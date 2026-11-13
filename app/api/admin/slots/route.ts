import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied

  const slots = await prisma.slot.findMany({
    orderBy: [{ date: "asc" }, { time: "asc" }],
    include: {
      barber: { select: { name: true } },
      appointments: { where: { status: "SCHEDULED" }, select: { id: true } },
    },
  })

  return NextResponse.json(
    slots.map(({ appointments, barber, date, ...slot }) => ({
      ...slot,
      date: date.toISOString().slice(0, 10),
      barberName: barber.name,
      booked: appointments.length > 0,
    })),
  )
}

/** Adds one or more times, for one or more barbers, for a single day. Ignores date+time+barber duplicates. */
export async function POST(request: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  const body = await request.json()
  const date = String(body.date ?? "")
  const times: string[] = Array.isArray(body.times) ? body.times.filter((t: unknown) => typeof t === "string" && t) : []
  const barberIds: string[] = Array.isArray(body.barberIds)
    ? body.barberIds.filter((id: unknown) => typeof id === "string" && id)
    : []

  if (!date || times.length === 0 || barberIds.length === 0) {
    return NextResponse.json({ error: "date, times and barberIds are required" }, { status: 400 })
  }

  const created = await Promise.all(
    times.flatMap((time) =>
      barberIds.map((barberId) =>
        prisma.slot.upsert({
          where: { date_time_barberId: { date: new Date(date), time, barberId } },
          update: {},
          create: { date: new Date(date), time, barberId },
        }),
      ),
    ),
  )

  return NextResponse.json(
    created.map((slot) => ({ ...slot, date: slot.date.toISOString().slice(0, 10) })),
    { status: 201 },
  )
}
