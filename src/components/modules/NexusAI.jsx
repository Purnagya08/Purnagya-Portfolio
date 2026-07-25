import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SFX } from '../../audio/audioEngine'

// ─── Knowledge base ───────────────────────────────────────────
const KB = {
  whoispurnagya: {
    title: 'ENGINEER PROFILE',
    lines: [
      { label: 'Name',        value: 'Purnagya Raj' },
      { label: 'Degree',      value: 'B.Tech CSE — UEM Jaipur (2024–28)' },
      { label: 'GPA',         value: '8.795 / 10.0' },
      { label: 'Rank',        value: 'Top of 250+ cohort — 3 Semesters' },
      { label: 'Status',      value: 'Open to SWE Internships' },
      { label: 'Location',    value: 'Jaipur, Rajasthan, India' },
      { label: 'GitHub',      value: 'github.com/Purnagya08' },
      { label: 'LinkedIn',    value: 'linkedin.com/in/purnagya-raj' },
      { label: 'LeetCode',    value: 'leetcode.com/u/techXpurna' },
    ],
  },

  skills: {
    title: 'TECHNICAL SKILLS',
    lines: [
      { label: 'Languages',  value: 'Java (Expert) · Python · TypeScript · JavaScript · C++' },
      { label: 'Frontend',   value: 'React · Next.js · TailwindCSS · Framer Motion · Three.js' },
      { label: 'Backend',    value: 'Node.js · Express · FastAPI · REST API Design' },
      { label: 'AI / ML',    value: 'PyTorch · Scikit-learn · OpenCV · LangChain · Redis Streams' },
      { label: 'Databases',  value: 'PostgreSQL · Prisma ORM · Redis · MongoDB' },
      { label: 'DevOps',     value: 'Docker · GitHub Actions · Vercel · Render · Vite' },
      { label: 'Certif.',    value: 'NPTEL Java — 100/100 · IIT Kharagpur · Top 1% National' },
    ],
  },

  achievements: {
    title: 'ACHIEVEMENTS',
    lines: [
      { label: 'NPTEL Java',    value: '100/100 · Top 1% nationally among 19,000+ candidates' },
      { label: 'LaserHacks 25', value: 'International Finalist · Lasell Univ USA · 500+ teams' },
      { label: 'Hackathon',     value: '2x Inter-College Winner · 2x National Finalist' },
      { label: 'Academic',      value: '8.795 GPA · 3x Semester Rank Holder · 250+ cohort' },
      { label: 'LinkedIn',      value: '#365DaysUpskillingMyself · 2000+ Followers' },
      { label: 'HackerRank',    value: '5-Star Java Badge' },
    ],
  },

  projects: {
    title: 'PROJECTS',
    lines: [
      { label: 'SentinelAI',   value: '6-service cyber platform · PyTorch 97%+ accuracy · Docker + Redis' },
      { label: 'HackFlow AI',  value: 'Hackathon management · Next.js 16 · FastAPI ML · PostgreSQL' },
      { label: 'WarrantySafe', value: 'Consumer warranty platform · Next.js + Node.js · Active build' },
      { label: 'OCR Chatbot',  value: 'Document Q&A · Tesseract + LangChain + OpenAI' },
      { label: 'MSME AI',      value: 'Loan strategy planner · React + FastAPI · AI-powered' },
    ],
  },

  learnings: {
    title: 'CURRENT LEARNINGS',
    lines: [
      { label: 'System Design', value: 'Scalable architecture · HLD / LLD patterns' },
      { label: 'DSA',           value: 'Advanced DP · Graph algorithms · Competitive programming' },
      { label: 'ML Research',   value: 'Transformer internals · Attention mechanism · Fine-tuning' },
      { label: 'Building',      value: 'WarrantySafe v1 · Full-stack · Shipping soon' },
      { label: 'Reading',       value: 'Designing Data-Intensive Apps · Clean Architecture' },
      { label: 'Grind',         value: 'LeetCode daily · Targeting Top 500 Java on HackerRank' },
    ],
  },

  contact: {
    title: 'CONTACT',
    lines: [
      { label: 'GitHub',    value: 'github.com/Purnagya08' },
      { label: 'LinkedIn',  value: 'linkedin.com/in/purnagya-raj' },
      { label: 'LeetCode',  value: 'leetcode.com/u/techXpurna' },
      { label: 'Email',     value: 'purnagya.raj26nov@gmail.com' },
      { label: 'Open to',   value: 'SWE Internships · AI Projects · Collaborations' },
      { label: 'Profile',   value: 'Type "profile" or click CAPTAIN in top-right HUD' },
    ],
  },

  stack: {
    title: 'TECH STACK DETAILS',
    lines: [
      { label: 'Expert',    value: 'Java · React · Next.js · Node.js · FastAPI' },
      { label: 'Proficient',value: 'TypeScript · PostgreSQL · Docker · PyTorch' },
      { label: 'Learning',  value: 'System Design · Advanced Algorithms · Transformers' },
      { label: 'Deployed',  value: 'Vercel · Render · GCR · Neon Postgres' },
    ],
  },
}

