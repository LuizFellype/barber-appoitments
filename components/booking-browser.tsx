"use client"

import { useMemo, useState } from "react"
import { Scissors, Check, Clock, CalendarDays, User, Phone } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatBRL, formatDateLong, weekdayShort } from "@/lib/format"
import { useActiveServices, useAvailability } from "@/lib/api/client"

// Ported from app-de-agendamento-de-barbearia/components/booking-flow.tsx, wired to
// real data via useActiveServices/useAvailability instead of server-action props.
// Booking submission itself is deferred to a follow-up change; name/contact are
// collected here (step 3) but not sent anywhere yet.
export function BookingBrowser() {
  const { data: services, isLoading: loadingServices, error: servicesError } = useActiveServices()
  const { data: availability, isLoading: loadingAvailability, error: availabilityError } = useAvailability()

  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")

  const effectiveDate = selectedDate ?? availability?.[0]?.date ?? null
  const canBook = Boolean(name.trim() && contact.trim() && selectedSlotId && selectedServiceIds.length > 0)

  const selectedServices = useMemo(
    () => (services ?? []).filter((s) => selectedServiceIds.includes(s.id)),
    [services, selectedServiceIds],
  )
  const totalCents = selectedServices.reduce((sum, s) => sum + s.priceCents, 0)
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.durationMin, 0)

  const daySlots = availability?.find((d) => d.date === effectiveDate)?.slots ?? []

  function toggleService(id: string) {
    setSelectedServiceIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  if (servicesError || availabilityError) {
    return (
      <Card className="p-6 text-sm text-destructive">
        Falha ao carregar dados: {`${servicesError ?? availabilityError}`}
      </Card>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="flex flex-col gap-6">
        <Card className="p-6">
          <StepHeader n={1} icon={<Scissors className="h-4 w-4" />} title="Escolha os servicos" />
          {loadingServices ? (
            <p className="mt-4 text-sm text-muted-foreground">Carregando servicos...</p>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(services ?? []).map((service) => {
                const active = selectedServiceIds.includes(service.id)
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => toggleService(service.id)}
                    className={`flex flex-col gap-1 rounded-lg border p-4 text-left transition-colors ${
                      active
                        ? "border-primary bg-primary/10"
                        : "border-border bg-secondary/40 hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{service.name}</span>
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                          active ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"
                        }`}
                      >
                        {active && <Check className="h-3 w-3" />}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground text-pretty">{service.description}</span>
                    <div className="mt-1 flex items-center gap-3 text-sm">
                      <span className="font-semibold text-primary">{formatBRL(service.priceCents)}</span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {service.durationMin} min
                      </span>
                    </div>
                  </button>
                )
              })}
              {services?.length === 0 && (
                <p className="col-span-full text-sm text-muted-foreground">Nenhum servico disponivel no momento.</p>
              )}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <StepHeader n={2} icon={<CalendarDays className="h-4 w-4" />} title="Escolha data e horario" />
          {loadingAvailability ? (
            <p className="mt-4 text-sm text-muted-foreground">Carregando horarios...</p>
          ) : (availability?.length ?? 0) === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Nenhum horario disponivel no momento. Volte em breve.
            </p>
          ) : (
            <>
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {availability!.map((day) => {
                  const active = day.date === effectiveDate
                  return (
                    <button
                      key={day.date}
                      type="button"
                      onClick={() => {
                        setSelectedDate(day.date)
                        setSelectedSlotId(null)
                      }}
                      className={`flex min-w-16 flex-col items-center rounded-lg border px-3 py-2 transition-colors ${
                        active ? "border-primary bg-primary/10" : "border-border bg-secondary/40 hover:border-primary/50"
                      }`}
                    >
                      <span className="text-xs uppercase text-muted-foreground">{weekdayShort(day.date)}</span>
                      <span className="text-lg font-semibold">{day.date.slice(8, 10)}</span>
                    </button>
                  )
                })}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {daySlots.map((slot) => {
                  const active = slot.id === selectedSlotId
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`rounded-lg border py-2 text-sm font-medium transition-colors ${
                        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-secondary/40 hover:border-primary/50"
                      }`}
                    >
                      {slot.time}
                    </button>
                  )
                })}
                {daySlots.length === 0 && (
                  <p className="col-span-full text-sm text-muted-foreground">Sem horarios livres neste dia.</p>
                )}
              </div>
            </>
          )}
        </Card>

        <Card className="p-6">
          <StepHeader n={3} icon={<User className="h-4 w-4" />} title="Seus dados" />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contact">Telefone ou @instagram</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="contact"
                  className="pl-9"
                  placeholder="(11) 99999-9999"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <Card className="p-6">
          <h3 className="text-lg font-semibold tracking-wide">Resumo</h3>
          <Separator className="my-4" />
          {selectedServices.length === 0 ? (
            <p className="text-sm text-muted-foreground">Selecione os servicos para ver o valor.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {selectedServices.map((s) => (
                <li key={s.id} className="flex items-center justify-between text-sm">
                  <span>{s.name}</span>
                  <span className="text-muted-foreground">{formatBRL(s.priceCents)}</span>
                </li>
              ))}
            </ul>
          )}

          {selectedSlotId && effectiveDate && (
            <div className="mt-4 rounded-lg bg-secondary/50 p-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                {formatDateLong(effectiveDate)}
              </div>
              <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                {daySlots.find((s) => s.id === selectedSlotId)?.time}
              </div>
            </div>
          )}

          <Separator className="my-4" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              {totalDuration > 0 && (
                <p className="text-xs text-muted-foreground">aprox. {totalDuration} min</p>
              )}
            </div>
            <span className="text-2xl font-bold text-primary">{formatBRL(totalCents)}</span>
          </div>

          <Button
            className="mt-4 w-full"
            disabled={!canBook}
            title="Confirmacao de agendamento chega no proximo passo"
          >
            Confirmar agendamento
          </Button>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            {canBook
              ? "Tudo pronto, mas o envio do agendamento ainda nao esta implementado."
              : "Preencha servicos, horario, nome e contato para continuar."}
          </p>
        </Card>
      </div>
    </div>
  )
}

function StepHeader({ n, icon, title }: { n: number; icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <Badge variant="secondary" className="flex h-7 w-7 items-center justify-center rounded-full p-0">
        {n}
      </Badge>
      <h2 className="flex items-center gap-2 text-lg font-semibold tracking-wide">
        <span className="text-primary">{icon}</span>
        {title}
      </h2>
    </div>
  )
}
