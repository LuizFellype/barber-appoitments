import Link from "next/link"
import { LogoBadge } from "@/components/brand/logo-badge"

const OPCOES = [
  {
    href: "/identidade/rua",
    nome: "Rua / Grafite",
    desc: "Fundo preto, textura halftone, tipografia marcante. Energia de rua, alto contraste.",
  },
  {
    href: "/identidade/streetwear",
    nome: "Streetwear Editorial",
    desc: "Fundo branco, grid limpo, numeração editorial. Cara de marca de streetwear premium.",
  },
  {
    href: "/identidade/comunidade",
    nome: "Comunidade / Acolhimento",
    desc: "Tons suaves, tipografia grande e legível, foco em depoimentos. Convida, acolhe, inclui.",
  },
]

export default function IdentidadeIndex() {
  return (
    <main className="min-h-screen bg-neutral-100 px-6 py-16 text-black">
      <div className="mx-auto max-w-3xl text-center">
        <LogoBadge tone="dark" className="mx-auto h-24 w-24" />
        <h1 className="mt-6 text-3xl font-bold">3 propostas de identidade visual — Ch&amp;2d</h1>
        <p className="mt-3 text-black/60">
          Mesma marca, mesmas cores (preto e branco), três direções diferentes. Dá uma olhada em cada uma e me diz
          qual combina mais com a barbearia.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
        {OPCOES.map((op) => (
          <Link
            key={op.href}
            href={op.href}
            className="flex flex-col rounded-2xl border border-black/10 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h2 className="mb-2 text-lg font-semibold">{op.nome}</h2>
            <p className="flex-1 text-sm text-black/60">{op.desc}</p>
            <span className="mt-4 text-sm font-semibold text-black underline underline-offset-4">Ver página →</span>
          </Link>
        ))}
      </div>
    </main>
  )
}
