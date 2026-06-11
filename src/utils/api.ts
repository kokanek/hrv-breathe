const BASE = '/api'

const TOKEN_KEY = 'hrv_app_token'

async function fetchWithAuth(input: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers)
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  const res = await fetch(input, { ...init, headers })
  if (res.status === 401) {
    localStorage.removeItem(TOKEN_KEY)
    window.location.href = '/login'
  }
  return res
}

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

export interface CreateSessionInput {
  startTime: string
  endTime: string
  durationSeconds: number
  tags: string[]
}

export async function fetchSessions(): Promise<SessionData[]> {
  const res = await fetchWithAuth(`${BASE}/sessions`)
  if (!res.ok) throw new Error('Failed to fetch sessions')
  const data = await res.json()
  return data.sessions
}

export async function fetchStats(): Promise<StatsData> {
  const res = await fetchWithAuth(`${BASE}/sessions/stats`)
  if (!res.ok) throw new Error('Failed to fetch stats')
  return res.json()
}

export async function createSession(session: CreateSessionInput): Promise<SessionData> {
  const res = await fetchWithAuth(`${BASE}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(session),
  })
  if (!res.ok) throw new Error('Failed to create session')
  const data = await res.json()
  return data.session
}

export async function updateSessionTags(id: string, tags: string[]): Promise<SessionData> {
  const res = await fetchWithAuth(`${BASE}/sessions/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tags }),
  })
  if (!res.ok) throw new Error('Failed to update session')
  const data = await res.json()
  return data.session
}
