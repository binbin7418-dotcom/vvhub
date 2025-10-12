import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return new Response("Missing url", { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
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