import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"

async function getUser(email: string) {
  return prisma.user.findUnique({ where: { email } })
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const user = await getUser(session.user.email)
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const customer = await prisma.customer.findFirst({
    where: { id, userId: user.id },
    include: { messages: { include: { message: { select: { content: true, channel: true, sentAt: true } } }, orderBy: { message: { sentAt: "desc" } }, take: 10 } },
  })
  if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(customer)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const user = await getUser(session.user.email)
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const body = await req.json()
  const customer = await prisma.customer.updateMany({ where: { id, userId: user.id }, data: body })
  return NextResponse.json(customer)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const user = await getUser(session.user.email)
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 })
  await prisma.customer.deleteMany({ where: { id, userId: user.id } })
  return NextResponse.json({ success: true })
}
