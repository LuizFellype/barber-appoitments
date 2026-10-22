import Link from "next/link"
import { Instagram, MessageCircle } from "lucide-react"
import { LogoBadge } from "@/components/brand/logo-badge"

const DEFENDEMOS = [
  {
    n: "01",
    t: "Autoestima",
    d: "Cada corte é pensado pra quem senta na cadeira sair se vendo diferente — mais confiante, mais dono de si.",
  },
  {
    n: "02",
    t: "Acessibilidade",
    d: "Preço justo e horários que cabem na rotina de quem trabalha, estuda e corre atrás. Barbearia pra comunidade, não apesar dela.",
  },
  {
    n: "03",
    t: "Cultura periférica",
    d: "Rap, trap, funk. Estética de rua assumida como identidade, não como estereótipo.",
  },
]

export default function StreetwearConceito() {
  return (
    <main className="min-h-screen bg-white text-black" style={{ fontFamily: "var(--font-poppins)" }}>
      <header className="flex items-center justify-between border-b border-black/10 px-6 py-5">
        <span className="text-xs uppercase tracking-[0.3em] text-black/50">Ch&amp;2d — Barbearia</span>
        <Link
          href="/identidade"
          className="text-xs uppercase tracking-widest text-black/40 underline-offset-4 hover:text-black hover:underline"
        >
          Ver outros estilos
        </Link>
      </header>

      {/* HERO */}
      <section className="relative mx-auto max-w-6xl px-6 pb-16 pt-20">
        <div className="grid items-center gap-10 sm:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.4em] text-black/40">Barbearia · Streetwear · Cuts</p>
            <h1
              className="text-6xl leading-[0.9] sm:text-8xl"
              style={{ fontFamily: "var(--font-archivo-black)" }}
            >
              CH&amp;2D
            </h1>
            <p className="mt-6 max-w-md text-pretty text-base text-black/60">
              Identidade, atitude e acolhimento em cada corte. Uma barbearia que nasceu na comunidade e carrega
              a estética da rua com orgulho.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/agendar"
                className="bg-black px-7 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/80"
              >
                Agendar
              </Link>
              <a
                href="#"
                className="flex items-center gap-2 border border-black/20 px-7 py-3 text-sm font-semibold uppercase tracking-widest text-black/70 transition hover:border-black hover:text-black"
              >
                <Instagram className="h-4 w-4" /> Instagram
              </a>
            </div>
          </div>
          <div className="flex justify-center sm:justify-end">
            <LogoBadge tone="dark" className="h-56 w-56 -rotate-6" />
          </div>
        </div>
      </section>

      {/* 01 SOBRE */}
      <section className="border-t border-black/10 px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-[auto_1fr]">
          <span className="text-sm font-semibold uppercase tracking-widest text-black/30">01 — Sobre</span>
          <div className="max-w-2xl">
            <h2 className="mb-4 text-3xl" style={{ fontFamily: "var(--font-archivo-black)" }}>
              Uma barbearia, um ponto de encontro.
            </h2>
            <p className="text-pretty leading-relaxed text-black/70">
              A Ch&amp;2d existe porque a comunidade precisava de um espaço que fosse além do corte: um lugar de
              pertencimento, onde a estética de rua — moda, música, atitude — é celebrada, não escondida.
              Trabalhamos pra que cada cliente saia se sentindo representado.
            </p>
          </div>
        </div>
      </section>

      {/* 02 O QUE DEFENDEMOS */}
      <section className="border-t border-black/10 bg-black px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <span className="mb-10 block text-sm font-semibold uppercase tracking-widest text-white/40">
            02 — O que defendemos
          </span>
          <div className="grid gap-10 sm:grid-cols-3">
            {DEFENDEMOS.map((item) => (
              <div key={item.n}>
                <span className="text-sm text-white/30" style={{ fontFamily: "var(--font-archivo-black)" }}>
                  {item.n}
                </span>
                <h3 className="mt-2 mb-3 text-xl font-semibold">{item.t}</h3>
                <p className="text-sm leading-relaxed text-white/60">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 LOOKBOOK */}
      <section className="border-t border-black/10 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <span className="mb-10 block text-sm font-semibold uppercase tracking-widest text-black/30">
            03 — Lookbook
          </span>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] border border-black/10 bg-black/5" />
            ))}
          </div>
          <p className="mt-4 text-xs text-black/30">
            [Reservado para fotos reais dos cortes e do espaço — grade estilo lookbook de marca]
          </p>
        </div>
      </section>

      {/* 04 CTA FULL BLEED */}
      <section className="border-t border-black/10 bg-black px-6 py-20 text-center text-white">
        <h2 className="text-3xl sm:text-5xl" style={{ fontFamily: "var(--font-archivo-black)" }}>
          AGENDE SEU HORÁRIO
        </h2>
        <p className="mx-auto mt-4 max-w-md text-white/60">
          Sem fila, sem recado perdido no WhatsApp. Escolha o serviço e o horário direto por aqui.
        </p>
        <Link
          href="/agendar"
          className="mt-8 inline-block bg-white px-10 py-4 text-sm font-semibold uppercase tracking-widest text-black transition hover:bg-white/90"
        >
          Marcar agora
        </Link>
      </section>

      <footer className="flex flex-col items-center gap-4 border-t border-black/10 px-6 py-10 text-center">
        <LogoBadge tone="dark" className="h-12 w-12" />
        <div className="flex gap-4 text-black/50">
          <a href="#" aria-label="Instagram" className="hover:text-black">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="#" aria-label="WhatsApp" className="hover:text-black">
            <MessageCircle className="h-5 w-5" />
          </a>
        </div>
        <p className="text-xs uppercase tracking-widest text-black/30">Ch&amp;2d Barbearia — Streetwear Cuts</p>
      </footer>
    </main>
  )
}
