"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";

interface Project {
  title: string;
  intro: string;
  desc: string;
}
interface DailyData {
  date: string;
  category: string;
  headline?: string;
  title?: string;
  intro?: string;
  projects: Project[];
}

export default function GithubPage() {
  const [posts, setPosts] = useState<
    { date: string; title: string; summary: string; path: string }[]
  >([]);
  const [headline, setHeadline] = useState<string>("GitHub 每日热门产品");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    async function loadPosts() {
      const resList = await fetch("/data/list.json?t=" + Date.now());
      const files: string[] = await resList.json();
      const loaded: any[] = [];

      // 取最新 headline
      try {
        const latestRes = await fetch(`/data/${files[0]}`);
        const latestJson: DailyData = await latestRes.json();
        setHeadline(latestJson.headline || "GitHub 每日热门产品");
      } catch {
        setHeadline("GitHub 每日热门产品");
      }

      // 遍历每份日报 JSON
      for (const f of files) {
        try {
          const res = await fetch(`/data/${f}`);
          if (!res.ok) continue;
          const json: DailyData = await res.json();

          // 每个 json 存在 title+intro（整份日报的钩子）
          const cardTitle =
            json.title || json.projects?.[0]?.title || "GitHub 热榜精选";
          const cardIntro =
            json.intro ||
            json.projects?.[0]?.intro ||
            "看看今天 GitHub 上又出了什么有趣的新项目 👇";

          loaded.push({
            date: json.date || f.replace("_GitHub_Trending_Daily.json", ""),
            title: cardTitle,
            summary: cardIntro,
            path: `/github/${f.replace("_GitHub_Trending_Daily.json", "")}`,
          });
        } catch (err) {
          console.error("加载出错:", err);
        }
      }

      loaded.sort((a, b) => (a.date < b.date ? 1 : -1));
      setPosts(loaded.slice(0, 12));
    }

    loadPosts();
  }, []);

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(keyword.toLowerCase()) ||
      p.summary.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#e0e7ff] via-[#f2f4ff] to-[#fafcff] text-gray-800 font-sans">
      <Navbar />

      {/* 顶部标题 */}
      <section className="text-center mt-14 mb-8">
        <h1 className="text-5xl font-extrabold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {headline}
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          全球开发者今天都在关注什么 👇
        </p>
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-inner flex items-center gap-2 px-4 py-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387zM14 8a6 6 0 11-12 0 6 6 0 0112 0z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            placeholder="Search projects..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 outline-none text-gray-700 bg-transparent py-1"
          />
        </div>
      </section>

      {/* 卡片 */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-8 pb-24">
        {filtered.map((p, i) => (
          <Link
            key={i}
            href={p.path}
            className={`group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ${
              i === 0 ? "ring-4 ring-indigo-400" : ""
            }`}
          >
            <div className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
              {p.date.replace("2025-", "")}
            </div>
            <div className="h-52 bg-gray-100 flex items-center justify-center">
              <img
                src="/github-logo.svg"
                alt="GitHub logo"
                loading="lazy"
                className="w-32 h-32 object-contain opacity-90"
              />
            </div>
            <div className="p-5 space-y-2">
              <h3 className="font-bold text-lg leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300">
                {p.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3">{p.summary}</p>
            </div>
          </Link>
        ))}
      </div>

      <footer className="bg-gray-900 py-10 text-center shadow-inner">
        <div className="max-w-4xl mx-auto text-gray-400 text-sm">
          <p>© 2025 VVhub · Daily GitHub Trends</p>
        </div>
      </footer>
    </main>
  );
}