import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const [totalCustomers, vipCustomers, totalMessages, allCustomers] = await Promise.all([
    prisma.customer.count({ where: { userId: user.id } }),
    prisma.customer.count({ where: { userId: user.id, visitCount: { gte: 5 } } }),
    prisma.message.count({ where: { userId: user.id } }),
    prisma.customer.findMany({ where: { userId: user.id }, select: { visitCount: true, totalSpend: true, lastVisit: true, createdAt: true } }),
  ])

  const totalRevenue = allCustomers.reduce((s, c) => s + c.totalSpend, 0)
  const avgSpend = totalCustomers > 0 ? totalRevenue / totalCustomers : 0
  const returnRate = totalCustomers > 0 ? (vipCustomers / totalCustomers) * 100 : 0

  const monthlyData: Record<string, { customers: number; revenue: number }> = {}
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    monthlyData[key] = { customers: 0, revenue: 0 }
  }

  allCustomers.forEach((c) => {
    const d = new Date(c.createdAt)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    if (monthlyData[key]) { monthlyData[key].customers++; monthlyData[key].revenue += c.totalSpend }
  })

  const visitDistribution = [
    { label: "첫 방문", count: allCustomers.filter((c) => c.visitCount === 1).length },
    { label: "2-4회", count: allCustomers.filter((c) => c.visitCount >= 2 && c.visitCount <= 4).length },
    { label: "5-9회", count: allCustomers.filter((c) => c.visitCount >= 5 && c.visitCount <= 9).length },
    { label: "10회+", count: allCustomers.filter((c) => c.visitCount >= 10).length },
  ]

  return NextResponse.json({
    totalCustomers, vipCustomers, totalMessages, totalRevenue, avgSpend,
    returnRate: Math.round(returnRate),
    monthlyData: Object.entries(monthlyData).map(([month, data]) => ({ month, ...data })),
    visitDistribution,
  })
}
