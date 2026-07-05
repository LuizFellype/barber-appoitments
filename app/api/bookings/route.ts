import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * Creates a booking: upserts the client by contact, re-checks the slot is still
 * free, snapshots the selected services (name + price locked in), and creates the
 * appointment. Mirrors createBooking() in
 * app-de-agendamento-de-barbearia/services/appointments.ts, backed by Postgres
 * instead of the mock store.
 */
export async function POST(request: NextRequest) {
  const body = await request.json()
  const name = String(body.name ?? "").trim()
  const contact = String(body.contact ?? "").trim()
  const slotId = String(body.slotId ?? "")
  const serviceIds: string[] = Array.isArray(body.serviceIds) ? body.serviceIds.filter((id: unknown) => typeof id === "string") : []

  if (!name || !contact || !slotId || serviceIds.length === 0) {
    return NextResponse.json({ error: "Preencha nome, contato, horario e ao menos um servico." }, { status: 400 })
  }

  try {
    const appointment = await prisma.$transaction(async (tx) => {
      const slot = await tx.slot.findUnique({ where: { id: slotId } })
      if (!slot) throw new BookingError("Horario indisponivel.", 404)

      const taken = await tx.appointment.findFirst({ where: { slotId, status: "SCHEDULED" } })
      if (taken) throw new BookingError("Este horario acabou de ser reservado. Escolha outro.", 409)

      const services = await tx.service.findMany({ where: { id: { in: serviceIds }, active: true } })
      if (services.length === 0) throw new BookingError("Selecione ao menos um servico.", 400)

      const client =
        (await tx.client.findFirst({ where: { contact: { equals: contact, mode: "insensitive" } } })) ??
        (await tx.client.create({ data: { name, contact } }))

      if (client.name !== name) {
        await tx.client.update({ where: { id: client.id }, data: { name } })
      }

      const totalCents = services.reduce((sum, s) => sum + s.priceCents, 0)

      return tx.appointment.create({
        data: {
          slotId,
          clientId: client.id,
          totalCents,
          services: {
            create: services.map((s) => ({ serviceId: s.id, name: s.name, priceCents: s.priceCents })),
          },
        },
        include: { services: true },
      })
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    if (error instanceof BookingError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    throw error
  }
}

class BookingError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}
