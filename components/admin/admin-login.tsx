"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { KeyRound, Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AdminAPI } from "@/lib/api/admin"

export function AdminLogin() {
  const [key, setKey] = useState("")
  const [error, setError] = useState("")
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    startTransition(async () => {
      try {
        const res = await AdminAPI.login(key)
        if (res.ok) {
          router.refresh()
        } else {
          setError("Chave incorreta.")
        }
      } catch {
        setError("Chave incorreta.")
      }
    })
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Scissors className="h-6 w-6" />
          </span>
          <h1 className="text-2xl font-bold tracking-wide">Area do Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">Informe a chave secreta para continuar.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="key">Chave secreta</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="key"
                type="password"
                className="pl-9"
                placeholder="********"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={pending || !key.trim()}>
            {pending ? "Verificando..." : "Entrar"}
          </Button>
        </form>
      </Card>
    </main>
  )
}
