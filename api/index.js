import app from '../server/app.js'
import connectDB from '../server/db.js'

// Single Vercel serverless function that fronts the whole Express app.
// vercel.json rewrites every /api/* request here; req.url keeps the original
// path (e.g. /api/login) so Express routing works unchanged.
export default async function handler(req, res) {
  try {
    await connectDB()
  } catch (err) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Database connection failed' }))
    return
  }
  return app(req, res)
}
