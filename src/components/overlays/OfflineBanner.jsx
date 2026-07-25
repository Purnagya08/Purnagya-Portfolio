import { motion, AnimatePresence } from 'framer-motion'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'

export default function OfflineBanner() {
  const isOnline = useOnlineStatus()

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -48, opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          exit={{    y: -48, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0,
            zIndex: 9990,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 10, padding: '8px 20px',
            background: 'rgba(231,76,60,0.12)',
            borderBottom: '1px solid rgba(231,76,60,0.3)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: '#e74c3c', flexShrink: 0 }}
          />
          <span style={{
            fontFamily: 'JetBrains Mono', fontSize: 9,
            color: 'rgba(231,76,60,0.8)', letterSpacing: '0.2em',
          }}>
            SIGNAL LOST — OFFLINE MODE ACTIVE
          </span>
          <span style={{
            fontFamily: 'JetBrains Mono', fontSize: 8,
            color: 'rgba(231,76,60,0.80)', letterSpacing: '0.1em',
          }}>
            NEXUS AI UNAVAILABLE
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
