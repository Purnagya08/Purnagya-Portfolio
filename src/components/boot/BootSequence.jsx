import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNexusStore } from '../../store/nexusStore'
import { SFX } from '../../audio/audioEngine'

// ─── Boot log lines ────────────────────────────────────────────
const BOOT_LINES = [
  { text: 'NEXUS OS v4.2.1 — Initializing...', delay: 0,    color: '#c9a84c', bold: true },
  { text: 'POST: Memory integrity check..........[ OK ]',    delay: 200,  color: '#38b8d8' },
  { text: 'POST: Quantum drive spinup.............[ OK ]',   delay: 380,  color: '#38b8d8' },
  { text: 'POST: Stellar nav array calibrate.....[ OK ]',   delay: 560,  color: '#38b8d8' },
  { text: 'Loading neural archive modules........',          delay: 750,  color: '#7a8cb0' },
  { text: '  → Museum of Origins          [LOADED]',        delay: 900,  color: '#38b8d8' },
  { text: '  → Training Facility          [LOADED]',        delay: 1050, color: '#38b8d8' },
  { text: '  → Challenge Galaxy           [LOADED]',        delay: 1200, color: '#38b8d8' },
  { text: '  → Mission Control            [LOADED]',        delay: 1350, color: '#38b8d8' },
  { text: '  → Research Labs              [LOADED]',        delay: 1500, color: '#38b8d8' },
  { text: '  → Achievement Observatory   [LOADED]',        delay: 1650, color: '#38b8d8' },
  { text: '  → Present Station           [LOADED]',        delay: 1800, color: '#38b8d8' },
  { text: '  → Future Galaxy             [LOADED]',        delay: 1950, color: '#38b8d8' },
  { text: 'Mounting captain logbook...............[ OK ]',  delay: 2150, color: '#38b8d8' },
  { text: 'Connecting to NEXUS AI engine..........',        delay: 2350, color: '#7a8cb0' },
  { text: '  WARNING: Consciousness protocol active',       delay: 2500, color: '#c9a84c' },
  { text: 'Calibrating spatial audio arrays......[ OK ]',  delay: 2700, color: '#38b8d8' },
  { text: 'Rendering 3D holographic matrix.......',         delay: 2900, color: '#7a8cb0' },
  { text: '  Starfield density: 10,000 objects  [ OK ]',   delay: 3050, color: '#38b8d8' },
  { text: 'Memory fragment system armed..........[ OK ]',  delay: 3200, color: '#38b8d8' },
  { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', delay: 3400, color: 'rgba(56,184,216,0.2)' },
  { text: 'ALL SYSTEMS NOMINAL. WELCOME, CAPTAIN.',        delay: 3600, color: '#c9a84c', bold: true },
  { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', delay: 3700, color: 'rgba(56,184,216,0.2)' },
]

// ─── Single boot line ─────────────────────────────────────────
function BootLine({ text, color, bold, visible }) {
  if (!visible) return null
  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.15 }}
      style={{
        fontFamily: 'JetBrains Mono',
        fontSize: 11,
        lineHeight: 1.7,
        color: color || '#7a8cb0',
        fontWeight: bold ? 600 : 400,
        whiteSpace: 'pre',
      }}
    >
      {text}
    </motion.div>
  )
}

// ─── Progress bar ─────────────────────────────────────────────
function BootProgress({ progress }) {
  const barW = Math.min(progress * 100, 100)
  return (
    <div style={{ width: '100%', marginTop: 24 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontFamily: 'JetBrains Mono', fontSize: 9,
        color: 'rgba(56,184,216,0.5)', marginBottom: 6,
      }}>
        <span>SYSTEM BOOT</span>
        <span>{Math.round(barW)}%</span>
      </div>
      <div style={{
        width: '100%', height: 2,
        background: 'rgba(56,184,216,0.1)',
        position: 'relative', overflow: 'hidden',
      }}>
        <motion.div
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #1a7fa8, #38b8d8, #c9a84c)',
            boxShadow: '0 0 10px rgba(56,184,216,0.6)',
          }}
          animate={{ width: `${barW}%` }}
          transition={{ duration: 0.3 }}
        />
        {/* Shimmer */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          backgroundSize: '60px 100%',
          animation: 'loadingBar 1s linear infinite',
        }} />
      </div>
    </div>
  )
}

