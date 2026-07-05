import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin()
  if (denied) return denied

  const { id } = await params
  await prisma.appointment.update({ where: { id }, data: { status: "CANCELLED" } })
  return NextResponse.json({ ok: true })
}
