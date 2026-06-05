import { useEffect, useState } from 'react'

// Chrome no longer auto-shows an install banner. We must capture the
// `beforeinstallprompt` event and trigger it from our own UI.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(
    () => window.matchMedia('(display-mode: standalone)').matches,
  )

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      // Prevent Chrome's old mini-infobar; keep the event for our button.
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    const onInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const promptInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setIsInstalled(true)
    // The event can only be used once.
    setDeferredPrompt(null)
  }

  return { canInstall: !!deferredPrompt && !isInstalled, isInstalled, promptInstall }
}
