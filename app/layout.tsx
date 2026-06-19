import type { Metadata } from "next"
import "./globals.css"
import Providers from "./providers"

export const metadata: Metadata = {
  title: "소사장 CRM - AI 마케팅 도구",
  description: "배달앱 수수료 없이 고객과 직접 소통하세요. AI가 작성하는 한국어 마케팅 메시지.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
