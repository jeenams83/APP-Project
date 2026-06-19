"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"

const TYPES = [
  { id: "sms", icon: "📱", label: "SMS 문자", desc: "90자 이내 짧은 홍보 문자" },
  { id: "kakao", icon: "💛", label: "카카오톡", desc: "이모지 활용 친근한 메시지" },
  { id: "naver_blog", icon: "📝", label: "네이버 블로그", desc: "방문 유도 블로그 포스팅" },
  { id: "instagram", icon: "📸", label: "인스타그램", desc: "해시태그 포함 캡션" },
  { id: "loyalty", icon: "⭐", label: "단골 감사 메시지", desc: "재방문 유도 감사 문자" },
]

export default function AIMarketingPage() {
  const { data: session } = useSession()
  const [type, setType] = useState("sms")
  const [context, setContext] = useState("")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  async function generate() {
    setLoading(true)
    setResult("")
    const res = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        businessName: session?.user?.businessName,
        context,
      }),
    })
    const data = await res.json()
    setResult(data.text || data.error || "오류가 발생했습니다.")
    setLoading(false)
  }

  async function copy() {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const selectedType = TYPES.find((t) => t.id === type)

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">AI 마케팅 문구 생성</h1>
        <p className="text-gray-500 text-sm mt-0.5">상황을 입력하면 AI가 자연스러운 한국어 홍보 문구를 작성합니다</p>
      </div>

      {/* Type selector */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => setType(t.id)}
            className={`p-3 rounded-xl border-2 text-left transition-all ${type === t.id ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"}`}
          >
            <div className="text-2xl mb-1">{t.icon}</div>
            <p className="text-xs font-semibold text-gray-700">{t.label}</p>
          </button>
        ))}
      </div>

      <div className="card space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{selectedType?.icon}</span>
          <div>
            <p className="font-semibold text-gray-700">{selectedType?.label}</p>
            <p className="text-xs text-gray-500">{selectedType?.desc}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            어떤 내용을 홍보하고 싶으신가요?
          </label>
          <textarea
            className="input-field resize-none"
            rows={3}
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="예: 이번 주 금요일 삼겹살 2인분 구매 시 된장찌개 서비스, 봄맞이 할인 20%..."
          />
        </div>

        <button
          onClick={generate}
          disabled={loading}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              AI가 작성 중...
            </>
          ) : (
            <>"🤖 문구 생성하기"</>
          )}
        </button>
      </div>

      {/* Result */}
      {(loading || result) && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-700">생성된 문구</h3>
            {result && (
              <button onClick={copy} className="text-xs px-3 py-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                {copied ? "✅ 복사됨" : "📋 복사"}
              </button>
            )}
          </div>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 rounded animate-pulse" style={{ background: "#e5e7eb", width: `${70 + i * 10}%` }} />
              ))}
            </div>
          ) : (
            <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap p-4 rounded-xl" style={{ background: "#f8f9fa" }}>
              {result}
            </div>
          )}
          {result && (
            <div className="mt-4 flex gap-2">
              <a href="/messages" className="btn-primary text-sm">
                💬 메시지로 발송하기
              </a>
              <button onClick={generate} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50">
                🔄 다시 생성
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="card" style={{ background: "linear-gradient(135deg, #f0f4ff, #faf0ff)" }}>
        <h3 className="font-semibold text-gray-700 mb-2">💡 효과적인 마케팅 팁</h3>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>• <strong>단골 고객에게만</strong> 발송하면 응답률이 3배 높습니다</li>
          <li>• <strong>할인보다 혜택</strong> 표현이 더 효과적입니다 (예: "서비스 드립니다")</li>
          <li>• <strong>짧고 명확하게</strong> — 첫 문장에 핵심이 담겨야 합니다</li>
          <li>• <strong>시간 한정</strong> 표현이 클릭률을 높입니다 (예: "오늘 하루만!")</li>
        </ul>
      </div>
    </div>
  )
}
