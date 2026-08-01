import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SFX } from '../../audio/audioEngine'

// ─── Contact links ────────────────────────────────────────────
const LINKS = [
  {
    label:    'EMAIL',
    value:    'purnagya.raj26nov@gmail.com',
    icon:     '✉',
    color:    '#c9a84c',
    action:   () => window.open('mailto:purnagya.raj26nov@gmail.com', '_blank'),
    copyable: true,
  },
  {
    label:  'GITHUB',
    value:  'github.com/Purnagya08',
    icon:   '⌥',
    color:  '#38b8d8',
    action: () => window.open('https://github.com/Purnagya08', '_blank'),
  },
  {
    label:  'LINKEDIN',
    value:  'linkedin.com/in/purnagya-raj',
    icon:   '◈',
    color:  '#a070e0',
    action: () => window.open('https://linkedin.com/in/purnagya-raj', '_blank'),
  },
  {
    label:  'LEETCODE',
    value:  'leetcode.com/u/Purnagya',
    icon:   '⚡',
    color:  '#60d8a0',
    action: () => window.open('https://leetcode.com/u/Purnagya', '_blank'),
  },
]

// ─── Single link row ──────────────────────────────────────────
function LinkRow({ link }) {
  const [copied, setCopied] = useState(false)
  const [hovered, setHovered] = useState(false)

  function handleCopy(e) {
    e.stopPropagation()
    navigator.clipboard.writeText(link.value).then(() => {
      setCopied(true)
      SFX.fragmentCollect()
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '11px 18px',
        background: hovered ? `${link.color}0c` : 'rgba(8,11,24,0.5)',
        borderBottom: `1px solid ${link.color}12`,
        transition: 'all 0.2s',
        position: 'relative',
      }}
    >
      <motion.div animate={{ scaleY: hovered ? 1 : 0 }}
        style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: link.color, transformOrigin: 'top' }} />

      <div style={{ fontSize: 16, color: link.color, flexShrink: 0 }}>{link.icon}</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: `${link.color}80`, letterSpacing: '0.18em', marginBottom: 2 }}>
          {link.label}
        </div>
        <div style={{
          fontFamily: 'Space Grotesk', fontSize: 12,
          color: hovered ? link.color : 'rgba(216,228,240,0.85)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          transition: 'color 0.2s',
        }}>
          {link.value}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        {link.copyable && (
          <motion.button onClick={handleCopy} whileTap={{ scale: 0.94 }} data-cursor="hover"
            style={{
              fontFamily: 'JetBrains Mono', fontSize: 8, letterSpacing: '0.1em',
              color: copied ? '#60d8a0' : `${link.color}80`,
              background: copied ? 'rgba(96,216,160,0.1)' : 'transparent',
              border: `1px solid ${copied ? 'rgba(96,216,160,0.4)' : link.color + '30'}`,
              padding: '3px 8px', cursor: 'none', transition: 'all 0.2s',
            }}>
            {copied ? '✓' : 'COPY'}
          </motion.button>
        )}
        <motion.button onClick={() => { SFX.click(); link.action() }} whileTap={{ scale: 0.94 }} data-cursor="hover"
          style={{
            fontFamily: 'JetBrains Mono', fontSize: 8, letterSpacing: '0.1em',
            color: link.color, background: `${link.color}0e`,
            border: `1px solid ${link.color}40`,
            padding: '3px 10px', cursor: 'none',
          }}>
          OPEN ›
        </motion.button>
      </div>
    </div>
  )
}

