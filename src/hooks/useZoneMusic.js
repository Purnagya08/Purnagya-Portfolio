import { useEffect, useRef } from 'react'
import { useNexusStore } from '../store/nexusStore'

// ─── Zone definitions ─────────────────────────────────────────
// Each zone has a unique combination of oscillator frequencies,
// waveforms, and filter settings to create a distinct feel.
const ZONES = {
  hub: {
    freqs:  [40, 40.3, 80],
    types:  ['sawtooth', 'sawtooth', 'sine'],
    gains:  [0.35, 0.35, 0.12],
    filter: { type: 'lowpass', freq: 300, q: 0.8 },
    lfoFreq: 0.06, lfoDepth: 1.2,
  },
  module: {
    freqs:  [55, 110, 165],
    types:  ['sine', 'sine', 'sine'],
    gains:  [0.25, 0.15, 0.08],
    filter: { type: 'bandpass', freq: 180, q: 1.2 },
    lfoFreq: 0.04, lfoDepth: 0.8,
  },
  nexusai: {
    freqs:  [60, 90, 120, 180],
    types:  ['sine', 'triangle', 'sine', 'sine'],
    gains:  [0.20, 0.12, 0.08, 0.05],
    filter: { type: 'highpass', freq: 80, q: 0.5 },
    lfoFreq: 0.08, lfoDepth: 0.5,
  },
  terminal: {
    freqs:  [30, 60],
    types:  ['sawtooth', 'square'],
    gains:  [0.18, 0.10],
    filter: { type: 'lowpass', freq: 200, q: 2 },
    lfoFreq: 0.12, lfoDepth: 2,
  },
}

// ─── Build a zone's audio graph ───────────────────────────────
function buildZone(ctx, masterGain, zoneDef) {
  const nodes = []
  const zoneGain = ctx.createGain()
  zoneGain.gain.value = 0          // start silent — fade in
  zoneGain.connect(masterGain)

  const filter = ctx.createBiquadFilter()
  filter.type            = zoneDef.filter.type
  filter.frequency.value = zoneDef.filter.freq
  filter.Q.value         = zoneDef.filter.q
  filter.connect(zoneGain)

  zoneDef.freqs.forEach((freq, i) => {
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type            = zoneDef.types[i]
    osc.frequency.value = freq
    gain.gain.value     = zoneDef.gains[i]
    osc.connect(gain)
    gain.connect(filter)
    osc.start()
    nodes.push(osc)
  })

  // LFO on filter frequency for movement
  const lfo     = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  lfo.frequency.value = zoneDef.lfoFreq
  lfoGain.gain.value  = zoneDef.lfoDepth * 10
  lfo.connect(lfoGain)
  lfoGain.connect(filter.frequency)
  lfo.start()
  nodes.push(lfo)

  return { nodes, zoneGain, filter }
}

// ─── Hook ─────────────────────────────────────────────────────
export function useZoneMusic() {
  const { phase, currentModule, terminalOpen, audioEnabled, audioVolume } = useNexusStore()

  const ctxRef      = useRef(null)
  const masterRef   = useRef(null)
  const zonesRef    = useRef({})      // { zoneName: { nodes, zoneGain } }
  const currentZone = useRef(null)
  const fadeDur     = 1.8             // crossfade seconds

  // Determine active zone
  let targetZone = null
  if (phase === 'hub' && audioEnabled) {
    if (terminalOpen)             targetZone = 'terminal'
    else if (currentModule === 'nexusai') targetZone = 'nexusai'
    else if (currentModule)       targetZone = 'module'
    else                          targetZone = 'hub'
  }

  // Init audio context once
  useEffect(() => {
    if (!audioEnabled) return
    try {
      if (!ctxRef.current) {
        ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
        masterRef.current = ctxRef.current.createGain()
        masterRef.current.gain.value = audioVolume * 0.5   // zones are quieter than SFX
        masterRef.current.connect(ctxRef.current.destination)
      }
      if (ctxRef.current.state === 'suspended') ctxRef.current.resume()
    } catch (_) {}
  }, [audioEnabled, audioVolume])

  // Crossfade when zone changes
  useEffect(() => {
    const ctx    = ctxRef.current
    const master = masterRef.current
    if (!ctx || !master || !audioEnabled) return
    if (targetZone === currentZone.current) return

    const now = ctx.currentTime

    // Fade out current zone
    if (currentZone.current && zonesRef.current[currentZone.current]) {
      const { zoneGain } = zonesRef.current[currentZone.current]
      zoneGain.gain.setValueAtTime(zoneGain.gain.value, now)
      zoneGain.gain.linearRampToValueAtTime(0, now + fadeDur)
      // Destroy after fade
      const zoneName = currentZone.current
      setTimeout(() => {
        const z = zonesRef.current[zoneName]
        if (z) {
          z.nodes.forEach(n => { try { n.stop() } catch (_) {} })
          delete zonesRef.current[zoneName]
        }
      }, (fadeDur + 0.2) * 1000)
    }

    // Fade in target zone
    if (targetZone && ZONES[targetZone]) {
      try {
        const zone = buildZone(ctx, master, ZONES[targetZone])
        zonesRef.current[targetZone] = zone
        zone.zoneGain.gain.setValueAtTime(0, now)
        zone.zoneGain.gain.linearRampToValueAtTime(0.6, now + fadeDur)
      } catch (_) {}
    }

    currentZone.current = targetZone
  }, [targetZone, audioEnabled])

  // Volume sync
  useEffect(() => {
    if (masterRef.current) {
      masterRef.current.gain.value = audioVolume * 0.5
    }
  }, [audioVolume])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(zonesRef.current).forEach(({ nodes }) => {
        nodes.forEach(n => { try { n.stop() } catch (_) {} })
      })
      zonesRef.current = {}
      if (ctxRef.current) {
        try { ctxRef.current.close() } catch (_) {}
        ctxRef.current = null
      }
    }
  }, [])
}
