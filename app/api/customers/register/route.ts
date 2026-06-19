import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const { name, phone, userId } = await req.json()
  if (!phone || !userId) return NextResponse.json({ error: "전화번호와 사업자 ID가 필요합니다." }, { status: 400 })
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return NextResponse.json({ error: "사업자를 찾을 수 없습니다." }, { status: 404 })
  const existing = await prisma.customer.findUnique({ where: { userId_phone: { userId, phone } } })
  if (existing) {
    await prisma.customer.update({ where: { id: existing.id }, data: { visitCount: { increment: 1 }, lastVisit: new Date() } })
    return NextResponse.json({ message: "방문 횟수가 업데이트되었습니다." })
  }
  const customer = await prisma.customer.create({ data: { userId, name, phone } })
  return NextResponse.json(customer, { status: 201 })
}