// ─── Command registry ─────────────────────────────────────────
const COMMANDS = {
  help: {
    desc: 'Show all commands',
    run: () => ({
      type: 'help',
      commands: Object.entries(COMMANDS).map(([k, v]) => ({ cmd: k, desc: v.desc })),
    }),
  },
  whoispurnagya: { desc: 'Engineer profile',      run: () => ({ type: 'data', ...KB.whoispurnagya }) },
  skills:        { desc: 'Technical skill set',   run: () => ({ type: 'data', ...KB.skills })        },
  achievements:  { desc: 'Awards and milestones', run: () => ({ type: 'data', ...KB.achievements })  },
  projects:      { desc: 'Project portfolio',     run: () => ({ type: 'data', ...KB.projects })      },
  learnings:     { desc: 'Current learnings',     run: () => ({ type: 'data', ...KB.learnings })     },
  contact:       { desc: 'Contact information',   run: () => ({ type: 'data', ...KB.contact })       },
  stack:         { desc: 'Tech stack breakdown',  run: () => ({ type: 'data', ...KB.stack })         },
  clear:         { desc: 'Clear the screen',      run: () => ({ type: 'clear' })                     },
}

const CMD_KEYS = Object.keys(COMMANDS)

// ─── Result renderer ──────────────────────────────────────────
function ResultBlock({ result }) {
  if (!result) return null

  if (result.type === 'help') {
    return (
      <div style={{ marginTop: 4 }}>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(56,184,216,0.75)', letterSpacing: '0.2em', marginBottom: 10 }}>
          NEXUS ARCHIVE — AVAILABLE QUERIES
        </div>
        {result.commands.map(({ cmd, desc }) => (
          <div key={cmd} style={{ display: 'flex', gap: 12, marginBottom: 5 }}>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#c9a84c', minWidth: 120, flexShrink: 0 }}>{cmd}</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'rgba(176,192,216,0.7)' }}>{desc}</span>
          </div>
        ))}
      </div>
    )
  }

  if (result.type === 'data') {
    return (
      <div style={{ marginTop: 4 }}>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(56,184,216,0.75)', letterSpacing: '0.2em', marginBottom: 10 }}>
          {result.title}
        </div>
        <div style={{ height: 1, background: 'rgba(56,184,216,0.12)', marginBottom: 10 }} />
        {result.lines.map((line, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 7, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#c9a84c', minWidth: 110, flexShrink: 0 }}>{line.label}</span>
            <span style={{ fontFamily: 'Space Grotesk', fontSize: 12, color: 'rgba(216,228,240,0.85)', flex: 1 }}>{line.value}</span>
          </div>
        ))}
      </div>
    )
  }

  if (result.type === 'error') {
    return (
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'rgba(231,76,60,0.8)', marginTop: 4 }}>
        ⚠ {result.message}
      </div>
    )
  }

  return null
}

