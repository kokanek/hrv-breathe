import { useState, useEffect, useRef } from 'react'

export function useCountdownTimer(isRunning: boolean, totalSeconds: number) {
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setRemainingSeconds(totalSeconds)
  }, [totalSeconds])

  useEffect(() => {
    if (isRunning && remainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isRunning, remainingSeconds])

  const isComplete = remainingSeconds === 0 && isRunning
  const elapsedSeconds = totalSeconds - remainingSeconds

  return { remainingSeconds, elapsedSeconds, isComplete }
}
