import mongoose from 'mongoose'

// Serverless functions are invoked many times on the same warm container.
// Reuse a single connection (and the in-flight connect promise) across
// invocations instead of reconnecting on every request — otherwise we'd
// exhaust the MongoDB Atlas connection pool under load.
let cached = global._mongoose
if (!cached) cached = global._mongoose = { conn: null, promise: null }

export default async function connectDB() {
  if (cached.conn) return cached.conn

  const MONGODB_URI = process.env.MONGODB_URI
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is required')
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI)
  }

  cached.conn = await cached.promise
  return cached.conn
}
