import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ReactQueryProvider } from "@/components/react-query-provider"

const inter = Inter({ subsets: ["latin"] })

const APP_NAME = "Ch&2d"
const APP_DESCRIPTION = "Barber shop appointment app."

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
  themeColor: "#16A34A",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  )
}
