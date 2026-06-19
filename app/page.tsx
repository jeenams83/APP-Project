import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}>
      <nav className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏪</span>
          <span className="text-white text-xl font-bold">소사장 CRM</span>
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="text-gray-300 px-4 py-2 rounded-lg hover:text-white transition-colors text-sm">로그인</Link>
          <Link href="/register" className="px-4 py-2 rounded-lg text-sm font-bold" style={{ background: "#fee500", color: "#3c1e1e" }}>무료로 시작하기</Link>
        </div>
      </nav>

      <section className="px-8 py-20 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-medium" style={{ background: "rgba(254,229,0,0.15)", color: "#fee500" }}>🚀 한국 소상공인 전용 AI 마케팅 도구</div>
        <h1 className="text-5xl font-bold text-white mb-6 leading-tight">배달앱 수수료 없이<br /><span style={{ color: "#fee500" }}>고객과 직접 소통하세요</span></h1>
        <p className="text-xl text-gray-300 mb-10 leading-relaxed">QR코드로 고객 명단을 만들고, AI가 작성한 한국어 홍보 메시지를<br />카카오톡·SMS로 직접 전송하세요. 배달의민족 수수료 30%가 사라집니다.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/register" className="px-8 py-4 rounded-xl text-lg font-bold" style={{ background: "#fee500", color: "#3c1e1e" }}>지금 무료로 시작하기 →</Link>
          <Link href="/login" className="px-8 py-4 rounded-xl text-lg font-medium text-white border border-white/20 hover:bg-white/10 transition-colors">로그인</Link>
        </div>
      </section>

      <section className="px-8 py-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "😤", title: "배달 수수료 20-33%", desc: "배달의민족·쿠팡이츠에 매달 수십만원 지불 중" },
            { icon: "😰", title: "고객 연락처 없음", desc: "단골 고객에게 직접 연락할 방법이 없는 현실" },
            { icon: "🤯", title: "한국어 마케팅 도구 없음", desc: "저렴하고 쉬운 한국어 AI 마케팅 도구가 없음" },
          ].map((p) => (
            <div key={p.title} className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="text-3xl mb-3">{p.icon}</div>
              <h3 className="text-white font-bold mb-2">{p.title}</h3>
              <p className="text-gray-400 text-sm">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-8 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-12">소사장 CRM이 해결합니다</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: "📱", title: "QR코드 고객 등록", desc: "계산대에 QR코드 한 장만 붙이면 고객이 직접 연락처를 등록합니다." },
            { icon: "🤖", title: "AI 한국어 마케팅", desc: "업종과 상황을 입력하면 AI가 자연스러운 한국어 홍보 문구를 즉시 작성합니다." },
            { icon: "💬", title: "직접 메시지 발송", desc: "단골 고객에게 카카오톡이나 SMS로 직접 연락하세요." },
            { icon: "📊", title: "고객 분석 대시보드", desc: "누가 단골인지, 방문 횟수는 얼마인지 한눈에 파악." },
          ].map((f) => (
            <div key={f.title} className="p-6 rounded-2xl flex gap-4" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="text-3xl flex-shrink-0">{f.icon}</div>
              <div>
                <h3 className="text-white font-bold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-8 py-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-4">합리적인 가격</h2>
        <p className="text-gray-400 text-center mb-12">배달앱에 내는 수수료의 1/10도 안 됩니다</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "베이직", price: "₩29,000", period: "/월", color: "#3b5bdb", features: ["고객 명단 최대 300명", "월 500건 메시지 발송", "AI 마케팅 문구 월 30회", "기본 분석"] },
            { name: "프로", price: "₩59,000", period: "/월", color: "#fee500", recommended: true, features: ["고객 명단 무제한", "무제한 메시지 발송", "AI 마케팅 문구 무제한", "네이버 블로그·인스타 자동 생성", "고급 분석 리포트"] },
          ].map((plan) => (
            <div key={plan.name} className="p-8 rounded-2xl relative" style={{ background: plan.recommended ? "rgba(254,229,0,0.1)" : "rgba(255,255,255,0.05)", border: `2px solid ${plan.recommended ? "#fee500" : "rgba(255,255,255,0.1)"}` }}>
              {plan.recommended && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold" style={{ background: "#fee500", color: "#3c1e1e" }}>추천</div>}
              <h3 className="text-white text-xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6"><span className="text-4xl font-bold" style={{ color: plan.color }}>{plan.price}</span><span className="text-gray-400">{plan.period}</span></div>
              <ul className="space-y-2 mb-8">{plan.features.map((f) => <li key={f} className="text-gray-300 text-sm flex gap-2"><span style={{ color: plan.recommended ? "#fee500" : "#3b5bdb" }}>✓</span> {f}</li>)}</ul>
              <Link href="/register" className="block text-center py-3 rounded-xl font-bold" style={{ background: plan.recommended ? "#fee500" : "#3b5bdb", color: plan.recommended ? "#3c1e1e" : "white" }}>시작하기</Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-8 text-center text-gray-500 text-sm border-t border-white/10">
        <p>© 2024 소사장 CRM · 한국 소상공인을 위한 AI 마케팅 도구</p>
      </footer>
    </main>
  )
}
