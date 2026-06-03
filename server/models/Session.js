import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema({
  user: { type: String, required: true, index: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  durationSeconds: { type: Number, required: true },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
})

// Reuse an already-compiled model on warm serverless invocations; compiling
// the same model twice throws OverwriteModelError.
export default mongoose.models.Session || mongoose.model('Session', sessionSchema)
