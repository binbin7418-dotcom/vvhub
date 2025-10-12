"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";

interface Project {
  title: string;
  intro: string;
  desc: string;
  stars: string;
  language: string;
  github: string;
  website?: string;
  features?: string[];
  images?: string[];
}
interface DailyData {
  date: string;
  category: string;
  projects: Project[];
}

export default function GithubDetail() {
  const { date } = useParams() as { date: string };
  const [data, setData] = useState<DailyData | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/data/${date}_GitHub_Trending_Daily.json`);
        if (!res.ok) throw new Error("文件读取失败");
        setData(await res.json());
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [date]);

  if (!data)
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-500">
        <Navbar />
        <p>正在加载 {date} 数据...</p>
      </main>
    );

  // 自动生成今日摘要标题
  const titleLead = (() => {
    const count = data.projects.length;
    if (count >= 4)
      return `发现 ${count} 个贼好玩的 GitHub 项目，相当给劲儿 🎯`;
    if (count >= 3)
      return `找到 ${count} 个职场提效神器，让你节省不少时间 🚀`;
    return `${data.date} 的 GitHub 热门项目合集 🌟`;
  })();

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#eef2ff] via-[#f4f6ff] to-[#fafcff] text-gray-800 font-sans pb-20">
      <Navbar />
      <section className="max-w-4xl mx-auto px-6 mt-16">
        <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {data.date} GitHub 日报
        </h1>
        <p className="text-gray-500 mb-12">{titleLead}</p>

        {data.projects.map((p, i) => {
          const img =
            p.images?.[0] && p.images[0].startsWith("http")
              ? p.images[0]
              : `https://picsum.photos/seed/${date}-${i}/1200/600`;

          // 生成为“项目体验感”式的文字，不再AI式自述
          const usage = (() => {
            const key =
              p.features?.join("、") ||
              p.intro ||
              p.desc ||
              "体验顺滑、上手简单";
            const scenario = /AI|智能|自动|script/i.test(key)
              ? "自动化或 AI 应用场景"
              : /web|网站|前端|UI/i.test(key)
              ? "产品或前端开发"
              : /工具|plugin|助手/i.test(key)
              ? "工作效率提升"
              : "各类项目创意实现";
            return `它特别适合${scenario}，最大优势是「${key
              .slice(0, 30)
              .replace(/[。！？]/g, "")
              .trim()}」。`;
          })();

          return (
            <article
              key={i}
              className="mb-16 bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden"
            >
              {/* 顶部图片区域 */}
              <div className="bg-gray-50 h-72 flex items-center justify-center overflow-hidden">
                <img
                  src={img}
                  alt={p.title}
                  onError={(e) =>
                    ((e.target as HTMLImageElement).src =
                      `https://picsum.photos/seed/fallback${i}/1200/600`)
                  }
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 文本内容 */}
              <div className="p-8 space-y-5">
                <h2 className="text-2xl font-bold text-indigo-700">
                  {p.title}
                </h2>
                <p className="text-gray-700 leading-relaxed">{p.intro}</p>

                <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                  <span>⭐ {p.stars}</span>
                  {p.language && <span>{p.language}</span>}
                </div>

                <p className="text-gray-700 leading-relaxed">{p.desc}</p>

                {/* 推荐理由 */}
                {p.features && p.features.length > 0 && (
                  <div className="bg-indigo-50 border-l-4 border-indigo-400 px-4 py-3 rounded-md">
                    <h3 className="font-semibold text-indigo-700 mb-1">
                      推荐理由
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {p.features.map((f, idx) => (
                        <li key={idx}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 使用场景 */}
                <div className="bg-gray-50 rounded-xl px-5 py-4 border">
                  <h4 className="font-medium text-gray-800 mb-2">使用场景</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {usage}
                  </p>
                </div>

                {/* 链接 */}
                <div className="pt-2 text-sm text-indigo-600 space-x-4">
                  <a
                    href={p.github}
                    target="_blank"
                    className="underline hover:text-indigo-800"
                  >
                    访问 GitHub 项目
                  </a>
                  {p.website && (
                    <a
                      href={p.website}
                      target="_blank"
                      className="underline hover:text-indigo-800"
                    >
                      官方网站
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}