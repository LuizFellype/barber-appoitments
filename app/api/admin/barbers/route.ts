import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied

  const barbers = await prisma.barber.findMany({ orderBy: { name: "asc" } })
  return NextResponse.json(barbers)
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  const body = await request.json()
  const barber = await prisma.barber.create({
    data: {
      name: String(body.name ?? "").trim(),
      active: body.active === undefined ? true : Boolean(body.active),
    },
  })
  return NextResponse.json(barber, { status: 201 })
}
