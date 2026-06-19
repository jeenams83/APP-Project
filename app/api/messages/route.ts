import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const messages = await prisma.message.findMany({
    where: { userId: user.id },
    include: { recipients: { include: { customer: { select: { name: true, phone: true } } } }, campaign: { select: { name: true } } },
    orderBy: { sentAt: "desc" },
    take: 50,
  })
  return NextResponse.json(messages)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const { content, channel, customerIds, campaignId } = await req.json()
  if (!content || !customerIds?.length) return NextResponse.json({ error: "내용과 수신자를 선택해주세요." }, { status: 400 })
  const message = await prisma.message.create({
    data: {
      userId: user.id, content, channel: channel ?? "sms", campaignId,
      recipients: { create: customerIds.map((customerId: string) => ({ customerId, status: "sent" })) },
    },
    include: { recipients: true },
  })
  return NextResponse.json(message, { status: 201 })
}
