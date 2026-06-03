import { motion } from 'framer-motion'
import { useNexusStore } from '../../store/nexusStore'
import { SFX } from '../../audio/audioEngine'
import { getModule } from '../../data/modules'

export default function ModuleShell({ children }) {
  const { currentModule, navigateTo, triggerWarp } = useNexusStore()
  const module = getModule(currentModule)

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
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed', inset: 0,
        zIndex: 50,
        overflowY: 'auto',
        scrollbarWidth: 'none',
      }}
    >
      {/* Module header bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 60,
        background: 'rgba(4,6,15,0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${module.color}25`,
        padding: '12px 28px',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        {/* Back button */}
        <button
          onClick={handleBack}
          data-cursor="hover"
          style={{
            fontFamily: 'JetBrains Mono', fontSize: 10,
            color: 'rgba(56,184,216,0.7)',
            background: 'none', border: 'none',
            letterSpacing: '0.15em',
            cursor: 'none',
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '4px 0',
          }}
        >
          ◂ RETURN TO HUB
        </button>

        <div style={{ width: 1, height: 20, background: 'rgba(56,184,216,0.15)' }} />

        {/* Module ID */}
        <div style={{
          fontFamily: 'JetBrains Mono', fontSize: 8,
          color: `${module.color}60`,
          letterSpacing: '0.2em',
        }}>
          {module.code}
        </div>

        <div style={{
          fontFamily: 'Orbitron', fontSize: 11,
          fontWeight: 600, letterSpacing: '0.2em',
          color: module.color,
        }}>
          {module.label.toUpperCase()}
        </div>

        {/* Right: status blip */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: 5, height: 5, borderRadius: '50%',
              background: module.color,
              boxShadow: `0 0 8px ${module.color}`,
            }}
          />
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: `${module.color}80`, letterSpacing: '0.15em' }}>
            ACTIVE
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ position: 'relative', minHeight: 'calc(100vh - 60px)' }}>
        {children}
      </div>
    </motion.div>
  )
}
