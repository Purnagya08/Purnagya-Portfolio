import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNexusStore } from '../../store/nexusStore'
import { toggleAudio, SFX } from '../../audio/audioEngine'

// ─── NEXUS AI Quick-access button ─────────────────────────────
function NexusAIButton() {
  const { navigateTo, currentModule, triggerWarp, phase } = useNexusStore()
  if (phase === 'entry' || phase === 'boot') return null

  const isActive = currentModule === 'nexusai'

  function handleClick() {
    SFX.moduleEnter()
    triggerWarp()
    setTimeout(() => navigateTo(isActive ? null : 'nexusai'), 400)
  }

  return (
    <button
      onClick={handleClick}
      data-cursor="hover"
      style={{
        fontFamily: 'JetBrains Mono', fontSize: 8,
        letterSpacing: '0.15em',
        color: isActive ? '#c9a84c' : 'rgba(56,184,216,0.6)',
        background: isActive ? 'rgba(201,168,76,0.08)' : 'transparent',
        border: `1px solid ${isActive ? 'rgba(201,168,76,0.35)' : 'rgba(56,184,216,0.2)'}`,
        padding: '5px 12px', cursor: 'none',
        display: 'flex', alignItems: 'center', gap: 6,
        transition: 'all 0.2s',
      }}
    >
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ width: 4, height: 4, borderRadius: '50%', background: isActive ? '#c9a84c' : '#38b8d8' }}
      />
      NEXUS·AI
    </button>
  )
}

// ─── Clock that ticks ─────────────────────────────────────────
function SystemClock() {
  const { systemTime, tickClock } = useNexusStore()

  useEffect(() => {
    const interval = setInterval(tickClock, 1000)
    return () => clearInterval(interval)
  }, [tickClock])

  const d = new Date(systemTime)
  const date = d.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
  const time = d.toLocaleTimeString('en-US', { hour12: false })

  return (
    <div className="data-readout text-right leading-relaxed">
      <div style={{ color: 'rgba(56,184,216,0.7)', fontSize: 9 }}>SYS.CLOCK</div>
      <div style={{ color: '#38b8d8', fontSize: 10 }}>{time}</div>
      <div style={{ color: 'rgba(56,184,216,0.4)', fontSize: 9 }}>{date}</div>
    </div>
  )
}

// ─── Audio toggle ─────────────────────────────────────────────
function AudioToggle() {
  const { audioEnabled, sfxEnabled, setSfxEnabled } = useNexusStore()

  const handleAudio = () => {
    toggleAudio()
  }

  return (
    <button
      onClick={handleAudio}
      className="data-readout flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
      style={{ background: 'none', border: 'none', padding: 4 }}
      title={audioEnabled ? 'Mute' : 'Enable Audio'}
    >
      <div style={{ fontSize: 9, color: 'rgba(201,168,76,0.7)' }}>AUDIO</div>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
        {audioEnabled ? (
          <>
            <path d="M1 4h3l4-3v10l-4-3H1V4z" stroke="#c9a84c" strokeWidth="0.8" fill="rgba(201,168,76,0.2)" />
            <path d="M11 2.5c1.2 1.2 1.8 2.8 1.8 4.5s-.6 3.3-1.8 4.5" stroke="#c9a84c" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M13.5 0.5c2 2 3 4.6 3 6.5s-1 4.5-3 6.5" stroke="rgba(201,168,76,0.4)" strokeWidth="0.8" strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d="M1 4h3l4-3v10l-4-3H1V4z" stroke="rgba(201,168,76,0.4)" strokeWidth="0.8" fill="none" />
            <path d="M11 4l4 4m0-4l-4 4" stroke="rgba(201,168,76,0.5)" strokeWidth="0.8" strokeLinecap="round" />
          </>
        )}
      </svg>
      <div style={{ fontSize: 8, color: audioEnabled ? '#c9a84c' : 'rgba(201,168,76,0.3)' }}>
        {audioEnabled ? 'ON' : 'OFF'}
      </div>
    </button>
  )
}

// ─── Coordinates display ──────────────────────────────────────
function CursorCoords() {
  const { cursorPos } = useNexusStore()
  const nx = ((cursorPos.x / window.innerWidth) * 100).toFixed(1)
  const ny = ((cursorPos.y / window.innerHeight) * 100).toFixed(1)

  return (
    <div className="data-readout" style={{ fontSize: 9 }}>
      <span style={{ color: 'rgba(56,184,216,0.4)' }}>X:</span>
      <span style={{ color: 'rgba(56,184,216,0.7)', marginLeft: 2 }}>{nx}%</span>
      <span style={{ color: 'rgba(56,184,216,0.4)', marginLeft: 6 }}>Y:</span>
      <span style={{ color: 'rgba(56,184,216,0.7)', marginLeft: 2 }}>{ny}%</span>
    </div>
  )
}

// ─── Fragment collector status ────────────────────────────────
function FragmentStatus() {
  const { collectedFragments, totalFragments } = useNexusStore()
  const pct = Math.round((collectedFragments.length / totalFragments) * 100)

  return (
    <div className="data-readout" style={{ fontSize: 9 }}>
      <div style={{ color: 'rgba(201,168,76,0.5)', marginBottom: 2 }}>MEMORY FRAGMENTS</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <div style={{
          width: 60, height: 2,
          background: 'rgba(201,168,76,0.1)',
          position: 'relative',
        }}>
          <div style={{
            width: `${pct}%`, height: '100%',
            background: 'linear-gradient(90deg, #a07830, #c9a84c)',
            transition: 'width 0.5s',
          }} />
        </div>
        <span style={{ color: '#c9a84c' }}>{collectedFragments.length}/{totalFragments}</span>
      </div>
    </div>
  )
}

