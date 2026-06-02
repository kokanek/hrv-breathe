import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema({
  user: { type: String, required: true, index: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  durationSeconds: { type: Number, required: true },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model('Session', sessionSchema)
