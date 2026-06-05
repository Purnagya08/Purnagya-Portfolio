import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SFX } from '../../audio/audioEngine'

// ─── Purnagya's knowledge base fed to the AI ─────────────────
const SYSTEM_PROMPT = `You are NEXUS AI — the personal archive assistant embedded in Purnagya Raj's portfolio. You have deep knowledge of Purnagya's background, projects, skills, and journey. You speak with the voice of the portfolio itself: analytical, honest, and slightly poetic. You use short, precise answers. You never fabricate specifics — only speak from what you know.

ABOUT PURNAGYA RAJ:
- 3rd year B.Tech CSE student at UEM Jaipur (Batch 2024-28)
- 9.0 GPA, 3x Semester Rank Holder in 250+ student cohort
- HackerRank: 5-star Java badge
- LinkedIn: linkedin.com/in/purnagya-raj | GitHub: github.com/Purnagya08

KEY PROJECTS:
1. SentinelAI — Autonomous cybersecurity simulation. 6 microservices, Redis Streams pipeline, PyTorch MLP + Random Forest ensemble (97%+ accuracy), React SOC dashboard. Built for Vultr Cloud Hackathon.
2. HackFlow AI — AI-powered hackathon management platform. Next.js 16, TypeScript, FastAPI ML microservice, Prisma, PostgreSQL. Deployed on Vercel + Render.
3. WarrantySafe — Consumer warranty management platform. Next.js, Node.js/Express, PostgreSQL. Currently in active development.
4. OCR Chatbot — Document intelligence. Tesseract OCR + OpenCV + LangChain + OpenAI. Ask questions about uploaded documents.
5. MSME Financial Platform — AI loan strategy planner for small businesses. React + FastAPI.

ACHIEVEMENTS:
- NPTEL Programming in Java: 100/100, Top 1% nationally, IIT Kharagpur (19,000+ candidates)
- LaserHacks 2025: International Finalist (Lasell University, USA, 500+ global teams)
- 2x Inter-College Hackathon Winner (Jaipur region, 40+ teams)
- 2x National Hackathon Finalist (Top 15 from 800+ teams)
- #365DaysOfUpskillingMyself LinkedIn challenge: 365 consecutive posts, 2000+ followers

TECHNICAL SKILLS:
- Languages: Java (expert), Python, TypeScript, JavaScript, C++
- Frontend: React, Next.js, TailwindCSS, Framer Motion
- Backend: Node.js, Express, FastAPI
- AI/ML: PyTorch, Scikit-learn, OpenCV, LangChain, Redis Streams
- DB: PostgreSQL, Prisma, Redis
- Tools: Docker, GitHub Actions, Vercel, Render, Vite

RESPONSE RULES:
- Be concise. Max 3-4 sentences unless a technical question needs more.
- Stay in character as NEXUS AI — the portfolio's intelligence layer.
- For questions outside Purnagya's profile, say "That data isn't in my archive" rather than making things up.
- Occasionally use phrases like "Captain's log shows...", "According to mission archives...", or "Station records indicate...".
- You can answer general coding/CS questions too — just be helpful.`

// ─── Suggested prompts ─────────────────────────────────────────
const SUGGESTIONS = [
  "What is SentinelAI?",
  "Tell me about Purnagya's NPTEL score",
  "What stack does he use?",
  "Explain the LaserHacks achievement",
  "What is he building right now?",
  "How did HackFlow AI work?",
  "What makes SentinelAI unique?",
  "What are his future goals?",
]

