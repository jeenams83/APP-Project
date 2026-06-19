"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

interface Customer { id: string; name: string | null; phone: string; visitCount: number }
interface Message { id: string; content: string; channel: string; sentAt: string; recipients: { customer: { name: string | null; phone: string } }[] }

export default function MessagesPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [content, setContent] = useState("")
  const [channel, setChannel] = useState("sms")
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState("")
  const [tab, setTab] = useState<"compose" | "history">("compose")

  useEffect(() => {
    fetch("/api/customers").then((r) => r.json()).then((d) => setCustomers(Array.isArray(d) ? d : []))
    fetch("/api/messages").then((r) => r.json()).then((d) => setMessages(Array.isArray(d) ? d : []))
  }, [])

  function toggleAll() {
    if (selected.size === customers.length) setSelected(new Set())
    else setSelected(new Set(customers.map((c) => c.id)))
  }

  function toggle(id: string) {
    setSelected((p) => {
      const n = new Set(p)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  async function send() {
    if (!content.trim() || selected.size === 0) return
    setSending(true)
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, channel, customerIds: [...selected] }),
    })
    if (res.ok) {
      const msg = await res.json()
      setMessages((p) => [msg, ...p])
      setContent("")
      setSelected(new Set())
      setSuccess(`${selected.size}명에게 메시지를 발송했습니다!`)
      setTimeout(() => setSuccess(""), 4000)
      setTab("history")
    }
    setSending(false)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">메시지 발송</h1>
        <p className="text-gray-500 text-sm mt-0.5">고객에게 직접 메시지를 보내세요</p>
      </div>

      {success && (
        <div className="rounded-xl p-4 text-sm font-medium" style={{ background: "#f0fff4", color: "#276749", border: "1px solid #9ae6b4" }}>
          ✅ {success}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {(["compose", "history"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200"}`}>
            {t === "compose" ? "✏️ 메시지 작성" : "📋 발송 내역"}
          </button>
        ))}
      </div>

      {tab === "compose" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Customer list */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-700">수신자 선택</h2>
              <button onClick={toggleAll} className="text-xs text-blue-600 hover:underline">
                {selected.size === customers.length ? "전체 해제" : "전체 선택"}
              </button>
            </div>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {customers.map((c) => (
                <label key={c.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggle(c.id)} className="rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700">{c.name || "이름 없음"}</p>
                    <p className="text-xs text-gray-400">{c.phone} · {c.visitCount}회 방문</p>
                  </div>
                  {c.visitCount >= 5 && <span className="badge badge-yellow text-xs">단골</span>}
                </label>
              ))}
              {customers.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-8">고객이 없습니다</p>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-3">{selected.size}명 선택됨</p>
          </div>

          {/* Compose */}
          <div className="card space-y-4">
            <h2 className="font-semibold text-gray-700">메시지 작성</h2>
            <div className="flex gap-2">
              {[
                { val: "sms", label: "📱 SMS" },
                { val: "kakao", label: "💛 카카오톡" },
              ].map((ch) => (
                <button key={ch.val} onClick={() => setChannel(ch.val)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${channel === ch.val ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500"}`}>
                  {ch.label}
                </button>
              ))}
            </div>
            <div>
              <textarea
                className="input-field resize-none"
                rows={7}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={channel === "sms"
                  ? "고객에게 보낼 SMS 내용을 입력하세요...\n(90자 이내 권장)"
                  : "카카오톡 메시지 내용을 입력하세요...\n\n이모지를 활용하면 더 효과적입니다 😊"}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-400">{content.length}자</span>
                {channel === "sms" && content.length > 90 && (
                  <span className="text-xs text-orange-500">장문 SMS로 발송됩니다</span>
                )}
              </div>
            </div>
            <button
              onClick={send}
              disabled={sending || selected.size === 0 || !content.trim()}
              className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? "발송 중..." : `${selected.size}명에게 발송하기`}
            </button>
            <p className="text-xs text-gray-400 text-center">
              실제 발송을 위해서는 SMS/카카오 API 연동이 필요합니다
            </p>
          </div>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ background: "#f8f9fa" }}>
                <tr>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">내용</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">채널</th>
                  <th className="text-center px-4 py-3 text-gray-500 font-medium">수신자</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">발송일</th>
                </tr>
              </thead>
              <tbody>
                {messages.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-10 text-gray-400">발송 내역이 없습니다</td></tr>
                ) : messages.map((m) => (
                  <tr key={m.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 max-w-xs">
                      <p className="truncate text-gray-700">{m.content}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${m.channel === "kakao" ? "badge-yellow" : "badge-blue"}`}>
                        {m.channel === "kakao" ? "카카오톡" : "SMS"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">{m.recipients?.length || 0}명</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {format(new Date(m.sentAt), "M월 d일 HH:mm", { locale: ko })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
