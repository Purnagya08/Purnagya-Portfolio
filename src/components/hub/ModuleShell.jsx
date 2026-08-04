import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useNexusStore } from '../../store/nexusStore'
import { SFX } from '../../audio/audioEngine'
import { getModule } from '../../data/modules'

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return mobile
}

export default function ModuleShell({ children }) {
  const { currentModule, navigateTo, triggerWarp } = useNexusStore()
  const module    = getModule(currentModule)
  const scrollRef = useRef()
  const mobile    = useIsMobile()

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [currentModule])

  if (!module) return null

  function handleBack() {
    SFX.warp()
    triggerWarp()
    setTimeout(() => navigateTo(null), 400)
  }

  // Desktop: offset right by 240px for NavMenu sidebar
  // Mobile:  full width, no offset
  const leftOffset = mobile ? 0 : 240

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      style={{ position: 'fixed', inset: 0, zIndex: 50 }}
    >
      {/* Dark overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(2,4,12,0.82)',
        backdropFilter: 'blur(2px)',
        pointerEvents: 'none',
      }} />

      {/* Scrollable content — offset for sidebar on desktop */}
      <div
        ref={scrollRef}
        style={{
          position: 'absolute',
          top: 0, right: 0, bottom: 0,
          left: leftOffset,
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
          padding: mobile ? '10px 14px' : '10px 24px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          {/* Back button */}
          <button
            onClick={handleBack}
            data-cursor="hover"
            style={{
              fontFamily: 'JetBrains Mono', fontSize: 10,
              color: 'rgba(56,184,216,0.7)',
              background: 'none', border: 'none',
              letterSpacing: '0.15em', cursor: 'none',
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '4px 0', flexShrink: 0,
              transition: 'color 0.2s',
            }}
          >
            ◂ HUB
          </button>

          <div style={{ width: 1, height: 18, background: 'rgba(56,184,216,0.12)', flexShrink: 0 }} />

          {/* Module code */}
          <div style={{
            fontFamily: 'JetBrains Mono', fontSize: 8,
            color: `${module.color}90`, letterSpacing: '0.2em', flexShrink: 0,
          }}>
            {module.code}
          </div>

          {/* Module name */}
          <div style={{
            fontFamily: 'Orbitron', fontSize: mobile ? 9 : 11, fontWeight: 600,
            letterSpacing: '0.12em', color: module.color,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {module.label.toUpperCase()}
          </div>

          {/* Status dot */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 5, height: 5, borderRadius: '50%', background: module.color, boxShadow: `0 0 8px ${module.color}` }}
            />
            {!mobile && (
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: `${module.color}95`, letterSpacing: '0.15em' }}>
                ACTIVE
              </span>
            )}
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