// ─── Session ID ───────────────────────────────────────────────
function SessionBadge() {
  const { sessionId } = useNexusStore()
  return (
    <div className="data-readout" style={{ fontSize: 9 }}>
      <span style={{ color: 'rgba(56,184,216,0.3)' }}>SID·</span>
      <span style={{ color: 'rgba(56,184,216,0.6)' }}>{sessionId}</span>
    </div>
  )
}

// ─── Main HUD Overlay ─────────────────────────────────────────
export default function HUDOverlay({ visible = true }) {
  const { phase } = useNexusStore()

  if (!visible || phase === 'entry') return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 1 }}
      style={{ pointerEvents: 'none', zIndex: 100 }}
    >
      {/* ── Top-left: NEXUS logo mark ── */}
      <div style={{
        position: 'fixed', top: 20, left: 24,
        display: 'flex', alignItems: 'center', gap: 10,
        pointerEvents: 'all',
      }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="12" stroke="rgba(201,168,76,0.5)" strokeWidth="1"/>
          <circle cx="14" cy="14" r="6"  stroke="rgba(56,184,216,0.4)"  strokeWidth="0.75"/>
          <circle cx="14" cy="14" r="2"  fill="#c9a84c"/>
          <line x1="14" y1="2"  x2="14" y2="26" stroke="rgba(201,168,76,0.2)" strokeWidth="0.5"/>
          <line x1="2"  y1="14" x2="26" y2="14" stroke="rgba(201,168,76,0.2)" strokeWidth="0.5"/>
        </svg>
        <div>
          <div style={{ fontFamily: 'Orbitron', fontSize: 11, color: '#c9a84c', letterSpacing: '0.25em', fontWeight: 600 }}>
            NEXUS
          </div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(56,184,216,0.5)', letterSpacing: '0.1em' }}>
            STATION·OS
          </div>
        </div>
      </div>

      {/* ── Top-right: AI button + Clock + audio ── */}
      <div style={{
        position: 'fixed', top: 20, right: 24,
        display: 'flex', alignItems: 'flex-start', gap: 12,
        pointerEvents: 'all',
      }}>
        <NexusAIButton />
        <SystemClock />
        <AudioToggle />
      </div>

      {/* ── Bottom-left: coordinates ── */}
      <div style={{
        position: 'fixed', bottom: 20, left: 24,
        display: 'flex', flex: 'column', gap: 6,
      }}>
        <CursorCoords />
        <SessionBadge />
      </div>

      {/* ── Bottom-right: fragment counter ── */}
      <div style={{
        position: 'fixed', bottom: 20, right: 24,
        pointerEvents: 'all',
      }}>
        <FragmentStatus />
      </div>

      {/* ── Corner accent lines ── */}
      {/* Top-left */}
      <svg style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none' }} width="80" height="80" viewBox="0 0 80 80">
        <path d="M0 40 L0 0 L40 0" stroke="rgba(56,184,216,0.15)" strokeWidth="1" fill="none" />
        <path d="M0 20 L0 0 L20 0" stroke="rgba(56,184,216,0.3)"  strokeWidth="1" fill="none" />
      </svg>
      {/* Top-right */}
      <svg style={{ position: 'fixed', top: 0, right: 0, pointerEvents: 'none' }} width="80" height="80" viewBox="0 0 80 80">
        <path d="M80 40 L80 0 L40 0" stroke="rgba(56,184,216,0.15)" strokeWidth="1" fill="none" />
        <path d="M80 20 L80 0 L60 0" stroke="rgba(56,184,216,0.3)"  strokeWidth="1" fill="none" />
      </svg>
      {/* Bottom-left */}
      <svg style={{ position: 'fixed', bottom: 0, left: 0, pointerEvents: 'none' }} width="80" height="80" viewBox="0 0 80 80">
        <path d="M0 40 L0 80 L40 80" stroke="rgba(201,168,76,0.15)" strokeWidth="1" fill="none" />
        <path d="M0 60 L0 80 L20 80" stroke="rgba(201,168,76,0.25)" strokeWidth="1" fill="none" />
      </svg>
      {/* Bottom-right */}
      <svg style={{ position: 'fixed', bottom: 0, right: 0, pointerEvents: 'none' }} width="80" height="80" viewBox="0 0 80 80">
        <path d="M80 40 L80 80 L40 80" stroke="rgba(201,168,76,0.15)" strokeWidth="1" fill="none" />
        <path d="M80 60 L80 80 L60 80" stroke="rgba(201,168,76,0.25)" strokeWidth="1" fill="none" />
      </svg>

      {/* ── Horizontal scan line (subtle) ── */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%',
        height: 1,
        background: 'linear-gradient(90deg, transparent 0%, rgba(56,184,216,0.3) 50%, transparent 100%)',
        animation: 'scanline 12s linear infinite',
        pointerEvents: 'none',
      }} />
    </motion.div>
  )
}
