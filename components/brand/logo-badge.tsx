import Image from "next/image"

/**
 * Logo oficial da Ch&2d (pente + tesoura, selo circular "BARBEARIA" e a faixa
 * "STREETWEAR · CUTS"), arquivo enviado pelo dono da barbearia — salvo em
 * `public/brand/ch2d-logo.png` (PNG com fundo transparente, estilo adesivo/sticker).
 *
 * O arquivo já é preto e branco com contorno/realces brancos. Em fundos claros ele
 * funciona direto; em fundos escuros ("light" tone) aplicamos uma base branca
 * arredondada atrás da imagem pra o preto não "sumir" no fundo.
 */
export function LogoBadge({
  className = "",
  tone = "dark",
}: {
  className?: string
  /** "dark" = usar sobre fundo claro (sem base). "light" = usar sobre fundo escuro (ganha base branca). */
  tone?: "dark" | "light"
}) {
  const image = (
    <Image
      src="/brand/ch2d-logo.png"
      alt="Ch&2d Barbearia — Streetwear Cuts"
      fill
      sizes="320px"
      className="object-contain"
    />
  )

  if (tone === "light") {
    return (
      <span className={`relative inline-block shrink-0 rounded-full bg-white ${className}`}>
        <span className="absolute inset-[7%]">{image}</span>
      </span>
    )
  }

  return <span className={`relative inline-block shrink-0 ${className}`}>{image}</span>
}
