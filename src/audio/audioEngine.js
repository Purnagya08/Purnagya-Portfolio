import { Howl, Howler } from 'howler'
import { useNexusStore } from '../store/nexusStore'

// ─── Sound registry ────────────────────────────────────────────
// We generate procedural audio via Web Audio API for the ambient,
// and use short synth blips for SFX so no external files are needed.

let audioCtx = null
let ambientNode = null
let ambientGain = null
let masterGain = null
let isAmbientRunning = false

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    masterGain = audioCtx.createGain()
    masterGain.gain.value = useNexusStore.getState().audioVolume
    masterGain.connect(audioCtx.destination)
  }
  return audioCtx
}

// ─── Ambient Engine Hum ───────────────────────────────────────
function createAmbientHum() {
  const ctx = getAudioCtx()
  ambientGain = ctx.createGain()
  ambientGain.gain.value = 0
  ambientGain.connect(masterGain)

  // Deep drone: multiple detuned oscillators
  const freqs = [40, 40.3, 80, 120, 160]
  const oscNodes = freqs.map(freq => {
    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()
    osc.type = freq < 50 ? 'sawtooth' : 'sine'
    osc.frequency.value = freq
    gainNode.gain.value = freq < 50 ? 0.4 : 0.1 / (freq / 40)
    osc.connect(gainNode)
    gainNode.connect(ambientGain)
    osc.start()
    return osc
  })

  // Add filtered noise for spaceship texture
  const bufferSize = ctx.sampleRate * 2
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.015
  }
  const noiseSource = ctx.createBufferSource()
  noiseSource.buffer = buffer
  noiseSource.loop = true

  const noiseFilter = ctx.createBiquadFilter()
  noiseFilter.type = 'bandpass'
  noiseFilter.frequency.value = 200
  noiseFilter.Q.value = 0.5

  const noiseGain = ctx.createGain()
  noiseGain.gain.value = 0.3

  noiseSource.connect(noiseFilter)
  noiseFilter.connect(noiseGain)
  noiseGain.connect(ambientGain)
  noiseSource.start()

  // Slow LFO on pitch for living feel
  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  lfo.frequency.value = 0.08
  lfoGain.gain.value = 1.5
  lfo.connect(lfoGain)
  oscNodes.forEach(osc => lfoGain.connect(osc.frequency))
  lfo.start()

  return { oscNodes, noiseSource, lfo }
}

// ─── Fade in ambient ─────────────────────────────────────────
export function startAmbient() {
  if (isAmbientRunning) return
  const ctx = getAudioCtx()
  if (ctx.state === 'suspended') ctx.resume()
  createAmbientHum()
  ambientGain.gain.setValueAtTime(0, ctx.currentTime)
  ambientGain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 3)
  isAmbientRunning = true
  useNexusStore.getState().setAmbientPlaying(true)
}

export function stopAmbient() {
  if (!ambientGain) return
  const ctx = getAudioCtx()
  ambientGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2)
  setTimeout(() => { isAmbientRunning = false }, 2500)
  useNexusStore.getState().setAmbientPlaying(false)
}

export function setMasterVolume(v) {
  if (!masterGain) return
  masterGain.gain.value = v
}

// ─── SFX Synth ────────────────────────────────────────────────
function playSynth({ type = 'sine', freq = 440, duration = 0.1, volume = 0.3, sweep = null, detune = 0 }) {
  const state = useNexusStore.getState()
  if (!state.audioEnabled || !state.sfxEnabled) return
  const ctx = getAudioCtx()
  if (ctx.state === 'suspended') ctx.resume()

  const osc = ctx.createOscillator()
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

// ─── Named SFX ────────────────────────────────────────────────
export const SFX = {
  // UI interactions
  click: () => playSynth({ type: 'square', freq: 800, duration: 0.08, volume: 0.15 }),
  hover: () => playSynth({ type: 'sine',   freq: 600, duration: 0.05, volume: 0.08 }),
  
  // Boot sequence beeps
  bootBeep:  () => playSynth({ type: 'square', freq: 440, duration: 0.05, volume: 0.2 }),
  bootReady: () => {
    // Ascending arpeggio
    [220, 330, 440, 660].forEach((f, i) => {
      setTimeout(() => playSynth({ type: 'sine', freq: f, duration: 0.2, volume: 0.25 }), i * 80)
    })
  },

  // Navigation / warp
  warp: () => {
    playSynth({ type: 'sawtooth', sweep: { from: 100, to: 2000 }, duration: 0.4, volume: 0.3 })
    setTimeout(() => playSynth({ type: 'sine', sweep: { from: 2000, to: 80 }, duration: 0.6, volume: 0.2 }), 400)
  },

  // Entry portal
  portalOpen: () => {
    [60, 80, 100, 150, 200].forEach((f, i) => {
      setTimeout(() => playSynth({ type: 'sawtooth', freq: f, duration: 0.5, volume: 0.15 }), i * 60)
    })
  },

  // Module enter
  moduleEnter: () => {
    playSynth({ type: 'sine', sweep: { from: 300, to: 600 }, duration: 0.3, volume: 0.2 })
    setTimeout(() => playSynth({ type: 'sine', freq: 900, duration: 0.1, volume: 0.1 }), 300)
  },

  // Fragment collected
  fragmentCollect: () => {
    [440, 550, 660, 880].forEach((f, i) => {
      setTimeout(() => playSynth({ type: 'sine', freq: f, duration: 0.15, volume: 0.2 }), i * 60)
    })
  },

  // Error / glitch
  glitch: () => {
    playSynth({ type: 'sawtooth', freq: 120, duration: 0.05, volume: 0.2 })
    setTimeout(() => playSynth({ type: 'square', freq: 60, duration: 0.08, volume: 0.15 }), 60)
  },

  // Keypress (terminal)
  keypress: () => playSynth({ type: 'square', freq: 400 + Math.random() * 200, duration: 0.04, volume: 0.1 }),
}

// ─── Initialize audio on user gesture ─────────────────────────
export function initAudio() {
  const ctx = getAudioCtx()
  if (ctx.state === 'suspended') ctx.resume()
  useNexusStore.getState().setAudioEnabled(true)
  setTimeout(startAmbient, 500)
}

export function toggleAudio() {
  const { audioEnabled, ambientPlaying } = useNexusStore.getState()
  if (audioEnabled && ambientPlaying) {
    stopAmbient()
    useNexusStore.getState().setAudioEnabled(false)
  } else {
    initAudio()
  }
}
