import { PrismaClient } from "@prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import bcrypt from "bcryptjs"
import path from "path"

const dbPath = path.join(process.cwd(), "dev.db")
const adapter = new PrismaBetterSqlite3({ url: dbPath })
const prisma = new PrismaClient({ adapter })

async function main() {
  const password = await bcrypt.hash("password123", 10)

  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      name: "김사장",
      password,
      businessName: "김사장 떡볶이",
      businessType: "음식점",
      phone: "010-1234-5678",
      plan: "pro",
    },
  })

  const customersData = [
    { name: "이순신", phone: "010-1111-2222", visitCount: 15, totalSpend: 185000, tags: "단골,VIP", daysAgo: 2 },
    { name: "박영희", phone: "010-3333-4444", visitCount: 8, totalSpend: 96000, tags: "단골", daysAgo: 5 },
    { name: "최민수", phone: "010-5555-6666", visitCount: 3, totalSpend: 35000, tags: "", daysAgo: 10 },
    { name: "정수연", phone: "010-7777-8888", visitCount: 22, totalSpend: 310000, tags: "단골,VIP", daysAgo: 1 },
    { name: "홍길동", phone: "010-9999-0000", visitCount: 1, totalSpend: 15000, tags: "", daysAgo: 20 },
    { name: "김민정", phone: "010-2222-3333", visitCount: 12, totalSpend: 142000, tags: "단골", daysAgo: 3 },
    { name: "이준혁", phone: "010-4444-5555", visitCount: 6, totalSpend: 72000, tags: "단골", daysAgo: 7 },
    { name: "박소연", phone: "010-6666-7777", visitCount: 2, totalSpend: 24000, tags: "", daysAgo: 15 },
  ]

  for (const c of customersData) {
    const lastVisit = new Date()
    lastVisit.setDate(lastVisit.getDate() - c.daysAgo)
    await prisma.customer.upsert({
      where: { userId_phone: { userId: user.id, phone: c.phone } },
      update: {},
      create: {
        userId: user.id,
        name: c.name,
        phone: c.phone,
        visitCount: c.visitCount,
        totalSpend: c.totalSpend,
        tags: c.tags || null,
        lastVisit,
      },
    })
  }

  console.log("✅ Seed complete:", user.email)
}

main().catch(console.error).finally(() => prisma.$disconnect())
