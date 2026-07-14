import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * Looks up a client's upcoming appointments by contact (phone/@instagram).
 * Deliberately a REST route backed by Prisma, not a public Hasura permission:
 * a Hasura row filter can't express "only reveal Client rows matching the
 * caller-supplied contact" — it can only be open (every row) or keyed off a
 * trusted session variable. Scoping this to one contact per request here keeps
 * a lookup from turning into a way to enumerate every client's contact info.
 *
 * No proof of ownership is required (matches the reference app's contact-only
 * client model) — anyone who knows/guesses a contact can see that client's
 * upcoming bookings. Acceptable for now; not a substitute for real auth.
 */
export async function GET(request: NextRequest) {
  const contact = request.nextUrl.searchParams.get("contact")?.trim()
  if (!contact) {
    return NextResponse.json({ error: "contact query param is required" }, { status: 400 })
  }

  const client = await prisma.client.findFirst({
    where: { contact: { equals: contact, mode: "insensitive" } },
  })

  if (!client) {
    return NextResponse.json([])
  }

  const today = new Date(new Date().toISOString().slice(0, 10))
  const appointments = await prisma.appointment.findMany({
    where: { clientId: client.id, status: "SCHEDULED", slot: { date: { gte: today } } },
    include: { slot: true, services: true },
  })

  const results = appointments.map((a) => ({
    id: a.id,
    date: a.slot.date.toISOString().slice(0, 10),
    time: a.slot.time,
    totalCents: a.totalCents,
    maintenanceFeeCents: a.maintenanceFeeCents,
    cancellationRequestedAt: a.cancellationRequestedAt,
    services: a.services.map((s) => ({ name: s.name, priceCents: s.priceCents })),
  }))
  results.sort((a, b) => (a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)))

  return NextResponse.json(results)
}
