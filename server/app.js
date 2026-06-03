import crypto from 'node:crypto'
import express from 'express'
import cors from 'cors'
import Session from './models/Session.js'
import requireAuth from './middleware/auth.js'
import { signToken } from './utils/jwt.js'

const app = express()
app.use(cors())
app.use(express.json())

const credString = process.env.CREDS
const FAMILY_MEMBERS = {}
if (credString) {
  credString.split(',').forEach(cred => {
    const [username, password] = cred.split(':')
    if (username && password) {
      FAMILY_MEMBERS[username] = password
    }
  })
}

// Constant-time string comparison. Hashing both sides to a fixed 32 bytes first
// keeps the buffers equal-length (timingSafeEqual throws otherwise) and avoids
// leaking the password length through timing.
function safeEqual(a, b) {
  const ah = crypto.createHash('sha256').update(String(a)).digest()
  const bh = crypto.createHash('sha256').update(String(b)).digest()
  return crypto.timingSafeEqual(ah, bh)
}

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // 1. Verify user exists and password matches.
  // Always run the comparison (even for unknown users) so the response time
  // doesn't reveal whether the username exists.
  const stored = FAMILY_MEMBERS[username];
  const isMatch = safeEqual(password, stored ?? '') && stored != null;

  if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

  // 2. Generate a token that lasts for 1 year (hassle-free!)
  const token = signToken({ user: username }, process.env.JWT_SECRET, { expiresIn: '365d' });

  return res.json({ token });
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

export default app