// ─── Main BootSequence ────────────────────────────────────────
export default function BootSequence() {
  const { setPhase, setBootComplete } = useNexusStore()
  const [visibleLines, setVisibleLines] = useState([])
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const scrollRef = useRef(null)
  const timers = useRef([])

  useEffect(() => {
    // Schedule each line
    BOOT_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setVisibleLines(prev => [...prev, i])
        setProgress((i + 1) / BOOT_LINES.length)
        SFX.bootBeep()
        // Auto-scroll to bottom
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
      }, line.delay)
      timers.current.push(t)
    })

    // Boot complete
    const doneTimer = setTimeout(() => {
      SFX.bootReady()
      setReady(true)
    }, BOOT_LINES[BOOT_LINES.length - 1].delay + 600)
    timers.current.push(doneTimer)

    return () => timers.current.forEach(clearTimeout)
  }, [])

  function handleEnterStation() {
    SFX.warp()
    setBootComplete(true)
    setTimeout(() => setPhase('hub'), 900)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed', inset: 0,
        background: '#02040c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 900,
        overflow: 'hidden',
      }}
    >
      {/* Scanlines */}
      <div className="scanlines" />

      {/* Subtle grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(56,184,216,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(56,184,216,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }} />

      {/* Terminal window */}
      <div style={{
        width: '100%',
        maxWidth: 680,
        padding: '0 24px',
        position: 'relative',
      }}>
        {/* Terminal title bar */}
        <div style={{
          background: 'rgba(15,20,40,0.9)',
          border: '1px solid rgba(56,184,216,0.15)',
          borderBottom: 'none',
          padding: '8px 16px',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {['#e74c3c', '#f39c12', '#2ecc71'].map((c, i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: 0.7 }} />
          ))}
          <span style={{
            fontFamily: 'JetBrains Mono', fontSize: 10,
            color: 'rgba(56,184,216,0.5)', marginLeft: 8, letterSpacing: '0.1em',
          }}>
            nexus-os — boot-sequence — 80×24
          </span>
        </div>

        {/* Terminal body */}
        <div
          ref={scrollRef}
          style={{
            background: 'rgba(4,6,15,0.95)',
            border: '1px solid rgba(56,184,216,0.15)',
            borderTop: 'none',
            padding: '20px 24px 16px',
            height: 340,
            overflowY: 'auto',
            scrollbarWidth: 'none',
            position: 'relative',
          }}
        >
          {BOOT_LINES.map((line, i) => (
            <BootLine
              key={i}
              text={line.text}
              color={line.color}
              bold={line.bold}
              visible={visibleLines.includes(i)}
            />
          ))}
          {/* Active cursor */}
          {!ready && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
              <div style={{
                fontFamily: 'JetBrains Mono', fontSize: 11, color: '#38b8d8',
              }}>▮</div>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div style={{ padding: '0 0' }}>
          <BootProgress progress={progress} />
        </div>

        {/* Enter station button */}
        <AnimatePresence>
          {ready && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ marginTop: 32, textAlign: 'center' }}
            >
              <button
                onClick={handleEnterStation}
                data-cursor="portal"
                style={{
                  fontFamily: 'Space Grotesk',
                  fontSize: 12, fontWeight: 600,
                  letterSpacing: '0.3em', textTransform: 'uppercase',
                  color: '#c9a84c',
                  background: 'transparent',
                  border: '1px solid rgba(201,168,76,0.5)',
                  padding: '14px 64px',
                  clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)',
                  position: 'relative', overflow: 'hidden',
                  cursor: 'none',
                  animation: 'glowPulse 3s ease-in-out infinite',
                }}
              >
                <motion.div
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.08), transparent)',
                    backgroundSize: '200% 100%',
                  }}
                  animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span style={{ position: 'relative' }}>ENTER NEXUS STATION</span>
              </button>

              <div style={{
                marginTop: 12,
                fontFamily: 'JetBrains Mono', fontSize: 9,
                color: 'rgba(56,184,216,0.3)', letterSpacing: '0.15em',
              }}>
                PRESS TO DOCK AT CENTRAL COMMAND
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
