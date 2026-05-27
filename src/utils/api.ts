const BASE = '/api'

export interface SessionData {
  _id: string
  startTime: string
  endTime: string
  durationSeconds: number
  tags: string[]
  createdAt: string
}

export interface StatsData {
  totalSessions: number
  totalMinutes: number
}

export async function fetchSessions(): Promise<SessionData[]> {
  const res = await fetch(`${BASE}/sessions`)
  if (!res.ok) throw new Error('Failed to fetch sessions')
  const data = await res.json()
  return data.sessions
}

export async function fetchStats(): Promise<StatsData> {
  const res = await fetch(`${BASE}/sessions/stats`)
  if (!res.ok) throw new Error('Failed to fetch stats')
  return res.json()
}

export async function createSession(session: {
  startTime: string
  endTime: string
  durationSeconds: number
  tags: string[]
}): Promise<SessionData> {
  const res = await fetch(`${BASE}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(session),
  })
  if (!res.ok) throw new Error('Failed to create session')
  const data = await res.json()
  return data.session
}
