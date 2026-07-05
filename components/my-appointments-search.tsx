"use client"

import { useState } from "react"
import { Search, CalendarDays, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { formatBRL, formatDateLong } from "@/lib/format"
import { useMyAppointments } from "@/lib/api/client"

export function MyAppointmentsSearch() {
  const [contact, setContact] = useState("")
  const [searched, setSearched] = useState(false)
  const { mutate, data, isPending, error } = useMyAppointments()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!contact.trim()) return
    setSearched(true)
    mutate(contact.trim())
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold tracking-wide">Meus agendamentos</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Digite o telefone ou @instagram usado na reserva para ver seus proximos agendamentos.
      </p>

      <form onSubmit={handleSearch} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="search-contact">Telefone ou @instagram</Label>
          <Input
            id="search-contact"
            value={contact}
            onChange={(e) => setContact(e.target.value.replace(/\s/g, ""))}
            placeholder="27999999999 ou @ch_du_corte"
          />
        </div>
        <Button type="submit" disabled={isPending || !contact.trim()}>
          <Search className="h-4 w-4" />
          {isPending ? "Buscando..." : "Buscar"}
        </Button>
      </form>

      {error && <p className="mt-4 text-sm text-destructive">{`${error}`}</p>}

      {searched && !isPending && !error && (
        <div className="mt-4 flex flex-col gap-3">
          {data?.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum agendamento futuro encontrado para esse contato.</p>
          ) : (
            data?.map((a) => (
              <div key={a.id} className="rounded-lg border border-border bg-secondary/40 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      {formatDateLong(a.date)}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {a.time}
                    </span>
                  </div>
                  <span className="font-semibold text-primary">{formatBRL(a.totalCents)}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {a.services.map((s) => s.name).join(", ") || "Sem servicos"}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </Card>
  )
}
