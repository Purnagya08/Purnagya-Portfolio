import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNexusStore } from '../../store/nexusStore'
import { SFX } from '../../audio/audioEngine'

export default function AchievementUnlock() {
  const { pendingAchievement, clearPendingAchievement } = useNexusStore()

  useEffect(() => {
    if (!pendingAchievement) return
    SFX.fragmentCollect()
    const t = setTimeout(clearPendingAchievement, 4000)
    return () => clearTimeout(t)
  }, [pendingAchievement, clearPendingAchievement])

  return (
    <div style={{
      position: 'fixed', bottom: 80, right: 24,
      zIndex: 9000, pointerEvents: 'none',
    }}>
      <AnimatePresence>
        {pendingAchievement && (
          <motion.div
            key={pendingAchievement.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0,  scale: 1   }}
            exit={{    opacity: 0, x: 60, scale: 0.9  }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              padding: '14px 20px',
              background: 'rgba(8,11,24,0.95)',
              border: '1px solid rgba(201,168,76,0.4)',
              backdropFilter: 'blur(16px)',
              maxWidth: 280,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top shimmer */}
            <motion.div
              initial={{ left: '-100%' }}
              animate={{ left: '200%' }}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{
                position: 'absolute', top: 0, width: '60%', height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.12), transparent)',
              }}
            />
            {/* Gold top bar */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)',
            }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <motion.div
                animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.3, 1] }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{ fontSize: 20, flexShrink: 0 }}
              >
                ★
              </motion.div>
              <div>
                <div style={{
                  fontFamily: 'JetBrains Mono', fontSize: 8,
                  color: 'rgba(201,168,76,0.6)', letterSpacing: '0.2em', marginBottom: 3,
                }}>
                  ACHIEVEMENT UNLOCKED
                </div>
                <div style={{
                  fontFamily: 'Orbitron', fontSize: 11,
                  fontWeight: 700, color: '#c9a84c',
                  letterSpacing: '0.05em',
                }}>
                  {pendingAchievement.label}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
