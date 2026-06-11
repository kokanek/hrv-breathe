import { create } from 'zustand'
import {
  fetchSessions,
  fetchStats,
  createSession,
  updateSessionTags,
} from '../utils/api'
import type { SessionData, StatsData, CreateSessionInput } from '../utils/api'

interface SessionStore {
  sessions: SessionData[]
  stats: StatsData
  status: 'idle' | 'loading' | 'loaded' | 'error'
  /** Fetch sessions + stats in parallel and populate the store. Doubles as the warm-up call. */
  load: () => Promise<void>
  /** Persist a new session and prepend it to the store. */
  addSession: (input: CreateSessionInput) => Promise<SessionData>
  /** Update a session's tags and reflect the change in the store. */
  setTags: (id: string, tags: string[]) => Promise<void>
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  sessions: [],
  stats: { totalSessions: 0, totalMinutes: 0 },
  status: 'idle',

  load: async () => {
    // Guard against concurrent runs (e.g. StrictMode double-invoke).
    if (get().status === 'loading') return
    set({ status: 'loading' })
    try {
      const [sessions, stats] = await Promise.all([fetchSessions(), fetchStats()])
      set({ sessions, stats, status: 'loaded' })
    } catch {
      // Keep any previously cached data; just mark the failure.
      set({ status: 'error' })
    }
  },

  addSession: async input => {
    const session = await createSession(input)
    set(state => ({ sessions: [session, ...state.sessions] }))
    return session
  },

  setTags: async (id, tags) => {
    const updated = await updateSessionTags(id, tags)
    set(state => ({
      sessions: state.sessions.map(s => (s._id === id ? updated : s)),
    }))
  },
}))
