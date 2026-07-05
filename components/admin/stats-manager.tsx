"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatBRL, formatDateLong } from "@/lib/format"
import { useClientStats } from "@/lib/api/admin-client"

export function StatsManager() {
  const { data: stats, isLoading } = useClientStats()

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-wide">Estatisticas</h2>
        <p className="text-sm text-muted-foreground">
          Quantos agendamentos (nao cancelados) cada cliente ja fez, e quanto gastou.
        </p>
      </div>

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
