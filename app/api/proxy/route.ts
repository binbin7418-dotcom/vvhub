import type { NextRequest } from "next/server";
import { lookup } from "node:dns/promises";

// SSRF protection: only proxy to public http(s) targets.
// Blocks loopback, private, link-local and other reserved addresses,
// including hostnames that resolve to such addresses.
const PRIVATE_IPV4_RANGES: Array<[number, number]> = [
  // [network address, netmask]
  [0x00000000, 0xff000000], // 0.0.0.0/8 ("this network")
  [0x7f000000, 0xff000000], // 127.0.0.0/8 loopback
  [0x0a000000, 0xff000000], // 10.0.0.0/8 private
  [0xac100000, 0xfff00000], // 172.16.0.0/12 private
  [0xc0a80000, 0xffff0000], // 192.168.0.0/16 private
  [0xa9fe0000, 0xffff0000], // 169.254.0.0/16 link-local
];

function ipv4ToInt(ip: string): number | null {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  let value = 0;
  for (const part of parts) {
    if (!/^\d+$/.test(part)) return null;
    const octet = Number(part);
    if (octet > 255) return null;
    value = (value << 8) + octet;
  }
  return value >>> 0;
}

function isPrivateIp(ip: string): boolean {
  // IPv4-mapped IPv6 address, e.g. ::ffff:127.0.0.1
  const mapped = ip.toLowerCase().match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return isPrivateIp(mapped[1]);

  const v4 = ipv4ToInt(ip);
  if (v4 !== null) {
    return PRIVATE_IPV4_RANGES.some(
      ([network, mask]) => (v4 & mask) === network,
    );
  }

  const v6 = ip.toLowerCase();
  if (v6 === "::1" || v6 === "::") return true; // loopback / unspecified
  if (v6.startsWith("fc") || v6.startsWith("fd")) return true; // fc00::/7 unique-local (covers fc00::/8)
  if (
    v6.startsWith("fe8") ||
    v6.startsWith("fe9") ||
    v6.startsWith("fea") ||
    v6.startsWith("feb")
  ) {
    return true; // fe80::/10 link-local
  }
  return false;
}

function isBlockedHostname(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  return host === "localhost" || host.endsWith(".localhost");
}

// Returns an error message when the target must not be fetched, else null.
async function assertPublicTarget(target: URL): Promise<string | null> {
  if (target.protocol !== "http:" && target.protocol !== "https:") {
    return "Only http: and https: URLs are allowed";
  }
  if (isBlockedHostname(target.hostname) || isPrivateIp(target.hostname)) {
    return "Refusing to fetch a private or reserved address";
  }
  let addresses: { address: string }[];
  try {
    addresses = await lookup(target.hostname, { all: true });
  } catch {
    return "Could not resolve target host";
  }
  if (addresses.some((address) => isPrivateIp(address.address))) {
    return "Refusing to fetch a host that resolves to a private or reserved address";
  }
  return null;
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return new Response("Missing url", { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(url);
  } catch {
    return new Response("Invalid url", { status: 400 });
  }

  const blocked = await assertPublicTarget(target);
  if (blocked) {
    return new Response(blocked, { status: 403 });
  }

  try {
    // Follow redirects manually so a redirect to a private or reserved
    // address is validated before it is fetched.
    let current = target;
    let res: Response | undefined;
    for (let i = 0; i <= 5; i++) {
      res = await fetch(current, {
        headers: { "User-Agent": "Mozilla/5.0" },
        redirect: "manual",
      });
      const location = res.headers.get("location");
      if (res.status < 300 || res.status >= 400 || !location) break;
      const next = new URL(location, current);
      const redirectBlocked = await assertPublicTarget(next);
      if (redirectBlocked) {
        return new Response(redirectBlocked, { status: 403 });
      }
      current = next;
    }
    if (!res || (res.status >= 300 && res.status < 400)) {
      return new Response("Fetch failed", { status: 502 });
    }
    const data = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/jpeg";
    return new Response(data, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "max-age=3600",
      },
    });
  } catch (e) {
    return new Response("Fetch failed", { status: 502 });
  }
}
