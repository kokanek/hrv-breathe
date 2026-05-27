import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import BreathingCircle from '../components/BreathingCircle'
import TagSelector from '../components/TagSelector'
import { useBreathingCycle } from '../hooks/useBreathingCycle'
import { useCountdownTimer } from '../hooks/useCountdownTimer'
import { createSession } from '../utils/api'

export default function SessionPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const durationMinutes = parseInt(searchParams.get('duration') || '5', 10)
  const totalSeconds = durationMinutes * 60

  const [isRunning, setIsRunning] = useState(true)
  const [showTags, setShowTags] = useState(false)
  const startTimeRef = useRef(new Date())

  const { phase } = useBreathingCycle(isRunning)
  const { remainingSeconds, elapsedSeconds, isComplete } = useCountdownTimer(isRunning, totalSeconds)

  const stopSession = useCallback(() => {
    setIsRunning(false)
    setShowTags(true)
  }, [])

  useEffect(() => {
    if (isComplete) {
      stopSession()
    }
  }, [isComplete, stopSession])

  const handleSave = async (tags: string[]) => {
    const endTime = new Date()
    try {
      await createSession({
        startTime: startTimeRef.current.toISOString(),
        endTime: endTime.toISOString(),
        durationSeconds: elapsedSeconds,
        tags,
      })
    } catch {
      // Silently fail — session still navigates to activity
    }
    navigate('/activity')
  }

  const handleSkip = async () => {
    const endTime = new Date()
    try {
      await createSession({
        startTime: startTimeRef.current.toISOString(),
        endTime: endTime.toISOString(),
        durationSeconds: elapsedSeconds,
        tags: [],
      })
    } catch {
      // Silently fail
    }
    navigate('/activity')
  }

  const mins = Math.floor(remainingSeconds / 60)
  const secs = remainingSeconds % 60
  const timeDisplay = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`

  return (
    <div className="h-full relative overflow-hidden">
      {/* Pastel gradient background */}
      <div className="absolute inset-0 gradient-bg" />

      {/* Decorative dots */}
      <div className="absolute top-[18%] right-[14%] w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(168,208,212,0.5)' }} />
      <div className="absolute top-[32%] left-[12%] w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(251,196,181,0.6)' }} />
      <div className="absolute bottom-[32%] right-[18%] w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(184,221,181,0.55)' }} />
      <div className="absolute bottom-[20%] left-[16%] w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(216,228,152,0.5)' }} />
      <div className="absolute top-[55%] right-[10%] w-1 h-1 rounded-full" style={{ backgroundColor: 'rgba(196,184,232,0.6)' }} />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 pt-6 pb-4">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-sm"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span className="text-gray-800 font-semibold text-lg">Breathe Bubbles</span>
          <div className="w-10 h-10" />
        </header>

        {/* Breathing Circle */}
        <div className="flex-1 flex items-center justify-center">
          <BreathingCircle phase={phase} isRunning={isRunning} />
        </div>

        {/* Timer + Controls */}
        <div className="flex flex-col items-center pb-10 px-6">
          <p className="text-gray-800 text-5xl font-light tracking-wider mb-3 tabular-nums">
            {timeDisplay}
          </p>

          <div className="flex items-center gap-2 mb-8">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#a8d0d4' }} />
            <span className="text-gray-500 text-xs font-medium tracking-widest uppercase">
              Session Active
            </span>
          </div>

          <button
            onClick={stopSession}
            className="w-full max-w-xs py-4 rounded-2xl bg-gray-800 text-white font-semibold text-lg flex items-center justify-center gap-2 shadow-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
            Stop Session
          </button>
        </div>
      </div>

      {/* Tag Selector */}
      {showTags && (
        <TagSelector onSave={handleSave} onSkip={handleSkip} elapsedSeconds={elapsedSeconds} />
      )}
    </div>
  )
}
