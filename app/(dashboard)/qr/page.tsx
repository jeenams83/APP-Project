"use client"

import { useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import QRCode from "qrcode"

export default function QRPage() {
  const { data: session } = useSession()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [qrUrl, setQrUrl] = useState("")
  const [userId, setUserId] = useState("")

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((s) => {
        const id = s?.user?.id
        if (!id) return
        setUserId(id)
        const url = `${window.location.origin}/register-customer/${id}`
        setQrUrl(url)
        if (canvasRef.current) {
          QRCode.toCanvas(canvasRef.current, url, {
            width: 280,
            margin: 2,
            color: { dark: "#1a1a2e", light: "#ffffff" },
          })
        }
      })
  }, [])

  function download() {
    if (!canvasRef.current) return
    const link = document.createElement("a")
    link.download = "고객등록QR.png"
    link.href = canvasRef.current.toDataURL()
    link.click()
  }

  function print() {
    window.print()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">고객 등록 QR 코드</h1>
        <p className="text-gray-500 text-sm mt-0.5">계산대나 입구에 붙여두면 고객이 직접 연락처를 등록합니다</p>
      </div>

      <div className="card text-center print:shadow-none">
        <div className="mb-4">
          <p className="text-lg font-bold text-gray-800 mb-1">
            📱 QR코드를 스캔해 주세요
          </p>
          <p className="text-gray-500 text-sm">
            {session?.user?.businessName || "가게"}의 단골 고객이 되어주세요!
          </p>
        </div>

        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-2xl border-4" style={{ borderColor: "#fee500" }}>
            <canvas ref={canvasRef} className="block" />
          </div>
        </div>

        <div className="mb-4 py-3 px-4 rounded-xl text-sm" style={{ background: "#f8f9fa" }}>
          <p className="text-gray-500 text-xs mb-1">등록 링크</p>
          <p className="text-gray-700 font-mono text-xs break-all">{qrUrl}</p>
        </div>

        <div className="flex gap-3 justify-center print:hidden">
          <button onClick={download} className="btn-primary flex items-center gap-2">
            ⬇️ PNG 저장
          </button>
          <button onClick={print} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 flex items-center gap-2">
            🖨️ 인쇄
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="card space-y-3">
        <h2 className="font-semibold text-gray-700">사용 방법</h2>
        <div className="space-y-3">
          {[
            { step: "1", title: "QR 코드 출력", desc: "PNG로 저장하거나 바로 인쇄하세요" },
            { step: "2", title: "계산대에 부착", desc: "고객이 잘 보이는 위치에 붙여두세요" },
            { step: "3", title: "고객이 스캔", desc: "고객이 카메라로 QR을 스캔하면 등록 페이지가 열립니다" },
            { step: "4", title: "자동으로 고객 명단에 추가", desc: "입력한 연락처가 바로 고객 명단에 저장됩니다" },
          ].map((s) => (
            <div key={s.step} className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white" style={{ background: "#3b5bdb" }}>
                {s.step}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">{s.title}</p>
                <p className="text-xs text-gray-500">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ background: "linear-gradient(135deg, #fffbeb, #fef3c7)", border: "1px solid #fde68a" }}>
        <p className="text-sm text-amber-800">
          <strong>💡 팁:</strong> QR 코드 아래에 &quot;등록하시면 다음 방문 시 특별 혜택을 드립니다!&quot;와 같은
          문구를 추가하면 등록률이 높아집니다.
        </p>
      </div>
    </div>
  )
}
