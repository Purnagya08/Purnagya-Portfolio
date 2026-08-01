import { motion } from 'framer-motion'
import { useNexusStore } from '../../store/nexusStore'
import { SFX } from '../../audio/audioEngine'

const NAV_ITEMS = [
  { id: 'origins',      label: 'Museum of Origins',      code: 'MOD-01', icon: '◈', color: '#c9a84c' },
  { id: 'training',     label: 'Training Facility',       code: 'MOD-02', icon: '⬡', color: '#38b8d8' },
  { id: 'challenges',   label: 'Challenge Galaxy',        code: 'MOD-03', icon: '✦', color: '#a070e0' },
  { id: 'missions',     label: 'Mission Control',         code: 'MOD-04', icon: '◎', color: '#38b8d8' },
  { id: 'research',     label: 'Research Labs',           code: 'MOD-05', icon: '⬢', color: '#60d8a0' },
  { id: 'achievements', label: 'Achievement Observatory', code: 'MOD-06', icon: '★', color: '#c9a84c' },
  { id: 'present',      label: 'Present Station',         code: 'MOD-07', icon: '◉', color: '#38b8d8' },
  { id: 'future',       label: 'Future Galaxy',           code: 'MOD-08', icon: '◌', color: '#a070e0' },
  { id: 'nexusai',      label: 'NEXUS AI',                code: 'AI',     icon: '◎', color: '#38b8d8' },
  { id: 'profile',      label: "Captain's Profile",       code: 'PRF',    icon: '◈', color: '#c9a84c' },
]

function NavRow({ item }) {
  const { currentModule, navigateTo, triggerWarp } = useNexusStore()
  const isActive = currentModule === item.id

  function handleClick() {
    if (isActive) return
    SFX.moduleEnter()
    triggerWarp()
    setTimeout(() => navigateTo(item.id), 400)
  }

  return (
    <motion.button
      onClick={handleClick}
      data-cursor="hover"
      whileHover={{ x: isActive ? 0 : 3 }}
      transition={{ duration: 0.15 }}
      style={{
        width: '100%', border: 'none',
        padding: '12px 18px', cursor: isActive ? 'default' : 'none',
        textAlign: 'left',
        display: 'flex', alignItems: 'center', gap: 10,
        background: isActive ? `${item.color}0e` : 'transparent',
        borderBottom: '1px solid rgba(56,184,216,0.05)',
        position: 'relative',
        transition: 'background 0.2s',
      }}
    >
      {isActive && (
        <motion.div
          layoutId="activeBar"
          style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: 2, background: item.color,
            boxShadow: `0 0 6px ${item.color}`,
          }}
        />
      )}

      <div style={{
        fontSize: 14, color: isActive ? item.color : `${item.color}80`,
        width: 18, textAlign: 'center', flexShrink: 0,
        transition: 'color 0.2s',
      }}>
        {item.icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'Orbitron', fontSize: 11, fontWeight: 600,
          color: isActive ? item.color : 'rgba(216,228,240,0.75)',
          letterSpacing: '0.04em',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          transition: 'color 0.2s',
        }}>
          {item.label}
        </div>
        <div style={{
          fontFamily: 'JetBrains Mono', fontSize: 9,
          color: `${item.color}55`, letterSpacing: '0.1em', marginTop: 1,
        }}>
          {item.code}
        </div>
      </div>
    </motion.button>
  )
}

export default function NavMenu() {
  const { phase, currentModule, navigateTo, triggerWarp } = useNexusStore()

  // Only show when inside a module — not on hub, entry, or boot
  if (phase !== 'hub' || currentModule === null) return null

  function handleHub() {
    SFX.click()
    triggerWarp()
    setTimeout(() => navigateTo(null), 400)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed',
        top: 56,
        left: 0,
        bottom: 0,
        width: 240,
        zIndex: 90,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(3,6,16,0.92)',
        borderRight: '1px solid rgba(56,184,216,0.12)',
        backdropFilter: 'blur(16px)',
        overflowY: 'auto',
        scrollbarWidth: 'none',
        pointerEvents: 'all',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '12px 14px 10px',
        borderBottom: '1px solid rgba(56,184,216,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily: 'JetBrains Mono', fontSize: 8,
          color: 'rgba(56,184,216,0.55)', letterSpacing: '0.18em',
        }}>
          MODULES
        </div>
        <button
          onClick={handleHub}
          data-cursor="hover"
          style={{
            fontFamily: 'JetBrains Mono', fontSize: 9,
            letterSpacing: '0.12em', color: '#c9a84c',
            background: 'rgba(201,168,76,0.08)',
            border: '1px solid rgba(201,168,76,0.3)',
            padding: '3px 8px', cursor: 'none',
          }}
        >
          ⊕ HUB
        </button>
      </div>

      {/* Module list */}
      <div style={{ flex: 1, paddingTop: 4 }}>
        {NAV_ITEMS.map(item => (
          <NavRow key={item.id} item={item} />
        ))}
      </div>

      {/* Footer hint */}
      <div style={{
        padding: '10px 14px',
        borderTop: '1px solid rgba(56,184,216,0.06)',
        fontFamily: 'JetBrains Mono', fontSize: 9,
        color: 'rgba(56,184,216,0.25)', letterSpacing: '0.1em',
        flexShrink: 0,
      }}>
        ` TERMINAL
      </div>
    </motion.div>
  )
}
