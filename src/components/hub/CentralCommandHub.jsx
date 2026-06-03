import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNexusStore } from '../../store/nexusStore'
import ModulePortal from './ModulePortal'
import { MODULES } from '../../data/modules'

// ─── SVG connection lines between hexes ──────────────────────
function ConnectionLines({ hovered }) {
  // Lines from center (col1,row1) to each surrounding module
  const center = { x: 1, y: 1 }
  const cellW = 150, cellH = 150
  const padX = 0, padY = 0

  const getPos = (col, row) => ({
    x: padX + col * cellW + cellW / 2,
    y: padY + row * cellH + cellH / 2,
  })

  const cx = getPos(center.x, center.y)

  const nonCenter = MODULES.filter(m => !m.isCenter)

  return (
    <svg
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', overflow: 'visible',
      }}
    >
      <defs>
        <linearGradient id="lineGold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(201,168,76,0)" />
          <stop offset="50%" stopColor="rgba(201,168,76,0.3)" />
          <stop offset="100%" stopColor="rgba(201,168,76,0)" />
        </linearGradient>
        <linearGradient id="lineCyan" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(56,184,216,0)" />
          <stop offset="50%" stopColor="rgba(56,184,216,0.2)" />
          <stop offset="100%" stopColor="rgba(56,184,216,0)" />
        </linearGradient>
      </defs>
      {nonCenter.map((m, i) => {
        const to = getPos(m.col, m.row)
        return (
          <motion.line
            key={m.id}
            x1={cx.x} y1={cx.y}
            x2={to.x} y2={to.y}
            stroke={m.color + '35'}
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

// ─── Floating data readout panel ──────────────────────────────
function DataPanel({ side }) {
  const { collectedFragments, totalFragments, sessionId } = useNexusStore()
  const isLeft = side === 'left'

  const items = isLeft ? [
    { label: 'STATION',  value: 'NEXUS-7G' },
    { label: 'STATUS',   value: 'NOMINAL' },
    { label: 'MODULES',  value: '09 / 09' },
    { label: 'SESSION',  value: sessionId },
  ] : [
    { label: 'FRAGMENTS', value: `${collectedFragments.length} / ${totalFragments}` },
    { label: 'ENGINEER',  value: 'PURNAGYA' },
    { label: 'VERSION',   value: 'v4.2.1' },
    { label: 'UPTIME',    value: '99.8%' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      style={{
        position: 'absolute',
        [isLeft ? 'left' : 'right']: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: '20px 16px',
        background: 'rgba(8,11,24,0.6)',
        border: '1px solid rgba(56,184,216,0.1)',
        backdropFilter: 'blur(8px)',
        minWidth: 140,
      }}
    >
      {/* Panel title */}
      <div style={{
        fontFamily: 'JetBrains Mono', fontSize: 8,
        color: 'rgba(56,184,216,0.4)',
        letterSpacing: '0.2em',
        borderBottom: '1px solid rgba(56,184,216,0.1)',
        paddingBottom: 8,
      }}>
        {isLeft ? '◂ SYS.STATUS' : 'CAPTAIN.LOG ▸'}
      </div>

      {items.map(item => (
        <div key={item.label}>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(56,184,216,0.35)', letterSpacing: '0.1em' }}>
            {item.label}
          </div>
          <div style={{
            fontFamily: 'JetBrains Mono', fontSize: 10,
            color: item.label === 'STATUS' ? '#60d8a0' : '#c9a84c',
            fontWeight: 500,
          }}>
            {item.value}
          </div>
        </div>
      ))}

      {/* Animated blip */}
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          width: 6, height: 6,
          borderRadius: '50%',
          background: '#60d8a0',
          boxShadow: '0 0 6px #60d8a0',
          alignSelf: isLeft ? 'flex-start' : 'flex-end',
        }}
      />
    </motion.div>
  )
}

// ─── Top header bar ───────────────────────────────────────────
function HubHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.7 }}
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: '20px 0 0',
        pointerEvents: 'none',
      }}
    >
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(56,184,216,0.2))' }} />
      <div style={{
        fontFamily: 'Orbitron', fontSize: 11,
        fontWeight: 600, letterSpacing: '0.4em',
        color: 'rgba(201,168,76,0.7)',
      }}>
        CENTRAL COMMAND HUB
      </div>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(56,184,216,0.2), transparent)' }} />
    </motion.div>
  )
}

// ─── Bottom status bar ────────────────────────────────────────
function HubFooter() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 120)
    return () => clearInterval(t)
  }, [])

  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ'
  const stream = Array.from({ length: 40 }, (_, i) =>
    chars[Math.floor((tick + i * 7) % chars.length)]
  ).join(' ')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        padding: '0 0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        pointerEvents: 'none',
      }}
    >
      <div style={{
        fontFamily: 'JetBrains Mono', fontSize: 8,
        color: 'rgba(56,184,216,0.15)',
        letterSpacing: '0.1em',
        overflow: 'hidden',
        maxWidth: 300,
        whiteSpace: 'nowrap',
      }}>
        {stream}
      </div>
      <div style={{
        fontFamily: 'JetBrains Mono', fontSize: 8,
        color: 'rgba(201,168,76,0.3)',
        letterSpacing: '0.15em',
        whiteSpace: 'nowrap',
      }}>
        ◈ SELECT A MODULE TO BEGIN ◈
      </div>
      <div style={{
        fontFamily: 'JetBrains Mono', fontSize: 8,
        color: 'rgba(56,184,216,0.15)',
        letterSpacing: '0.1em',
        overflow: 'hidden',
        maxWidth: 300,
        whiteSpace: 'nowrap',
      }}>
        {stream}
      </div>
    </motion.div>
  )
}

// ─── Main hub ─────────────────────────────────────────────────
export default function CentralCommandHub({ onModuleEnter }) {
  const cellW = 150
  const cellH = 150
  const cols = 3, rows = 3
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

      {/* Side data panels */}
      <div style={{
        position: 'relative',
        width: gridW + 340,
        height: gridH + 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'all',
      }}>
        <DataPanel side="left"  />
        <DataPanel side="right" />

        {/* The 3×3 hex grid */}
        <div style={{
          position: 'relative',
          width: gridW,
          height: gridH,
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
      </div>

      <HubFooter />
    </div>
  )
}
