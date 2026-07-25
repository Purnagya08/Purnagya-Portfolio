import { motion } from 'framer-motion'
import { useNexusStore } from '../store/nexusStore'
import { SFX } from '../audio/audioEngine'

export default function NotFound() {
  const { navigateTo, triggerWarp } = useNexusStore()

  function handleReturn() {
    SFX.warp()
    triggerWarp()
    setTimeout(() => navigateTo(null), 400)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#02040c',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 16, padding: 32,
    }}>
      {Array.from({ length: 80 }, (_, i) => (
        <div key={i} style={{ position: 'absolute', left: `${Math.random()*100}%`, top: `${Math.random()*100}%`, width: 1, height: 1, borderRadius: '50%', background: 'white', opacity: 0.15 + Math.random() * 0.5 }} />
      ))}

      <motion.div animate={{ opacity: [0.4,1,0.4] }} transition={{ duration: 3, repeat: Infinity }}
        style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.3em', color: 'rgba(231,76,60,0.6)' }}>
        ⚠ NAVIGATION ERROR ⚠
      </motion.div>

      <div style={{ fontFamily: 'Orbitron', fontSize: 'clamp(48px,10vw,96px)', fontWeight: 800, color: '#e74c3c', textShadow: '0 0 40px rgba(231,76,60,0.4)', letterSpacing: '0.1em', lineHeight: 1 }}>
        404
      </div>

      <div style={{ fontFamily: 'Space Grotesk', fontSize: 14, color: 'rgba(176,192,216,0.5)', textAlign: 'center' }}>
        Sector not found. This coordinate does not exist in the archive.
      </div>

      <div style={{ width: 160, height: 1, background: 'linear-gradient(90deg, transparent, rgba(231,76,60,0.3), transparent)', margin: '8px 0' }} />

      <motion.button
        onClick={handleReturn}
        data-cursor="hover"
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
        style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.2em', color: '#38b8d8', background: 'transparent', border: '1px solid rgba(56,184,216,0.3)', padding: '10px 28px', cursor: 'pointer', marginTop: 8 }}
      >
        ◂ RETURN TO HUB
      </motion.button>
    </div>
  )
}
