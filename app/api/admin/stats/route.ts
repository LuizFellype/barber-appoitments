import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"

const MAX_CLIENTS = 100

/** Per-client booking stats (non-cancelled appointments only), for the admin panel.
 * Conceptually mirrors getClientStats() in
 * app-de-agendamento-de-barbearia/services/stats.ts, but aggregates in SQL (GROUP BY)
 * instead of loading every client + every appointment row into Node and reducing
 * there — that doesn't scale with appointment history size. Only clients with at
 * least one scheduled appointment are included, capped at the top MAX_CLIENTS by
 * booking count, so the response size doesn't grow unbounded with the client base. */
export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied

  const grouped = await prisma.appointment.groupBy({
    by: ["clientId"],
    where: { status: "SCHEDULED" },
    _count: { clientId: true },
    _sum: { totalCents: true },
    _max: { createdAt: true },
    orderBy: [{ _count: { clientId: "desc" } }, { _sum: { totalCents: "desc" } }],
    take: MAX_CLIENTS,
  })

  const clients = await prisma.client.findMany({
    where: { id: { in: grouped.map((g) => g.clientId) } },
    select: { id: true, name: true, contact: true },
  })
  const clientById = new Map(clients.map((c) => [c.id, c]))

  const stats = grouped.map((g) => ({
    clientId: g.clientId,
    name: clientById.get(g.clientId)?.name ?? "",
    contact: clientById.get(g.clientId)?.contact ?? "",
    bookingsCount: g._count.clientId,
    totalSpentCents: g._sum.totalCents ?? 0,
    lastBookingDate: g._max.createdAt?.toISOString() ?? null,
  }))

  return NextResponse.json(stats)
}
