import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SFX } from '../../audio/audioEngine'

function MessageForm({ onClose }) {
  const [form, setForm]     = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')
  const [errMsg, setErrMsg] = useState('')

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
          padding: '32px 24px', textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}
      >
        <motion.div
          animate={{ scale: [0.8, 1.2, 1] }}
          transition={{ duration: 0.4 }}
          style={{ fontSize: 32, color: '#60d8a0' }}
        >
          ✓
        </motion.div>
        <div style={{ fontFamily: 'Orbitron', fontSize: 13, color: '#60d8a0', letterSpacing: '0.1em' }}>
          TRANSMISSION SENT
        </div>
        <div style={{ fontFamily: 'Space Grotesk', fontSize: 13, color: 'rgba(216,228,240,0.65)', lineHeight: 1.6 }}>
          Message delivered successfully.<br />I'll get back to you soon.
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button
            onClick={() => setStatus('idle')}
            data-cursor="hover"
            style={{
              fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: '0.12em',
              color: '#38b8d8', background: 'transparent',
              border: '1px solid rgba(56,184,216,0.35)',
              padding: '7px 16px', cursor: 'none',
            }}
          >
            SEND ANOTHER
          </button>
          <button
            onClick={onClose}
            data-cursor="hover"
            style={{
              fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: '0.12em',
              color: '#c9a84c', background: 'rgba(201,168,76,0.08)',
              border: '1px solid rgba(201,168,76,0.35)',
              padding: '7px 16px', cursor: 'none',
            }}
          >
            CLOSE
          </button>
        </div>
      </motion.div>
    )
  }

  const inputStyle = {
    width: '100%', background: 'rgba(8,11,24,0.8)',
    border: '1px solid rgba(56,184,216,0.18)',
    outline: 'none', color: '#d8e4f0',
    fontFamily: 'Space Grotesk', fontSize: 13,
    padding: '10px 12px', transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  }

  const labelStyle = {
    fontFamily: 'JetBrains Mono', fontSize: 8,
    color: 'rgba(56,184,216,0.6)', letterSpacing: '0.18em',
    display: 'block', marginBottom: 5,
  }

  return (
    <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: 13 }}>
      {/* Name */}
      <div>
        <label style={labelStyle}>YOUR NAME</label>
        <input
          name="name" value={form.name} onChange={handleChange}
          placeholder="Purnagya Raj"
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = 'rgba(56,184,216,0.55)'}
          onBlur={e  => e.target.style.borderColor = 'rgba(56,184,216,0.18)'}
        />
      </div>

      {/* Email */}
      <div>
        <label style={labelStyle}>YOUR EMAIL</label>
        <input
          name="email" value={form.email} onChange={handleChange}
          placeholder="you@email.com" type="email"
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = 'rgba(56,184,216,0.55)'}
          onBlur={e  => e.target.style.borderColor = 'rgba(56,184,216,0.18)'}
        />
      </div>

      {/* Message */}
      <div>
        <label style={labelStyle}>MESSAGE</label>
        <textarea
          name="message" value={form.message} onChange={handleChange}
          placeholder="What's on your mind? Internship opportunity, collaboration, or just a hello..."
          rows={5}
          style={{ ...inputStyle, resize: 'none', lineHeight: 1.65 }}
          onFocus={e => e.target.style.borderColor = 'rgba(56,184,216,0.55)'}
          onBlur={e  => e.target.style.borderColor = 'rgba(56,184,216,0.18)'}
        />
      </div>

      {/* Error */}
      {errMsg && (
        <div style={{
          fontFamily: 'JetBrains Mono', fontSize: 9,
          color: '#e74c3c', letterSpacing: '0.05em',
          padding: '6px 10px',
          background: 'rgba(231,76,60,0.06)',
          border: '1px solid rgba(231,76,60,0.2)',
        }}>
          ⚠ {errMsg}
        </div>
      )}

      {/* Send */}
      <motion.button
        onClick={handleSend}
        disabled={status === 'sending'}
        whileHover={{ scale: status === 'sending' ? 1 : 1.02 }}
        whileTap={{ scale: 0.97 }}
        data-cursor="hover"
        style={{
          fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.18em',
          color: status === 'sending' ? 'rgba(201,168,76,0.45)' : '#c9a84c',
          background: 'rgba(201,168,76,0.08)',
          border: `1.5px solid ${status === 'sending' ? 'rgba(201,168,76,0.2)' : 'rgba(201,168,76,0.55)'}`,
          padding: '11px', cursor: 'none', transition: 'all 0.2s',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}
      >
        {status === 'sending' ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{
                width: 10, height: 10,
                border: '1.5px solid rgba(201,168,76,0.3)',
                borderTop: '1.5px solid #c9a84c',
                borderRadius: '50%',
              }}
            />
            TRANSMITTING...
          </>
        ) : (
          '⌨ SEND MESSAGE'
        )}
      </motion.button>

      <div style={{
        fontFamily: 'JetBrains Mono', fontSize: 8,
        color: 'rgba(56,184,216,0.25)', letterSpacing: '0.1em',
        textAlign: 'center',
      }}>
        Delivered to purnagya.raj26nov@gmail.com · Reply goes to your inbox
      </div>
    </div>
  )
}

export default function MessageOverlay({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 5000,
              background: 'rgba(2,4,12,0.6)',
              backdropFilter: 'blur(6px)',
              cursor: 'none',
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,   scale: 1 }}
            exit={{   opacity: 0, y: -12,  scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed',
              top: 70, right: 16,
              width: 'min(420px, calc(100vw - 32px))',
              zIndex: 5001,
              background: 'rgba(4,7,18,0.97)',
              border: '1px solid rgba(56,184,216,0.25)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.8)',
              overflow: 'hidden',
            }}
          >
            {/* Cyan top bar */}
            <div style={{
              height: 2,
              background: 'linear-gradient(90deg, transparent, #38b8d8, rgba(56,184,216,0.2), transparent)',
            }} />

            {/* Header */}
            <div style={{
              padding: '16px 20px 12px',
              borderBottom: '1px solid rgba(56,184,216,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{
                  fontFamily: 'Orbitron', fontSize: 13, fontWeight: 700,
                  color: '#38b8d8', letterSpacing: '0.12em',
                }}>
                  SEND MESSAGE
                </div>
                <div style={{
                  fontFamily: 'JetBrains Mono', fontSize: 8,
                  color: 'rgba(56,184,216,0.5)', letterSpacing: '0.15em', marginTop: 3,
                }}>
                  DIRECT TRANSMISSION · PURNAGYA RAJ
                </div>
              </div>
              <button
                onClick={onClose}
                data-cursor="hover"
                style={{
                  fontFamily: 'JetBrains Mono', fontSize: 9,
                  color: 'rgba(216,228,240,0.5)',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '4px 10px', cursor: 'none', letterSpacing: '0.1em',
                }}
              >
                ✕ CLOSE
              </button>
            </div>

            {/* Form */}
            <MessageForm onClose={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
