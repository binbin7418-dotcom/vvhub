import Navbar from "../components/Navbar";
import fs from "fs";
import path from "path";

export default async function SoloPage() {
  const filePath = path.join(process.cwd(), "public/data/2025-10-08_daily.json");
  const jsonData = await fs.promises.readFile(filePath, "utf-8");
  const data = JSON.parse(jsonData);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#e0e7ff] via-[#f2f4ff] to-[#fafcff] font-sans text-gray-800">
      <Navbar />

      <section className="text-center mt-14 mb-12">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Startup Stories
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Inspiring stories from indie hackers and solo founders.
        </p>
        <div className="mt-8 flex justify-center">
          <input
            type="text"
            placeholder="🔍  Search projects..."
            className="w-96 border border-gray-300 rounded-full px-5 py-3 shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>
      </section>

      {/* 卡片区域 - 注意这里用的是 data.solo_projects */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 px-10 pb-24">
        {data.solo_projects.map((item: any, i: number) => (
          <a
            key={i}
            href={item.url}
            target="_blank"
            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
          >
            <div className="h-48 bg-gray-200 overflow-hidden">
              <img
                src={`https://picsum.photos/seed/solo${i}/600/400`}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3">{item.summary}</p>
            </div>
          </a>
        ))}
      </div>

      <footer className="bg-gray-900 py-10 text-center shadow-inner">
        <div className="max-w-4xl mx-auto text-gray-400 text-sm">
          <p>© 2025 VVhub · Global Daily Trends</p>
        </div>
      </footer>
    </main>
  );
}