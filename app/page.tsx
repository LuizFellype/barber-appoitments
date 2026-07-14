import Link from "next/link"
import { Scissors } from "lucide-react"
import { BookingBrowser } from "@/components/booking-browser"
import { MyAppointmentsSearch } from "@/components/my-appointments-search"
import { InstallPwaButton } from "@/components/install-pwa-button"

export default function Home() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Scissors className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold tracking-widest">CH&2D</span>
          </div>
          <div className="flex items-center gap-4">
            <InstallPwaButton />
            <Link href="/admin" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Area do admin
            </Link>
          </div>
        </div>
      </header>

      <section className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <h1 className="text-3xl font-bold tracking-wide text-balance sm:text-4xl">Agende seu horario</h1>
          <p className="mt-2 max-w-xl text-muted-foreground text-pretty">
            Escolha os servicos, veja o valor total na hora e reserve o melhor horario para o seu corte.
          </p>
        </div>
      </section>

      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8">
        <BookingBrowser />
        <MyAppointmentsSearch />
      </div>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-muted-foreground">Ch&2d - Barbearia</div>
      </footer>
    </main>
  )
}
