import { useEffect, useRef } from 'react'

// Keep the screen awake while `active` is true so the breathing session's
// audio and animation aren't killed by the device's screen-timeout. The lock
// is automatically released by the browser whenever the page is hidden, so we
// re-acquire it each time the page becomes visible again.
export function useWakeLock(active: boolean) {
  const sentinelRef = useRef<WakeLockSentinel | null>(null)

  useEffect(() => {
    if (!active) return
    if (!('wakeLock' in navigator)) return

    let cancelled = false

    const request = async () => {
      try {
        const sentinel = await navigator.wakeLock.request('screen')
        if (cancelled) {
          sentinel.release().catch(() => {})
          return
        }
        sentinelRef.current = sentinel
      } catch {
        // Denied or unavailable (e.g. low battery / not user-activated) — ignore.
      }
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') request()
    }

    request()
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', handleVisibility)
      sentinelRef.current?.release().catch(() => {})
      sentinelRef.current = null
    }
  }, [active])
}
