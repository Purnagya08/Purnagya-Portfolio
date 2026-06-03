import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNexusStore } from './store/nexusStore'

import NexusCursor        from './components/cursor/NexusCursor'
import HUDOverlay         from './components/ui/HUDOverlay'
import WarpTransition     from './components/ui/WarpTransition'
import EntryGate          from './components/boot/EntryGate'
import BootSequence       from './components/boot/BootSequence'
import SpaceScene         from './components/three/SpaceScene'
import CentralCommandHub  from './components/hub/CentralCommandHub'
import ModuleShell        from './components/hub/ModuleShell'

// ─── Module placeholder (Part 3+ fills these in) ─────────────
function ModulePlaceholder({ id }) {
  const mod = { color: '#38b8d8' }
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 16,
    }}>
      <div style={{ fontFamily: 'Orbitron', fontSize: 32, color: '#c9a84c', letterSpacing: '0.1em',
        textShadow: '0 0 40px rgba(201,168,76,0.4)' }}>
        {id?.toUpperCase()}
      </div>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'rgba(56,184,216,0.5)', letterSpacing: '0.2em' }}>
        MODULE CONTENT — COMING IN PART 3+
      </div>
    </div>
  )
}

// ─── Hub layer (3D scene + hex grid) ─────────────────────────
function HubLayer() {
  const { currentModule } = useNexusStore()
  const showGrid = currentModule === null

  return (
    <>
      {/* 3D scene always visible as backdrop */}
      <SpaceScene />

      {/* Grid overlay */}
      <AnimatePresence>
        {showGrid && (
          <motion.div
            key="hub-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'fixed', inset: 0, zIndex: 20 }}
          >
            <CentralCommandHub />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active module */}
      <AnimatePresence>
        {currentModule && (
          <motion.div
            key={`module-${currentModule}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 50 }}
          >
            <ModuleShell>
              <ModulePlaceholder id={currentModule} />
            </ModuleShell>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Root App ─────────────────────────────────────────────────
export default function App() {
  const { phase } = useNexusStore()

  useEffect(() => {
    const prevent = (e) => e.preventDefault()
    document.addEventListener('contextmenu', prevent)
    return () => document.removeEventListener('contextmenu', prevent)
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#02040c' }}>
      <div className="noise-overlay" />
      <div className="scanlines" />
      <div className="vignette" />

      <AnimatePresence mode="wait">
        {phase === 'entry' && (
          <motion.div key="entry" style={{ position: 'fixed', inset: 0, zIndex: 800 }}>
            <EntryGate />
          </motion.div>
        )}

        {phase === 'boot' && (
          <motion.div key="boot" style={{ position: 'fixed', inset: 0, zIndex: 700 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <BootSequence />
          </motion.div>
        )}

        {phase === 'hub' && (
          <motion.div key="hub" style={{ position: 'fixed', inset: 0, zIndex: 10 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <HubLayer />
          </motion.div>
        )}
      </AnimatePresence>

      <HUDOverlay visible={phase !== 'entry'} />
      <WarpTransition />
      <NexusCursor />
    </div>
  )
}
