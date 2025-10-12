import Navbar from "../components/Navbar";

export default function VipPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#e0e7ff] via-[#f2f4ff] to-[#fafcff] font-sans text-gray-800">
      <Navbar />

      {/* 会员中心内容区 */}
      <section className="flex flex-col items-center justify-center text-center py-20">
        
        {/* 主要订阅卡片 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-10 max-w-2xl">
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Premium Membership
          </h1>

          <p className="text-gray-600 text-lg mb-8">
            Unlock exclusive content, remove ads, and receive a curated daily report directly in your mailbox.
          </p>

          <div className="bg-gray-100 rounded-xl p-6 mb-8">
            <p className="text-4xl font-bold text-gray-900">$4.99 <span className="text-lg font-medium text-gray-500">/ month</span></p>
            <p className="text-sm text-gray-500 mt-2">Cancel anytime.</p>
          </div>

          <a
            href="#" // 这里以后可以换成支付链接
            className="inline-block w-full px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-full shadow-lg hover:shadow-pink-500/40 hover:scale-105 transition-all duration-300"
          >
            Subscribe Now
          </a>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-gray-900 py-10 text-center shadow-inner mt-20">
        <div className="max-w-4xl mx-auto text-gray-400 text-sm">
          <p>© 2025 VVhub · Global Daily Trends</p>
        </div>
      </footer>
    </main>
  );
}