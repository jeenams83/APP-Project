"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"

const nav = [
  { href: "/dashboard", icon: "📊", label: "대시보드" },
  { href: "/customers", icon: "👥", label: "고객 명단" },
  { href: "/messages", icon: "💬", label: "메시지 발송" },
  { href: "/ai-marketing", icon: "🤖", label: "AI 마케팅" },
  { href: "/analytics", icon: "📈", label: "분석" },
  { href: "/qr", icon: "📲", label: "QR 코드" },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#f8f9fa" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 flex flex-col w-60 transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ background: "#1a1a2e" }}
      >
        <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
          <span className="text-2xl">🏪</span>
          <div>
            <p className="text-white font-bold text-sm">소사장 CRM</p>
            <p className="text-gray-400 text-xs truncate max-w-[120px]">{session.user?.businessName || session.user?.email}</p>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${pathname === item.href ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <div className="px-3 py-2 mb-2 rounded-lg" style={{ background: "rgba(59,91,219,0.2)" }}>
            <p className="text-xs text-blue-300 font-medium">
              {session.user?.plan === "pro" ? "🌟 프로 플랜" : "베이직 플랜"}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="sidebar-link w-full text-left hover:text-red-400"
          >
            <span>🚪</span>
            <span>로그아웃</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-4 px-6 py-4 bg-white border-b border-gray-200">
          <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">안녕하세요,</span>
            <span className="font-semibold text-gray-700">{session.user?.name || "사장님"}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
