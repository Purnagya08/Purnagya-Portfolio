import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNexusStore } from '../../store/nexusStore'
import ModulePortal from './ModulePortal'
import { MODULES } from '../../data/modules'

// ─── SVG connection lines ─────────────────────────────────────
function ConnectionLines() {
  const cellW = 150, cellH = 150
  const getPos = (col, row) => ({
    x: col * cellW + cellW / 2,
    y: row * cellH + cellH / 2,
  })
  const cx = getPos(1, 1)
  const nonCenter = MODULES.filter(m => !m.isCenter)

  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
      {nonCenter.map((m, i) => {
        const to = getPos(m.col, m.row)
        return (
          <motion.line
            key={m.id}
            x1={cx.x} y1={cx.y} x2={to.x} y2={to.y}
            stroke={m.color + '30'}
            strokeWidth={1}
            strokeDasharray="4 8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
          />
        )
      })}
    </svg>
  )
}

// ─── Side data panel — fixed to viewport edges, NOT inside grid container ──
function DataPanel({ side }) {
  const { collectedFragments, totalFragments, sessionId } = useNexusStore()
  const isLeft = side === 'left'

  const items = isLeft ? [
    { label: 'STATION', value: 'NEXUS-7G',  bright: false },
    { label: 'STATUS',  value: 'NOMINAL',   bright: true  },
    { label: 'MODULES', value: '09 / 09',   bright: false },
    { label: 'SESSION', value: sessionId,   bright: false },
  ] : [
    { label: 'FRAGMENTS', value: `${collectedFragments.length} / ${totalFragments}`, bright: false },
    { label: 'ENGINEER',  value: 'PURNAGYA', bright: true  },
    { label: 'VERSION',   value: 'v4.2.1',   bright: false },
    { label: 'UPTIME',    value: '99.8%',    bright: false },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -16 : 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.6 }}
      style={{
        position: 'fixed',
        [isLeft ? 'left' : 'right']: 16,
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: '16px 14px',
        background: 'rgba(6,9,20,0.82)',
        border: '1px solid rgba(56,184,216,0.14)',
        backdropFilter: 'blur(10px)',
        width: 128,
        zIndex: 25,
        pointerEvents: 'none',
      }}
    >
      {/* Title */}
      <div style={{
        fontFamily: 'JetBrains Mono', fontSize: 8,
        color: 'rgba(56,184,216,0.75)',
        letterSpacing: '0.18em',
        borderBottom: '1px solid rgba(56,184,216,0.12)',
        paddingBottom: 7,
      }}>
        {isLeft ? '◂ SYS.STATUS' : 'CAPTAIN.LOG ▸'}
      </div>

      {items.map(item => (
        <div key={item.label}>
          <div style={{
            fontFamily: 'JetBrains Mono', fontSize: 7.5,
            color: 'rgba(56,184,216,0.75)',
            letterSpacing: '0.12em', marginBottom: 2,
          }}>
            {item.label}
          </div>
          <div style={{
            fontFamily: 'JetBrains Mono', fontSize: 10,
            color: item.label === 'STATUS'   ? '#60d8a0'
                 : item.label === 'ENGINEER' ? '#e8c96a'
                 : '#c9a84c',
            fontWeight: 600,
            letterSpacing: '0.04em',
          }}>
            {item.value}
          </div>
        </div>
      ))}

      {/* Blip */}
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          width: 5, height: 5, borderRadius: '50%',
          background: '#60d8a0', boxShadow: '0 0 6px #60d8a0',
          alignSelf: isLeft ? 'flex-start' : 'flex-end',
          marginTop: 2,
        }}
      />
    </motion.div>
  )
}

// ─── Top header ───────────────────────────────────────────────
function HubHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.7 }}
      style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 14, padding: '18px 0 0',
        pointerEvents: 'none',
      }}
    >
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(56,184,216,0.22))' }} />
      <div style={{
        fontFamily: 'Orbitron', fontSize: 10,
        fontWeight: 600, letterSpacing: '0.38em',
        color: 'rgba(201,168,76,0.8)',
      }}>
        CENTRAL COMMAND HUB
      </div>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(56,184,216,0.22), transparent)' }} />
    </motion.div>
  )
}

// ─── Bottom data stream ───────────────────────────────────────
function HubFooter() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 130)
    return () => clearInterval(t)
  }, [])
  const chars = '01アイウエカキクケサシスタチツナニヌネ'
  const stream = Array.from({ length: 36 }, (_, i) =>
    chars[Math.floor((tick + i * 7) % chars.length)]
  ).join(' ')

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 20, padding: '0 0 14px',
        pointerEvents: 'none',
      }}
    >
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(56,184,216,0.75)', overflow: 'hidden', maxWidth: 260, whiteSpace: 'nowrap' }}>{stream}</div>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(201,168,76,0.80)', letterSpacing: '0.15em', whiteSpace: 'nowrap' }}>◈ SELECT A MODULE TO BEGIN ◈</div>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(56,184,216,0.75)', overflow: 'hidden', maxWidth: 260, whiteSpace: 'nowrap' }}>{stream}</div>
    </motion.div>
  )
}

// ─── Main Hub ─────────────────────────────────────────────────
export default function CentralCommandHub({ onModuleEnter }) {
  const cellW = 150, cellH = 150
  const cols = 3,   rows  = 3
  const gridW = cols * cellW
  const gridH = rows * cellH

  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 20,
      pointerEvents: 'none',
    }}>
      <HubHeader />

      {/* Side panels — fixed to viewport, independent of grid */}
      <DataPanel side="left" />
      <DataPanel side="right" />

      {/* Grid only — no extra wrapper width */}
      <div style={{
        position: 'relative',
        width: gridW,
        height: gridH,
        pointerEvents: 'all',
      }}>
        <ConnectionLines />

        {MODULES.map((module, i) => (
          <div
            key={module.id}
            style={{
              position: 'absolute',
              left: module.col * cellW + (cellW - (module.isCenter ? 160 : 130)) / 2,
              top:  module.row * cellH + (cellH - (module.isCenter ? 160 : 130)) / 2,
            }}
          >
            <ModulePortal
              module={module}
              index={i}
              onEnter={onModuleEnter}
            />
          </div>
        ))}
      </div>

      <HubFooter />
    </div>
  )
}