// ─── Message bubble ───────────────────────────────────────────
function MessageBubble({ message, isLast }) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 16,
      }}
    >
      {/* AI avatar dot */}
      {!isUser && (
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          border: '1px solid rgba(56,184,216,0.4)',
          background: 'rgba(8,11,24,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, marginRight: 10, marginTop: 2,
        }}>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: '#38b8d8' }}
          />
        </div>
      )}

      <div style={{
        maxWidth: '78%',
        padding: '12px 16px',
        background: isUser
          ? 'rgba(201,168,76,0.09)'
          : 'rgba(8,11,24,0.85)',
        border: isUser
          ? '1px solid rgba(201,168,76,0.25)'
          : '1px solid rgba(56,184,216,0.15)',
        position: 'relative',
        backdropFilter: 'blur(8px)',
      }}>
        {/* Role label */}
        <div style={{
          fontFamily: 'JetBrains Mono', fontSize: 8,
          color: isUser ? 'rgba(201,168,76,0.5)' : 'rgba(56,184,216,0.4)',
          letterSpacing: '0.15em', marginBottom: 6,
        }}>
          {isUser ? 'CAPTAIN' : 'NEXUS·AI'}
        </div>

        {/* Content */}
        <div style={{
          fontFamily: 'Space Grotesk', fontSize: 13,
          color: 'rgba(216,228,240,0.88)', lineHeight: 1.7,
          whiteSpace: 'pre-wrap', wordBreak: 'break-word',
        }}>
          {message.content}
        </div>
      </div>

      {/* User avatar */}
      {isUser && (
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          border: '1px solid rgba(201,168,76,0.4)',
          background: 'rgba(8,11,24,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, marginLeft: 10, marginTop: 2,
          fontFamily: 'Orbitron', fontSize: 9, color: '#c9a84c',
        }}>
          P
        </div>
      )}
    </motion.div>
  )
}

// ─── Thinking indicator ────────────────────────────────────────
function Thinking() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, paddingLeft: 38 }}
    >
      <div style={{
        padding: '10px 14px',
        background: 'rgba(8,11,24,0.85)',
        border: '1px solid rgba(56,184,216,0.15)',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(56,184,216,0.4)', letterSpacing: '0.15em', marginRight: 4 }}>
          NEXUS·AI
        </div>
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
            transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
            style={{ width: 4, height: 4, borderRadius: '50%', background: '#38b8d8' }}
          />
        ))}
      </div>
    </motion.div>
  )
}

