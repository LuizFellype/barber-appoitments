"use client"

import { useState } from "react"
import { Clock, User, Phone, Ban } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatBRL } from "@/lib/format"
import type { AdminAppointment } from "@/lib/api/admin"
import { useAdminAppointmentsByDay, useCancelAppointment } from "@/lib/api/admin-client"
import { ConfirmDialog } from "./confirm-dialog"

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function AppointmentsManager() {
  const [date, setDate] = useState(todayISO())
  const { data: appointments, isLoading } = useAdminAppointmentsByDay(date)
  const cancelAppointment = useCancelAppointment(date)
  const [cancelling, setCancelling] = useState<AdminAppointment | null>(null)

  function handleCancel() {
    if (!cancelling) return
    cancelAppointment.mutate(cancelling.id, { onSuccess: () => setCancelling(null) })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-wide">Agendamentos</h2>
          <p className="text-sm text-muted-foreground">Agendamentos ativos de um dia.</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="apt-date">Dia</Label>
          <Input id="apt-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : (appointments?.length ?? 0) === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum agendamento neste dia.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {appointments!.map((a) => (
            <Card key={a.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 font-medium">
                  <Clock className="h-4 w-4 text-primary" />
                  {a.time}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  {a.clientName}
                  <Phone className="ml-2 h-3.5 w-3.5" />
                  {a.clientContact}
                </div>
                <p className="text-sm text-muted-foreground">
                  {a.services.map((s) => s.name).join(", ") || "Sem servicos"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-primary">{formatBRL(a.totalCents)}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCancelling(a)}
                  aria-label="Cancelar agendamento"
                  className="text-destructive hover:text-destructive"
                >
                  <Ban className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!cancelling}
        onOpenChange={(v) => !v && setCancelling(null)}
        title="Cancelar agendamento?"
        description={`O agendamento de ${cancelling?.clientName} as ${cancelling?.time} sera cancelado e o horario ficara livre novamente.`}
        confirmLabel="Cancelar agendamento"
        pending={cancelAppointment.isPending}
        onConfirm={handleCancel}
      />
    </div>
  )
}
