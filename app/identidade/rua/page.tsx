import Link from "next/link"
import { Instagram, MessageCircle, Scissors } from "lucide-react"
import { LogoBadge } from "@/components/brand/logo-badge"

const PILARES = [
  {
    titulo: "AUTOESTIMA",
    texto: "Cada corte é um upgrade na confiança de quem senta na cadeira. Aqui ninguém sai igual chegou.",
  },
  {
    titulo: "ACESSIBILIDADE",
    texto: "Preço justo, horário flexível e atendimento sem julgamento pra quem é da comunidade.",
  },
  {
    titulo: "CULTURA DA QUEBRADA",
    texto: "Rap, trap e funk no som. Estilo nosso, sem pedir desculpa por ser quem é.",
  },
]

const GALERIA = [
  "Cliente saindo satisfeito depois do degradê, Ch&2d, 2026",
  "Movimento de sábado na barbearia, comunidade reunida",
  "Detalhe do acabamento navalhado, estilo streetwear",
  "Roda de conversa esperando a vez, som ligado no fundo",
  "Mural da barbearia pintado por artista local",
  "Criança da comunidade no primeiro corte, sorriso de orelha a orelha",
]

export default function RuaConceito() {
  return (
    <main className="min-h-screen bg-black text-white" style={{ fontFamily: "var(--font-oswald)" }}>
      {/* textura halftone sutil */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />

      <header className="relative z-10 flex items-center justify-between border-b-2 border-white/20 px-5 py-4">
        <div className="flex items-center gap-2">
          <LogoBadge tone="light" className="h-12 w-12" />
          <span className="text-sm uppercase tracking-[0.3em] text-white/70">Barbearia da quebrada</span>
        </div>
        <Link
          href="/identidade"
          className="text-xs uppercase tracking-widest text-white/50 underline-offset-4 hover:text-white hover:underline"
        >
          Ver outros estilos
        </Link>
      </header>

      {/* HERO */}
      <section className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-5 py-20 text-center">
        <LogoBadge tone="light" className="h-40 w-40" />
        <h1
          className="mt-8 text-5xl leading-[0.95] sm:text-7xl"
          style={{ fontFamily: "var(--font-bungee)" }}
        >
          CH&amp;2D
        </h1>
        <p className="mt-5 max-w-xl text-pretty text-xl font-semibold uppercase tracking-wide text-white/90">
          Não é só um corte. É atitude.
        </p>
        <p className="mt-3 max-w-lg text-balance text-white/60">
          Barbearia feita pela e para a comunidade. Nascemos na quebrada e é pra ela que a gente trabalha.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-none border-2 border-white bg-white px-7 py-3 text-sm font-bold uppercase tracking-widest text-black transition hover:bg-transparent hover:text-white"
          >
            Marcar horário
          </Link>
          <a
            href="#"
            className="flex items-center gap-2 rounded-none border-2 border-white/40 px-7 py-3 text-sm font-bold uppercase tracking-widest text-white/80 transition hover:border-white hover:text-white"
          >
            <Instagram className="h-4 w-4" /> Seguir
          </a>
        </div>
      </section>

      {/* HISTÓRIA */}
      <section className="relative z-10 border-y-2 border-white/20 bg-white/5 px-5 py-16">
        <div className="mx-auto max-w-3xl">
          <h2
            className="mb-4 text-3xl uppercase sm:text-4xl"
            style={{ fontFamily: "var(--font-marker)" }}
          >
            Nossa história
          </h2>
          <p className="text-pretty text-lg leading-relaxed text-white/80">
            A Ch&amp;2d nasceu aqui, na comunidade, sabendo o que é faltar oportunidade. Mais que uma barbearia,
            é ponto de encontro, é autoestima, é espaço pra todo mundo se sentir representado — do moleque que tá
            cortando o cabelo pela primeira vez até quem já é cliente de anos.
          </p>
        </div>
      </section>

      {/* PILARES */}
      <section className="relative z-10 mx-auto max-w-5xl px-5 py-16">
        <h2 className="mb-10 text-center text-sm uppercase tracking-[0.4em] text-white/50">Mais que um corte</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {PILARES.map((p) => (
            <div key={p.titulo} className="border-2 border-white/15 p-6 transition hover:border-white/50">
              <Scissors className="mb-4 h-6 w-6 text-white/60" />
              <h3 className="mb-2 text-xl" style={{ fontFamily: "var(--font-archivo-black)" }}>
                {p.titulo}
              </h3>
              <p className="text-sm leading-relaxed text-white/60">{p.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SOM DA QUEBRADA */}
      <section className="relative z-10 border-y-2 border-white/20 bg-white text-black">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center">
          <p
            className="text-pretty text-3xl leading-tight sm:text-5xl"
            style={{ fontFamily: "var(--font-marker)" }}
          >
            "Aqui o som não abaixa e o corte não erra."
          </p>
          <p className="mt-4 text-sm uppercase tracking-widest text-black/50">
            Rap · Trap · Funk — a trilha sonora da Ch&amp;2d
          </p>
        </div>
      </section>

      {/* GALERIA */}
      <section className="relative z-10 mx-auto max-w-5xl px-5 py-16">
        <h2 className="mb-8 text-center text-sm uppercase tracking-[0.4em] text-white/50">Registros</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {GALERIA.map((legenda, i) => (
            <figure key={i} className="group relative aspect-square overflow-hidden border border-white/15 bg-white/5">
              <div className="flex h-full w-full items-center justify-center text-white/20">
                <Scissors className="h-8 w-8" />
              </div>
              <figcaption className="absolute inset-x-0 bottom-0 bg-black/80 p-2 text-[10px] leading-tight text-white/70 opacity-0 transition group-hover:opacity-100">
                {legenda}
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-white/30">
          [Espaço reservado para fotos reais do dia a dia da barbearia — cada uma com legenda]
        </p>
      </section>

      {/* DEPOIMENTO */}
      <section className="relative z-10 border-t-2 border-white/20 bg-white/5 px-5 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-pretty text-xl italic text-white/80">
            "Primeira vez que saí de uma barbearia me sentindo representado de verdade. Aqui é o meu lugar."
          </p>
          <p className="mt-3 text-sm uppercase tracking-widest text-white/40">— Cliente da Ch&amp;2d</p>
        </div>
      </section>

      <footer className="relative z-10 flex flex-col items-center gap-3 px-5 py-10 text-center text-white/40">
        <LogoBadge tone="light" className="h-14 w-14" />
        <p className="text-xs uppercase tracking-widest">Feito na comunidade, pra comunidade.</p>
        <div className="flex gap-4">
          <a href="#" aria-label="Instagram" className="hover:text-white">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="#" aria-label="WhatsApp" className="hover:text-white">
            <MessageCircle className="h-5 w-5" />
          </a>
        </div>
      </footer>
    </main>
  )
}
