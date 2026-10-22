import Link from "next/link"
import { Heart, Instagram, MessageCircle, Smile, Users } from "lucide-react"
import { LogoBadge } from "@/components/brand/logo-badge"

const COMPROMISSOS = [
  {
    icon: Smile,
    titulo: "Autoestima",
    texto:
      "Mais do que um corte: um momento de cuidado. Queremos que cada pessoa saia da cadeira se sentindo mais confiante.",
  },
  {
    icon: Users,
    titulo: "Acessibilidade",
    texto:
      "Preço justo, horários flexíveis e atendimento acolhedor pra quem mora aqui na comunidade — sem barreira pra ninguém.",
  },
  {
    icon: Heart,
    titulo: "Cultura periférica",
    texto: "Rap, trap e funk fazem parte de quem somos. Celebramos a cultura da quebrada com orgulho, todo dia.",
  },
]

const VOZES = [
  { nome: "Cliente de longa data", texto: "Me sinto em casa aqui. Não é só o corte, é o acolhimento." },
  { nome: "Mãe de cliente", texto: "Meu filho adora vir, se sente à vontade e sai sempre sorrindo." },
  { nome: "Cliente da comunidade", texto: "Preço justo e um papo bom. Virou parte da minha semana." },
]

export default function ComunidadeConceito() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-black" style={{ fontFamily: "var(--font-poppins)" }}>
      <header className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <LogoBadge tone="dark" className="h-10 w-10" />
          <span className="text-sm font-semibold">Ch&amp;2d Barbearia</span>
        </div>
        <Link
          href="/identidade"
          className="text-xs uppercase tracking-widest text-black/40 underline-offset-4 hover:text-black hover:underline"
        >
          Ver outros estilos
        </Link>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <LogoBadge tone="dark" className="mx-auto h-32 w-32" />
        <h1 className="mt-8 text-balance text-4xl font-bold leading-tight sm:text-5xl">
          Todo mundo merece se sentir bem na cadeira.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-black/60">
          A Ch&amp;2d é uma barbearia da nossa comunidade — feita para acolher, incluir e celebrar quem somos,
          com preço justo e portas abertas pra todo mundo.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/agendar"
            className="rounded-full bg-black px-8 py-3 text-base font-semibold text-white transition hover:bg-black/80"
          >
            Marcar meu horário
          </Link>
          <a
            href="#"
            className="flex items-center gap-2 rounded-full border border-black/15 px-8 py-3 text-base font-semibold text-black/70 transition hover:border-black hover:text-black"
          >
            <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
          </a>
        </div>
      </section>

      {/* QUEM SOMOS */}
      <section className="border-y border-black/10 bg-white px-6 py-16">
        <div className="mx-auto grid max-w-4xl items-center gap-10 sm:grid-cols-2">
          <div className="aspect-square rounded-2xl bg-black/5" />
          <div>
            <h2 className="mb-4 text-2xl font-bold">Quem somos</h2>
            <p className="text-pretty leading-relaxed text-black/70">
              Nascemos aqui, na comunidade, entendendo de perto as dificuldades de quem vive na periferia. A
              Ch&amp;2d é mais do que uma barbearia: é um espaço de convivência, onde cada corte carrega respeito
              pela história de quem senta na cadeira.
            </p>
          </div>
        </div>
      </section>

      {/* COMPROMISSOS */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="mb-10 text-center text-2xl font-bold">Nosso compromisso</h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {COMPROMISSOS.map(({ icon: Icon, titulo, texto }) => (
            <div key={titulo} className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{titulo}</h3>
              <p className="text-sm leading-relaxed text-black/60">{texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VOZES DA QUEBRADA */}
      <section className="border-y border-black/10 bg-white px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-2xl font-bold">Vozes da quebrada</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {VOZES.map((v) => (
              <div key={v.nome} className="rounded-2xl bg-[#fafafa] p-6">
                <p className="text-pretty text-sm leading-relaxed text-black/70">"{v.texto}"</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-black/40">{v.nome}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALERIA */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="mb-8 text-center text-2xl font-bold">Nosso dia a dia</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-black/5" />
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-black/30">
          [Reservado para fotos reais da barbearia, do time e dos clientes — cada uma com legenda]
        </p>
      </section>

      {/* CTA FINAL */}
      <section className="bg-black px-6 py-16 text-center text-white">
        <h2 className="text-2xl font-bold sm:text-3xl">Vem fazer parte dessa história.</h2>
        <p className="mx-auto mt-3 max-w-md text-white/60">
          Agende seu horário e venha conhecer de perto por que a Ch&amp;2d é mais que uma barbearia.
        </p>
        <Link
          href="/agendar"
          className="mt-7 inline-block rounded-full bg-white px-9 py-3 text-base font-semibold text-black transition hover:bg-white/90"
        >
          Marcar meu horário
        </Link>
      </section>

      <footer className="flex flex-col items-center gap-3 px-6 py-10 text-center text-black/40">
        <p className="text-xs">Feito com orgulho, na e para a comunidade.</p>
        <div className="flex gap-4">
          <a href="#" aria-label="Instagram" className="hover:text-black">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="#" aria-label="WhatsApp" className="hover:text-black">
            <MessageCircle className="h-5 w-5" />
          </a>
        </div>
      </footer>
    </main>
  )
}
