import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"

/** GET /api/admin/stats/summary?from=YYYY-MM-DD&to=YYYY-MM-DD
 * Revenue breakdown for a date range: how much is for the services themselves
 * (goes to the barbershop) vs the flat maintenance fee (see lib/pricing.ts),
 * for non-cancelled appointments only. Filtered by slot date (when the
 * service happens, and gets paid for at the shop — there's no online
 * payment), not booking/createdAt date, same convention as "last appointment"
 * in the per-client stats below.
 */
export async function GET(request: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  const from = request.nextUrl.searchParams.get("from")
  const to = request.nextUrl.searchParams.get("to")
  if (!from || !to) {
    return NextResponse.json({ error: "from and to query params are required" }, { status: 400 })
  }

  const { _sum, _count } = await prisma.appointment.aggregate({
    where: {
      status: "SCHEDULED",
      slot: { date: { gte: new Date(from), lte: new Date(to) } },
    },
    _sum: { totalCents: true, maintenanceFeeCents: true },
    _count: true,
  })

  return NextResponse.json({
    from,
    to,
    appointmentsCount: _count,
    servicesCents: _sum.totalCents ?? 0,
    maintenanceFeeCents: _sum.maintenanceFeeCents ?? 0,
  })
}
