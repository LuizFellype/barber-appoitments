import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"
import { getVisitNumbers, isMilestoneVisit } from "@/lib/loyalty"

/** GET /api/admin/appointments?date=YYYY-MM-DD -> active appointments for that day, enriched for the admin UI. */
export async function GET(request: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  const date = request.nextUrl.searchParams.get("date")
  if (!date) {
    return NextResponse.json({ error: "date query param is required" }, { status: 400 })
  }

  const appointments = await prisma.appointment.findMany({
    where: { status: "SCHEDULED", slot: { date: new Date(date) } },
    orderBy: { slot: { time: "asc" } },
    include: { slot: true, client: true, services: true },
  })

  const visitNumbers = await getVisitNumbers(appointments.map((a) => a.id))

  return NextResponse.json(
    appointments.map((a) => {
      const visitNumber = visitNumbers.get(a.id) ?? 0
      return {
        id: a.id,
        status: a.status,
        totalCents: a.totalCents,
        maintenanceFeeCents: a.maintenanceFeeCents,
        cancellationRequestedAt: a.cancellationRequestedAt,
        createdAt: a.createdAt,
        date: a.slot.date.toISOString().slice(0, 10),
        time: a.slot.time,
        clientName: a.client.name,
        clientContact: a.client.contact,
        services: a.services.map((s) => ({ serviceId: s.serviceId, name: s.name, priceCents: s.priceCents })),
        visitNumber,
        isMilestone: isMilestoneVisit(visitNumber),
      }
    }),
  )
}
