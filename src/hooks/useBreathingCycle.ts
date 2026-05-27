import { useState, useEffect, useRef, useCallback } from 'react'
import { playInhaleBeep, playExhaleBeep } from '../utils/audio'

export type Phase = 'inhale' | 'exhale'

const PHASE_DURATION = 6000

export function useBreathingCycle(isRunning: boolean) {
  const [phase, setPhase] = useState<Phase>('inhale')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const hasStartedRef = useRef(false)

  const startCycle = useCallback(() => {
    if (hasStartedRef.current) return
    hasStartedRef.current = true
    playInhaleBeep()
    setPhase('inhale')

    intervalRef.current = setInterval(() => {
      setPhase(prev => {
        const next = prev === 'inhale' ? 'exhale' : 'inhale'
        if (next === 'inhale') {
          playInhaleBeep()
        } else {
          playExhaleBeep()
        }
        return next
      })
    }, PHASE_DURATION)
  }, [])

  useEffect(() => {
    if (isRunning) {
      startCycle()
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      hasStartedRef.current = false
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isRunning, startCycle])

  return { phase }
}
