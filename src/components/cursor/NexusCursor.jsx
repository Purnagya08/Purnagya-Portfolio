import { useEffect, useRef, useCallback, useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { useNexusStore } from '../../store/nexusStore'
import { SFX } from '../../audio/audioEngine'

// ─── Trail dot ────────────────────────────────────────────────
function TrailDot({ x, y, index, total }) {
  const age  = index / total
  const size = 2 + (1 - age) * 4
  return (
    <div style={{
      position: 'fixed',
      left: x - size / 2, top: y - size / 2,
      width: size, height: size,
      borderRadius: '50%',
      background: `rgba(56,184,216,${(1 - age) * 0.4})`,
      pointerEvents: 'none', zIndex: 9994,
      willChange: 'transform',
    }} />
  )
}

// ─── Click shockwave ──────────────────────────────────────────
function Shockwave({ x, y, id, color }) {
  return (
    <motion.div
      key={id}
      initial={{ width: 0, height: 0, opacity: 0.7, x, y }}
      animate={{ width: 72, height: 72, opacity: 0,  x: x - 36, y: y - 36 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      style={{
        position: 'fixed', borderRadius: '50%',
        border: `1px solid ${color}`,
        pointerEvents: 'none', zIndex: 9993,
        boxShadow: `0 0 8px ${color}50`,
      }}
    />
  )
}

// ─── Main Cursor ──────────────────────────────────────────────
export default function NexusCursor() {
  const { cursorVariant, cursorTrail } = useNexusStore()
  const setCursorPos     = useNexusStore(s => s.setCursorPos)
  const setCursorVariant = useNexusStore(s => s.setCursorVariant)
  const addCursorTrail   = useNexusStore(s => s.addCursorTrail)

  // Raw motion values (no spring — instant)
  const rawX = useMotionValue(-200)
  const rawY = useMotionValue(-200)

  // Main dot — very fast spring
  const x = useSpring(rawX, { stiffness: 900, damping: 40, mass: 0.3 })
  const y = useSpring(rawY, { stiffness: 900, damping: 40, mass: 0.3 })

  // Outer ring — slightly slower
  const ringX = useSpring(rawX, { stiffness: 220, damping: 22, mass: 0.8 })
  const ringY = useSpring(rawY, { stiffness: 220, damping: 22, mass: 0.8 })

  const [shockwaves, setShockwaves] = useState([])
  const shockId  = useRef(0)
  const lastPos  = useRef({ x: 0, y: 0 })
  const rafRef   = useRef(null)
  const pendingPos = useRef(null)

  // ── mousemove → just store, apply in rAF ─────────────────────
  const handleMouseMove = useCallback((e) => {
    pendingPos.current = { x: e.clientX, y: e.clientY }
  }, [])

  // ── rAF loop — smooth, no DOM scan, no store writes per frame ─
  useEffect(() => {
    let lastTrailX = 0, lastTrailY = 0

    function tick() {
      const pos = pendingPos.current
      if (pos) {
        rawX.set(pos.x)
        rawY.set(pos.y)
        setCursorPos(pos)

        const dx = pos.x - lastTrailX
        const dy = pos.y - lastTrailY
        if (dx * dx + dy * dy > 64) {
          addCursorTrail({ x: pos.x, y: pos.y })
          lastTrailX = pos.x
          lastTrailY = pos.y
        }
        pendingPos.current = null
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [rawX, rawY, setCursorPos, addCursorTrail])

  const handleMouseDown = useCallback((e) => {
    setCursorVariant('click')
    SFX.click()
    const id    = shockId.current++
    const color = useNexusStore.getState().cursorVariant === 'portal' ? '#c9a84c' : '#38b8d8'
    setShockwaves(prev => [...prev.slice(-3), { id, x: e.clientX, y: e.clientY, color }])
  }, [setCursorVariant])

  const handleMouseUp = useCallback(() => setCursorVariant('default'), [setCursorVariant])

  useEffect(() => {
    // Variant detection via event delegation — no per-frame DOM scan
    const onEnter = (e) => {
      const el = e.target
      if      (el.closest('[data-cursor="portal"]'))            setCursorVariant('portal')
      else if (el.closest('button, a, [data-cursor="hover"]')) setCursorVariant('hover')
      else if (el.closest('[data-cursor="text"]'))              setCursorVariant('text')
    }
    const onLeave = () => setCursorVariant('default')

    window.addEventListener('mousemove',  handleMouseMove, { passive: true })
    window.addEventListener('mousedown',  handleMouseDown)
    window.addEventListener('mouseup',    handleMouseUp)
    window.addEventListener('mouseover',  onEnter)
    window.addEventListener('mouseout',   onLeave)

    return () => {
      window.removeEventListener('mousemove',  handleMouseMove)
      window.removeEventListener('mousedown',  handleMouseDown)
      window.removeEventListener('mouseup',    handleMouseUp)
      window.removeEventListener('mouseover',  onEnter)
      window.removeEventListener('mouseout',   onLeave)
    }
  }, [handleMouseMove, handleMouseDown, handleMouseUp, setCursorVariant])

  // Clean stale shockwaves
  useEffect(() => {
    if (!shockwaves.length) return
    const t = setTimeout(() => setShockwaves(p => p.slice(1)), 500)
    return () => clearTimeout(t)
  }, [shockwaves])

  const isHover  = cursorVariant === 'hover'
  const isClick  = cursorVariant === 'click'
  const isPortal = cursorVariant === 'portal'

  const dotSize  = isClick ? 5 : 8
  const ringSize = isPortal ? 60 : isHover ? 44 : 30
  const ringColor = isPortal ? '#c9a84c' : '#38b8d8'
  const dotColor  = isHover  ? 'rgba(201,168,76,0.95)'
                  : isPortal ? '#c9a84c'
                  : 'rgba(56,184,216,0.95)'

  return (
    <>
      {/* Trail */}
      {cursorTrail.map((pt, i) => (
        <TrailDot key={i} x={pt.x} y={pt.y} index={i} total={cursorTrail.length} />
      ))}

      {/* Shockwaves */}
      <AnimatePresence>
        {shockwaves.map(sw => <Shockwave key={sw.id} {...sw} />)}
      </AnimatePresence>

      {/* Outer ring */}
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0,
          x: ringX, y: ringY,
          translateX: `-${ringSize / 2}px`,
          translateY: `-${ringSize / 2}px`,
          width: ringSize, height: ringSize,
          borderRadius: '50%',
          border: `1px solid ${ringColor}`,
          opacity: isPortal ? 1 : isHover ? 0.85 : 0.5,
          pointerEvents: 'none', zIndex: 9995,
          transition: 'width 0.15s, height 0.15s, border-color 0.15s, opacity 0.15s',
          willChange: 'transform',
        }}
        animate={{ rotate: isPortal ? 360 : 0 }}
        transition={{ rotate: { duration: 2, repeat: Infinity, ease: 'linear' } }}
      />

      {/* Inner dot */}
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0,
          x, y,
          translateX: `-${dotSize / 2}px`,
          translateY: `-${dotSize / 2}px`,
          width: dotSize, height: dotSize,
          borderRadius: isPortal ? '2px' : '50%',
          background: dotColor,
          pointerEvents: 'none', zIndex: 9999,
          boxShadow: isPortal
            ? '0 0 14px rgba(201,168,76,0.9)'
            : isHover
            ? '0 0 10px rgba(201,168,76,0.8)'
            : '0 0 8px rgba(56,184,216,0.8)',
          transition: 'width 0.1s, height 0.1s, background 0.15s, border-radius 0.15s',
          willChange: 'transform',
        }}
        animate={isClick ? { scale: [1, 1.6, 1] } : {}}
        transition={{ duration: 0.18 }}
      />

      {/* Crosshair on hover/portal */}
      {(isHover || isPortal) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            position: 'fixed', top: 0, left: 0,
            x, y, translateX: '-50%', translateY: '-50%',
            pointerEvents: 'none', zIndex: 9995,
          }}
        >
          <div style={{ position: 'absolute', width: 18, height: 1, background: ringColor, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0.5 }} />
          <div style={{ position: 'absolute', width: 1, height: 18, background: ringColor, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0.5 }} />
        </motion.div>
      )}
    </>
  )
}
