import { useState, useEffect, useRef } from 'react'
import { playInhaleSound, playExhaleSound } from '../utils/audio'

export type Phase = 'inhale' | 'exhale'

const PHASE_DURATION = 6000

export function useBreathingCycle(isRunning: boolean, isLoginPage = false) {
  const [phase, setPhase] = useState<Phase>('inhale')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    // intervalRef doubles as the "already started" guard.
    // React StrictMode cleans up and re-runs effects in dev; using intervalRef
    // (which cleanup sets to null) means the restart works correctly.
    if (intervalRef.current) return

    if (!isLoginPage) playInhaleSound()
    setPhase('inhale')

    intervalRef.current = setInterval(() => {
      setPhase(prev => {
        const next = prev === 'inhale' ? 'exhale' : 'inhale'
        if (!isLoginPage) {
          if (next === 'inhale') playInhaleSound()
          else playExhaleSound()
        }
        return next
      })
    }, PHASE_DURATION)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isRunning, isLoginPage])

  return { phase }
}
