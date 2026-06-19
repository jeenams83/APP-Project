"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"

interface Analytics {
  totalCustomers: number
  vipCustomers: number
  totalMessages: number
  totalRevenue: number
  avgSpend: number
  returnRate: number
  monthlyData: { month: string; customers: number; revenue: number }[]
  visitDistribution: { label: string; count: number }[]
}

const COLORS = ["#e5e7eb", "#93c5fd", "#3b82f6", "#1d4ed8"]

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/analytics").then((r) => r.json()).then((d) => { setData(d); setLoading(false) })
  }, [])

  if (loading) return <div className="text-center py-20 text-gray-400">로딩 중...</div>
  if (!data) return <div className="text-center py-20 text-gray-400">데이터를 불러올 수 없습니다</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">분석</h1>
        <p className="text-gray-500 text-sm mt-0.5">고객 및 매출 현황을 한눈에 확인하세요</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "전체 고객", value: data.totalCustomers, suffix: "명", color: "#3b5bdb", icon: "👥" },
          { label: "단골 고객", value: data.vipCustomers, suffix: "명", color: "#f59e0b", icon: "⭐" },
          { label: "총 매출", value: `₩${(data.totalRevenue / 10000).toFixed(0)}만`, suffix: "", color: "#10b981", icon: "💰" },
          { label: "단골 비율", value: `${data.returnRate}%`, suffix: "", color: "#6366f1", icon: "🔄" },
        ].map((k) => (
          <div key={k.label} className="card">
            <div className="flex items-center gap-1 mb-2">
              <span>{k.icon}</span>
              <span className="text-xs text-gray-500">{k.label}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: k.color }}>{k.value}{k.suffix}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card">
          <h3 className="font-semibold text-gray-700 mb-4">월별 신규 고객</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`${v}명`, "신규 고객"]} />
              <Bar dataKey="customers" fill="#3b5bdb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-700 mb-4">방문 횟수 분포</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.visitDistribution} dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={80} label={(props) => `${props.name} ${((props.percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                {data.visitDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue chart */}
      <div className="card">
        <h3 className="font-semibold text-gray-700 mb-4">월별 매출</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.monthlyData} margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₩${(v / 10000).toFixed(0)}만`} />
            <Tooltip formatter={(v) => [`₩${Number(v).toLocaleString()}`, "매출"]} />
            <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary stats */}
      <div className="card">
        <h3 className="font-semibold text-gray-700 mb-4">요약 통계</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500">고객당 평균 지출</p>
            <p className="text-xl font-bold text-gray-800 mt-1">₩{data.avgSpend.toLocaleString("ko-KR", { maximumFractionDigits: 0 })}</p>
          </div>
          <div>
            <p className="text-gray-500">총 메시지 발송</p>
            <p className="text-xl font-bold text-gray-800 mt-1">{data.totalMessages}건</p>
          </div>
          <div>
            <p className="text-gray-500">VIP 고객 (5회+)</p>
            <p className="text-xl font-bold text-gray-800 mt-1">{data.vipCustomers}명</p>
          </div>
        </div>
      </div>
    </div>
  )
}
