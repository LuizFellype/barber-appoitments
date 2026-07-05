"use client"

import { useMemo, useState } from "react"
import { Plus, Trash2, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { formatDateLong } from "@/lib/format"
import type { AdminSlot } from "@/lib/api/admin"
import { useAddSlots, useAdminSlots, useRemoveSlot } from "@/lib/api/admin-client"
import { ConfirmDialog } from "./confirm-dialog"

export function SlotsManager() {
  const { data: slots, isLoading } = useAdminSlots()
  const addSlots = useAddSlots()
  const removeSlot = useRemoveSlot()

  const [date, setDate] = useState("")
  const [times, setTimes] = useState("")
  const [removing, setRemoving] = useState<AdminSlot | null>(null)

  const byDay = useMemo(() => {
    const map = new Map<string, AdminSlot[]>()
    for (const slot of slots ?? []) {
      if (!map.has(slot.date)) map.set(slot.date, [])
      map.get(slot.date)!.push(slot)
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b))
  }, [slots])

  function handleAdd() {
    const parsedTimes = times
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
    if (!date || parsedTimes.length === 0) return

    addSlots.mutate(
      { date, times: parsedTimes },
      { onSuccess: () => setTimes("") },
    )
  }

  function handleRemove() {
    if (!removing) return
    removeSlot.mutate(removing.id, { onSuccess: () => setRemoving(null) })
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-wide">Disponibilidade</h2>
        <p className="text-sm text-muted-foreground">Adicione horarios para um dia especifico.</p>
      </div>

      <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slot-date">Data</Label>
          <Input id="slot-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="slot-times">Horarios (separados por virgula)</Label>
          <Input
            id="slot-times"
            value={times}
            onChange={(e) => setTimes(e.target.value)}
            placeholder="09:00, 10:00, 11:30"
          />
        </div>
        <Button onClick={handleAdd} disabled={addSlots.isPending || !date || !times.trim()}>
          <Plus className="h-4 w-4" />
          {addSlots.isPending ? "Adicionando..." : "Adicionar"}
        </Button>
      </Card>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : byDay.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum horario cadastrado.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {byDay.map(([day, daySlots]) => (
            <Card key={day} className="p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                <CalendarDays className="h-4 w-4 text-primary" />
                {formatDateLong(day)}
              </div>
              <div className="flex flex-wrap gap-2">
                {daySlots.map((slot) => (
                  <span
                    key={slot.id}
                    className="flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-1.5 text-sm"
                  >
                    {slot.time}
                    {slot.booked && (
                      <Badge variant="secondary" className="text-xs">
                        Reservado
                      </Badge>
                    )}
                    <button
                      type="button"
                      onClick={() => setRemoving(slot)}
                      disabled={slot.booked}
                      className="text-muted-foreground transition-colors hover:text-destructive disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Remover horario"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!removing}
        onOpenChange={(v) => !v && setRemoving(null)}
        title="Remover horario?"
        description={`O horario ${removing?.time} sera removido da agenda.`}
        confirmLabel="Remover"
        pending={removeSlot.isPending}
        onConfirm={handleRemove}
      />
    </div>
  )
}
