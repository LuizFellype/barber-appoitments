import { prisma } from "@/lib/prisma"

/** Every Nth non-cancelled appointment a client books earns a surprise gift
 * (a drink, a barbershop sticker, a discount — whatever the barber hands out
 * in the moment; not modeled here). "Nth" follows booking order (createdAt),
 * the same "any non-cancelled appointment counts" definition already used by
 * the admin stats' bookingsCount — so a milestone can be hit by a future
 * booking, not just one that already happened.
 */
export const MILESTONE_INTERVAL = 5

export function isMilestoneVisit(visitNumber: number): boolean {
  return visitNumber > 0 && visitNumber % MILESTONE_INTERVAL === 0
}

/** Maps each given appointment id to its 1-based position among its client's
 * non-cancelled appointments, ordered by booking time (createdAt). Ranks are
 * computed from each client's full SCHEDULED history, not just the requested
 * ids, so a rank never shifts depending on which ids are passed in. */
export async function getVisitNumbers(appointmentIds: string[]): Promise<Map<string, number>> {
  if (appointmentIds.length === 0) return new Map()

  const requested = await prisma.appointment.findMany({
    where: { id: { in: appointmentIds } },
    select: { clientId: true },
  })
  const clientIds = [...new Set(requested.map((a) => a.clientId))]

  const history = await prisma.appointment.findMany({
    where: { clientId: { in: clientIds }, status: "SCHEDULED" },
    orderBy: { createdAt: "asc" },
    select: { id: true, clientId: true },
  })

  const visitNumbers = new Map<string, number>()
  const countByClient = new Map<string, number>()
  for (const appointment of history) {
    const nextCount = (countByClient.get(appointment.clientId) ?? 0) + 1
    countByClient.set(appointment.clientId, nextCount)
    visitNumbers.set(appointment.id, nextCount)
  }

  return visitNumbers
}
