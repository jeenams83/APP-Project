import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, password, businessName, businessType, phone } = body
  if (!email || !password || !businessName) {
    return NextResponse.json({ error: "필수 항목을 입력해주세요." }, { status: 400 })
  }
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return NextResponse.json({ error: "이미 사용 중인 이메일입니다." }, { status: 409 })
  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { name, email, password: hashed, businessName, businessType, phone } })
  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 })
}
