import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin()
  if (denied) return denied

  const { id } = await params

  const activeAppointment = await prisma.appointment.findFirst({
    where: { slotId: id, status: "SCHEDULED" },
    select: { id: true },
  })
  if (activeAppointment) {
    return NextResponse.json({ error: "Cannot remove: there is an active appointment for this slot." }, { status: 409 })
  }

  await prisma.slot.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
