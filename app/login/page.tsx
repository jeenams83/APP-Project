"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("demo@example.com")
  const [password, setPassword] = useState("password123")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const result = await signIn("credentials", { email, password, redirect: false })
    setLoading(false)
    if (result?.error) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.")
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-4xl">🏪</span>
          <h1 className="text-2xl font-bold text-white mt-3">소사장 CRM</h1>
          <p className="text-gray-400 mt-1 text-sm">로그인하여 고객 관리를 시작하세요</p>
        </div>
        <div className="rounded-2xl p-8 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <input className="input-field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
              <input className="input-field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="btn-primary w-full py-3" disabled={loading}>{loading ? "로그인 중..." : "로그인"}</button>
          </form>
          <div className="mt-4 p-3 rounded-lg text-xs text-gray-500 bg-gray-50">
            <p className="font-medium mb-1">데모 계정</p>
            <p>이메일: demo@example.com · 비밀번호: password123</p>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">계정이 없으신가요? <Link href="/register" className="text-blue-600 font-medium hover:underline">회원가입</Link></p>
        </div>
      </div>
    </div>
  )
}
