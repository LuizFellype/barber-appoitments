"use client"

import { useState } from "react"
import { Pencil, Plus, Trash2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatBRL } from "@/lib/format"
import type { AdminService, ServiceInput } from "@/lib/api/admin"
import { useAdminServices, useCreateService, useDeleteService, useUpdateService } from "@/lib/api/admin-client"
import { ConfirmDialog } from "./confirm-dialog"

const emptyForm = { name: "", description: "", price: "", duration: "30", active: true }

export function ServicesManager() {
  const { data: services, isLoading } = useAdminServices()
  const createService = useCreateService()
  const updateService = useUpdateService()
  const deleteService = useDeleteService()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<AdminService | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [deleting, setDeleting] = useState<AdminService | null>(null)

  const pending = createService.isPending || updateService.isPending
  const deletePending = deleteService.isPending

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setOpen(true)
  }

  function openEdit(s: AdminService) {
    setEditing(s)
    setForm({
      name: s.name,
      description: s.description,
      price: (s.priceCents / 100).toString(),
      duration: s.durationMin.toString(),
      active: s.active,
    })
    setOpen(true)
  }

  function handleSave() {
    const input: ServiceInput = {
      name: form.name.trim(),
      description: form.description.trim(),
      priceCents: Math.round(Number(form.price) * 100) || 0,
      durationMin: Math.round(Number(form.duration)) || 30,
      active: form.active,
    }
    if (!input.name) return

    const onDone = () => setOpen(false)
    if (editing) {
      updateService.mutate({ id: editing.id, input }, { onSuccess: onDone })
    } else {
      createService.mutate(input, { onSuccess: onDone })
    }
  }

  function handleDelete() {
    if (!deleting) return
    deleteService.mutate(deleting.id, { onSuccess: () => setDeleting(null) })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-wide">Servicos</h2>
          <p className="text-sm text-muted-foreground">Nome, descricao, preco e duracao.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Novo servico
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {(services ?? []).map((s) => (
            <Card key={s.id} className="flex flex-col gap-2 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{s.name}</span>
                  {!s.active && <Badge variant="secondary">Inativo</Badge>}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(s)} aria-label="Editar">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleting(s)}
                    aria-label="Excluir"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-pretty">{s.description || "Sem descricao"}</p>
              <div className="flex items-center gap-3 text-sm">
                <span className="font-semibold text-primary">{formatBRL(s.priceCents)}</span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {s.durationMin} min
                </span>
              </div>
            </Card>
          ))}
          {services?.length === 0 && <p className="text-sm text-muted-foreground">Nenhum servico cadastrado.</p>}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar servico" : "Novo servico"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="s-name">Nome</Label>
              <Input
                id="s-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Corte de cabelo"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="s-desc">Descricao</Label>
              <Input
                id="s-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Descricao do servico"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="s-price">Preco (R$)</Label>
                <Input
                  id="s-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="50.00"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="s-dur">Duracao (min)</Label>
                <Input
                  id="s-dur"
                  type="number"
                  min="5"
                  step="5"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="h-4 w-4 accent-[var(--primary)]"
              />
              Ativo (visivel para clientes)
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={pending || !form.name.trim()}>
              {pending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title="Excluir servico?"
        description={`O servico "${deleting?.name}" sera removido permanentemente.`}
        confirmLabel="Excluir"
        pending={deletePending}
        onConfirm={handleDelete}
      />
    </div>
  )
}
