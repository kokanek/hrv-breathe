import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import BreathingCircle from '../components/BreathingCircle'
import TagSelector from '../components/TagSelector'
import { useBreathingCycle } from '../hooks/useBreathingCycle'
import { useCountdownTimer } from '../hooks/useCountdownTimer'
import { useWakeLock } from '../hooks/useWakeLock'
import { useSessionStore } from '../stores/sessionStore'
import { playGong } from '../utils/audio'
import { logBreathingToJournal } from '../utils/api'
import { getSaveToJournal } from '../utils/settings'

export default function SessionPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const durationMinutes = parseInt(searchParams.get('duration') || '5', 10)
  const totalSeconds = durationMinutes * 60

  const [isRunning, setIsRunning] = useState(true)
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  // Tracks the initial save fired on completion — gates the tag panel.
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  // Tracks the tag-update request, to guard against double-tap.
  const [submitting, setSubmitting] = useState(false)
  const startTimeRef = useRef(new Date())
  const savedIdRef = useRef<string | null>(null)

  const { remainingSeconds, elapsedSeconds, isComplete } = useCountdownTimer(isRunning, totalSeconds)
  // Stop the breathing animation when the timer finishes naturally.
  const activelyRunning = isRunning && !isComplete
  // Stop the breathing cues a second before the timer ends. Sessions are whole
  // minutes and phases are 6s, so the final phase boundary lands exactly on
  // completion — without this, a new phase's start sound would ring at the same
  // instant as the completion gong.
  const breathingRunning = isRunning && remainingSeconds > 1
  const { phase } = useBreathingCycle(breathingRunning)

  // Hold the screen awake for the duration so the OS screen-timeout doesn't
  // pause the audio and animation mid-session.
  useWakeLock(activelyRunning)

  // Show the tag panel only once the initial save resolves (saved, or errored as a fallback).
  const showTags = saveStatus === 'saved' || saveStatus === 'error'

  // On completion: gong + save exactly once. The 'idle' state guard is StrictMode-safe.
  useEffect(() => {
    if (!isComplete || saveStatus !== 'idle') return
    playGong()
    setSaveStatus('saving')
    // Mirror the completed session into the journal app, if enabled. Fire and
    // forget — journal availability shouldn't block or fail the session save.
    if (getSaveToJournal()) {
      logBreathingToJournal().catch(() => {})
    }
    useSessionStore
      .getState()
      .addSession({
        startTime: startTimeRef.current.toISOString(),
        endTime: new Date().toISOString(),
        durationSeconds: totalSeconds,
        tags: [],
      })
      .then(session => {
        savedIdRef.current = session._id
        setSaveStatus('saved')
      })
      .catch(() => setSaveStatus('error'))
  }, [isComplete, saveStatus, totalSeconds])

  const togglePause = () => setIsRunning(prev => !prev)
  const endWithoutSaving = () => navigate('/')

  const handleSave = async (tags: string[]) => {
    if (submitting) return
    setSubmitting(true)
    try {
      if (savedIdRef.current) {
        await useSessionStore.getState().setTags(savedIdRef.current, tags)
      } else {
        // Fallback: the initial save errored, so create the session now.
        await useSessionStore.getState().addSession({
          startTime: startTimeRef.current.toISOString(),
          endTime: new Date().toISOString(),
          durationSeconds: elapsedSeconds,
          tags,
        })
      }
    } catch {
      // Silently fail — session still navigates to activity
    }
    navigate('/activity')
  }

  const handleSkip = async () => {
    if (submitting) return
    setSubmitting(true)
    if (!savedIdRef.current) {
      try {
        await useSessionStore.getState().addSession({
          startTime: startTimeRef.current.toISOString(),
          endTime: new Date().toISOString(),
          durationSeconds: elapsedSeconds,
          tags: [],
        })
      } catch {
        // Silently fail
      }
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
            onClick={() => setShowEndConfirm(true)}
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
            <span
              className={`w-2 h-2 rounded-full ${activelyRunning ? 'animate-pulse' : ''}`}
              style={{ backgroundColor: activelyRunning ? '#a8d0d4' : '#c4b8e8' }}
            />
            <span className="text-gray-500 text-xs font-medium tracking-widest uppercase">
              {activelyRunning ? 'Session Active' : 'Paused'}
            </span>
          </div>

          <button
            onClick={togglePause}
            className="w-full max-w-xs py-4 rounded-2xl bg-gray-800 text-white font-semibold text-lg flex items-center justify-center gap-2 shadow-lg"
          >
            {activelyRunning ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
            {activelyRunning ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>

      {/* Saving indicator — blocks interaction while the initial save is in flight */}
      {saveStatus === 'saving' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center px-6 bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-white rounded-3xl p-6 shadow-xl flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-emerald-300 border-t-emerald-800 rounded-full animate-spin" />
            <p className="text-gray-700 font-semibold">Saving your session…</p>
          </div>
        </div>
      )}

      {/* Tag Selector */}
      {showTags && (
        <TagSelector
          onSave={handleSave}
          onSkip={handleSkip}
          elapsedSeconds={elapsedSeconds}
          isSaving={submitting}
        />
      )}

      {/* End-session confirmation */}
      {showEndConfirm && (
        <div className="absolute inset-0 z-20 flex items-center justify-center px-6 bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-white rounded-3xl p-6 shadow-xl">
            <h2 className="text-gray-800 text-lg font-semibold mb-2">End session?</h2>
            <p className="text-gray-500 text-sm mb-6">
              Your current session won't be saved.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEndConfirm(false)}
                className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-700 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={endWithoutSaving}
                className="flex-1 py-3 rounded-2xl bg-gray-800 text-white font-semibold"
              >
                End
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
