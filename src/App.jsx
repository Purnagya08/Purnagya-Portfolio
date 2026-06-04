import { useEffect, lazy, Suspense } from 'react'
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

// ── All 9 modules lazy loaded ─────────────────────────────────
const MuseumOfOrigins        = lazy(() => import('./components/modules/MuseumOfOrigins'))
const TrainingFacility       = lazy(() => import('./components/modules/TrainingFacility'))
const ChallengeGalaxy        = lazy(() => import('./components/modules/ChallengeGalaxy'))
const MissionControl         = lazy(() => import('./components/modules/MissionControl'))
const ResearchLabs           = lazy(() => import('./components/modules/ResearchLabs'))
const AchievementObservatory = lazy(() => import('./components/modules/AchievementObservatory'))
const PresentStation         = lazy(() => import('./components/modules/PresentStation'))
const FutureGalaxy           = lazy(() => import('./components/modules/FutureGalaxy'))
const NexusAI                = lazy(() => import('./components/modules/NexusAI'))

// ── Spinner while lazy module loads ──────────────────────────
function ModuleLoading() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{
            width: 40, height: 40, margin: '0 auto 16px',
            border: '1px solid rgba(56,184,216,0.3)',
            borderTop: '1px solid #38b8d8', borderRadius: '50%',
          }}
        />
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'rgba(56,184,216,0.5)', letterSpacing: '0.2em' }}>
          LOADING MODULE...
        </div>
      </div>
    </div>
  )
}

// ── Route id → component ──────────────────────────────────────
function ModuleContent({ id }) {
  switch (id) {
    case 'origins':      return <MuseumOfOrigins />
    case 'training':     return <TrainingFacility />
    case 'challenges':   return <ChallengeGalaxy />
    case 'missions':     return <MissionControl />
    case 'research':     return <ResearchLabs />
    case 'achievements': return <AchievementObservatory />
    case 'present':      return <PresentStation />
    case 'future':       return <FutureGalaxy />
    case 'nexusai':      return <NexusAI />
    default:             return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontFamily: 'Orbitron', fontSize: 32, color: '#c9a84c', textShadow: '0 0 30px rgba(201,168,76,0.4)' }}>
          {id?.toUpperCase()}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'rgba(56,184,216,0.4)', letterSpacing: '0.2em' }}>
          MODULE NOT FOUND
        </div>
      </div>
    )
  }
}

// ── Hub: 3D scene + grid + active module ─────────────────────
function HubLayer() {
  const { currentModule } = useNexusStore()
  const showGrid = currentModule === null

  return (
    <>
      <SpaceScene />

      <AnimatePresence>
        {showGrid && (
          <motion.div
            key="hub-grid"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'fixed', inset: 0, zIndex: 20 }}
          >
            <CentralCommandHub />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {currentModule && (
          <motion.div
            key={`module-${currentModule}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ position: 'fixed', inset: 0, zIndex: 50 }}
          >
            <ModuleShell>
              <Suspense fallback={<ModuleLoading />}>
                <ModuleContent id={currentModule} />
              </Suspense>
            </ModuleShell>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ── Root ──────────────────────────────────────────────────────
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
