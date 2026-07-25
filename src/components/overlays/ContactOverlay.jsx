import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SFX } from '../../audio/audioEngine'

// ─── Contact links data ───────────────────────────────────────
const LINKS = [
  {
    label: 'EMAIL',
    value: 'purnagya.raj26nov@gmail.com',
    icon: '✉',
    color: '#c9a84c',
    action: () => window.open('mailto: purnagya.raj26nov@gmail.com', '_blank'),
    copyable: true,
  },
  {
    label: 'GITHUB',
    value: 'github.com/Purnagya08',
    icon: '⌥',
    color: '#38b8d8',
    action: () => window.open('https://github.com/Purnagya08', '_blank'),
  },
  {
    label: 'LINKEDIN',
    value: 'linkedin.com/in/purnagya-raj',
    icon: '◈',
    color: '#a070e0',
    action: () => window.open('https://linkedin.com/in/purnagya-raj', '_blank'),
  },
  {
    label: 'RESUME',
    value: 'View Resume',
    icon: '⬇',
    color: '#ff6b6b',
    action: () =>
      window.open(
        'https://drive.google.com/file/d/1BJj9m4Eg2zUeI5lclTAgXRCwrvrv2CGW/view',
        '_blank'
      ),
  },
  {
    label: 'LEETCODE',
    value: 'leetcode.com/u/techXpurna',
    icon: '⚡',
    color: '#60d8a0',
    action: () => window.open('https://leetcode.com/u/techXpurna', '_blank'),
  },
]

// ─── Single contact row ───────────────────────────────────────
function ContactRow({ link, index }) {
  const [copied, setCopied] = useState(false)
  const [hovered, setHovered] = useState(false)

  function handleClick() {
    SFX.click()
    link.action()
  }

  function handleCopy(e) {
    e.stopPropagation()
    navigator.clipboard.writeText(link.value).then(() => {
      setCopied(true)
      SFX.fragmentCollect()
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative' }}
    >
      {/* Main row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 18px',
        background: hovered ? `${link.color}0c` : 'rgba(8,11,24,0.6)',
        border: `1px solid ${hovered ? link.color + '45' : link.color + '18'}`,
        transition: 'all 0.2s',
        cursor: 'none',
      }}>
        {/* Icon */}
        <div style={{
          fontSize: 18, color: link.color,
          width: 28, textAlign: 'center', flexShrink: 0,
          filter: hovered ? `drop-shadow(0 0 6px ${link.color})` : 'none',
          transition: 'filter 0.2s',
        }}>
          {link.icon}
        </div>

        {/* Label + value */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'JetBrains Mono', fontSize: 8,
            color: `${link.color}90`, letterSpacing: '0.18em', marginBottom: 3,
          }}>
            {link.label}
          </div>
          <div style={{
            fontFamily: 'Space Grotesk', fontSize: 13,
            color: hovered ? link.color : 'rgba(216,228,240,0.85)',
            fontWeight: 500, transition: 'color 0.2s',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {link.value}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {link.copyable && (
            <motion.button
              onClick={handleCopy}
              whileTap={{ scale: 0.94 }}
              data-cursor="hover"
              style={{
                fontFamily: 'JetBrains Mono', fontSize: 8,
                letterSpacing: '0.12em',
                color: copied ? '#60d8a0' : `${link.color}80`,
                background: copied ? 'rgba(96,216,160,0.1)' : 'transparent',
                border: `1px solid ${copied ? 'rgba(96,216,160,0.4)' : link.color + '30'}`,
                padding: '4px 10px', cursor: 'none',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {copied ? '✓ COPIED' : 'COPY'}
            </motion.button>
          )}
          <motion.button
            onClick={handleClick}
            whileTap={{ scale: 0.94 }}
            data-cursor="hover"
            style={{
              fontFamily: 'JetBrains Mono', fontSize: 8,
              letterSpacing: '0.12em',
              color: link.color,
              background: `${link.color}0e`,
              border: `1px solid ${link.color}40`,
              padding: '4px 12px', cursor: 'none',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            OPEN ›
          </motion.button>
        </div>

        {/* Left accent line on hover */}
        <motion.div
          animate={{ scaleY: hovered ? 1 : 0 }}
          style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: 2, background: link.color,
            transformOrigin: 'top',
            boxShadow: `0 0 8px ${link.color}`,
          }}
        />
      </div>
    </motion.div>
  )
}

// ─── Main ContactOverlay ──────────────────────────────────────
export default function ContactOverlay({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 5000,
              background: 'rgba(2,4,12,0.75)',
              backdropFilter: 'blur(6px)',
              cursor: 'none',
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed',
              top: 70, right: 16,
              width: 'min(440px, calc(100vw - 32px))',
              zIndex: 5001,
              background: 'rgba(4,7,18,0.97)',
              border: '1px solid rgba(201,168,76,0.3)',
              backdropFilter: 'blur(20px)',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.08)',
            }}
          >
            {/* Gold top bar */}
            <div style={{
              height: 2,
              background: 'linear-gradient(90deg, transparent, #c9a84c, rgba(201,168,76,0.3), transparent)',
            }} />

            {/* Header */}
            <div style={{
              padding: '18px 20px 14px',
              borderBottom: '1px solid rgba(56,184,216,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{
                  fontFamily: 'Orbitron', fontSize: 14, fontWeight: 700,
                  color: '#c9a84c', letterSpacing: '0.12em',
                }}>
                  OPEN CHANNEL
                </div>
                <div style={{
                  fontFamily: 'JetBrains Mono', fontSize: 8,
                  color: 'rgba(56,184,216,0.6)', letterSpacing: '0.15em', marginTop: 3,
                }}>
                  PURNAGYA RAJ · AVAILABLE FOR INTERNSHIPS
                </div>
              </div>
              <button
                onClick={onClose}
                data-cursor="hover"
                style={{
                  fontFamily: 'JetBrains Mono', fontSize: 9,
                  color: 'rgba(176,192,216,0.5)',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '4px 10px', cursor: 'none',
                  letterSpacing: '0.1em',
                  transition: 'all 0.2s',
                }}
              >
                ✕ CLOSE
              </button>
            </div>

            {/* Status bar */}
            <div style={{
              padding: '10px 20px',
              background: 'rgba(96,216,160,0.05)',
              borderBottom: '1px solid rgba(96,216,160,0.1)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: 6, height: 6, borderRadius: '50%', background: '#60d8a0', boxShadow: '0 0 6px #60d8a0', flexShrink: 0 }}
              />
              <span style={{ fontFamily: 'Space Grotesk', fontSize: 12, color: 'rgba(216,228,240,0.82)' }}>
                Open to SWE internships · AI projects · Collaborations
              </span>
            </div>

            {/* Contact rows */}
            <div style={{ padding: '12px 0 4px' }}>
              {LINKS.map((link, i) => (
                <ContactRow key={link.label} link={link} index={i} />
              ))}
            </div>

            {/* Footer note */}
            <div style={{
              padding: '12px 20px 16px',
              borderTop: '1px solid rgba(56,184,216,0.08)',
              fontFamily: 'Libre Baskerville', fontStyle: 'italic',
              fontSize: 12, color: 'rgba(216,228,240,0.5)',
              lineHeight: 1.6, textAlign: 'center',
            }}>
              "If you are building something interesting — I want to hear about it."
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
