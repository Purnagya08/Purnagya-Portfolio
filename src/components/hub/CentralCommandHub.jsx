import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNexusStore } from '../../store/nexusStore'
import ModulePortal from './ModulePortal'
import { MODULES } from '../../data/modules'

// ─── Mobile detection hook ────────────────────────────────────
function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return mobile
}

// ─── SVG connection lines (desktop only) ─────────────────────
function ConnectionLines() {
  const cellW = 150, cellH = 150
  const getPos = (col, row) => ({ x: col * cellW + cellW / 2, y: row * cellH + cellH / 2 })
  const cx = getPos(1, 1)
  const nonCenter = MODULES.filter(m => !m.isCenter)
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
      {nonCenter.map((m, i) => {
        const to = getPos(m.col, m.row)
        return (
          <motion.line key={m.id} x1={cx.x} y1={cx.y} x2={to.x} y2={to.y}
            stroke={m.color + '30'} strokeWidth={1} strokeDasharray="4 8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }} />
        )
      })}
    </svg>
  )
}

// ─── Desktop: hex grid ────────────────────────────────────────
function DesktopHub() {
  const cellW = 150, cellH = 150
  const cols = 3, rows = 3
  const gridW = cols * cellW
  const gridH = rows * cellH

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, pointerEvents: 'none' }}>
      <HubHeader />
      <DataPanel side="left" />
      <DataPanel side="right" />
      <div style={{ position: 'relative', width: gridW, height: gridH, pointerEvents: 'all' }}>
        <ConnectionLines />
        {MODULES.map((module, i) => (
          <div key={module.id} style={{
            position: 'absolute',
            left: module.col * cellW + (cellW - (module.isCenter ? 160 : 130)) / 2,
            top:  module.row * cellH + (cellH - (module.isCenter ? 160 : 130)) / 2,
          }}>
            <ModulePortal module={module} index={i} />
          </div>
        ))}
      </div>
      <HubFooter />
    </div>
  )
}

// ─── Mobile: vertical scrollable list ────────────────────────
function MobileHub() {
  const { navigateTo, triggerWarp } = useNexusStore()
  const navModules = MODULES.filter(m => !m.isCenter)

  function handleTap(id) {
    triggerWarp()
    setTimeout(() => navigateTo(id), 400)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 20,
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto', overflowX: 'hidden',
      scrollbarWidth: 'none',
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ textAlign: 'center', padding: '72px 20px 20px', flexShrink: 0 }}
      >
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, letterSpacing: '0.35em', color: 'rgba(201,168,76,0.65)', marginBottom: 6 }}>
          ◈ CENTRAL COMMAND HUB ◈
        </div>
        <div style={{ fontFamily: 'Orbitron', fontSize: 22, fontWeight: 800, color: '#c9a84c', textShadow: '0 0 30px rgba(201,168,76,0.35)', letterSpacing: '0.12em' }}>
          NEXUS
        </div>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(56,184,216,0.5)', letterSpacing: '0.2em', marginTop: 4 }}>
          SELECT A MODULE
        </div>
      </motion.div>

      {/* Module list */}
      <div style={{ flex: 1, padding: '0 14px 80px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {navModules.map((m, i) => (
          <motion.button
            key={m.id}
            onClick={() => handleTap(m.id)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
            style={{
              width: '100%', background: 'rgba(8,11,24,0.8)',
              border: `1px solid ${m.color}22`,
              borderLeft: `3px solid ${m.color}80`,
              padding: '14px 16px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 14,
              backdropFilter: 'blur(8px)',
              textAlign: 'left',
            }}
          >
            <div style={{ fontSize: 20, flexShrink: 0 }}>{m.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'Orbitron', fontSize: 11, fontWeight: 600, color: m.color, letterSpacing: '0.05em', marginBottom: 2 }}>
                {m.shortLabel}
              </div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: 11, color: 'rgba(216,228,240,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {m.description}
              </div>
            </div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: `${m.color}60`, flexShrink: 0 }}>
              {m.code} ›
            </div>
          </motion.button>
        ))}
      </div>

      {/* Bottom fade */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(transparent, rgba(2,4,12,0.9))', pointerEvents: 'none' }} />
    </div>
  )
}

// ─── Header / Footer / DataPanel stubs (desktop) ─────────────
function HubHeader() {
  return (
    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '18px 0 0', pointerEvents: 'none' }}>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(56,184,216,0.22))' }} />
      <div style={{ fontFamily: 'Orbitron', fontSize: 10, fontWeight: 600, letterSpacing: '0.38em', color: 'rgba(201,168,76,0.8)' }}>CENTRAL COMMAND HUB</div>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(56,184,216,0.22), transparent)' }} />
    </motion.div>
  )
}

function HubFooter() {
  const [tick, setTick] = useState(0)
  useEffect(() => { const t = setInterval(() => setTick(n => n + 1), 130); return () => clearInterval(t) }, [])
  const chars = '01アイウエカキクケサシスタチツナニヌネ'
  const stream = Array.from({ length: 36 }, (_, i) => chars[Math.floor((tick + i * 7) % chars.length)]).join(' ')
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }}
      style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '0 0 14px', pointerEvents: 'none' }}>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(56,184,216,0.13)', overflow: 'hidden', maxWidth: 260, whiteSpace: 'nowrap' }}>{stream}</div>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(201,168,76,0.45)', letterSpacing: '0.15em', whiteSpace: 'nowrap' }}>◈ SELECT A MODULE TO BEGIN ◈</div>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(56,184,216,0.13)', overflow: 'hidden', maxWidth: 260, whiteSpace: 'nowrap' }}>{stream}</div>
    </motion.div>
  )
}

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
    <motion.div initial={{ opacity: 0, x: isLeft ? -16 : 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1, duration: 0.6 }}
      style={{ position: 'fixed', [isLeft ? 'left' : 'right']: 14, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 10, padding: '14px 13px', background: 'rgba(2,5,14,0.9)', border: '1px solid rgba(56,184,216,0.3)', backdropFilter: 'blur(14px)', width: 126, zIndex: 25, pointerEvents: 'none' }}>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: '#38b8d8', letterSpacing: '0.18em', fontWeight: 700, borderBottom: '1px solid rgba(56,184,216,0.25)', paddingBottom: 6 }}>{isLeft ? '◂ SYS.STATUS' : 'CAPTAIN.LOG ▸'}</div>
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

// ─── Main export ──────────────────────────────────────────────
export default function CentralCommandHub() {
  const mobile = useIsMobile()
  return mobile ? <MobileHub /> : <DesktopHub />
}
