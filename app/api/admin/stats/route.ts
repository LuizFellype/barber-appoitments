import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"

const MAX_CLIENTS = 100

interface StatsRow {
  clientId: string
  name: string
  contact: string
  bookingsCount: number
  totalSpentCents: number
  lastDate: Date
  lastTime: string
}

/** Per-client booking stats (non-cancelled appointments only), for the admin panel.
 * Conceptually mirrors getClientStats() in
 * app-de-agendamento-de-barbearia/services/stats.ts, but aggregates in SQL instead
 * of loading every client + every appointment row into Node and reducing there —
 * that doesn't scale with appointment history size. Only clients with at least one
 * scheduled appointment are included, capped at the top MAX_CLIENTS by booking
 * count, so the response size doesn't grow unbounded with the client base.
 *
 * "Last appointment" means the most recent *slot* date/time (when the haircut is/was
 * scheduled for), not createdAt (when the booking was made) — those can differ a lot
 * since a client can book weeks ahead. Prisma's groupBy can't aggregate a joined
 * table's column, so this is a raw query: a DISTINCT ON per client (ordered by slot
 * date/time desc) for the "last" row, joined with a plain COUNT/SUM aggregate. */
export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied

  const rows = await prisma.$queryRaw<StatsRow[]>`
    WITH last_appt AS (
      SELECT DISTINCT ON (a."clientId")
        a."clientId",
        s."date" AS "lastDate",
        s."time" AS "lastTime"
      FROM "Appointment" a
      JOIN "Slot" s ON s."id" = a."slotId"
      WHERE a."status" = 'SCHEDULED'
      ORDER BY a."clientId", s."date" DESC, s."time" DESC
    ),
    agg AS (
      SELECT
        a."clientId",
        COUNT(*)::int AS "bookingsCount",
        SUM(a."totalCents")::int AS "totalSpentCents"
      FROM "Appointment" a
      WHERE a."status" = 'SCHEDULED'
      GROUP BY a."clientId"
    )
    SELECT
      agg."clientId",
      c."name",
      c."contact",
      agg."bookingsCount",
      agg."totalSpentCents",
      last_appt."lastDate",
      last_appt."lastTime"
    FROM agg
    JOIN last_appt ON last_appt."clientId" = agg."clientId"
    JOIN "Client" c ON c."id" = agg."clientId"
    ORDER BY agg."bookingsCount" DESC, agg."totalSpentCents" DESC
    LIMIT ${MAX_CLIENTS}
  `

  const stats = rows.map((r) => ({
    clientId: r.clientId,
    name: r.name,
    contact: r.contact,
    bookingsCount: r.bookingsCount,
    totalSpentCents: r.totalSpentCents,
    lastBookingDate: r.lastDate.toISOString().slice(0, 10),
    lastBookingTime: r.lastTime,
  }))

  return NextResponse.json(stats)
}
