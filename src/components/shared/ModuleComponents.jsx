import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { useNexusStore } from '../../store/nexusStore'
import { SFX } from '../../audio/audioEngine'

// ─── Fade-in wrapper (triggers when scrolled into view) ───────
export function RevealBlock({ children, delay = 0, y = 24 }) {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ─── Section title with HUD decoration ───────────────────────
export function SectionTitle({ label, code, color = '#c9a84c', sub }) {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6 }}
      style={{ marginBottom: 32 }}
    >
      {code && (
        <div style={{
          fontFamily: 'JetBrains Mono', fontSize: 9,
          letterSpacing: '0.3em', color: `${color}70`,
          marginBottom: 6,
        }}>
          {code}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 3, height: 28, background: color, borderRadius: 2, boxShadow: `0 0 10px ${color}` }} />
        <div style={{
          fontFamily: 'Orbitron', fontSize: 'clamp(18px, 2.5vw, 26px)',
          fontWeight: 700, color,
          letterSpacing: '0.06em',
          textShadow: `0 0 30px ${color}50`,
        }}>
          {label}
        </div>
      </div>
      {sub && (
        <div style={{
          fontFamily: 'Libre Baskerville', fontStyle: 'italic',
          fontSize: 13, color: 'rgba(216,228,240,0.82)',
          marginTop: 6, marginLeft: 17,
        }}>
          {sub}
        </div>
      )}
      <div style={{
        height: 1, marginTop: 12,
        background: `linear-gradient(90deg, ${color}40, transparent)`,
      }} />
    </motion.div>
  )
}

// ─── Memory Fragment collectible ──────────────────────────────
export function MemoryFragment({ id, quote, author }) {
  const { collectFragment, collectedFragments } = useNexusStore()
  const [collected, setCollected] = useState(false)
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-40px' })

  const alreadyCollected = collectedFragments.includes(id)

  function handleCollect() {
    if (alreadyCollected || collected) return
    setCollected(true)
    collectFragment(id)
    SFX.fragmentCollect()
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5 }}
      onClick={handleCollect}
      data-cursor="hover"
      style={{
        position: 'relative',
        padding: '20px 24px',
        background: 'rgba(201,168,76,0.04)',
        border: `1px solid ${collected || alreadyCollected ? '#c9a84c' : 'rgba(201,168,76,0.2)'}`,
        cursor: 'none',
        userSelect: 'none',
        transition: 'border-color 0.3s',
        overflow: 'hidden',
      }}
    >
      {/* Corner brackets */}
      {['tl','tr','bl','br'].map(p => (
        <div key={p} style={{
          position: 'absolute', width: 10, height: 10,
          borderStyle: 'solid', borderColor: '#c9a84c',
          ...(p==='tl' ? { top:4, left:4,   borderWidth:'1px 0 0 1px' } : {}),
          ...(p==='tr' ? { top:4, right:4,  borderWidth:'1px 1px 0 0' } : {}),
          ...(p==='bl' ? { bottom:4, left:4,  borderWidth:'0 0 1px 1px' } : {}),
          ...(p==='br' ? { bottom:4, right:4, borderWidth:'0 1px 1px 0' } : {}),
        }} />
      ))}

      <div style={{
        fontFamily: 'JetBrains Mono', fontSize: 8,
        letterSpacing: '0.2em', color: 'rgba(201,168,76,0.80)',
        marginBottom: 10,
      }}>
        ◈ MEMORY FRAGMENT {id}
        {(collected || alreadyCollected) && (
          <span style={{ color: '#c9a84c', marginLeft: 8 }}>— COLLECTED</span>
        )}
      </div>

      <div style={{
        fontFamily: 'Libre Baskerville', fontStyle: 'italic',
        fontSize: 14, color: 'rgba(216,228,240,0.9)',
        lineHeight: 1.7, marginBottom: 8,
      }}>
        "{quote}"
      </div>

      {author && (
        <div style={{
          fontFamily: 'Space Grotesk', fontSize: 11,
          color: 'rgba(201,168,76,0.6)',
          letterSpacing: '0.05em',
        }}>
          — {author}
        </div>
      )}

      {!collected && !alreadyCollected && (
        <div style={{
          position: 'absolute', bottom: 8, right: 12,
          fontFamily: 'JetBrains Mono', fontSize: 8,
          color: 'rgba(201,168,76,0.80)',
          letterSpacing: '0.1em',
        }}>
          CLICK TO COLLECT
        </div>
      )}

      {/* Shimmer on collect */}
      {collected && (
        <motion.div
          initial={{ left: '-100%' }}
          animate={{ left: '200%' }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)',
            width: '60%',
          }}
        />
      )}
    </motion.div>
  )
}

