import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNexusStore } from '../../store/nexusStore'

// ─── Procedural audio for each event ─────────────────────────
function playEventSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const master = ctx.createGain()
    master.gain.value = 0.18
    master.connect(ctx.destination)

    if (type === 'meteor') {
      // Quick white-noise whoosh
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.6, ctx.sampleRate)
      const d = buf.getChannelData(0)
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length)
      const src = ctx.createBufferSource()
      src.buffer = buf
      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = 2000
      filter.Q.value = 0.5
      src.connect(filter)
      filter.connect(master)
      src.start()
      setTimeout(() => ctx.close(), 800)
    }

    if (type === 'solar') {
      // Rising drone
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(60, ctx.currentTime)
      osc.frequency.linearRampToValueAtTime(180, ctx.currentTime + 1.5)
      gain.gain.setValueAtTime(0, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.4)
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.8)
      osc.connect(gain)
      gain.connect(master)
      osc.start()
      osc.stop(ctx.currentTime + 2)
      setTimeout(() => ctx.close(), 2200)
    }

    if (type === 'interference') {
      // Static burst
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.4, ctx.sampleRate)
      const d = buf.getChannelData(0)
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
      const src = ctx.createBufferSource()
      src.buffer = buf
      const gain = ctx.createGain()
      gain.gain.value = 0.15
      src.connect(gain)
      gain.connect(master)
      src.start()
      setTimeout(() => ctx.close(), 600)
    }

    if (type === 'wormhole') {
      // Deep low sweep
      ;[40, 60, 80].forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(freq * 3, ctx.currentTime + 2)
        gain.gain.setValueAtTime(0, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.3 + i * 0.1)
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.5)
        osc.connect(gain)
        gain.connect(master)
        osc.start()
        osc.stop(ctx.currentTime + 2.8)
      })
      setTimeout(() => ctx.close(), 3200)
    }
  } catch (_) {
    // Audio context unavailable — silent fail
  }
}

// ─── Meteor shower ────────────────────────────────────────────
function MeteorShower() {
  const meteors = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    top:   `${-5 + Math.random() * 40}%`,
    left:  `${10 + Math.random() * 70}%`,
    delay: Math.random() * 1.2,
    length: 60 + Math.random() * 120,
    angle: 30 + Math.random() * 20,
  }))

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {meteors.map(m => (
        <motion.div
          key={m.id}
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{ opacity: [0, 0.9, 0], x: m.length * 1.5, y: m.length }}
          transition={{ duration: 0.6, delay: m.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            top: m.top, left: m.left,
            width: m.length, height: 1.5,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.9), transparent)',
            transform: `rotate(${m.angle}deg)`,
            transformOrigin: 'left center',
            boxShadow: '0 0 4px rgba(255,255,255,0.6)',
          }}
        />
      ))}
    </div>
  )
}

// ─── Solar flare ──────────────────────────────────────────────
function SolarFlare() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.22, 0.08, 0.18, 0] }}
      transition={{ duration: 2.5, times: [0, 0.15, 0.4, 0.7, 1] }}
      style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 15% 25%, rgba(255,200,80,0.35) 0%, rgba(255,120,20,0.15) 40%, transparent 70%)',
      }}
    />
  )
}

