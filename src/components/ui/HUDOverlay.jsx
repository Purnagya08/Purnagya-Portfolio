import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNexusStore } from '../../store/nexusStore'
import { toggleAudio, SFX } from '../../audio/audioEngine'
import ContactOverlay from '../overlays/ContactOverlay'

// ─── Captain Profile button ───────────────────────────────────
function ProfileButton() {
  const { navigateTo, currentModule, triggerWarp } = useNexusStore()
  const isActive = currentModule === 'profile'
  function handleClick() {
    SFX.click(); triggerWarp()
    setTimeout(() => navigateTo(isActive ? null : 'profile'), 400)
  }
  return (
    <button onClick={handleClick} data-cursor="hover" title="Captain's Profile"
      style={{
        fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: '0.12em',
        color: isActive ? '#ffe080' : '#e8c96a',
        background: isActive ? 'rgba(201,168,76,0.22)' : 'rgba(201,168,76,0.12)',
        border: `1.5px solid ${isActive ? '#c9a84c' : 'rgba(201,168,76,0.65)'}`,
        padding: '5px 11px', cursor: 'none',
        display: 'flex', alignItems: 'center', gap: 5,
        whiteSpace: 'nowrap', boxShadow: isActive ? '0 0 12px rgba(201,168,76,0.3)' : 'none',
      }}>
      <span>◈</span> CAPTAIN
    </button>
  )
}

// ─── NEXUS AI button ──────────────────────────────────────────
function NexusAIButton() {
  const { navigateTo, currentModule, triggerWarp } = useNexusStore()
  const isActive = currentModule === 'nexusai'
  function handleClick() {
    SFX.click(); triggerWarp()
    setTimeout(() => navigateTo(isActive ? null : 'nexusai'), 400)
  }
  return (
    <button onClick={handleClick} data-cursor="hover" title="NEXUS AI"
      style={{
        fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: '0.12em',
        color: isActive ? '#7dd8f0' : '#38b8d8',
        background: isActive ? 'rgba(56,184,216,0.2)' : 'rgba(56,184,216,0.1)',
        border: `1.5px solid ${isActive ? '#38b8d8' : 'rgba(56,184,216,0.6)'}`,
        padding: '5px 11px', cursor: 'none',
        display: 'flex', alignItems: 'center', gap: 6,
        whiteSpace: 'nowrap', boxShadow: isActive ? '0 0 12px rgba(56,184,216,0.3)' : 'none',
      }}>
      <motion.div animate={{ opacity: [0.5,1,0.5] }} transition={{ duration: 2, repeat: Infinity }}
        style={{ width: 5, height: 5, borderRadius: '50%', background: '#38b8d8', flexShrink: 0 }} />
      NEXUS·AI
    </button>
  )
}

// ─── Clock ────────────────────────────────────────────────────
function SystemClock() {
  const { systemTime, tickClock } = useNexusStore()
  useEffect(() => { const t = setInterval(tickClock, 1000); return () => clearInterval(t) }, [tickClock])
  const d    = new Date(systemTime)
  const time = d.toLocaleTimeString('en-US', { hour12: false })
  const date = d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
  return (
    <div style={{ textAlign: 'right', lineHeight: 1.65 }}>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8,  color: '#60b8d8', letterSpacing: '0.1em' }}>SYS.CLOCK</div>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#38b8d8', fontWeight: 700 }}>{time}</div>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8,  color: '#60b8d8' }}>{date}</div>
    </div>
  )
}

// ─── Audio toggle ─────────────────────────────────────────────
function AudioToggle() {
  const { audioEnabled } = useNexusStore()
  const on = audioEnabled
  return (
    <button onClick={toggleAudio} data-cursor="hover"
      title={on ? 'Mute' : 'Enable Audio'}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
        background: on ? 'rgba(201,168,76,0.12)' : 'rgba(231,76,60,0.1)',
        border: `1.5px solid ${on ? 'rgba(201,168,76,0.7)' : 'rgba(231,76,60,0.6)'}`,
        padding: '5px 10px', cursor: 'none', minWidth: 46,
      }}>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: on ? '#e8c96a' : '#e74c3c', letterSpacing: '0.12em' }}>AUDIO</div>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
        {on ? <>
          <path d="M1 4h3l4-3v10l-4-3H1V4z" stroke="#c9a84c" strokeWidth="1" fill="rgba(201,168,76,0.25)" />
          <path d="M11 2.5c1.2 1.2 1.8 2.8 1.8 4.5s-.6 3.3-1.8 4.5" stroke="#c9a84c" strokeWidth="1" strokeLinecap="round" />
        </> : <>
          <path d="M1 4h3l4-3v10l-4-3H1V4z" stroke="#e74c3c" strokeWidth="1" fill="none" />
          <path d="M11 3l4 6m0-6l-4 6" stroke="#e74c3c" strokeWidth="1" strokeLinecap="round" />
        </>}
      </svg>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: on ? '#e8c96a' : '#e74c3c', fontWeight: 700 }}>{on ? 'ON' : 'OFF'}</div>
    </button>
  )
}

