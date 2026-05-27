import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ActivityItem from '../components/ActivityItem'
import { fetchSessions, fetchStats } from '../utils/api'
import type { SessionData, StatsData } from '../utils/api'

export default function ActivityPage() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [stats, setStats] = useState<StatsData>({ totalSessions: 0, totalMinutes: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [sessionsData, statsData] = await Promise.all([
          fetchSessions(),
          fetchStats(),
        ])
        setSessions(sessionsData)
        setStats(statsData)
      } catch {
        // API unavailable — show empty state
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

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
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          aria-label="Go home"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pb-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: '#e8f4f0' }}>
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <p className="text-xs text-gray-400 font-medium">Total Sessions</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">
              {stats.totalSessions}
              <span className="text-sm font-normal text-gray-400 ml-1">completed</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: '#fdf0ec' }}>
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs text-gray-400 font-medium">Total Minutes</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">
              {stats.totalMinutes}
              <span className="text-sm font-normal text-gray-400 ml-1">m</span>
            </p>
          </motion.div>
        </div>

        {/* Activity List */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-emerald-300 border-t-emerald-800 rounded-full animate-spin" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-400 font-medium">No sessions yet</p>
            <p className="text-gray-300 text-sm mt-1">Complete your first breathing session</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map(session => (
              <motion.div
                key={session._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ActivityItem session={session} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