// ─── Horizontal timeline ──────────────────────────────────────
export function Timeline({ events }) {
  return (
    <div style={{ position: 'relative', padding: '24px 0' }}>
      {/* Spine */}
      <div style={{
        position: 'absolute', left: 16, top: 0, bottom: 0,
        width: 1,
        background: 'linear-gradient(180deg, transparent, rgba(56,184,216,0.3) 10%, rgba(56,184,216,0.3) 90%, transparent)',
      }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {events.map((ev, i) => (
          <RevealBlock key={i} delay={i * 0.08}>
            <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', paddingLeft: 8 }}>
              {/* Node */}
              <div style={{ flexShrink: 0, position: 'relative', zIndex: 2 }}>
                <div style={{
                  width: 16, height: 16,
                  borderRadius: '50%',
                  border: `2px solid ${ev.color || '#38b8d8'}`,
                  background: '#02040c',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 10px ${ev.color || '#38b8d8'}60`,
                }}>
                  <div style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: ev.color || '#38b8d8',
                  }} />
                </div>
              </div>

              {/* Content */}
              <div style={{ flex: 1, paddingBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4, flexWrap: 'wrap' }}>
                  <div style={{
                    fontFamily: 'JetBrains Mono', fontSize: 9,
                    color: ev.color || '#38b8d8',
                    letterSpacing: '0.1em',
                  }}>
                    {ev.year}
                  </div>
                  <div style={{
                    fontFamily: 'Orbitron', fontSize: 13,
                    fontWeight: 600, color: '#d8e4f0',
                    letterSpacing: '0.05em',
                  }}>
                    {ev.title}
                  </div>
                </div>
                <div style={{
                  fontFamily: 'Space Grotesk', fontSize: 13,
                  color: 'rgba(176,192,216,0.7)', lineHeight: 1.6,
                }}>
                  {ev.description}
                </div>
                {ev.tags && (
                  <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                    {ev.tags.map(t => <Tag key={t} label={t} color={ev.color} />)}
                  </div>
                )}
              </div>
            </div>
          </RevealBlock>
        ))}
      </div>
    </div>
  )
}

// ─── Tag pill ─────────────────────────────────────────────────
export function Tag({ label, color = '#38b8d8' }) {
  return (
    <span style={{
      fontFamily: 'JetBrains Mono', fontSize: 9,
      letterSpacing: '0.1em',
      color, border: `1px solid ${color}40`,
      background: `${color}0a`,
      padding: '2px 8px',
      borderRadius: 2,
    }}>
      {label}
    </span>
  )
}

// ─── Stat card ────────────────────────────────────────────────
export function StatCard({ value, label, color = '#c9a84c', icon }) {
  const ref = useRef()
  const inView = useInView(ref, { once: true })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const num = parseFloat(value)
    if (isNaN(num)) return
    let start = 0
    const step = num / 40
    const t = setInterval(() => {
      start += step
      if (start >= num) { setDisplay(num); clearInterval(t) }
      else setDisplay(Math.floor(start))
    }, 30)
    return () => clearInterval(t)
  }, [inView, value])

  const isNum = !isNaN(parseFloat(value))

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      style={{
        padding: '20px 24px',
        background: 'rgba(8,11,24,0.7)',
        border: `1px solid ${color}25`,
        backdropFilter: 'blur(8px)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at bottom, ${color}08 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      {icon && (
        <div style={{ fontSize: 20, marginBottom: 6, color }}>{icon}</div>
      )}
      <div style={{
        fontFamily: 'Orbitron', fontSize: 'clamp(24px, 3vw, 36px)',
        fontWeight: 700, color,
        textShadow: `0 0 20px ${color}60`,
        lineHeight: 1,
      }}>
        {isNum ? display : value}{typeof value === 'string' && value.includes('+') ? '+' : ''}
      </div>
      <div style={{
        fontFamily: 'Space Grotesk', fontSize: 11,
        color: 'rgba(216,228,240,0.82)',
        letterSpacing: '0.08em',
        marginTop: 6,
      }}>
        {label}
      </div>
    </motion.div>
  )
}

// ─── Code block ───────────────────────────────────────────────
export function CodeBlock({ code, lang = 'java' }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div style={{
      position: 'relative',
      background: 'rgba(4,6,15,0.9)',
      border: '1px solid rgba(56,184,216,0.12)',
      overflow: 'hidden',
    }}>
      {/* Header bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 14px',
        background: 'rgba(8,11,24,0.8)',
        borderBottom: '1px solid rgba(56,184,216,0.08)',
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#e74c3c','#f39c12','#2ecc71'].map((c, i) => (
            <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: c, opacity: 0.6 }} />
          ))}
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'rgba(56,184,216,0.7)', marginLeft: 6, letterSpacing: '0.1em' }}>
            {lang}
          </span>
        </div>
        <button
          onClick={copy}
          data-cursor="hover"
          style={{
            fontFamily: 'JetBrains Mono', fontSize: 8,
            color: copied ? '#60d8a0' : 'rgba(56,184,216,0.7)',
            background: 'none', border: 'none', cursor: 'none',
            letterSpacing: '0.1em',
          }}
        >
          {copied ? 'COPIED' : 'COPY'}
        </button>
      </div>
      <pre style={{
        fontFamily: 'JetBrains Mono', fontSize: 12,
        color: '#b0c0d8', lineHeight: 1.6,
        padding: '16px 20px',
        margin: 0, overflow: 'auto',
        scrollbarWidth: 'none',
        whiteSpace: 'pre-wrap',
      }}>
        {code}
      </pre>
    </div>
  )
}

// ─── Lore card (story paragraph with accent line) ─────────────
export function LoreCard({ text, accent = '#38b8d8' }) {
  return (
    <RevealBlock>
      <div style={{
        padding: '20px 24px',
        background: 'rgba(8,11,24,0.5)',
        borderLeft: `2px solid ${accent}50`,
        position: 'relative',
      }}>
        <div style={{
          fontFamily: 'Libre Baskerville',
          fontSize: 'clamp(13px, 1.5vw, 15px)',
          color: 'rgba(216,228,240,0.88)',
          lineHeight: 1.85,
          fontStyle: 'italic',
        }}>
          {text}
        </div>
      </div>
    </RevealBlock>
  )
}

// ─── Module section wrapper ───────────────────────────────────
export function Section({ children, style = {} }) {
  return (
    <div style={{
      maxWidth: 860,
      margin: '0 auto',
      padding: '48px 28px',
      ...style,
    }}>
      {children}
    </div>
  )
}
