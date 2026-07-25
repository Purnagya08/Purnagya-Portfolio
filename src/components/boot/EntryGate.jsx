import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNexusStore } from '../../store/nexusStore'
import { initAudio, SFX } from '../../audio/audioEngine'

function StarField({ count = 220 }) {
  const stars = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() < 0.05 ? 2.5 : Math.random() < 0.2 ? 1.5 : 1,
      opacity: 0.2 + Math.random() * 0.8,
      dur:   2 + Math.random() * 5,
      delay: Math.random() * 5,
    }))
  ).current

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position: 'absolute',
          left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size,
          borderRadius: '50%', background: 'white',
          '--min-op': s.opacity * 0.25,
          '--max-op': s.opacity,
          '--d': `${s.dur}s`,
          '--delay': `${s.delay}s`,
          animation: 'twinkle var(--d) var(--delay) ease-in-out infinite',
        }} className="star" />
      ))}
    </div>
  )
}

function Nebulae() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(26,127,168,0.13) 0%, transparent 70%)', top: '-20%', left: '-10%', filter: 'blur(40px)', animation: 'float 15s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', width: '40vw', height: '40vw', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(201,168,76,0.09) 0%, transparent 70%)', bottom: '-10%', right: '5%', filter: 'blur(60px)', animation: 'float 20s ease-in-out infinite reverse' }} />
      <div style={{ position: 'absolute', width: '30vw', height: '30vw', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(100,60,180,0.07) 0%, transparent 70%)', top: '30%', right: '20%', filter: 'blur(50px)', animation: 'float 25s ease-in-out infinite', animationDelay: '-5s' }} />
    </div>
  )
}

function WarpTunnel({ progress }) {
  const lines = useRef(
    Array.from({ length: 60 }, (_, i) => {
      const angle = (i / 60) * Math.PI * 2
      return { angle, len: 100 + Math.random() * 300, width: 0.5 + Math.random() * 1 }
    })
  ).current

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: progress > 0.3 ? 1 : 0 }}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
    >
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
        {lines.map((l, i) => {
          const cx = 960, cy = 540
          return (
            <motion.line
              key={i}
              x1={cx} y1={cy}
              x2={cx + Math.cos(l.angle) * l.len}
              y2={cy + Math.sin(l.angle) * l.len}
              stroke={i % 3 === 0 ? 'rgba(201,168,76,0.5)' : 'rgba(56,184,216,0.3)'}
              strokeWidth={l.width}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: progress, opacity: progress * 0.8 }}
              transition={{ duration: 0.8, delay: i * 0.008, ease: 'easeOut' }}
            />
          )
        })}
      </svg>
      <motion.div
        animate={{ opacity: progress * 0.6, scale: 0.5 + progress * 2 }}
        style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(56,184,216,0.25) 0%, rgba(201,168,76,0.1) 30%, transparent 70%)',
        }}
      />
    </motion.div>
  )
}

