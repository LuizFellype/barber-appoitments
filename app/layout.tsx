import type React from "react"
import type { Metadata, Viewport } from "next"
import { Archivo_Black, Bungee, Inter, Oswald, Permanent_Marker, Poppins } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ReactQueryProvider } from "@/components/react-query-provider"

const inter = Inter({ subsets: ["latin"] })

// Fontes da identidade visual (Ch&2d), carregadas aqui para ficarem disponíveis
// tanto na home ("/") quanto nas páginas de comparação em "/identidade/*".
const bungee = Bungee({ subsets: ["latin"], weight: "400", variable: "--font-bungee" })
const archivoBlack = Archivo_Black({ subsets: ["latin"], weight: "400", variable: "--font-archivo-black" })
const permanentMarker = Permanent_Marker({ subsets: ["latin"], weight: "400", variable: "--font-marker" })
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" })
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins" })

const APP_NAME = "Ch&2d"
const APP_DESCRIPTION = "Barbearia Ch&2d — streetwear, cultura de rua e agendamento online."

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: APP_NAME,
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  icons: [
    { url: "/icons/favicon-16x16.png", rel: "icon", type: "image/png", sizes: "16x16" },
    { url: "/icons/favicon-32x32.png", rel: "icon", type: "image/png", sizes: "32x32" },
    { url: "/icons/apple-touch-icon.png", rel: "apple-touch-icon" },
  ],
}

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.className} ${bungee.variable} ${archivoBlack.variable} ${permanentMarker.variable} ${oswald.variable} ${poppins.variable}`}
      >
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  )
}
