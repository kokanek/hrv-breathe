import express from 'express'
import cors from 'cors'
import Session from './models/Session.js'
import requireAuth from './middleware/auth.js'

const app = express()
app.use(cors())
app.use(express.json())

// Login is handled by an external Cloudflare Worker that owns the credentials
// (CREDS) and the signing secret. We proxy the request through so the browser
// keeps talking to a single origin and the family credentials never live in
// this app. The Worker mints the same HS256 { token } this route used to, so
// requireAuth keeps verifying with JWT_SECRET unchanged.
app.post('/api/login', async (req, res) => {
  try {
    const workerRes = await fetch(process.env.AUTH_WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Only sent when configured, so the Worker can reject direct callers.
        ...(process.env.PROXY_SECRET && { 'X-Proxy-Secret': process.env.PROXY_SECRET }),
      },
      body: JSON.stringify(req.body ?? {}),
    })
    const data = await workerRes.json().catch(() => ({ error: 'Auth service error' }))
    return res.status(workerRes.status).json(data)
  } catch (err) {
    return res.status(502).json({ error: 'Auth service unavailable' })
  }
});

// Protect every /api/sessions* route — login stays public so tokens can be issued.
app.use('/api/sessions', requireAuth)

app.get('/api/sessions', async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user }).sort({ createdAt: -1 }).limit(50)
    res.json({ sessions })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sessions' })
  }
})

app.get('/api/sessions/stats', async (req, res) => {
  try {
    const totalSessions = await Session.countDocuments({ user: req.user })
    const result = await Session.aggregate([
      { $match: { user: req.user } },
      { $group: { _id: null, totalSeconds: { $sum: '$durationSeconds' } } },
    ])
    const totalMinutes = result.length > 0 ? Math.round(result[0].totalSeconds / 60) : 0
    res.json({ totalSessions, totalMinutes })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

app.post('/api/sessions', async (req, res) => {
  try {
    const { startTime, endTime, durationSeconds, tags } = req.body
    if (!startTime || !endTime || durationSeconds == null) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    const session = await Session.create({ user: req.user, startTime, endTime, durationSeconds, tags: tags || [] })
    res.status(201).json({ session })
  } catch (err) {
    res.status(500).json({ error: 'Failed to create session' })
  }
})

// Journal integration: the journal app (log-journal.vercel.app) stores each
// month as one Redis blob keyed `journal:<username>:<monthKey>`, shaped
// { "YYYY-MM-DD": JournalEntry[] }. Its API has no CORS headers, so the
// browser can't call it directly — we proxy the read-modify-write here.
// The client supplies monthKey/dateKey/timestamp so "today" is the user's
// local day, not the server's (Vercel runs in UTC).
const JOURNAL_API_URL = process.env.JOURNAL_API_URL || 'https://log-journal.vercel.app'

app.post('/api/journal/breathing', requireAuth, async (req, res) => {
  const { monthKey, dateKey, timestamp } = req.body
  if (
    !/^\d{4}_\d{1,2}$/.test(monthKey || '') ||
    !/^\d{4}-\d{2}-\d{2}$/.test(dateKey || '') ||
    !timestamp || isNaN(Date.parse(timestamp))
  ) {
    return res.status(400).json({ error: 'Invalid monthKey, dateKey or timestamp' })
  }

  try {
    const params = `username=${encodeURIComponent(req.user)}&monthKey=${encodeURIComponent(monthKey)}`
    const getRes = await fetch(`${JOURNAL_API_URL}/api/getlog?${params}`)
    if (!getRes.ok) throw new Error(`getlog responded ${getRes.status}`)
    const month = (await getRes.json()) || {}

    const entry = {
      id: Date.now().toString(),
      text: 'Breathing session completed',
      timestamp,
      color: 'blue',
      tags: [{ id: 'hrv-app', text: 'HRV app', emoji: '🧘', color: 'blue' }],
    }
    month[dateKey] = [...(month[dateKey] || []), entry].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )

    const saveRes = await fetch(`${JOURNAL_API_URL}/api/savelog?${params}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(month),
    })
    if (!saveRes.ok) throw new Error(`savelog responded ${saveRes.status}`)

    res.status(201).json({ entry })
  } catch (err) {
    res.status(502).json({ error: 'Failed to save journal entry' })
  }
})

app.patch('/api/sessions/:id', async (req, res) => {
  try {
    const { tags } = req.body
    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      { tags: tags || [] },
      { new: true }
    )
    if (!session) return res.status(404).json({ error: 'Session not found' })
    res.json({ session })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update session' })
  }
})

export default app
