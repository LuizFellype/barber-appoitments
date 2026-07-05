import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied

  const services = await prisma.service.findMany({ orderBy: { name: "asc" } })
  return NextResponse.json(services)
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  const body = await request.json()
  const service = await prisma.service.create({
    data: {
      name: String(body.name ?? "").trim(),
      description: String(body.description ?? "").trim(),
      priceCents: Math.round(Number(body.priceCents) || 0),
      durationMin: Math.round(Number(body.durationMin) || 0),
      active: Boolean(body.active),
    },
  })
  return NextResponse.json(service, { status: 201 })
}
