import crypto from 'node:crypto'

// Minimal HS256 JWT implementation using only Node core modules.

function base64url(input) {
  return Buffer.from(input).toString('base64url')
}

function sign(data, secret) {
  return crypto.createHmac('sha256', secret).update(data).digest('base64url')
}

// Parse durations like "365d", "12h", "30m", "60s", or a raw number of seconds.
function toSeconds(expiresIn) {
  if (typeof expiresIn === 'number') return expiresIn
  const match = /^(\d+)([smhd])$/.exec(expiresIn)
  if (!match) throw new Error(`Invalid expiresIn: ${expiresIn}`)
  const value = Number(match[1])
  const unit = { s: 1, m: 60, h: 3600, d: 86400 }[match[2]]
  return value * unit
}

export function signToken(payload, secret, { expiresIn } = {}) {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const body = { ...payload, iat: now }
  if (expiresIn != null) body.exp = now + toSeconds(expiresIn)

  const encodedHeader = base64url(JSON.stringify(header))
  const encodedPayload = base64url(JSON.stringify(body))
  const signature = sign(`${encodedHeader}.${encodedPayload}`, secret)
  return `${encodedHeader}.${encodedPayload}.${signature}`
}

export function verifyToken(token, secret) {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('Malformed token')
  const [encodedHeader, encodedPayload, signature] = parts

  const expected = sign(`${encodedHeader}.${encodedPayload}`, secret)
  const sigBuf = Buffer.from(signature)
  const expectedBuf = Buffer.from(expected)
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    throw new Error('Invalid signature')
  }

  const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString())
  if (payload.exp != null && Math.floor(Date.now() / 1000) >= payload.exp) {
    throw new Error('Token expired')
  }
  return payload
}
