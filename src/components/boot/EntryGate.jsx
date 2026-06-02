import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNexusStore } from '../../store/nexusStore'
import { initAudio, SFX } from '../../audio/audioEngine'

// ─── Procedural CSS stars (no images needed) ──────────────────
function StarField() {
  const stars = useRef(
    Array.from({ length: 200 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() < 0.05 ? 2 : Math.random() < 0.2 ? 1.5 : 1,
      opacity: 0.2 + Math.random() * 0.8,
      dur: 2 + Math.random() * 5,
      delay: Math.random() * 5,
    }))
  ).current

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {stars.map(s => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: 'white',
            '--min-op': s.opacity * 0.3,
            '--max-op': s.opacity,
            '--d': `${s.dur}s`,
            '--delay': `${s.delay}s`,
            animation: `twinkle var(--d) var(--delay) ease-in-out infinite`,
          }}
          className="star"
        />
      ))}
    </div>
  )
}

// ─── Nebula blobs ─────────────────────────────────────────────
function Nebulae() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        width: '60vw', height: '60vw',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(26,127,168,0.12) 0%, transparent 70%)',
        top: '-20%', left: '-10%',
        filter: 'blur(40px)',
        animation: 'float 15s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute',
        width: '40vw', height: '40vw',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)',
        bottom: '-10%', right: '5%',
        filter: 'blur(60px)',
        animation: 'float 20s ease-in-out infinite reverse',
      }} />
      <div style={{
        position: 'absolute',
        width: '30vw', height: '30vw',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(100,60,180,0.07) 0%, transparent 70%)',
        top: '30%', right: '20%',
        filter: 'blur(50px)',
        animation: 'float 25s ease-in-out infinite',
        animationDelay: '-5s',
      }} />
    </div>
  )
}

// ─── Orbit rings ─────────────────────────────────────────────
function OrbitRings() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
      {[300, 500, 700, 900].map((size, i) => (
        <div
          key={size}
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: '50%',
            border: `1px solid rgba(56,184,216,${0.08 - i * 0.015})`,
            animation: `spin ${20 + i * 10}s linear infinite ${i % 2 ? 'reverse' : ''}`,
          }}
        />
      ))}
      {/* Dashed orbit */}
      <div style={{
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: '50%',
        border: '1px dashed rgba(201,168,76,0.08)',
        animation: 'spin 60s linear infinite',
      }} />
    </div>
  )
}

// ─── The entry prompt ─────────────────────────────────────────
function EntryPrompt({ onEnter, status }) {
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 800)
    return () => clearInterval(t)
  }, [])

  return (
    <motion.div
      style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 1.2 }}
    >
      {/* Station label */}
      <motion.div
        style={{
          fontFamily: 'JetBrains Mono',
          fontSize: 10,
          letterSpacing: '0.4em',
          color: 'rgba(56,184,216,0.5)',
          marginBottom: 24,
        }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        ◈ NEXUS STATION — SECTOR 7G ◈
      </motion.div>

      {/* Main title */}
      <div
        className="glitch-text"
        data-text="NEXUS"
        style={{
          fontFamily: 'Orbitron',
          fontSize: 'clamp(56px, 12vw, 110px)',
          fontWeight: 800,
          color: '#c9a84c',
          letterSpacing: '0.15em',
          lineHeight: 1,
          marginBottom: 8,
          textShadow: '0 0 40px rgba(201,168,76,0.4), 0 0 80px rgba(201,168,76,0.15)',
        }}
      >
        NEXUS
      </div>

      {/* Subtitle */}
      <div style={{
        fontFamily: 'Libre Baskerville',
        fontStyle: 'italic',
        fontSize: 'clamp(14px, 2vw, 18px)',
        color: 'rgba(176,192,216,0.7)',
        letterSpacing: '0.08em',
        marginBottom: 48,
      }}>
        The Logbook of an Engineer
      </div>

      {/* Divider */}
      <div style={{
        width: 240,
        height: 1,
        margin: '0 auto 48px',
        background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)',
      }} />

      {/* Enter button */}
      {status === 'waiting' && (
        <motion.button
          onClick={onEnter}
          data-cursor="portal"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          style={{
            fontFamily: 'Space Grotesk',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#c9a84c',
            background: 'transparent',
            border: '1px solid rgba(201,168,76,0.4)',
            padding: '14px 48px',
            position: 'relative',
            clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)',
            cursor: 'none',
            overflow: 'hidden',
          }}
        >
          {/* Shimmer on hover */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.1), transparent)',
              backgroundSize: '200% 100%',
            }}
            animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span style={{ position: 'relative' }}>INITIATE ENTRY</span>
        </motion.button>
      )}

      {status === 'entering' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: 11,
            color: '#38b8d8',
            letterSpacing: '0.2em',
          }}
        >
          <span className="typing-cursor">ESTABLISHING LINK</span>
        </motion.div>
      )}

      {/* Footnote */}
      <div style={{
        marginTop: 40,
        fontFamily: 'JetBrains Mono',
        fontSize: 9,
        color: 'rgba(56,184,216,0.3)',
        letterSpacing: '0.12em',
      }}>
        ⚠ AUDIO RECOMMENDED · ENABLE SOUND FOR FULL EXPERIENCE
      </div>
    </motion.div>
  )
}

// ─── Main EntryGate ───────────────────────────────────────────
export default function EntryGate() {
  const { setPhase, setEntryGranted } = useNexusStore()
  const [status, setStatus] = useState('waiting') // 'waiting' | 'entering' | 'done'
  const [particles, setParticles] = useState([])

  function handleEnter() {
    setStatus('entering')
    initAudio()
    SFX.portalOpen()

    // Burst particles
    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        angle: (i / 20) * 360,
        dist: 80 + Math.random() * 120,
        size: 1 + Math.random() * 3,
      }))
    )

    setTimeout(() => {
      setStatus('done')
      setEntryGranted(true)
      setPhase('boot')
    }, 2000)
  }

  return (
    <AnimatePresence>
      <motion.div
        style={{
          position: 'fixed',
          inset: 0,
          background: '#02040c',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          zIndex: 1000,
        }}
        exit={{
          opacity: 0,
          scale: 1.1,
          filter: 'blur(20px)',
        }}
        transition={{ duration: 0.8 }}
      >
        <Nebulae />
        <StarField />
        <OrbitRings />

        {/* Horizontal rule top/bottom */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(56,184,216,0.2), transparent)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.15), transparent)',
        }} />

        <EntryPrompt onEnter={handleEnter} status={status} />

        {/* Flash overlay on enter */}
        {status === 'entering' && (
          <motion.div
            style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(56,184,216,0.2) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
            animate={{ opacity: [0, 1, 0.3] }}
            transition={{ duration: 2 }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
