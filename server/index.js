import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { config } from 'dotenv'
import Session from './models/Session.js'

config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/sessions', async (_req, res) => {
  try {
    const sessions = await Session.find().sort({ createdAt: -1 }).limit(50)
    res.json({ sessions })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sessions' })
  }
})

app.get('/api/sessions/stats', async (_req, res) => {
  try {
    const totalSessions = await Session.countDocuments()
    const result = await Session.aggregate([
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
    const session = await Session.create({ startTime, endTime, durationSeconds, tags: tags || [] })
    res.status(201).json({ session })
  } catch (err) {
    res.status(500).json({ error: 'Failed to create session' })
  }
})

const PORT = process.env.PORT || 3001
const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('MONGODB_URI environment variable is required')
  process.exit(1)
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  })
