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

export function initAudio(): void {
  getAudioContext()
}
