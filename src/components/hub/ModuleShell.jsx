import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNexusStore } from '../../store/nexusStore'
import { SFX } from '../../audio/audioEngine'
import { getModule } from '../../data/modules'

export default function ModuleShell({ children }) {
  const { currentModule, navigateTo, triggerWarp } = useNexusStore()
  const module = getModule(currentModule)
  const scrollRef = useRef()

  // Reset scroll position when module changes
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [currentModule])

  if (!module) return null

  function handleBack() {
    SFX.warp()
    triggerWarp()
    setTimeout(() => navigateTo(null), 400)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      style={{ position: 'fixed', inset: 0, zIndex: 50 }}
    >
      {/* Dark overlay behind content (space still bleeds through slightly) */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(2,4,12,0.82)',
        backdropFilter: 'blur(2px)',
        pointerEvents: 'none',
      }} />

      {/* Scrollable content area */}
      <div
        ref={scrollRef}
        style={{
          position: 'absolute', inset: 0,
          overflowY: 'auto', overflowX: 'hidden',
          scrollbarWidth: 'none',
        }}
      >
        {/* Sticky header */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 60,
          background: 'rgba(4,6,15,0.94)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${module.color}20`,
          padding: '10px 24px',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          {/* Back */}
          <button
            onClick={handleBack}
            data-cursor="hover"
            style={{
              fontFamily: 'JetBrains Mono', fontSize: 10,
              color: 'rgba(56,184,216,0.7)',
              background: 'none', border: 'none',
              letterSpacing: '0.15em', cursor: 'none',
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '4px 0', flexShrink: 0,
              transition: 'color 0.2s',
            }}
          >
            ◂ HUB
          </button>

          <div style={{ width: 1, height: 18, background: 'rgba(56,184,216,0.12)', flexShrink: 0 }} />

          {/* Breadcrumb */}
          <div style={{
            fontFamily: 'JetBrains Mono', fontSize: 8,
            color: `${module.color}55`, letterSpacing: '0.2em', flexShrink: 0,
          }}>
            {module.code}
          </div>

          <div style={{
            fontFamily: 'Orbitron', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.18em', color: module.color,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {module.label.toUpperCase()}
          </div>

          {/* Right side status */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: 5, height: 5, borderRadius: '50%',
                background: module.color,
                boxShadow: `0 0 8px ${module.color}`,
              }}
            />
            <span style={{
              fontFamily: 'JetBrains Mono', fontSize: 8,
              color: `${module.color}70`, letterSpacing: '0.15em',
            }}>
              ACTIVE
            </span>
          </div>
        </div>

        {/* Module content */}
        <div style={{ position: 'relative', minHeight: 'calc(100vh - 48px)' }}>
          {children}
        </div>
      </div>
    </motion.div>
  )
}
