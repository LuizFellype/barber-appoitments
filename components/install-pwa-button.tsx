"use client"

import { useEffect, useRef, useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

/** Chrome/Edge fire this instead of auto-showing their install UI, letting the
 * app trigger the native prompt from its own button. Not in the DOM lib types. */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

function isRunningStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari's PWA flag; not covered by the standalone media query there.
    (window.navigator as { standalone?: boolean }).standalone === true
  )
}

/**
 * Shows an "Install app" button only when the browser has signaled the app is
 * installable (via beforeinstallprompt) and it isn't already installed.
 * Ported from app-de-agendamento-de-barbearia's sibling project basket-stats
 * (app/page.tsx), which uses the same beforeinstallprompt/appinstalled pair.
 * Renders nothing on browsers that never fire beforeinstallprompt (Firefox,
 * Safari) or when the app is already running standalone.
 */
export function InstallPwaButton() {
  const [installable, setInstallable] = useState(false)
  const installPrompt = useRef<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if (isRunningStandalone()) return

    function onBeforeInstallPrompt(event: Event) {
      event.preventDefault()
      installPrompt.current = event as BeforeInstallPromptEvent
      setInstallable(true)
    }

    function onAppInstalled() {
      installPrompt.current = null
      setInstallable(false)
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt)
    window.addEventListener("appinstalled", onAppInstalled)
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt)
      window.removeEventListener("appinstalled", onAppInstalled)
    }
  }, [])

  if (!installable) return null

  async function handleInstall() {
    if (!installPrompt.current) return
    await installPrompt.current.prompt()
    installPrompt.current = null
    setInstallable(false)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleInstall}>
      <Download className="h-4 w-4" />
      Instalar app
    </Button>
  )
}