// ─── Signal interference ──────────────────────────────────────
function SignalInterference() {
  return (
    <>
      {/* Horizontal glitch lines */}
      {Array.from({ length: 6 }, (_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{
            opacity: [0, 0.7, 0, 0.5, 0],
            scaleX:  [0, 1, 0.3, 0.8, 0],
            x:       [0, -8, 4, -2, 0],
          }}
          transition={{
            duration: 0.25,
            delay: i * 0.08,
            repeat: 3,
            repeatDelay: 0.1,
          }}
          style={{
            position: 'absolute',
            top:    `${15 + i * 12}%`,
            left: 0, right: 0,
            height: 2 + Math.random() * 3,
            background: `rgba(56,184,216,${0.15 + Math.random() * 0.25})`,
            pointerEvents: 'none',
            transformOrigin: 'left center',
          }}
        />
      ))}
      {/* RGB split overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.12, 0, 0.08, 0] }}
        transition={{ duration: 0.8, times: [0, 0.2, 0.5, 0.7, 1] }}
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'repeating-linear-gradient(0deg, rgba(255,0,0,0.04) 0px, transparent 1px, rgba(0,0,255,0.04) 2px, transparent 3px)',
          mixBlendMode: 'screen',
        }}
      />
    </>
  )
}

// ─── Wormhole pulse ───────────────────────────────────────────
function WormholePulse() {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {[0, 1, 2, 3].map(i => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{ opacity: [0, 0.5, 0], scale: [0.2, 2.5, 4] }}
          transition={{ duration: 1.8, delay: i * 0.3, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            width: 300, height: 300,
            borderRadius: '50%',
            border: `1px solid rgba(160,112,224,${0.6 - i * 0.12})`,
            boxShadow: `0 0 40px rgba(160,112,224,0.3), inset 0 0 40px rgba(160,112,224,0.1)`,
          }}
        />
      ))}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 0.8, 0], scale: [0, 1, 0.5] }}
        transition={{ duration: 1.2, delay: 0.2 }}
        style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(160,112,224,0.6) 0%, transparent 70%)',
          filter: 'blur(8px)',
        }}
      />
    </div>
  )
}

// ─── Event configs ────────────────────────────────────────────
const EVENTS = [
  { type: 'meteor',       label: 'METEOR SHOWER',       minInterval: 25, maxInterval: 60,  duration: 2500 },
  { type: 'solar',        label: 'SOLAR FLARE',         minInterval: 40, maxInterval: 90,  duration: 3000 },
  { type: 'interference', label: 'SIGNAL INTERFERENCE', minInterval: 30, maxInterval: 70,  duration: 1800 },
  { type: 'wormhole',     label: 'WORMHOLE PULSE',      minInterval: 50, maxInterval: 120, duration: 2800 },
]

function EventRenderer({ type }) {
  switch (type) {
    case 'meteor':       return <MeteorShower />
    case 'solar':        return <SolarFlare />
    case 'interference': return <SignalInterference />
    case 'wormhole':     return <WormholePulse />
    default:             return null
  }
}

// ─── Main DynamicEvents ───────────────────────────────────────
export default function DynamicEvents() {
  const { phase, audioEnabled } = useNexusStore()
  const [activeEvent, setActiveEvent] = useState(null)
  const timers     = useRef([])
  const fireRef    = useRef(null)

  // Store audioEnabled in ref so fireEvent doesn't need it as dep
  const audioRef = useRef(audioEnabled)
  useEffect(() => { audioRef.current = audioEnabled }, [audioEnabled])

  useEffect(() => {
    if (phase !== 'hub') return

    function fireEvent() {
      const event = EVENTS[Math.floor(Math.random() * EVENTS.length)]
      setActiveEvent(event)
      if (audioRef.current) playEventSound(event.type)

      const clearTimer = setTimeout(() => setActiveEvent(null), event.duration)
      timers.current.push(clearTimer)

      const delay = (event.minInterval + Math.random() * (event.maxInterval - event.minInterval)) * 1000
      const nextTimer = setTimeout(fireEvent, delay)
      timers.current.push(nextTimer)
    }

    fireRef.current = fireEvent

    const firstDelay = (15 + Math.random() * 15) * 1000
    const firstTimer = setTimeout(fireEvent, firstDelay)
    timers.current.push(firstTimer)

    return () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
  }, [phase])

  if (phase !== 'hub') return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 15, pointerEvents: 'none' }}>
      <AnimatePresence mode="wait">
        {activeEvent && (
          <motion.div
            key={activeEvent.type + Date.now()}
            style={{ position: 'absolute', inset: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EventRenderer type={activeEvent.type} />

            {/* Event label */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute', top: 72, left: '50%',
                transform: 'translateX(-50%)',
                fontFamily: 'JetBrains Mono', fontSize: 9,
                letterSpacing: '0.3em',
                color: 'rgba(201,168,76,0.6)',
                background: 'rgba(4,6,15,0.7)',
                border: '1px solid rgba(201,168,76,0.15)',
                padding: '4px 14px',
                whiteSpace: 'nowrap',
              }}
            >
              ⚠ {activeEvent.label} DETECTED
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
