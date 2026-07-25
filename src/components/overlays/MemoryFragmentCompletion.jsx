import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNexusStore } from '../../store/nexusStore'
import { SFX } from '../../audio/audioEngine'

export default function MemoryFragmentCompletion() {
  const { collectedFragments, totalFragments } = useNexusStore()
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (collectedFragments.length >= totalFragments && !dismissed) {
      setTimeout(() => {
        setShow(true)
        SFX.bootReady()
      }, 600)
    }
  }, [collectedFragments.length, totalFragments, dismissed])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 8000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(2,4,12,0.92)',
            backdropFilter: 'blur(8px)',
          }}
          onClick={() => { setShow(false); setDismissed(true) }}
        >
          {/* Orbit rings */}
          {[120, 200, 300].map((r, i) => (
            <motion.div
              key={r}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 12 + i * 4, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                width: r * 2, height: r * 2, borderRadius: '50%',
                border: `1px solid rgba(201,168,76,${0.2 - i * 0.05})`,
                top: '50%', left: '50%',
                marginTop: -r, marginLeft: -r,
              }}
            >
              <div style={{
                position: 'absolute', top: -4, left: '50%', marginLeft: -4,
                width: 8, height: 8, borderRadius: '50%',
                background: '#c9a84c', boxShadow: '0 0 12px #c9a84c',
              }} />
            </motion.div>
          ))}

          {/* Central content */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1,   opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: 'center', position: 'relative', zIndex: 2, padding: '0 32px' }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{ fontSize: 48, marginBottom: 20 }}
            >
              ◈
            </motion.div>

            <div style={{
              fontFamily: 'JetBrains Mono', fontSize: 10,
              letterSpacing: '0.4em', color: 'rgba(201,168,76,0.6)',
              marginBottom: 12,
            }}>
              LOGBOOK COMPLETE
            </div>

            <div style={{
              fontFamily: 'Orbitron', fontSize: 'clamp(28px, 6vw, 52px)',
              fontWeight: 800, color: '#c9a84c',
              textShadow: '0 0 60px rgba(201,168,76,0.5)',
              letterSpacing: '0.08em', lineHeight: 1.1,
              marginBottom: 16,
            }}>
              ALL MEMORY<br />FRAGMENTS FOUND
            </div>

            <div style={{
              fontFamily: 'Libre Baskerville', fontStyle: 'italic',
              fontSize: 'clamp(13px, 1.5vw, 16px)',
              color: 'rgba(216,228,240,0.85)',
              maxWidth: 440, margin: '0 auto 32px',
              lineHeight: 1.7,
            }}>
              You have read every entry in the captain's logbook. The full story of this engineer is now yours.
            </div>

            <div style={{
              display: 'flex', justifyContent: 'center', gap: 12,
              marginBottom: 32, flexWrap: 'wrap',
            }}>
              {Array.from({ length: totalFragments }, (_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: '#c9a84c',
                    boxShadow: '0 0 8px #c9a84c',
                  }}
                />
              ))}
            </div>

            <div style={{
              fontFamily: 'JetBrains Mono', fontSize: 9,
              color: 'rgba(56,184,216,0.75)', letterSpacing: '0.2em',
            }}>
              CLICK ANYWHERE TO CONTINUE
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
