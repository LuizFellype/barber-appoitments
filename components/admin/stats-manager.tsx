"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatBRL, formatDateLong } from "@/lib/format"
import { useClientStats, useStatsSummary } from "@/lib/api/admin-client"

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function firstDayOfMonthISO() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
}

export function StatsManager() {
  const { data: stats, isLoading } = useClientStats()

  const [from, setFrom] = useState(firstDayOfMonthISO())
  const [to, setTo] = useState(todayISO())
  const { data: summary, isLoading: loadingSummary } = useStatsSummary(from, to)

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-wide">Estatisticas</h2>
        <p className="text-sm text-muted-foreground">
          Quantos agendamentos (nao cancelados) cada cliente ja fez, e quanto gastou.
        </p>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h3 className="font-semibold tracking-wide">Faturamento no periodo</h3>
            <p className="text-sm text-muted-foreground">
              Quanto e dos servicos (fica com a barbearia) e quanto e taxa de manutencao, por data do agendamento.
            </p>
          </div>
          <div className="flex items-end gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="stats-from">De</Label>
              <Input id="stats-from" type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="stats-to">Ate</Label>
              <Input id="stats-to" type="date" value={to} min={from} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>
        </div>

        {loadingSummary ? (
          <p className="mt-4 text-sm text-muted-foreground">Carregando...</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-secondary/40 p-4">
              <p className="text-sm text-muted-foreground">Servicos (barbearia)</p>
              <p className="text-xl font-bold text-primary">{formatBRL(summary?.servicesCents ?? 0)}</p>
            </div>
            <div className="rounded-lg bg-secondary/40 p-4">
              <p className="text-sm text-muted-foreground">Taxa de manutencao</p>
              <p className="text-xl font-bold text-primary">{formatBRL(summary?.maintenanceFeeCents ?? 0)}</p>
            </div>
            <div className="rounded-lg bg-secondary/40 p-4">
              <p className="text-sm text-muted-foreground">
                Total ({summary?.appointmentsCount ?? 0} agendamento{summary?.appointmentsCount === 1 ? "" : "s"})
              </p>
              <p className="text-xl font-bold text-primary">
                {formatBRL((summary?.servicesCents ?? 0) + (summary?.maintenanceFeeCents ?? 0))}
              </p>
            </div>
          </div>
        )}
      </Card>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : (stats?.length ?? 0) === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum cliente cadastrado ainda.</p>
      ) : (
        <Card className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead className="text-right">Agendamentos</TableHead>
                <TableHead className="text-right">Total gasto</TableHead>
                <TableHead>Ultimo agendamento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats!.map((s) => (
                <TableRow key={s.clientId}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="text-muted-foreground">{s.contact}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">{s.bookingsCount}</Badge>
                  </TableCell>
                  <TableCell className="text-right text-primary">{formatBRL(s.totalSpentCents)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {s.lastBookingDate ? `${formatDateLong(s.lastBookingDate)} as ${s.lastBookingTime}` : "Nunca"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