// ─── Main NEXUS AI module ─────────────────────────────────────
export default function NexusAI() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "NEXUS AI online. I am the archive intelligence of this station — connected to Purnagya's full mission log, project database, and captain's notes.\n\nAsk me anything about the engineer behind this portfolio. Or ask a technical question. I'm listening.",
    },
  ])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const scrollRef               = useRef()
  const inputRef                = useRef()

  // Auto-scroll on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  const sendMessage = useCallback(async (text) => {
    const content = text || input.trim()
    if (!content || loading) return

    setInput('')
    setError(null)
    SFX.click()

    const userMsg = { role: 'user', content }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setLoading(true)

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!response.ok) throw new Error(`API error: ${response.status}`)

      const data = await response.json()
      const assistantText = data.content?.find(b => b.type === 'text')?.text || 'Archive query returned no data.'

      setMessages(prev => [...prev, { role: 'assistant', content: assistantText }])
      SFX.moduleEnter()
    } catch (err) {
      console.error('NEXUS AI error:', err)
      setError('Transmission failed. Archive link unstable.')
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Station alert: transmission interrupted. The archive link is temporarily unstable. Try again in a moment.',
      }])
    } finally {
      setLoading(false)
    }
  }, [input, messages, loading])

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
    SFX.keypress()
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: 'calc(100vh - 48px)',
      background: 'transparent',
      position: 'relative',
    }}>

      {/* Header */}
      <div style={{
        padding: '20px 28px 0',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 4 }}>
          <div style={{
            width: 36, height: 36,
            borderRadius: '50%',
            border: '1px solid rgba(56,184,216,0.4)',
            background: 'rgba(8,11,24,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 8, height: 8, borderRadius: '50%', background: '#38b8d8', boxShadow: '0 0 10px #38b8d8' }}
            />
            {/* Orbit ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute', inset: -4,
                border: '1px dashed rgba(56,184,216,0.25)',
                borderRadius: '50%',
              }}
            />
          </div>
          <div>
            <div style={{ fontFamily: 'Orbitron', fontSize: 14, fontWeight: 700, color: '#38b8d8', letterSpacing: '0.1em' }}>
              NEXUS AI
            </div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(56,184,216,0.45)', letterSpacing: '0.15em' }}>
              ARCHIVE INTELLIGENCE · ONLINE
            </div>
          </div>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              marginLeft: 'auto',
              fontFamily: 'JetBrains Mono', fontSize: 8,
              color: '#60d8a0', letterSpacing: '0.15em',
              display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#60d8a0', boxShadow: '0 0 6px #60d8a0' }} />
            CONNECTED
          </motion.div>
        </div>

        <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(56,184,216,0.2), transparent)', margin: '16px 0 0' }} />
      </div>

      {/* Suggestion chips — only show when minimal conversation */}
      {messages.length <= 1 && (
        <div style={{
          padding: '16px 28px 0',
          flexShrink: 0,
        }}>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(56,184,216,0.35)', letterSpacing: '0.15em', marginBottom: 10 }}>
            SUGGESTED QUERIES
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {SUGGESTIONS.map(s => (
              <motion.button
                key={s}
                onClick={() => sendMessage(s)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                data-cursor="hover"
                style={{
                  fontFamily: 'Space Grotesk', fontSize: 11,
                  color: 'rgba(56,184,216,0.7)',
                  background: 'rgba(56,184,216,0.05)',
                  border: '1px solid rgba(56,184,216,0.15)',
                  padding: '6px 12px', cursor: 'none',
                  transition: 'background 0.2s, border-color 0.2s',
                }}
              >
                {s}
              </motion.button>
            ))}
          </div>
          <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(56,184,216,0.1), transparent)', margin: '16px 0 0' }} />
        </div>
      )}

      {/* Messages */}
      <div
        ref={scrollRef}
        style={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden',
          padding: '20px 28px',
          scrollbarWidth: 'none',
        }}
      >
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            message={msg}
            isLast={i === messages.length - 1}
          />
        ))}
        <AnimatePresence>
          {loading && <Thinking />}
        </AnimatePresence>
      </div>

      {/* Input area */}
      <div style={{
        flexShrink: 0,
        padding: '12px 28px 20px',
        borderTop: '1px solid rgba(56,184,216,0.08)',
        background: 'rgba(4,6,15,0.7)',
        backdropFilter: 'blur(16px)',
      }}>
        <div style={{
          display: 'flex', gap: 10, alignItems: 'flex-end',
          background: 'rgba(8,11,24,0.8)',
          border: `1px solid ${input.length > 0 ? 'rgba(56,184,216,0.3)' : 'rgba(56,184,216,0.1)'}`,
          padding: '10px 14px',
          transition: 'border-color 0.2s',
        }}>
          <div style={{
            fontFamily: 'JetBrains Mono', fontSize: 11,
            color: 'rgba(56,184,216,0.4)', flexShrink: 0,
            alignSelf: 'center',
          }}>
            ›
          </div>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask the archive anything..."
            rows={1}
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              fontFamily: 'Space Grotesk', fontSize: 13,
              color: '#d8e4f0', resize: 'none',
              scrollbarWidth: 'none',
              lineHeight: 1.5,
              maxHeight: 100, overflow: 'auto',
            }}
          />
          <motion.button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            whileHover={input.trim() && !loading ? { scale: 1.05 } : {}}
            whileTap={input.trim() && !loading ? { scale: 0.95 } : {}}
            data-cursor="hover"
            style={{
              fontFamily: 'JetBrains Mono', fontSize: 10,
              letterSpacing: '0.15em',
              color: input.trim() && !loading ? '#38b8d8' : 'rgba(56,184,216,0.25)',
              background: input.trim() && !loading ? 'rgba(56,184,216,0.08)' : 'transparent',
              border: `1px solid ${input.trim() && !loading ? 'rgba(56,184,216,0.3)' : 'rgba(56,184,216,0.1)'}`,
              padding: '6px 14px', cursor: 'none',
              flexShrink: 0, alignSelf: 'center',
              transition: 'all 0.2s',
            }}
          >
            {loading ? '...' : 'SEND'}
          </motion.button>
        </div>
        <div style={{
          fontFamily: 'JetBrains Mono', fontSize: 8,
          color: 'rgba(56,184,216,0.2)', letterSpacing: '0.1em',
          marginTop: 8, textAlign: 'center',
        }}>
          ENTER to send · SHIFT+ENTER for new line · Powered by Claude
        </div>
      </div>
    </div>
  )
}
