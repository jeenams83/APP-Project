"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import Link from "next/link"

interface Customer {
  id: string
  name: string | null
  phone: string
  visitCount: number
  totalSpend: number
  lastVisit: string
  tags: string | null
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: "", phone: "", notes: "", tags: "", totalSpend: "" })
  const [saving, setSaving] = useState(false)

  async function load(q = "") {
    setLoading(true)
    const r = await fetch(`/api/customers?q=${encodeURIComponent(q)}`)
    const d = await r.json()
    setCustomers(Array.isArray(d) ? d : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    const t = setTimeout(() => load(search), 300)
    return () => clearTimeout(t)
  }, [search])

  async function addCustomer(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, totalSpend: Number(form.totalSpend) || 0 }),
    })
    setSaving(false)
    setShowAdd(false)
    setForm({ name: "", phone: "", notes: "", tags: "", totalSpend: "" })
    load()
  }

  async function deleteCustomer(id: string) {
    if (!confirm("이 고객을 삭제하시겠습니까?")) return
    await fetch(`/api/customers/${id}`, { method: "DELETE" })
    setCustomers((p) => p.filter((c) => c.id !== id))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">고객 명단</h1>
          <p className="text-gray-500 text-sm mt-0.5">총 {customers.length}명의 고객</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowAdd(true)}>
          + 고객 추가
        </button>
      </div>

      {/* Search */}
      <input
        className="input-field max-w-sm"
        placeholder="이름 또는 전화번호 검색..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Add customer modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
            <h2 className="text-lg font-bold text-gray-800 mb-4">새 고객 추가</h2>
            <form onSubmit={addCustomer} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">이름</label>
                  <input className="input-field" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="홍길동" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">전화번호 *</label>
                  <input className="input-field" required value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="010-0000-0000" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">결제 금액 (원)</label>
                  <input className="input-field" type="number" value={form.totalSpend} onChange={(e) => setForm((p) => ({ ...p, totalSpend: e.target.value }))} placeholder="15000" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">태그</label>
                  <input className="input-field" value={form.tags} onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))} placeholder="단골,VIP" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">메모</label>
                <textarea className="input-field" rows={2} value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} placeholder="특이사항..." />
              </div>
              <div className="flex gap-2 justify-end mt-2">
                <button type="button" className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100" onClick={() => setShowAdd(false)}>
                  취소
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "저장 중..." : "추가"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ background: "#f8f9fa" }}>
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">고객</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">전화번호</th>
                <th className="text-center px-4 py-3 text-gray-500 font-medium">방문횟수</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">누적금액</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">최근방문</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">태그</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">로딩 중...</td></tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <div className="text-4xl mb-2">👥</div>
                    <p>고객이 없습니다</p>
                    <p className="text-xs mt-1">QR코드로 고객을 등록하거나 직접 추가하세요</p>
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/customers/${c.id}`} className="font-medium text-gray-800 hover:text-blue-600">
                        {c.name || "이름 없음"}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{c.phone}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`badge ${c.visitCount >= 10 ? "badge-yellow" : c.visitCount >= 5 ? "badge-blue" : "badge-gray"}`}>
                        {c.visitCount}회
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-700">
                      ₩{c.totalSpend.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {format(new Date(c.lastVisit), "M월 d일", { locale: ko })}
                    </td>
                    <td className="px-4 py-3">
                      {c.tags?.split(",").map((t) => (
                        <span key={t} className="badge badge-blue mr-1">{t.trim()}</span>
                      ))}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteCustomer(c.id)} className="text-red-400 hover:text-red-600 text-xs">삭제</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
