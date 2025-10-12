export default function Navbar() {
  return (
    <header className="flex justify-between items-center px-10 py-4 bg-[#0f0f0f]/90 backdrop-blur border-b border-gray-800 sticky top-0 z-50">
      {/* 柔光 V Logo */}
      <div className="flex items-center space-x-2 group">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-violet-400 via-purple-400 to-blue-400 shadow-lg shadow-violet-400/30 group-hover:scale-110 transition-transform duration-300">
          <span className="text-white text-lg font-extrabold drop-shadow-sm">V</span>
        </div>
      </div>

      {/* 右侧导航 */}
      <div className="flex items-center space-x-6">
        <nav className="space-x-5 text-gray-300 font-medium">
          <a href="/" className="hover:text-white transition-colors">Reddit</a>
          <a href="/ai-tools" className="hover:text-white transition-colors">AI Tools</a>
          <a href="/github" className="hover:text-white transition-colors">GitHub</a>
          <a href="/solo" className="hover:text-white transition-colors">Startup</a>
        </nav>

        {/* 🌐语言切换按钮 */}
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
          title="Switch Language"
        >
          🌐
        </button>

        {/* 💎会员按钮 */}
        <a
          href="/vip"
          className="px-4 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-full shadow hover:shadow-pink-500/40 hover:scale-105 transition-all"
        >
          Member
        </a>
      </div>
    </header>
  );
}