import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin()
  if (denied) return denied

  const { id } = await params
  const body = await request.json()
  const barber = await prisma.barber.update({
    where: { id },
    data: {
      name: String(body.name ?? "").trim(),
      active: Boolean(body.active),
    },
  })
  return NextResponse.json(barber)
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin()
  if (denied) return denied

  const { id } = await params

  const existingSlot = await prisma.slot.findFirst({ where: { barberId: id }, select: { id: true } })
  if (existingSlot) {
    return NextResponse.json(
      { error: "Cannot remove: this barber still has availability slots. Remove them first." },
      { status: 409 },
    )
  }

  await prisma.barber.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
