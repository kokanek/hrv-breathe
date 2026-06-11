import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import DurationBubbles from '../components/DurationBubbles'
import { initAudio } from '../utils/audio'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import { useSessionStore } from '../stores/sessionStore'

export default function HomePage() {
  const [minutes, setMinutes] = useState(5)
  const navigate = useNavigate()
  const { canInstall, promptInstall } = useInstallPrompt()

  // Warm up Mongo / the serverless fn and prime the session store on app open.
  useEffect(() => {
    useSessionStore.getState().load()
  }, [])

  const decrement = () => setMinutes(m => Math.max(1, m - 1))
  const increment = () => setMinutes(m => Math.min(30, m + 1))

  const startSession = () => {
    initAudio()
    navigate(`/session?duration=${minutes}`)
  }

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-6 pb-2">
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="3" />
            <circle cx="6" cy="6" r="1.5" />
            <circle cx="18" cy="6" r="1.5" />
            <circle cx="6" cy="18" r="1.5" />
            <circle cx="18" cy="18" r="1.5" />
          </svg>
          <span className="text-lg font-bold text-gray-800">Breathe Bubbles</span>
        </div>
        <div className="flex items-center gap-1">
        {canInstall && (
          <button
            onClick={promptInstall}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-800 text-white text-sm font-semibold shadow-sm active:bg-gray-700"
            aria-label="Install app"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
            </svg>
            Install
          </button>
        )}
        <button
          onClick={() => navigate('/activity')}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          aria-label="View activity"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        </button>
        </div>
      </header>

      {/* Central Time Control */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="flex items-center gap-8 mb-8">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={decrement}
            className="w-14 h-14 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-2xl font-bold text-gray-700 active:bg-gray-50"
          >
            −
          </motion.button>

          <motion.div
            key={minutes}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="flex flex-col items-center"
          >
            <span className="text-7xl font-bold text-gray-800 tabular-nums leading-none">
              {minutes}
            </span>
            <span className="text-sm text-gray-400 mt-1 font-medium">minutes</span>
          </motion.div>

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={increment}
            className="w-14 h-14 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-2xl font-bold text-gray-700 active:bg-gray-50"
          >
            +
          </motion.button>
        </div>

        <DurationBubbles selected={minutes} onSelect={setMinutes} />
      </div>

      {/* Start Button */}
      <div className="px-6 pb-10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={startSession}
          className="w-full py-5 rounded-2xl bg-gray-800 text-white text-lg font-bold tracking-wider uppercase flex items-center justify-center gap-3 shadow-xl"
        >
          Start Session
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </motion.button>
      </div>
    </div>
  )
}
