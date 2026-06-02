import { verifyToken } from '../utils/jwt.js'

function requireAuth(req, res, next) {
  // 1. Grab the Authorization header
  const authHeader = req.headers['authorization']

  // Header format is usually "Bearer <token>", so we split it by the space
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    // No token provided? Block the request immediately
    return res.status(401).json({ error: 'Access denied. Please log in.' })
  }

  try {
    // 2. Verify the token using your secret key
    const decoded = verifyToken(token, process.env.JWT_SECRET)

    // 3. Attach the decoded user (e.g., "mom" or "dad") directly to the request object
    req.user = decoded.user

    // 4. Move on to the actual API route logic
    next()
  } catch (err) {
    // Token is tampered with or expired
    return res.status(401).json({ error: 'Invalid or expired token.' })
  }
}

export default requireAuth