// ─── Message form ─────────────────────────────────────────────
function MessageForm() {
  const [form, setForm]       = useState({ name: '', email: '', message: '' })
  const [status, setStatus]   = useState('idle') // idle | sending | success | error
  const [errMsg, setErrMsg]   = useState('')

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSend() {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrMsg('All fields are required.')
      return
    }
    if (!form.email.includes('@')) {
      setErrMsg('Enter a valid email address.')
      return
    }
    setErrMsg('')
    setStatus('sending')
    SFX.click()

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrMsg(data.error || 'Something went wrong. Try again.')
        setStatus('error')
      } else {
        setStatus('success')
        setForm({ name: '', email: '', message: '' })
        SFX.fragmentCollect()
      }
    } catch {
      setErrMsg('Connection failed. Check your internet and try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: '24px 20px', textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        }}
      >
        <motion.div
          animate={{ scale: [0.8, 1.2, 1] }}
          transition={{ duration: 0.4 }}
          style={{ fontSize: 28, color: '#60d8a0' }}
        >
          ✓
        </motion.div>
        <div style={{ fontFamily: 'Orbitron', fontSize: 12, color: '#60d8a0', letterSpacing: '0.1em' }}>
          TRANSMISSION SENT
        </div>
        <div style={{ fontFamily: 'Space Grotesk', fontSize: 12, color: 'rgba(216,228,240,0.65)' }}>
          Message delivered. I'll get back to you soon.
        </div>
        <button
          onClick={() => setStatus('idle')}
          data-cursor="hover"
          style={{
            fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: '0.12em',
            color: '#38b8d8', background: 'transparent',
            border: '1px solid rgba(56,184,216,0.3)',
            padding: '6px 16px', cursor: 'none', marginTop: 4,
          }}
        >
          SEND ANOTHER
        </button>
      </motion.div>
    )
  }

  const inputStyle = {
    width: '100%', background: 'rgba(8,11,24,0.8)',
    border: '1px solid rgba(56,184,216,0.18)',
    outline: 'none', color: '#d8e4f0',
    fontFamily: 'Space Grotesk', fontSize: 13,
    padding: '10px 12px',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  }

  const labelStyle = {
    fontFamily: 'JetBrains Mono', fontSize: 8,
    color: 'rgba(56,184,216,0.55)', letterSpacing: '0.18em',
    display: 'block', marginBottom: 5,
  }

  return (
    <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(56,184,216,0.5)', letterSpacing: '0.2em', marginBottom: 2 }}>
        SEND A MESSAGE
      </div>

      {/* Name */}
      <div>
        <label style={labelStyle}>NAME</label>
        <input
          name="name" value={form.name} onChange={handleChange}
          placeholder="Your name"
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = 'rgba(56,184,216,0.5)'}
          onBlur={e  => e.target.style.borderColor = 'rgba(56,184,216,0.18)'}
        />
      </div>

      {/* Email */}
      <div>
        <label style={labelStyle}>EMAIL</label>
        <input
          name="email" value={form.email} onChange={handleChange}
          placeholder="your@email.com" type="email"
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = 'rgba(56,184,216,0.5)'}
          onBlur={e  => e.target.style.borderColor = 'rgba(56,184,216,0.18)'}
        />
      </div>

      {/* Message */}
      <div>
        <label style={labelStyle}>MESSAGE</label>
        <textarea
          name="message" value={form.message} onChange={handleChange}
          placeholder="What's on your mind?"
          rows={4}
          style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
          onFocus={e => e.target.style.borderColor = 'rgba(56,184,216,0.5)'}
          onBlur={e  => e.target.style.borderColor = 'rgba(56,184,216,0.18)'}
        />
      </div>

      {/* Error */}
      {errMsg && (
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#e74c3c', letterSpacing: '0.05em' }}>
          ⚠ {errMsg}
        </div>
      )}

      {/* Send button */}
      <motion.button
        onClick={handleSend}
        disabled={status === 'sending'}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        data-cursor="hover"
        style={{
          fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.18em',
          color: status === 'sending' ? 'rgba(201,168,76,0.5)' : '#c9a84c',
          background: 'rgba(201,168,76,0.08)',
          border: `1px solid ${status === 'sending' ? 'rgba(201,168,76,0.2)' : 'rgba(201,168,76,0.5)'}`,
          padding: '10px', cursor: 'none',
          transition: 'all 0.2s',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}
      >
        {status === 'sending' ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{ width: 10, height: 10, border: '1px solid rgba(201,168,76,0.4)', borderTop: '1px solid #c9a84c', borderRadius: '50%' }}
            />
            TRANSMITTING...
          </>
        ) : (
          '✉ SEND MESSAGE'
        )}
      </motion.button>
    </div>
  )
}

