let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

function playBeep(frequency: number, durationMs: number): void {
  const ctx = getAudioContext()
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)

  gainNode.gain.setValueAtTime(0, ctx.currentTime)
  gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01)
  gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + durationMs / 1000)

  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + durationMs / 1000)
}

export function playInhaleBeep(): void {
  playBeep(523.25, 200)
}

export function playExhaleBeep(): void {
  playBeep(440, 120)
  setTimeout(() => playBeep(440, 120), 200)
}

export function playGong(): void {
  const ctx = getAudioContext()
  const now = ctx.currentTime
  const duration = 1.8

  // Layer a low fundamental with a higher harmonic for a bell-like timbre.
  const gain = ctx.createGain()
  gain.connect(ctx.destination)
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(0.4, now + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

  for (const frequency of [196, 392]) {
    const oscillator = ctx.createOscillator()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(frequency, now)
    oscillator.connect(gain)
    oscillator.start(now)
    oscillator.stop(now + duration)
  }
}

export function initAudio(): void {
  getAudioContext()
}
