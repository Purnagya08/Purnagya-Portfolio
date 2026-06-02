import { useEffect, useRef, useCallback } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useNexusStore } from '../../store/nexusStore'
import { SFX } from '../../audio/audioEngine'

// ─── Trail Dot ────────────────────────────────────────────────
function TrailDot({ x, y, index, total }) {
  const age = index / total
  const size = 3 + (1 - age) * 5

  return (
    <div
      style={{
        position: 'fixed',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: '50%',
        background: `rgba(56, 184, 216, ${(1 - age) * 0.5})`,
        pointerEvents: 'none',
        zIndex: 9994,
        transform: 'translate(0, 0)',
      }}
    />
  )
}

// ─── Main Cursor ──────────────────────────────────────────────
export default function NexusCursor() {
  const { cursorVariant, cursorTrail } = useNexusStore()
  const setCursorPos = useNexusStore(s => s.setCursorPos)
  const setCursorVariant = useNexusStore(s => s.setCursorVariant)
  const addCursorTrail = useNexusStore(s => s.addCursorTrail)

  const rawX = useMotionValue(-100)
  const rawY = useMotionValue(-100)

  // Main cursor spring (fast)
  const springConfig = { stiffness: 500, damping: 30, mass: 0.5 }
  const x = useSpring(rawX, springConfig)
  const y = useSpring(rawY, springConfig)

  // Ring lags behind (slower spring)
  const ringConfig = { stiffness: 150, damping: 18, mass: 1 }
  const ringX = useSpring(rawX, ringConfig)
  const ringY = useSpring(rawY, ringConfig)

  const trailTimer = useRef(null)
  const lastPos = useRef({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e) => {
    const pos = { x: e.clientX, y: e.clientY }
    rawX.set(pos.x)
    rawY.set(pos.y)
    setCursorPos(pos)

    // Throttle trail addition
    const dx = pos.x - lastPos.current.x
    const dy = pos.y - lastPos.current.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist > 8) {
      addCursorTrail(pos)
      lastPos.current = pos
    }
  }, [rawX, rawY, setCursorPos, addCursorTrail])

  const handleMouseDown = useCallback(() => {
    setCursorVariant('click')
    SFX.click()
  }, [setCursorVariant])

  const handleMouseUp = useCallback(() => {
    setCursorVariant('default')
  }, [setCursorVariant])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    // Detect hoverable elements
    const onEnter = (e) => {
      const el = e.target
      if (el.closest('button, a, [data-cursor="hover"]')) {
        setCursorVariant('hover')
      } else if (el.closest('[data-cursor="portal"]')) {
        setCursorVariant('portal')
      } else if (el.closest('[data-cursor="text"]')) {
        setCursorVariant('text')
      }
    }
    const onLeave = () => setCursorVariant('default')

    window.addEventListener('mouseover', onEnter)
    window.addEventListener('mouseout', onLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mouseover', onEnter)
      window.removeEventListener('mouseout', onLeave)
    }
  }, [handleMouseMove, handleMouseDown, handleMouseUp, setCursorVariant])

  // Cursor state styles
  const isHover  = cursorVariant === 'hover'
  const isClick  = cursorVariant === 'click'
  const isPortal = cursorVariant === 'portal'

  const dotSize     = isClick ? 6 : 8
  const ringSize    = isHover ? 48 : isPortal ? 64 : 32
  const ringOpacity = isHover ? 0.9 : isPortal ? 1 : 0.5
  const ringColor   = isPortal ? '#c9a84c' : '#38b8d8'

  return (
    <>
      {/* Trail */}
      {cursorTrail.map((pt, i) => (
        <TrailDot key={i} x={pt.x} y={pt.y} index={i} total={cursorTrail.length} />
      ))}

      {/* Outer ring (lagging) */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0, left: 0,
          x: ringX,
          y: ringY,
          translateX: `-${ringSize / 2}px`,
          translateY: `-${ringSize / 2}px`,
          width: ringSize,
          height: ringSize,
          borderRadius: '50%',
          border: `1px solid ${ringColor}`,
          opacity: ringOpacity,
          pointerEvents: 'none',
          zIndex: 9995,
          transition: 'width 0.2s, height 0.2s, border-color 0.2s, opacity 0.2s',
        }}
        animate={{
          rotate: isPortal ? 360 : 0,
        }}
        transition={{ rotate: { duration: 2, repeat: Infinity, ease: 'linear' } }}
      >
        {/* Tick marks on ring */}
        {[0, 90, 180, 270].map(angle => (
          <div
            key={angle}
            style={{
              position: 'absolute',
              width: 4,
              height: 1,
              background: ringColor,
              top: '50%',
              left: angle === 90 ? '100%' : angle === 270 ? '-4px' : '50%',
              transform: angle === 0
                ? 'translateX(-50%) translateY(-50%) translateY(-15px)'
                : angle === 180
                ? 'translateX(-50%) translateY(-50%) translateY(15px)'
                : 'translateY(-50%)',
              opacity: 0.8,
            }}
          />
        ))}
      </motion.div>

      {/* Inner crosshair dot */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0, left: 0,
          x,
          y,
          translateX: `-${dotSize / 2}px`,
          translateY: `-${dotSize / 2}px`,
          width: dotSize,
          height: dotSize,
          borderRadius: isPortal ? '0%' : '50%',
          background: isHover
            ? 'rgba(201, 168, 76, 0.9)'
            : isPortal
            ? '#c9a84c'
            : 'rgba(56, 184, 216, 0.9)',
          pointerEvents: 'none',
          zIndex: 9999,
          boxShadow: isHover
            ? '0 0 10px rgba(201,168,76,0.8)'
            : '0 0 10px rgba(56,184,216,0.8)',
          transition: 'width 0.1s, height 0.1s, background 0.2s, border-radius 0.2s',
        }}
      />

      {/* Crosshair lines (appear on hover) */}
      {(isHover || isPortal) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0, left: 0,
            x,
            y,
            translateX: '-50%',
            translateY: '-50%',
            pointerEvents: 'none',
            zIndex: 9995,
          }}
        >
          {/* Horizontal line */}
          <div style={{
            position: 'absolute',
            width: 24,
            height: 1,
            background: ringColor,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.6,
          }} />
          {/* Vertical line */}
          <div style={{
            position: 'absolute',
            width: 1,
            height: 24,
            background: ringColor,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.6,
          }} />
        </motion.div>
      )}
    </>
  )
}
