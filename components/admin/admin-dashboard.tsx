"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminAPI } from "@/lib/api/admin"
import { ServicesManager } from "./services-manager"
import { SlotsManager } from "./slots-manager"
import { AppointmentsManager } from "./appointments-manager"
import { StatsManager } from "./stats-manager"

export function AdminDashboard() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function handleSignOut() {
    startTransition(async () => {
      await AdminAPI.logout()
      router.refresh()
    })
  }

  return (
    <main className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Scissors className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold tracking-widest">CH&2D ADMIN</span>
          </div>
          <Button variant="ghost" onClick={handleSignOut} disabled={pending}>
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <Tabs defaultValue="services">
          <TabsList>
            <TabsTrigger value="services">Servicos</TabsTrigger>
            <TabsTrigger value="slots">Disponibilidade</TabsTrigger>
            <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
            <TabsTrigger value="stats">Estatisticas</TabsTrigger>
          </TabsList>
          <TabsContent value="services" className="mt-6">
            <ServicesManager />
          </TabsContent>
          <TabsContent value="slots" className="mt-6">
            <SlotsManager />
          </TabsContent>
          <TabsContent value="appointments" className="mt-6">
            <AppointmentsManager />
          </TabsContent>
          <TabsContent value="stats" className="mt-6">
            <StatsManager />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