function StationReveal({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <motion.circle
              cx="60" cy="60" r={50}
              stroke="rgba(201,168,76,0.4)" strokeWidth="1"
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '60px 60px' }}
            />
            <motion.ellipse
              cx="60" cy="60" rx="50" ry="18"
              stroke="rgba(56,184,216,0.3)" strokeWidth="1" fill="none"
              animate={{ rotateX: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
            <motion.ellipse
              cx="60" cy="60" rx="18" ry="50"
              stroke="rgba(56,184,216,0.2)" strokeWidth="0.75" fill="none"
              animate={{ rotateY: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            />
            <circle cx="60" cy="60" r={8} fill="rgba(201,168,76,0.7)" />
            <motion.circle
              cx="60" cy="60" r={8}
              fill="none" stroke="rgba(201,168,76,0.4)" strokeWidth="1"
              animate={{ r: [8, 20, 8], opacity: [0.8, 0, 0.8] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function DockText({ phase }) {
  const lines = [
    { p: 0.4,  text: 'NEXUS STATION DETECTED' },
    { p: 0.55, text: 'INITIALIZING DOCKING PROTOCOL' },
    { p: 0.7,  text: 'SYNCHRONIZING NEURAL ARCHIVE' },
    { p: 0.85, text: 'DOCK CONFIRMED — PREPARE FOR ENTRY' },
  ]

  return (
    <div style={{
      position: 'absolute', bottom: '20%', left: '50%',
      transform: 'translateX(-50%)',
      textAlign: 'center', minWidth: 300,
    }}>
      {lines.map(l => (
        <AnimatePresence key={l.text}>
          {phase >= l.p && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                fontFamily: 'JetBrains Mono', fontSize: 9,
                color: 'rgba(56,184,216,0.75)',
                letterSpacing: '0.25em', marginBottom: 5,
              }}
            >
              › {l.text}
            </motion.div>
          )}
        </AnimatePresence>
      ))}
    </div>
  )
}

export default function EntryGate() {
  const { setPhase, setEntryGranted } = useNexusStore()
  const [status, setStatus]           = useState('waiting')
  const [warpProgress, setWarpProgress] = useState(0)
  const [showStation, setShowStation] = useState(false)
  const animFrame = useRef(null)
  const startTime = useRef(null)

  function handleEnter() {
    setStatus('flythrough')
    initAudio()
    SFX.portalOpen()

    startTime.current = performance.now()
    function tick(now) {
      const elapsed = (now - startTime.current) / 2800
      const p = Math.min(elapsed, 1)
      setWarpProgress(p)

      if (p >= 0.45 && !showStation) setShowStation(true)

      if (p < 1) {
        animFrame.current = requestAnimationFrame(tick)
      } else {
        SFX.bootReady()
        setTimeout(() => {
          setStatus('done')
          setEntryGranted(true)
          setPhase('boot')
        }, 400)
      }
    }
    animFrame.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    return () => { if (animFrame.current) cancelAnimationFrame(animFrame.current) }
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        style={{
          position: 'fixed', inset: 0,
          background: '#02040c',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', zIndex: 1000,
        }}
        exit={{ opacity: 0, scale: 1.08, filter: 'blur(16px)' }}
        transition={{ duration: 0.7 }}
      >
        <Nebulae />
        <StarField />

        {[300, 500, 700].map((size, i) => (
          <div key={size} style={{
            position: 'absolute',
            width: size, height: size, borderRadius: '50%',
            border: `1px solid rgba(56,184,216,${0.07 - i * 0.02})`,
            animation: `spin ${20 + i * 10}s linear infinite ${i % 2 ? 'reverse' : ''}`,
          }} />
        ))}

        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(56,184,216,0.2), transparent)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.15), transparent)' }} />

        {status === 'flythrough' && <WarpTunnel progress={warpProgress} />}
        <StationReveal visible={showStation} />
        {status === 'flythrough' && <DockText phase={warpProgress} />}

        <AnimatePresence>
          {status === 'waiting' && (
            <motion.div
              key="entry-content"
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px' }}
            >
              <motion.div
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.4em', color: 'rgba(56,184,216,0.75)', marginBottom: 24 }}
              >
                ◈ NEXUS STATION — SECTOR 7G ◈
              </motion.div>

              <div
                className="glitch-text"
                data-text="NEXUS"
                style={{
                  fontFamily: 'Orbitron',
                  fontSize: 'clamp(56px, 12vw, 110px)',
                  fontWeight: 800, color: '#c9a84c',
                  letterSpacing: '0.15em', lineHeight: 1,
                  marginBottom: 8,
                  textShadow: '0 0 40px rgba(201,168,76,0.4), 0 0 80px rgba(201,168,76,0.15)',
                }}
              >
                NEXUS
              </div>

              <div style={{
                fontFamily: 'Libre Baskerville', fontStyle: 'italic',
                fontSize: 'clamp(14px, 2vw, 18px)',
                color: 'rgba(216,228,240,0.82)',
                letterSpacing: '0.08em', marginBottom: 48,
              }}>
                The Logbook of an Engineer
              </div>

              <div style={{ width: 240, height: 1, margin: '0 auto 48px', background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)' }} />

              <motion.button
                onClick={handleEnter}
                data-cursor="portal"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 600,
                  letterSpacing: '0.3em', textTransform: 'uppercase',
                  color: '#c9a84c', background: 'transparent',
                  border: '1px solid rgba(201,168,76,0.4)',
                  padding: '14px 48px', cursor: 'none',
                  clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                <motion.div
                  style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.1), transparent)', backgroundSize: '200% 100%' }}
                  animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span style={{ position: 'relative' }}>INITIATE ENTRY</span>
              </motion.button>

              <div style={{ marginTop: 40, fontFamily: 'JetBrains Mono', fontSize: 9, color: 'rgba(56,184,216,0.75)', letterSpacing: '0.12em' }}>
                ⚠ AUDIO RECOMMENDED · ENABLE SOUND FOR FULL EXPERIENCE
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {warpProgress > 0.9 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.5 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(56,184,216,0.25)', pointerEvents: 'none' }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