// ─── Bottom left ──────────────────────────────────────────────
function BottomLeft() {
  const { cursorPos, sessionId } = useNexusStore()
  const nx = ((cursorPos.x / (window.innerWidth  || 1)) * 100).toFixed(1)
  const ny = ((cursorPos.y / (window.innerHeight || 1)) * 100).toFixed(1)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9 }}>
        <span style={{ color: '#60b8d8' }}>X:</span>
        <span style={{ color: '#38b8d8', marginLeft: 3, fontWeight: 700 }}>{nx}%</span>
        <span style={{ color: '#60b8d8', marginLeft: 8 }}>Y:</span>
        <span style={{ color: '#38b8d8', marginLeft: 3, fontWeight: 700 }}>{ny}%</span>
      </div>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: '#60b8d8' }}>
        SID·<span style={{ color: '#38b8d8', fontWeight: 700 }}>{sessionId}</span>
      </div>
    </div>
  )
}

// ─── Fragment counter ─────────────────────────────────────────
function FragmentStatus() {
  const { collectedFragments, totalFragments } = useNexusStore()
  const collected = collectedFragments.length
  const pct = Math.min(Math.round((collected / totalFragments) * 100), 100)

  return (
    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9 }}>
      <div style={{ color: '#e8c96a', marginBottom: 5, fontSize: 8, fontWeight: 700, letterSpacing: '0.1em' }}>
        MEMORY FRAGMENTS
      </div>
      {/* Bar and count on separate lines to prevent overlap */}
      <div style={{ width: 80, height: 3, background: 'rgba(201,168,76,0.25)', borderRadius: 2, marginBottom: 4 }}>
        <div style={{
          width: `${pct}%`, height: '100%',
          background: 'linear-gradient(90deg,#a07830,#e8c96a)',
          borderRadius: 2,
          transition: 'width 0.5s',
        }} />
      </div>
      <div style={{ color: '#e8c96a', fontSize: 10, fontWeight: 700 }}>
        {collected}/{totalFragments}
      </div>
    </div>
  )
}

// ─── Side data panel ──────────────────────────────────────────
function DataPanel({ side }) {
  const { collectedFragments, totalFragments, sessionId } = useNexusStore()
  const isLeft = side === 'left'
  const items = isLeft ? [
    { label: 'STATION', value: 'NEXUS-7G',  color: '#e8c96a' },
    { label: 'STATUS',  value: 'NOMINAL',   color: '#60d8a0' },
    { label: 'MODULES', value: '09 / 09',   color: '#e8c96a' },
    { label: 'SESSION', value: sessionId,   color: '#38b8d8' },
  ] : [
    { label: 'FRAGMENTS', value: `${collectedFragments.length} / ${totalFragments}`, color: '#e8c96a' },
    { label: 'ENGINEER',  value: 'PURNAGYA', color: '#ffffff' },
    { label: 'VERSION',   value: 'v4.2.1',   color: '#e8c96a' },
    { label: 'UPTIME',    value: '99.8%',    color: '#60d8a0' },
  ]
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -16 : 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.6 }}
      style={{
        position: 'fixed', [isLeft ? 'left' : 'right']: 14,
        top: '50%', transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', gap: 10,
        padding: '14px 13px',
        background: 'rgba(2,5,14,0.9)',
        border: '1px solid rgba(56,184,216,0.3)',
        backdropFilter: 'blur(14px)',
        width: 126, zIndex: 25, pointerEvents: 'none',
      }}>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: '#38b8d8', letterSpacing: '0.18em', fontWeight: 700, borderBottom: '1px solid rgba(56,184,216,0.25)', paddingBottom: 6 }}>
        {isLeft ? '◂ SYS.STATUS' : 'CAPTAIN.LOG ▸'}
      </div>
      {items.map(item => (
        <div key={item.label}>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 7.5, color: '#5ab4d4', letterSpacing: '0.1em', marginBottom: 2 }}>{item.label}</div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: item.color, fontWeight: 700 }}>{item.value}</div>
        </div>
      ))}
      <motion.div animate={{ opacity: [0.4,1,0.4] }} transition={{ duration: 2, repeat: Infinity }}
        style={{ width: 5, height: 5, borderRadius: '50%', background: '#60d8a0', boxShadow: '0 0 6px #60d8a0', alignSelf: isLeft ? 'flex-start' : 'flex-end' }} />
    </motion.div>
  )
}

