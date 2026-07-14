import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * Lets a client flag their own appointment for cancellation from the public
 * "my appointments" search. This is a soft/advisory request, not a real
 * cancellation: it only stamps cancellationRequestedAt so the admin sees it
 * and can contact the client to confirm before actually cancelling (which
 * still only happens via POST /api/admin/appointments/[id]/cancel). The slot
 * stays booked and status stays SCHEDULED.
 *
 * No account/session exists in this app's contact-only client model (see
 * my-appointments/route.ts), so ownership is proven the same way that GET
 * lookup already trusts: the caller must supply the contact used at booking
 * time, matched case-insensitively against the appointment's client.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json().catch(() => ({}))
  const contact = String(body.contact ?? "").trim()

  if (!contact) {
    return NextResponse.json({ error: "contact is required" }, { status: 400 })
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: { client: true },
  })

  if (!appointment || appointment.client.contact.toLowerCase() !== contact.toLowerCase()) {
    return NextResponse.json({ error: "Agendamento nao encontrado para esse contato." }, { status: 404 })
  }

  if (appointment.status !== "SCHEDULED") {
    return NextResponse.json({ error: "Este agendamento nao esta mais ativo." }, { status: 409 })
  }

  const updated = await prisma.appointment.update({
    where: { id },
    data: { cancellationRequestedAt: appointment.cancellationRequestedAt ?? new Date() },
  })

  return NextResponse.json({ ok: true, cancellationRequestedAt: updated.cancellationRequestedAt })
}
