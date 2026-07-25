import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNexusStore } from '../../store/nexusStore'
import { SFX } from '../../audio/audioEngine'

// Hexagon clip path (flat-top orientation)
const HEX_CLIP = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'

function ScanLine({ color }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: 0, right: 0,
        height: 1,
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        opacity: 0.6,
        pointerEvents: 'none',
      }}
      animate={{ top: ['0%', '100%'] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
    />
  )
}

export default function ModulePortal({ module, index, onEnter }) {
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const { navigateTo } = useNexusStore()

  const isCenter = module.isCenter

  function handleClick() {
    if (isCenter) return
    setClicked(true)
    SFX.moduleEnter()
    useNexusStore.getState().triggerWarp()
    setTimeout(() => {
      navigateTo(module.id)
      if (onEnter) onEnter(module.id)
    }, 400)
  }

  function handleHover(v) {
    setHovered(v)
    if (v) SFX.hover()
  }

  const size = isCenter ? 160 : 130
  const borderColor = hovered ? module.color : `${module.color}44`
  const bgColor = hovered
    ? `${module.color}14`
    : isCenter
    ? 'rgba(201,168,76,0.06)'
    : 'rgba(8,11,24,0.75)'

  return (
    <motion.div
      data-cursor={isCenter ? 'default' : 'hover'}
      onClick={handleClick}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{
        opacity: 1,
        scale: clicked ? 1.15 : 1,
      }}
      transition={{
        opacity: { delay: index * 0.06, duration: 0.5 },
        scale:   { delay: index * 0.06, duration: 0.4, type: 'spring', stiffness: 200 },
      }}
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isCenter ? 'default' : 'none',
        userSelect: 'none',
      }}
    >
      {/* Outer glow ring */}
      {hovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            position: 'absolute',
            inset: -8,
            clipPath: HEX_CLIP,
            background: `radial-gradient(ellipse at center, ${module.glowColor} 0%, transparent 70%)`,
            filter: 'blur(8px)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Hex border */}
      <motion.div
        animate={{
          borderColor,
          backgroundColor: bgColor,
          boxShadow: hovered
            ? `0 0 30px ${module.glowColor}, 0 0 60px ${module.glowColor.replace('0.4', '0.15')}`
            : 'none',
        }}
        transition={{ duration: 0.25 }}
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: HEX_CLIP,
          border: `1px solid ${borderColor}`,
          backgroundColor: bgColor,
          backdropFilter: 'blur(8px)',
          overflow: 'hidden',
          transition: 'background-color 0.25s, border-color 0.25s',
        }}
      >
        {/* Scan line on hover */}
        {hovered && <ScanLine color={module.color} />}

        {/* HUD corner marks */}
        {['tl', 'tr', 'bl', 'br'].map(pos => (
          <div key={pos} style={{
            position: 'absolute',
            width: 8, height: 8,
            borderStyle: 'solid',
            borderColor: `${module.color}60`,
            ...(pos === 'tl' ? { top: 10, left: '28%', borderWidth: '1px 0 0 1px' } : {}),
            ...(pos === 'tr' ? { top: 10, right: '28%', borderWidth: '1px 1px 0 0' } : {}),
            ...(pos === 'bl' ? { bottom: 10, left: '28%', borderWidth: '0 0 1px 1px' } : {}),
            ...(pos === 'br' ? { bottom: 10, right: '28%', borderWidth: '0 1px 1px 0' } : {}),
          }} />
        ))}
      </motion.div>

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 6, textAlign: 'center',
        padding: '0 16px',
      }}>
        {/* Icon */}
        <motion.div
          animate={{
            color: hovered ? module.color : `${module.color}99`,
            textShadow: hovered
              ? `0 0 20px ${module.color}, 0 0 40px ${module.color}`
              : 'none',
            scale: hovered ? 1.2 : 1,
          }}
          style={{
            fontSize: isCenter ? 28 : 22,
            fontFamily: 'monospace',
            lineHeight: 1,
          }}
        >
          {module.icon}
        </motion.div>

        {/* Module code */}
        <div style={{
          fontFamily: 'JetBrains Mono',
          fontSize: 8,
          letterSpacing: '0.15em',
          color: `${module.color}60`,
        }}>
          {module.code}
        </div>

        {/* Short label */}
        <div style={{
          fontFamily: 'Orbitron',
          fontSize: isCenter ? 11 : 9,
          fontWeight: 600,
          letterSpacing: '0.1em',
          color: hovered ? module.color : `${module.color}cc`,
          lineHeight: 1.2,
          maxWidth: isCenter ? 100 : 80,
          textAlign: 'center',
          transition: 'color 0.25s',
        }}>
          {module.shortLabel}
        </div>

        {/* Status dot */}
        {!isCenter && (
          <motion.div
            animate={{ opacity: hovered ? 1 : 0.4, scale: hovered ? 1.3 : 1 }}
            style={{
              width: 4, height: 4,
              borderRadius: '50%',
              background: module.color,
              boxShadow: `0 0 6px ${module.color}`,
            }}
          />
        )}
      </div>

      {/* Tooltip on hover */}
      {hovered && !isCenter && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'absolute',
            bottom: -52,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(4,6,15,0.95)',
            border: `1px solid ${module.color}40`,
            padding: '6px 12px',
            whiteSpace: 'nowrap',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <div style={{
            fontFamily: 'Space Grotesk',
            fontSize: 10,
            color: module.color,
            fontWeight: 600,
            letterSpacing: '0.05em',
          }}>
            {module.label}
          </div>
          <div style={{
            fontFamily: 'JetBrains Mono',
            fontSize: 8,
            color: 'rgba(216,228,240,0.78)',
            marginTop: 2,
            maxWidth: 200,
            whiteSpace: 'normal',
            lineHeight: 1.4,
          }}>
            {module.description}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