// ─── Main ContactOverlay ──────────────────────────────────────
export default function ContactOverlay({ open, onClose }) {
  const [tab, setTab] = useState('links') // links | message

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, zIndex: 5000, background: 'rgba(2,4,12,0.6)', backdropFilter: 'blur(6px)', cursor: 'none' }}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,   scale: 1 }}
            exit={{   opacity: 0, y: -12,  scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed', top: 70, right: 16,
              width: 'min(460px, calc(100vw - 32px))',
              zIndex: 5001,
              background: 'rgba(4,7,18,0.97)',
              border: '1px solid rgba(201,168,76,0.25)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.8)',
              overflow: 'hidden',
            }}
          >
            {/* Gold top bar */}
            <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #c9a84c, rgba(201,168,76,0.2), transparent)' }} />

            {/* Header */}
            <div style={{
              padding: '16px 20px 12px',
              borderBottom: '1px solid rgba(56,184,216,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontFamily: 'Orbitron', fontSize: 13, fontWeight: 700, color: '#c9a84c', letterSpacing: '0.12em' }}>
                  OPEN CHANNEL
                </div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(56,184,216,0.55)', letterSpacing: '0.15em', marginTop: 3 }}>
                  PURNAGYA RAJ · AVAILABLE FOR INTERNSHIPS
                </div>
              </div>
              <button onClick={onClose} data-cursor="hover"
                style={{
                  fontFamily: 'JetBrains Mono', fontSize: 9, color: 'rgba(216,228,240,0.5)',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                  padding: '4px 10px', cursor: 'none', letterSpacing: '0.1em',
                }}>
                ✕ CLOSE
              </button>
            </div>

            {/* Status bar */}
            <div style={{
              padding: '8px 20px', background: 'rgba(96,216,160,0.05)',
              borderBottom: '1px solid rgba(96,216,160,0.1)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <motion.div animate={{ opacity: [0.4,1,0.4] }} transition={{ duration: 2, repeat: Infinity }}
                style={{ width: 6, height: 6, borderRadius: '50%', background: '#60d8a0', boxShadow: '0 0 6px #60d8a0', flexShrink: 0 }} />
              <span style={{ fontFamily: 'Space Grotesk', fontSize: 12, color: 'rgba(216,228,240,0.8)' }}>
                Open to SWE internships · AI projects · Collaborations
              </span>
            </div>

            {/* Tab switcher */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(56,184,216,0.1)' }}>
              {[
                { key: 'links',   label: 'LINKS'   },
                { key: 'message', label: 'MESSAGE'  },
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => { setTab(t.key); SFX.click() }}
                  data-cursor="hover"
                  style={{
                    flex: 1, padding: '10px',
                    fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: '0.15em',
                    color: tab === t.key ? '#c9a84c' : 'rgba(56,184,216,0.45)',
                    background: tab === t.key ? 'rgba(201,168,76,0.06)' : 'transparent',
                    border: 'none',
                    borderBottom: `2px solid ${tab === t.key ? '#c9a84c' : 'transparent'}`,
                    cursor: 'none', transition: 'all 0.2s',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              {tab === 'links' ? (
                <motion.div key="links"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  {LINKS.map(link => <LinkRow key={link.label} link={link} />)}
                  <div style={{
                    padding: '12px 18px',
                    fontFamily: 'Libre Baskerville', fontStyle: 'italic',
                    fontSize: 12, color: 'rgba(216,228,240,0.4)',
                    textAlign: 'center', borderTop: '1px solid rgba(56,184,216,0.06)',
                  }}>
                    "If you are building something interesting — I want to hear about it."
                  </div>
                </motion.div>
              ) : (
                <motion.div key="message"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <MessageForm />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
