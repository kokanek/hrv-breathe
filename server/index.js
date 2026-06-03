import 'dotenv/config'
import app from './app.js'
import connectDB from './db.js'

const PORT = process.env.PORT || 3001

// Local dev only. On Vercel the app is served via api/index.js as a
// serverless function — this listener never runs there.
connectDB()
  .then(() => {
    console.log('Connected to MongoDB Atlas')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  })
