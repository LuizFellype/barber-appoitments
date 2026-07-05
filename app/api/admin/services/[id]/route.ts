import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin()
  if (denied) return denied

  const { id } = await params
  const body = await request.json()
  const service = await prisma.service.update({
    where: { id },
    data: {
      name: String(body.name ?? "").trim(),
      description: String(body.description ?? "").trim(),
      priceCents: Math.round(Number(body.priceCents) || 0),
      durationMin: Math.round(Number(body.durationMin) || 0),
      active: Boolean(body.active),
    },
  })
  return NextResponse.json(service)
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin()
  if (denied) return denied

  const { id } = await params
  await prisma.service.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
