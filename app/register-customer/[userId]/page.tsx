"use client"

import { useState, use } from "react"

export default function CustomerRegisterPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params)
  const [form, setForm] = useState({ name: "", phone: "" })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [businessName, setBusinessName] = useState("우리 가게")

  useState(() => {
    fetch(`/api/business/${userId}`)
      .then((r) => r.json())
      .then((d) => d.businessName && setBusinessName(d.businessName))
      .catch(() => {})
  })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    const res = await fetch("/api/customers/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, userId }),
    })
    setStatus(res.ok ? "success" : "error")
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)" }}>
        <div className="text-center p-8 max-w-sm">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-white mb-2">등록 완료!</h1>
          <p className="text-gray-300 mb-2">{businessName}의 단골 고객으로 등록되었습니다.</p>
          <p className="text-gray-400 text-sm">특별 혜택 및 이벤트 소식을 문자로 안내드릴게요 😊</p>
          <div className="mt-6 py-3 px-5 rounded-xl text-sm font-medium inline-block" style={{ background: "#fee500", color: "#3c1e1e" }}>감사합니다! ✨</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-10" style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)" }}>
      <div className="w-full max-w-sm mx-4">
        <div className="text-center mb-6">
          <span className="text-4xl">🏪</span>
          <h1 className="text-xl font-bold text-white mt-3">{businessName}</h1>
          <p className="text-gray-400 text-sm mt-1">단골 고객 등록하고 특별 혜택 받으세요!</p>
        </div>
        <div className="bg-white rounded-2xl p-6">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <input className="input-field" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="홍길동" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">휴대폰 번호 *</label>
              <input className="input-field" type="tel" required value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="010-0000-0000" />
            </div>
            {status === "error" && <p className="text-red-500 text-sm">오류가 발생했습니다. 다시 시도해주세요.</p>}
            <button type="submit" disabled={status === "loading"} className="w-full py-3 rounded-xl font-bold text-sm disabled:opacity-50" style={{ background: "#fee500", color: "#3c1e1e" }}>
              {status === "loading" ? "등록 중..." : "단골 등록하기 🎁"}
            </button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-4">개인정보는 마케팅 메시지 발송 외에 사용되지 않습니다</p>
        </div>
      </div>
    </div>
  )
}
