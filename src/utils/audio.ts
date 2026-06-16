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

// Breath recordings, played alternately for the duration of each phase.
let inhaleAudio: HTMLAudioElement | null = null
let exhaleAudio: HTMLAudioElement | null = null

function getBreathAudio(): { inhale: HTMLAudioElement; exhale: HTMLAudioElement } {
  if (!inhaleAudio) {
    inhaleAudio = new Audio('/in_breath.mp3')
    inhaleAudio.preload = 'auto'
  }
  if (!exhaleAudio) {
    exhaleAudio = new Audio('/out_breath.mp3')
    exhaleAudio.preload = 'auto'
  }
  return { inhale: inhaleAudio, exhale: exhaleAudio }
}

function playClip(audio: HTMLAudioElement): void {
  // Restart from the top so a clip re-triggers cleanly even if the previous
  // phase's playback hasn't fully finished.
  audio.pause()
  audio.currentTime = 0
  audio.play().catch(() => {})
}

export function playInhaleSound(): void {
  playClip(getBreathAudio().inhale)
}

export function playExhaleSound(): void {
  playClip(getBreathAudio().exhale)
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
  // Unlock the breath clips inside the user gesture that calls this, so the
  // mid-session plays (which have no gesture of their own) aren't blocked by
  // the browser's autoplay policy. Play muted, then immediately reset.
  const { inhale, exhale } = getBreathAudio()
  for (const audio of [inhale, exhale]) {
    audio.muted = true
    audio
      .play()
      .then(() => {
        audio.pause()
        audio.currentTime = 0
        audio.muted = false
      })
      .catch(() => {
        audio.muted = false
      })
  }
}
