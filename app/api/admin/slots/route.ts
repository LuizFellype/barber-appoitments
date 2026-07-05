import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied

  const slots = await prisma.slot.findMany({
    orderBy: [{ date: "asc" }, { time: "asc" }],
    include: { appointments: { where: { status: "SCHEDULED" }, select: { id: true } } },
  })

  return NextResponse.json(
    slots.map(({ appointments, date, ...slot }) => ({
      ...slot,
      date: date.toISOString().slice(0, 10),
      booked: appointments.length > 0,
    })),
  )
}

/** Adds one or more times for a single day. Ignores date+time duplicates. */
export async function POST(request: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  const body = await request.json()
  const date = String(body.date ?? "")
  const times: string[] = Array.isArray(body.times) ? body.times.filter((t: unknown) => typeof t === "string" && t) : []

  if (!date || times.length === 0) {
    return NextResponse.json({ error: "date and times are required" }, { status: 400 })
  }

  const created = await Promise.all(
    times.map((time) =>
      prisma.slot.upsert({
        where: { date_time: { date: new Date(date), time } },
        update: {},
        create: { date: new Date(date), time },
      }),
    ),
  )

  return NextResponse.json(
    created.map((slot) => ({ ...slot, date: slot.date.toISOString().slice(0, 10) })),
    { status: 201 },
  )
}