// ─── Main HUD ─────────────────────────────────────────────────
export default function HUDOverlay({ visible = true }) {
  const { phase, currentModule } = useNexusStore()
  const [contactOpen, setContactOpen] = useState(false)
  if (!visible || phase === 'entry') return null

  // Side panels only visible on hub (no module open)
  const showPanels = currentModule === null

  return (
    <>
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 200 }}>

      {/* ── Top-left: logo ── */}
      <div style={{
        position: 'absolute', top: 14, left: 16,
        display: 'flex', alignItems: 'center', gap: 10,
        pointerEvents: 'all',
        background: 'rgba(2,5,14,0.75)',
        border: '1px solid rgba(201,168,76,0.3)',
        padding: '6px 12px',
        backdropFilter: 'blur(12px)',
      }}>
        <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="12" stroke="#c9a84c" strokeWidth="1.2"/>
          <circle cx="14" cy="14" r="6"  stroke="#38b8d8" strokeWidth="1"/>
          <circle cx="14" cy="14" r="2.5" fill="#c9a84c"/>
        </svg>
        <div>
          <div style={{ fontFamily: 'Orbitron', fontSize: 11, color: '#e8c96a', letterSpacing: '0.25em', fontWeight: 700 }}>NEXUS</div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 7, color: '#38b8d8', letterSpacing: '0.1em' }}>STATION·OS</div>
        </div>
      </div>

      {/* ── Top-right: ALL controls in one pill ── */}
      <div style={{
        position: 'absolute', top: 14, right: 16,
        display: 'flex', alignItems: 'stretch', gap: 6,
        pointerEvents: 'all',
        background: 'rgba(2,5,14,0.82)',
        border: '1px solid rgba(56,184,216,0.3)',
        padding: '8px 10px',
        backdropFilter: 'blur(14px)',
      }}>
        <ProfileButton />
        <div style={{ width: 1, background: 'rgba(56,184,216,0.2)', alignSelf: 'stretch' }} />
        <NexusAIButton />
        <div style={{ width: 1, background: 'rgba(56,184,216,0.2)', alignSelf: 'stretch' }} />
        {/* Contact button */}
        <button
          onClick={() => { SFX.click(); setContactOpen(o => !o) }}
          data-cursor="hover"
          title="Open Channel — Contact"
          style={{
            fontFamily: 'JetBrains Mono', fontSize: 9,
            letterSpacing: '0.12em',
            color: contactOpen ? '#ffe080' : '#c9a84c',
            background: contactOpen ? 'rgba(201,168,76,0.18)' : 'rgba(201,168,76,0.08)',
            border: `1.5px solid ${contactOpen ? '#c9a84c' : 'rgba(201,168,76,0.5)'}`,
            padding: '5px 11px', cursor: 'none',
            display: 'flex', alignItems: 'center', gap: 6,
            whiteSpace: 'nowrap',
            boxShadow: contactOpen ? '0 0 14px rgba(201,168,76,0.25)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          <span>✉</span> CONTACT
        </button>
        <div style={{ width: 1, background: 'rgba(56,184,216,0.2)', alignSelf: 'stretch' }} />
        <SystemClock />
        <div style={{ width: 1, background: 'rgba(56,184,216,0.2)', alignSelf: 'stretch' }} />
        <AudioToggle />
      </div>

      {/* ── Side data panels — hub only ── */}
      {showPanels && <DataPanel side="left"  />}
      {showPanels && <DataPanel side="right" />}

      {/* ── Bottom-left ── */}
      <div style={{ position: 'absolute', bottom: 14, left: 16, pointerEvents: 'none' }}>
        <BottomLeft />
      </div>

      {/* ── Bottom-right ── */}
      <div style={{ position: 'absolute', bottom: 14, right: 16, pointerEvents: 'all' }}>
        <FragmentStatus />
      </div>

      {/* ── Corner lines ── */}
      <svg style={{ position: 'absolute', top: 0, left: 0 }} width="60" height="60" viewBox="0 0 60 60" fill="none">
        <path d="M0 30 L0 0 L30 0" stroke="rgba(56,184,216,0.3)" strokeWidth="1"/>
        <path d="M0 14 L0 0 L14 0" stroke="rgba(56,184,216,0.55)" strokeWidth="1"/>
      </svg>
      <svg style={{ position: 'absolute', top: 0, right: 0 }} width="60" height="60" viewBox="0 0 60 60" fill="none">
        <path d="M60 30 L60 0 L30 0" stroke="rgba(56,184,216,0.3)" strokeWidth="1"/>
        <path d="M60 14 L60 0 L46 0" stroke="rgba(56,184,216,0.55)" strokeWidth="1"/>
      </svg>
      <svg style={{ position: 'absolute', bottom: 0, left: 0 }} width="60" height="60" viewBox="0 0 60 60" fill="none">
        <path d="M0 30 L0 60 L30 60" stroke="rgba(201,168,76,0.3)" strokeWidth="1"/>
        <path d="M0 46 L0 60 L14 60" stroke="rgba(201,168,76,0.55)" strokeWidth="1"/>
      </svg>
      <svg style={{ position: 'absolute', bottom: 0, right: 0 }} width="60" height="60" viewBox="0 0 60 60" fill="none">
        <path d="M60 30 L60 60 L30 60" stroke="rgba(201,168,76,0.3)" strokeWidth="1"/>
        <path d="M60 46 L60 60 L46 60" stroke="rgba(201,168,76,0.55)" strokeWidth="1"/>
      </svg>

      {/* ── Scan line ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(56,184,216,0.5), transparent)',
        animation: 'scanline 12s linear infinite',
      }} />
    </div>

    {/* ── Contact overlay — outside pointerEvents:none wrapper ── */}
    <ContactOverlay open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  )
}
