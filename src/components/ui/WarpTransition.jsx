import { motion, AnimatePresence } from 'framer-motion'
import { useNexusStore } from '../../store/nexusStore'

export default function WarpTransition() {
  const { isTransitioning } = useNexusStore()

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key="warp"
          style={{
            position: 'fixed', inset: 0,
            zIndex: 9990,
            pointerEvents: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Radial speed lines */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
            {Array.from({ length: 60 }, (_, i) => {
              const angle = (i / 60) * 360
              const rad = (angle * Math.PI) / 180
              const len = 200 + Math.random() * 600
              const cx = 960, cy = 540
              return (
                <motion.line
                  key={i}
                  x1={cx}
                  y1={cy}
                  x2={cx + Math.cos(rad) * len}
                  y2={cy + Math.sin(rad) * len}
                  stroke={i % 3 === 0 ? 'rgba(201,168,76,0.4)' : 'rgba(56,184,216,0.25)'}
                  strokeWidth={0.5 + Math.random() * 1}
                  initial={{ opacity: 0, scaleX: 0, scaleY: 0 }}
                  animate={{ opacity: [0, 0.8, 0], scaleX: [0, 1, 2], scaleY: [0, 1, 2] }}
                  transition={{ duration: 0.7, delay: i * 0.005, ease: 'easeOut' }}
                  style={{ transformOrigin: `${cx}px ${cy}px` }}
                />
              )
            })}
          </svg>

          {/* Central flash */}
          <motion.div
            style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(56,184,216,0.3) 0%, rgba(201,168,76,0.15) 30%, transparent 70%)',
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 3] }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />

          {/* Scanline flicker */}
          <motion.div
            style={{
              position: 'absolute', inset: 0,
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(56,184,216,0.05) 2px, rgba(56,184,216,0.05) 4px)',
            }}
            animate={{ opacity: [1, 0, 1, 0] }}
            transition={{ duration: 0.15, repeat: 5 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
