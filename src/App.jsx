import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNexusStore } from './store/nexusStore'

import NexusCursor from './components/cursor/NexusCursor'
import HUDOverlay from './components/ui/HUDOverlay'
import WarpTransition from './components/ui/WarpTransition'
import EntryGate from './components/boot/EntryGate'
import BootSequence from './components/boot/BootSequence'

// ─── Placeholder for phases we build in later parts ──────────
function ComingSoon({ label }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#04060f',
        zIndex: 10,
      }}
    >
      {/* Stars */}
      {Array.from({ length: 100 }, (_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: Math.random() < 0.1 ? 2 : 1,
          height: Math.random() < 0.1 ? 2 : 1,
          borderRadius: '50%',
          background: 'white',
          opacity: 0.2 + Math.random() * 0.6,
          animation: `twinkle ${2 + Math.random() * 4}s ${Math.random() * 3}s ease-in-out infinite`,
        }} />
      ))}

      <div style={{
        fontFamily: 'JetBrains Mono', fontSize: 10,
        letterSpacing: '0.3em', color: 'rgba(56,184,216,0.5)',
        marginBottom: 16,
      }}>
        ◈ MODULE ONLINE ◈
      </div>
      <div style={{
        fontFamily: 'Orbitron', fontSize: 'clamp(32px, 6vw, 56px)',
        fontWeight: 700, color: '#c9a84c',
        textShadow: '0 0 40px rgba(201,168,76,0.4)',
        letterSpacing: '0.1em',
        marginBottom: 12,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'Libre Baskerville', fontStyle: 'italic',
        fontSize: 14, color: 'rgba(176,192,216,0.5)',
      }}>
        Part 2 builds this module →
      </div>
    </motion.div>
  )
}

// ─── Root App ─────────────────────────────────────────────────
export default function App() {
  const { phase } = useNexusStore()

  // Prevent right-click context menu (immersive feel)
  useEffect(() => {
    const prevent = (e) => e.preventDefault()
    document.addEventListener('contextmenu', prevent)
    return () => document.removeEventListener('contextmenu', prevent)
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#02040c' }}>
      {/* ── Always-on atmosphere overlays ── */}
      <div className="noise-overlay" />
      <div className="scanlines" />
      <div className="vignette" />

      {/* ── Phase router ── */}
      <AnimatePresence mode="wait">
        {phase === 'entry' && (
          <motion.div key="entry" style={{ position: 'fixed', inset: 0, zIndex: 800 }}>
            <EntryGate />
          </motion.div>
        )}

        {phase === 'boot' && (
          <motion.div
            key="boot"
            style={{ position: 'fixed', inset: 0, zIndex: 700 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BootSequence />
          </motion.div>
        )}

        {phase === 'hub' && (
          <motion.div
            key="hub"
            style={{ position: 'fixed', inset: 0, zIndex: 10 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Built in Part 2 */}
            <ComingSoon label="CENTRAL COMMAND" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Persistent chrome (appears after boot) ── */}
      <HUDOverlay visible={phase !== 'entry'} />
      <WarpTransition />

      {/* ── Custom cursor (always on) ── */}
      <NexusCursor />
    </div>
  )
}
