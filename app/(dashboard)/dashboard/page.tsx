"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"

interface Analytics {
  totalCustomers: number
  vipCustomers: number
  totalMessages: number
  totalRevenue: number
  avgSpend: number
  returnRate: number
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const cards = stats ? [
    { icon: "👥", label: "전체 고객", value: stats.totalCustomers.toLocaleString(), sub: "명", color: "#3b5bdb" },
    { icon: "⭐", label: "단골 고객", value: stats.vipCustomers.toLocaleString(), sub: "명 (5회 이상)", color: "#f59e0b" },
    { icon: "💬", label: "발송 메시지", value: stats.totalMessages.toLocaleString(), sub: "건", color: "#10b981" },
    { icon: "🔄", label: "단골 비율", value: `${stats.returnRate}%`, sub: "재방문율", color: "#6366f1" },
  ] : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          안녕하세요, {session?.user?.businessName || session?.user?.name || "사장님"} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">오늘도 좋은 하루 되세요!</p>
      </div>

      {/* Stats grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card animate-pulse h-28" style={{ background: "#e5e7eb" }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => (
            <div key={c.label} className="card">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{c.icon}</span>
                <span className="text-xs text-gray-500">{c.label}</span>
              </div>
              <p className="text-3xl font-bold" style={{ color: c.color }}>{c.value}</p>
              <p className="text-xs text-gray-400 mt-1">{c.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">빠른 실행</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { href: "/customers", icon: "👤", title: "고객 추가", desc: "새 고객을 등록하세요", color: "#3b5bdb" },
            { href: "/messages", icon: "💬", title: "메시지 발송", desc: "단골 고객에게 연락하기", color: "#fee500", textColor: "#3c1e1e" },
            { href: "/ai-marketing", icon: "🤖", title: "AI 문구 생성", desc: "한국어 홍보 문구 자동 작성", color: "#10b981" },
            { href: "/qr", icon: "📲", title: "QR 코드", desc: "고객 등록 QR 출력하기", color: "#6366f1" },
          ].map((a) => (
            <Link key={a.href} href={a.href}
              className="card hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer block"
              style={{ borderTop: `3px solid ${a.color}` }}
            >
              <div className="text-2xl mb-2">{a.icon}</div>
              <p className="font-semibold text-gray-800 text-sm">{a.title}</p>
              <p className="text-gray-500 text-xs mt-1">{a.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Tip banner */}
      <div className="rounded-xl p-5 flex gap-4 items-start" style={{ background: "linear-gradient(135deg, #1a1a2e, #0f3460)", border: "1px solid rgba(59,91,219,0.3)" }}>
        <span className="text-2xl">💡</span>
        <div>
          <p className="text-white font-semibold text-sm">오늘의 팁</p>
          <p className="text-gray-300 text-sm mt-1">
            QR코드를 계산대에 붙여두면 고객이 직접 연락처를 등록할 수 있습니다.
            단골 고객 10명만 있어도 SMS 한 번에 재방문율이 올라갑니다!
          </p>
          <Link href="/qr" className="inline-block mt-2 text-xs font-medium px-3 py-1 rounded-full" style={{ background: "#fee500", color: "#3c1e1e" }}>
            QR 코드 만들기 →
          </Link>
        </div>
      </div>
    </div>
  )
}
