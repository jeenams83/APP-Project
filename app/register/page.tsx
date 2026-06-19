"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const BUSINESS_TYPES = ["음식점", "카페", "미용실", "헬스장", "학원", "편의점", "뷰티샵", "의류매장", "기타"]

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: "", email: "", password: "", businessName: "", businessType: "음식점", phone: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function update(k: string, v: string) { setForm((p) => ({ ...p, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    const data = await res.json()
    if (!res.ok) { setError(data.error || "오류가 발생했습니다."); setLoading(false); return }
    await signIn("credentials", { email: form.email, password: form.password, redirect: false })
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-10" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" }}>
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <span className="text-4xl">🏪</span>
          <h1 className="text-2xl font-bold text-white mt-3">소사장 CRM 시작하기</h1>
          <p className="text-gray-400 mt-1 text-sm">배달앱 없이 고객과 직접 소통하세요</p>
        </div>
        <div className="rounded-2xl p-8 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">이름</label><input className="input-field" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="홍길동" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">연락처</label><input className="input-field" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="010-0000-0000" /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">이메일 *</label><input className="input-field" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 *</label><input className="input-field" type="password" value={form.password} onChange={(e) => update("password", e.target.value)} required minLength={6} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">상호명 *</label><input className="input-field" value={form.businessName} onChange={(e) => update("businessName", e.target.value)} required placeholder="예: 홍길동 떡볶이" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">업종</label><select className="input-field" value={form.businessType} onChange={(e) => update("businessType", e.target.value)}>{BUSINESS_TYPES.map((t) => <option key={t}>{t}</option>)}</select></div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="btn-primary w-full py-3" disabled={loading}>{loading ? "처리 중..." : "무료로 시작하기"}</button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">이미 계정이 있으신가요? <Link href="/login" className="text-blue-600 font-medium hover:underline">로그인</Link></p>
        </div>
      </div>
    </div>
  )
}
