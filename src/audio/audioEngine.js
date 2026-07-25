import { useNexusStore } from '../store/nexusStore'

// ─── Audio context & nodes ─────────────────────────────────────
let audioCtx     = null
let masterGain   = null

// Ambient
let ambientAudio    = null
let ambientSource   = null
let ambientGainNode = null

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx   = new (window.AudioContext || window.webkitAudioContext)()
    masterGain = audioCtx.createGain()
    masterGain.gain.value = 1.0
    masterGain.connect(audioCtx.destination)
  }
  return audioCtx
}

function createAmbient() {
  if (ambientAudio) return
  const ctx = getAudioCtx()

  ambientAudio             = new Audio('/audio/nexus_audio.mp3')
  ambientAudio.crossOrigin = 'anonymous'
  ambientAudio.loop        = true
  ambientAudio.preload     = 'auto'

  ambientSource   = ctx.createMediaElementSource(ambientAudio)
  ambientGainNode = ctx.createGain()
  ambientGainNode.gain.value = 0

  ambientSource.connect(ambientGainNode)
  ambientGainNode.connect(masterGain)
}

export function startAmbient() {
  const ctx = getAudioCtx()
  if (ctx.state === 'suspended') ctx.resume()

  createAmbient()

  if (!ambientAudio.paused) return

  ambientAudio.play().then(() => {
    ambientGainNode.gain.cancelScheduledValues(ctx.currentTime)
    ambientGainNode.gain.setValueAtTime(0, ctx.currentTime)
    ambientGainNode.gain.linearRampToValueAtTime(0.75, ctx.currentTime + 3)
    useNexusStore.getState().setAmbientPlaying(true)
  }).catch(err => {
    console.warn('[NEXUS Audio] Playback blocked:', err)
  })
}

export function stopAmbient(fadeDuration = 2) {
  if (!ambientGainNode || !ambientAudio) return
  const ctx = getAudioCtx()

  ambientGainNode.gain.cancelScheduledValues(ctx.currentTime)
  ambientGainNode.gain.setValueAtTime(ambientGainNode.gain.value, ctx.currentTime)
  ambientGainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + fadeDuration)

  setTimeout(() => {
    ambientAudio.pause()
    ambientAudio.currentTime = 0
    useNexusStore.getState().setAmbientPlaying(false)
  }, fadeDuration * 1000 + 200)
}

export function setMasterVolume(v) {
  if (!masterGain) return
  masterGain.gain.value = v
}

function playSynth({ type = 'sine', freq = 440, duration = 0.1, volume = 0.3, sweep = null, detune = 0 }) {
  const state = useNexusStore.getState()
  if (!state.audioEnabled || !state.sfxEnabled) return
  const ctx = getAudioCtx()
  if (ctx.state === 'suspended') ctx.resume()

  const osc  = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(masterGain)

  osc.type = type
  osc.frequency.value = freq
  if (detune) osc.detune.value = detune

  if (sweep) {
    osc.frequency.setValueAtTime(sweep.from, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(sweep.to, ctx.currentTime + duration)
  }

  gain.gain.setValueAtTime(volume, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + duration + 0.01)
}

export const SFX = {
  click:    () => playSynth({ type: 'square',   freq: 800,  duration: 0.08, volume: 0.15 }),
  hover:    () => playSynth({ type: 'sine',     freq: 600,  duration: 0.05, volume: 0.15 }),
  bootBeep: () => playSynth({ type: 'square',   freq: 440,  duration: 0.05, volume: 0.2  }),
  bootReady: () => {
    [220, 330, 440, 660].forEach((f, i) =>
      setTimeout(() => playSynth({ type: 'sine', freq: f, duration: 0.2, volume: 0.25 }), i * 80)
    )
  },
  warp: () => {
    playSynth({ type: 'sawtooth', sweep: { from: 100, to: 2000 }, duration: 0.4, volume: 0.3 })
    setTimeout(() => playSynth({ type: 'sine', sweep: { from: 2000, to: 80 }, duration: 0.6, volume: 0.2 }), 400)
  },
  portalOpen: () => {
    [60, 80, 100, 150, 200].forEach((f, i) =>
      setTimeout(() => playSynth({ type: 'sawtooth', freq: f, duration: 0.5, volume: 0.15 }), i * 60)
    )
  },
  moduleEnter: () => {
    playSynth({ type: 'sine', sweep: { from: 300, to: 600 }, duration: 0.3, volume: 0.2 })
    setTimeout(() => playSynth({ type: 'sine', freq: 900, duration: 0.1, volume: 0.1 }), 300)
  },
  fragmentCollect: () => {
    [440, 550, 660, 880].forEach((f, i) =>
      setTimeout(() => playSynth({ type: 'sine', freq: f, duration: 0.15, volume: 0.2 }), i * 60)
    )
  },
  glitch: () => {
    playSynth({ type: 'sawtooth', freq: 120, duration: 0.05, volume: 0.2 })
    setTimeout(() => playSynth({ type: 'square', freq: 60, duration: 0.08, volume: 0.15 }), 60)
  },
  keypress: () => playSynth({ type: 'square', freq: 400 + Math.random() * 200, duration: 0.04, volume: 0.1 }),
}

export function initAudio() {
  const ctx = getAudioCtx()
  if (ctx.state === 'suspended') ctx.resume()
  useNexusStore.getState().setAudioEnabled(true)
  useNexusStore.getState().setAudioVolume?.(1.0)
  setTimeout(startAmbient, 300)
}

export function toggleAudio() {
  const { audioEnabled } = useNexusStore.getState()
  if (audioEnabled) {
    stopAmbient(1.5)
    useNexusStore.getState().setAudioEnabled(false)
  } else {
    initAudio()
  }
}
