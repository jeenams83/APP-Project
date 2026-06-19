import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q") || ""
  const customers = await prisma.customer.findMany({
    where: {
      userId: user.id,
      AND: [query ? { OR: [{ name: { contains: query } }, { phone: { contains: query } }] } : {}],
    },
    orderBy: { lastVisit: "desc" },
  })
  return NextResponse.json(customers)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
  const body = await req.json()
  const { name, phone, notes, tags, totalSpend } = body
  if (!phone) return NextResponse.json({ error: "전화번호를 입력해주세요." }, { status: 400 })
  const existing = await prisma.customer.findUnique({ where: { userId_phone: { userId: user.id, phone } } })
  if (existing) {
    const updated = await prisma.customer.update({
      where: { id: existing.id },
      data: { visitCount: { increment: 1 }, lastVisit: new Date(), totalSpend: totalSpend ? existing.totalSpend + totalSpend : existing.totalSpend, notes: notes ?? existing.notes },
    })
    return NextResponse.json(updated)
  }
  const customer = await prisma.customer.create({ data: { userId: user.id, name, phone, notes, tags, totalSpend: totalSpend ?? 0 } })
  return NextResponse.json(customer, { status: 201 })
}
