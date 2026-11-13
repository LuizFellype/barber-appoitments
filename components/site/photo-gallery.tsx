"use client"

import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

type GalleryItem = {
  legenda: string
  a: string
  b: string
}

type Slide = {
  src: string
  legenda: string
}

export function PhotoGallery({ items }: { items: GalleryItem[] }) {
  const slides: Slide[] = items.flatMap((item) => [
    { src: item.a, legenda: item.legenda },
    { src: item.b, legenda: item.legenda },
  ])

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const close = useCallback(() => setOpenIndex(null), [])
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i - 1 + slides.length) % slides.length)),
    [slides.length],
  )
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i + 1) % slides.length)),
    [slides.length],
  )

  useEffect(() => {
    if (openIndex === null) return
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [openIndex, close, prev, next])

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpenIndex(i * 2)}
            className="group relative aspect-square overflow-hidden border border-white/15 bg-white/5 text-left"
          >
            <Image
              src={item.a}
              alt={item.legenda}
              fill
              sizes="(min-width: 640px) 33vw, 50vw"
              className="object-cover opacity-100 transition-opacity duration-700 ease-in-out group-hover:opacity-0"
            />
            <Image
              src={item.b}
              alt={item.legenda}
              fill
              sizes="(min-width: 640px) 33vw, 50vw"
              className="object-cover opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
            />
            <span className="absolute inset-x-0 bottom-0 bg-black/80 p-2 text-[10px] leading-tight text-white/70 opacity-0 transition group-hover:opacity-100">
              {item.legenda}
            </span>
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 px-4 py-6"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Fechar"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              prev()
            }}
            aria-label="Foto anterior"
            className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-4"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              next()
            }}
            aria-label="Próxima foto"
            className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-4"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div
            className="flex w-full max-w-4xl flex-1 items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-full max-h-[70vh] w-full">
              <Image
                key={slides[openIndex].src}
                src={slides[openIndex].src}
                alt={slides[openIndex].legenda}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
          </div>

          <p className="mt-3 max-w-xl text-center text-sm text-white/70">{slides[openIndex].legenda}</p>
          <p className="mt-1 text-xs uppercase tracking-widest text-white/30">
            {openIndex + 1} / {slides.length}
          </p>

          <div
            className="mt-4 flex max-w-full gap-2 overflow-x-auto px-2 pb-1"
            onClick={(e) => e.stopPropagation()}
          >
            {slides.map((slide, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setOpenIndex(i)}
                className={`relative h-14 w-14 shrink-0 overflow-hidden rounded border transition ${
                  i === openIndex ? "border-white opacity-100" : "border-white/20 opacity-50 hover:opacity-80"
                }`}
              >
                <Image src={slide.src} alt={slide.legenda} fill sizes="56px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