// ─── Suggestion chips ─────────────────────────────────────────
const SUGGESTIONS = ['whoispurnagya', 'skills', 'achievements', 'projects', 'learnings', 'contact', 'stack', 'help']

// ─── Main NexusAI module ──────────────────────────────────────
export default function NexusAI() {
  const [history, setHistory]       = useState([])
  const [input,   setInput]         = useState('')
  const [suggest, setSuggest]       = useState('')
  const [cmdHist, setCmdHist]       = useState([])
  const [histIdx, setHistIdx]       = useState(-1)
  const [showSuggestions, setShowSuggestions] = useState(true)

  const scrollRef = useRef()
  const inputRef  = useRef()

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [history])

  const runCommand = useCallback((cmd) => {
    const c = cmd.trim().toLowerCase()
    setShowSuggestions(false)
    SFX.click()

    if (!c) return

    const handler = COMMANDS[c]
    let result

    if (handler) {
      result = handler.run()
    } else {
      // Fuzzy hint
      const close = CMD_KEYS.find(k => k.includes(c) || c.includes(k.slice(0, 4)))
      result = {
        type: 'error',
        message: `"${c}" not found.${close ? ` Did you mean: ${close}?` : ''} Type 'help' to list commands.`,
      }
    }

    if (result.type === 'clear') {
      setHistory([])
      return
    }

    setHistory(prev => [...prev, { cmd: c, result }])
    setCmdHist(prev => [c, ...prev.slice(0, 49)])
    setHistIdx(-1)
    setInput('')
    setSuggest('')
  }, [])

  const onKeyDown = useCallback((e) => {
    if (e.key === 'Tab' && suggest) {
      e.preventDefault()
      setInput(suggest)
      setSuggest('')
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      runCommand(input)
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(histIdx + 1, cmdHist.length - 1)
      setHistIdx(next)
      setInput(cmdHist[next] ?? '')
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(histIdx - 1, -1)
      setHistIdx(next)
      setInput(next === -1 ? '' : cmdHist[next] ?? '')
    }
    SFX.keypress()
  }, [input, suggest, histIdx, cmdHist, runCommand])

  const onInputChange = (e) => {
    const val = e.target.value
    setInput(val)
    if (val) {
      const match = CMD_KEYS.find(k => k.startsWith(val.toLowerCase()) && k !== val.toLowerCase())
      setSuggest(match ?? '')
    } else {
      setSuggest('')
    }
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: 'calc(100vh - 48px)',
      background: 'transparent',
    }}>
      {/* Header */}
      <div style={{ padding: '20px 28px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 4 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
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
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', inset: -4, border: '1px dashed rgba(56,184,216,0.25)', borderRadius: '50%' }}
            />
          </div>
          <div>
            <div style={{ fontFamily: 'Orbitron', fontSize: 14, fontWeight: 700, color: '#38b8d8', letterSpacing: '0.1em' }}>
              NEXUS AI
            </div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(56,184,216,0.75)', letterSpacing: '0.15em' }}>
              ARCHIVE INTELLIGENCE · QUERY SYSTEM
            </div>
          </div>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono', fontSize: 8, color: '#60d8a0', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: 5 }}
          >
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#60d8a0', boxShadow: '0 0 6px #60d8a0' }} />
            ONLINE
          </motion.div>
        </div>
        <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(56,184,216,0.2), transparent)', marginTop: 14 }} />
      </div>

      {/* Suggestion chips — initial state */}
      {showSuggestions && history.length === 0 && (
        <div style={{ padding: '14px 28px 0', flexShrink: 0 }}>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(56,184,216,0.75)', letterSpacing: '0.15em', marginBottom: 10 }}>
            QUERY THE ARCHIVE
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {SUGGESTIONS.map(s => (
              <motion.button
                key={s}
                onClick={() => runCommand(s)}
                whileHover={{ scale: 1.03, borderColor: 'rgba(56,184,216,0.5)' }}
                whileTap={{ scale: 0.97 }}
                data-cursor="hover"
                style={{
                  fontFamily: 'Space Grotesk', fontSize: 11,
                  color: 'rgba(56,184,216,0.8)',
                  background: 'rgba(56,184,216,0.05)',
                  border: '1px solid rgba(56,184,216,0.18)',
                  padding: '6px 14px', cursor: 'none',
                  letterSpacing: '0.05em',
                  transition: 'all 0.18s',
                }}
              >
                {s}
              </motion.button>
            ))}
          </div>
          <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(56,184,216,0.1), transparent)', marginTop: 14 }} />
        </div>
      )}

      {/* Conversation history */}
      <div
        ref={scrollRef}
        style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '16px 28px', scrollbarWidth: 'none' }}
      >
        <AnimatePresence initial={false}>
          {history.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              style={{ marginBottom: 24 }}
            >
              {/* Command echo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{
                  fontFamily: 'JetBrains Mono', fontSize: 9,
                  color: '#c9a84c', letterSpacing: '0.12em',
                }}>
                  NEXUS›
                </div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#d8e4f0' }}>
                  {entry.cmd}
                </div>
              </div>
              {/* Result */}
              <div style={{
                padding: '14px 18px',
                background: 'rgba(8,11,24,0.6)',
                border: '1px solid rgba(56,184,216,0.1)',
                backdropFilter: 'blur(8px)',
              }}>
                <ResultBlock result={entry.result} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div style={{
        flexShrink: 0,
        padding: '10px 28px 18px',
        borderTop: '1px solid rgba(56,184,216,0.08)',
        background: 'rgba(4,6,15,0.7)',
        backdropFilter: 'blur(16px)',
      }}>
        <div style={{
          display: 'flex', gap: 10, alignItems: 'center',
          background: 'rgba(8,11,24,0.8)',
          border: `1px solid ${input ? 'rgba(56,184,216,0.3)' : 'rgba(56,184,216,0.1)'}`,
          padding: '10px 14px',
          position: 'relative',
          transition: 'border-color 0.2s',
        }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'rgba(56,184,216,0.75)', flexShrink: 0 }}>›</span>

          {/* Ghost autocomplete */}
          {suggest && (
            <span style={{
              position: 'absolute', left: 38, top: '50%', transform: 'translateY(-50%)',
              fontFamily: 'JetBrains Mono', fontSize: 13,
              color: 'rgba(56,184,216,0.75)', pointerEvents: 'none', userSelect: 'none',
              whiteSpace: 'pre',
            }}>
              {suggest}
            </span>
          )}

          <input
            ref={inputRef}
            value={input}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
            placeholder="Type a command or press TAB..."
            autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              fontFamily: 'JetBrains Mono', fontSize: 13,
              color: '#d8e4f0', caretColor: '#38b8d8',
            }}
          />
          <motion.button
            onClick={() => runCommand(input)}
            disabled={!input.trim()}
            whileHover={input.trim() ? { scale: 1.04 } : {}}
            whileTap={input.trim() ? { scale: 0.96 } : {}}
            data-cursor="hover"
            style={{
              fontFamily: 'JetBrains Mono', fontSize: 9,
              letterSpacing: '0.15em',
              color: input.trim() ? '#38b8d8' : 'rgba(56,184,216,0.75)',
              background: input.trim() ? 'rgba(56,184,216,0.08)' : 'transparent',
              border: `1px solid ${input.trim() ? 'rgba(56,184,216,0.3)' : 'rgba(56,184,216,0.08)'}`,
              padding: '5px 12px', cursor: 'none', flexShrink: 0,
              transition: 'all 0.18s',
            }}
          >
            QUERY
          </motion.button>
        </div>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(56,184,216,0.75)', letterSpacing: '0.1em', marginTop: 7, textAlign: 'center' }}>
          TAB autocomplete · ↑↓ history · ENTER execute
        </div>
      </div>
    </div>
  )
}
