import type React from "react"
import { Archivo_Black, Bungee, Oswald, Permanent_Marker, Poppins } from "next/font/google"

const bungee = Bungee({ subsets: ["latin"], weight: "400", variable: "--font-bungee" })
const archivoBlack = Archivo_Black({ subsets: ["latin"], weight: "400", variable: "--font-archivo-black" })
const permanentMarker = Permanent_Marker({ subsets: ["latin"], weight: "400", variable: "--font-marker" })
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" })
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins" })

export default function IdentidadeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${bungee.variable} ${archivoBlack.variable} ${permanentMarker.variable} ${oswald.variable} ${poppins.variable}`}
    >
      {children}
    </div>
  )
}
