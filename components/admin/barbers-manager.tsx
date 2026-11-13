"use client"

import { useState } from "react"
import { Plus, Trash2, Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { AdminBarber } from "@/lib/api/admin"
import { useAdminBarbers, useCreateBarber, useDeleteBarber, useUpdateBarber } from "@/lib/api/admin-client"
import { ConfirmDialog } from "./confirm-dialog"

export function BarbersManager() {
  const { data: barbers, isLoading } = useAdminBarbers()
  const createBarber = useCreateBarber()
  const updateBarber = useUpdateBarber()
  const deleteBarber = useDeleteBarber()

  const [name, setName] = useState("")
  const [removing, setRemoving] = useState<AdminBarber | null>(null)

  function handleAdd() {
    const trimmed = name.trim()
    if (!trimmed) return
    createBarber.mutate({ name: trimmed, active: true }, { onSuccess: () => setName("") })
  }

  function handleToggleActive(barber: AdminBarber) {
    updateBarber.mutate({ id: barber.id, input: { name: barber.name, active: !barber.active } })
  }

  function handleRemove() {
    if (!removing) return
    deleteBarber.mutate(removing.id, { onSuccess: () => setRemoving(null) })
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-wide">Barbeiros</h2>
        <p className="text-sm text-muted-foreground">Cadastre os barbeiros para vincular a disponibilidade.</p>
      </div>

      <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-end">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="barber-name">Nome</Label>
          <Input
            id="barber-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do barbeiro"
          />
        </div>
        <Button onClick={handleAdd} disabled={createBarber.isPending || !name.trim()}>
          <Plus className="h-4 w-4" />
          {createBarber.isPending ? "Adicionando..." : "Adicionar"}
        </Button>
      </Card>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : (barbers?.length ?? 0) === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum barbeiro cadastrado.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {barbers!.map((barber) => (
            <Card key={barber.id} className="flex items-center justify-between gap-2 p-4">
              <div className="flex items-center gap-2">
                <Scissors className="h-4 w-4 text-primary" />
                <span className="font-medium">{barber.name}</span>
                {!barber.active && <Badge variant="secondary">Inativo</Badge>}
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={() => handleToggleActive(barber)} disabled={updateBarber.isPending}>
                  {barber.active ? "Desativar" : "Ativar"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setRemoving(barber)}
                  aria-label="Excluir"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!removing}
        onOpenChange={(v) => !v && setRemoving(null)}
        title="Excluir barbeiro?"
        description={`O barbeiro "${removing?.name}" sera removido permanentemente. So e possivel remover se ele nao tiver horarios cadastrados.`}
        confirmLabel="Excluir"
        pending={deleteBarber.isPending}
        onConfirm={handleRemove}
      />
    </div>
  )
}
