import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  RevealBlock, SectionTitle, MemoryFragment,
  Tag, StatCard, LoreCard, Section
} from '../shared/ModuleComponents'

// ─── Hero ─────────────────────────────────────────────────────
function MissionHero() {
  return (
    <div style={{
      position: 'relative', height: '65vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Radar sweep */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600, height: 600, pointerEvents: 'none',
      }}>
        {[100, 200, 300].map(r => (
          <div key={r} style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: r * 2, height: r * 2, borderRadius: '50%',
            border: '1px solid rgba(56,184,216,0.08)',
          }} />
        ))}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            width: 300, height: 1,
            transformOrigin: '0 50%',
            background: 'linear-gradient(90deg, rgba(56,184,216,0.6), transparent)',
          }}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.4em', color: 'rgba(56,184,216,0.6)', marginBottom: 16 }}
        >◈ MOD-04 · MISSION CONTROL ◈</motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          style={{
            fontFamily: 'Orbitron', fontSize: 'clamp(34px, 7vw, 68px)',
            fontWeight: 800, color: '#38b8d8',
            textShadow: '0 0 60px rgba(56,184,216,0.35)',
            letterSpacing: '0.08em', lineHeight: 1.1, marginBottom: 16,
          }}
        >ENGINEERING<br />MISSIONS</motion.div>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{ fontFamily: 'Libre Baskerville', fontStyle: 'italic', fontSize: 'clamp(13px, 1.8vw, 16px)', color: 'rgba(176,192,216,0.6)', maxWidth: 480, margin: '0 auto' }}
        >
          Every project is a mission briefing. Objectives, stack, outcome.
        </motion.div>
      </div>
    </div>
  )
}

// ─── Mission status badge ─────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    'DEPLOYED':    { color: '#60d8a0', bg: 'rgba(96,216,160,0.08)'  },
    'ACTIVE':      { color: '#38b8d8', bg: 'rgba(56,184,216,0.08)'  },
    'COMPLETED':   { color: '#c9a84c', bg: 'rgba(201,168,76,0.08)'  },
    'IN PROGRESS': { color: '#a070e0', bg: 'rgba(160,112,224,0.08)' },
  }
  const s = map[status] || map['ACTIVE']
  return (
    <div style={{
      fontFamily: 'JetBrains Mono', fontSize: 8, letterSpacing: '0.15em',
      color: s.color, background: s.bg,
      border: `1px solid ${s.color}30`,
      padding: '3px 10px', display: 'inline-flex', alignItems: 'center', gap: 5,
    }}>
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ width: 4, height: 4, borderRadius: '50%', background: s.color }}
      />
      {status}
    </div>
  )
}

// ─── Mission card (expandable) ────────────────────────────────
function MissionCard({ mission, index }) {
  const [open, setOpen] = useState(index === 0)
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-40px' })

  const c = mission.color

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      style={{
        border: `1px solid ${open ? c + '35' : c + '15'}`,
        background: 'rgba(8,11,24,0.7)',
        backdropFilter: 'blur(8px)',
        overflow: 'hidden',
        transition: 'border-color 0.3s',
      }}
    >
      {/* Header — always visible */}
      <button
        onClick={() => setOpen(o => !o)}
        data-cursor="hover"
        style={{
          width: '100%', background: 'none', border: 'none',
          cursor: 'none', padding: '22px 24px',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          gap: 16, alignItems: 'center',
          borderBottom: open ? `1px solid ${c}12` : 'none',
        }}
      >
        {/* Mission number */}
        <div style={{
          fontFamily: 'Orbitron', fontSize: 22, fontWeight: 800,
          color: `${c}25`, lineHeight: 1, minWidth: 40, textAlign: 'right',
        }}>
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Title block */}
        <div style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5, flexWrap: 'wrap' }}>
            <div style={{
              fontFamily: 'Orbitron', fontSize: 16, fontWeight: 700,
              color: open ? c : `${c}bb`, letterSpacing: '0.05em',
              transition: 'color 0.25s',
            }}>
              {mission.name}
            </div>
            <StatusBadge status={mission.status} />
          </div>
          <div style={{
            fontFamily: 'Space Grotesk', fontSize: 12,
            color: 'rgba(176,192,216,0.55)', lineHeight: 1.5,
          }}>
            {mission.tagline}
          </div>
        </div>

        {/* Toggle arrow */}
        <motion.div
          animate={{ rotate: open ? 90 : 0 }}
          style={{ color: `${c}60`, fontFamily: 'monospace', fontSize: 14, flexShrink: 0 }}
        >▶</motion.div>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '20px 24px 28px' }}>

              {/* Two-column layout: details + stack */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 24, marginBottom: 24,
              }}>
                {/* Mission briefing */}
                <div>
                  <div style={{
                    fontFamily: 'JetBrains Mono', fontSize: 8,
                    color: `${c}55`, letterSpacing: '0.2em', marginBottom: 8,
                  }}>
                    MISSION BRIEFING
                  </div>
                  <div style={{
                    fontFamily: 'Space Grotesk', fontSize: 13,
                    color: 'rgba(176,192,216,0.75)', lineHeight: 1.75,
                  }}>
                    {mission.description}
                  </div>
                </div>

                {/* Architecture */}
                <div>
                  <div style={{
                    fontFamily: 'JetBrains Mono', fontSize: 8,
                    color: `${c}55`, letterSpacing: '0.2em', marginBottom: 8,
                  }}>
                    TECH STACK
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {mission.stack.map(t => <Tag key={t} label={t} color={c} />)}
                  </div>
                </div>
              </div>

              {/* Metrics row */}
              {mission.metrics && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${mission.metrics.length}, 1fr)`,
                  gap: 12, marginBottom: 24,
                }}>
                  {mission.metrics.map(m => (
                    <div key={m.label} style={{
                      padding: '12px 16px',
                      background: `${c}06`,
                      border: `1px solid ${c}15`,
                      textAlign: 'center',
                    }}>
                      <div style={{ fontFamily: 'Orbitron', fontSize: 18, fontWeight: 700, color: c }}>{m.value}</div>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: `${c}60`, letterSpacing: '0.1em', marginTop: 2 }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Mission log */}
              {mission.log && (
                <div style={{
                  padding: '14px 18px',
                  background: 'rgba(4,6,15,0.6)',
                  borderLeft: `2px solid ${c}40`,
                  marginBottom: 20,
                }}>
                  <div style={{
                    fontFamily: 'JetBrains Mono', fontSize: 8,
                    color: `${c}55`, letterSpacing: '0.2em', marginBottom: 6,
                  }}>
                    CAPTAIN'S LOG
                  </div>
                  <div style={{
                    fontFamily: 'Libre Baskerville', fontStyle: 'italic',
                    fontSize: 13, color: 'rgba(216,228,240,0.7)', lineHeight: 1.7,
                  }}>
                    {mission.log}
                  </div>
                </div>
              )}

              {/* Links */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {mission.github && (
                  <a
                    href={mission.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="hover"
                    style={{
                      fontFamily: 'JetBrains Mono', fontSize: 10,
                      color: c, border: `1px solid ${c}40`,
                      background: `${c}08`, padding: '7px 18px',
                      letterSpacing: '0.15em', textDecoration: 'none',
                      transition: 'background 0.2s, border-color 0.2s',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}
                  >
                    ⌥ GITHUB
                  </a>
                )}
                {mission.live && (
                  <a
                    href={mission.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="hover"
                    style={{
                      fontFamily: 'JetBrains Mono', fontSize: 10,
                      color: '#60d8a0', border: '1px solid rgba(96,216,160,0.3)',
                      background: 'rgba(96,216,160,0.06)', padding: '7px 18px',
                      letterSpacing: '0.15em', textDecoration: 'none',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}
                  >
                    ◉ LIVE
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Mission data ─────────────────────────────────────────────
const MISSIONS = [
  {
    name: 'SentinelAI',
    tagline: 'Autonomous Cyber Defense Simulator — 6-service microservices platform',
    status: 'DEPLOYED',
    color: '#38b8d8',
    description: 'A full-stack autonomous cybersecurity platform built for the Vultr Cloud Hackathon. Six microservices communicate through Redis Streams. A PyTorch MLP + Random Forest ensemble achieves 97%+ attack detection accuracy. The React SOC dashboard shows live attack timelines, defense responses, and system telemetry in real-time.',
    stack: ['React', 'FastAPI', 'PyTorch', 'Random Forest', 'Redis Streams', 'Docker', 'PostgreSQL', 'WebSockets', 'Vultr Cloud'],
    metrics: [
      { value: '97%+', label: 'DETECTION ACCURACY' },
      { value: '6',    label: 'MICROSERVICES'      },
      { value: '<50ms', label: 'RESPONSE TIME'     },
    ],
    log: 'Built at 2am, debugged at 4am, deployed at 6am. The Redis race condition that fired events 3x was the final boss. One config line fixed it. The satisfaction was disproportionate.',
    github: 'https://github.com/Purnagya08',
    live: null,
  },
  {
    name: 'HackFlow AI',
    tagline: 'AI-powered hackathon management platform — full-stack with ML microservice',
    status: 'DEPLOYED',
    color: '#a070e0',
    description: 'An end-to-end platform for running hackathons — from team registration to project evaluation. ML microservice scores projects automatically using NLP. Judges get AI-assisted summaries. Organizers get real-time dashboards. Built with Next.js 16 App Router, TypeScript, Prisma ORM, and a FastAPI ML service.',
    stack: ['Next.js 16', 'TypeScript', 'FastAPI', 'Prisma', 'PostgreSQL', 'TailwindCSS', 'JWT Auth', 'Vercel', 'Render'],
    metrics: [
      { value: '4',    label: 'USER ROLES'      },
      { value: 'ML',   label: 'AUTO-SCORING'    },
      { value: '2',    label: 'DEPLOYMENTS'     },
    ],
    log: 'Started as a hackathon submission, evolved into a real product. The moment the ML scorer graded a project correctly for the first time — that was the mission achieved.',
    github: 'https://github.com/Purnagya08',
    live: null,
  },
  {
    name: 'WarrantySafe',
    tagline: 'Consumer ownership and warranty management platform',
    status: 'ACTIVE',
    color: '#c9a84c',
    description: 'A platform for managing product warranties, ownership documents, and service reminders. Users upload receipts, get expiry alerts, and track claims. Built with Next.js frontend, Node.js/Express backend, PostgreSQL with structured PRD. Deployed on Vercel and Render.',
    stack: ['Next.js', 'Node.js', 'Express', 'PostgreSQL', 'TailwindCSS', 'Vercel', 'Render', 'JWT'],
    metrics: [
      { value: 'v1',  label: 'CURRENT VERSION' },
      { value: '2',   label: 'DEPLOYMENTS'     },
      { value: 'PRD', label: 'SPEC-DRIVEN'     },
    ],
    log: 'The kind of product you build because you personally needed it and couldn\'t find it. Real problem, real solution. Still flying.',
    github: 'https://github.com/Purnagya08',
    live: null,
  },
  {
    name: 'OCR Chatbot',
    tagline: 'Document intelligence — extract, understand, converse with your files',
    status: 'COMPLETED',
    color: '#60d8a0',
    description: 'An intelligent chatbot that reads documents through OCR, understands the content, and answers natural language questions about it. Combines computer vision with NLP. Upload a PDF or image, ask anything about it.',
    stack: ['Python', 'OpenCV', 'Tesseract OCR', 'FastAPI', 'React', 'OpenAI API', 'LangChain'],
    metrics: [
      { value: 'OCR', label: 'EXTRACTION'    },
      { value: 'NLP', label: 'UNDERSTANDING' },
      { value: 'Q&A', label: 'INTERACTION'   },
    ],
    log: 'Computer vision + NLP in one pipeline. The first time it answered a question about a scanned receipt correctly, I closed my laptop and went for a walk.',
    github: 'https://github.com/Purnagya08',
    live: null,
  },
  {
    name: 'MSME AI Financial Health Platform',
    tagline: 'AI loan strategy planner for small businesses',
    status: 'COMPLETED',
    color: '#38b8d8',
    description: 'React-based frontend with an AI-powered loan strategy feature for MSMEs. Analyzes business financials, suggests loan products, and generates repayment strategies using AI. Built to help small business owners navigate credit options without financial advisors.',
    stack: ['React', 'TailwindCSS', 'FastAPI', 'OpenAI API', 'Recharts', 'Node.js'],
    metrics: [
      { value: 'AI',  label: 'STRATEGY ENGINE' },
      { value: 'SME', label: 'TARGET USERS'    },
      { value: '1st', label: 'PROJECT TYPE'    },
    ],
    log: 'My earliest real project. Rough edges everywhere. But it worked — and it solved a problem. That matters more than clean code at the beginning.',
    github: 'https://github.com/Purnagya08',
    live: null,
  },
]

// ─── Main module ──────────────────────────────────────────────
export default function MissionControl() {
  return (
    <div style={{ background: 'transparent', minHeight: '100vh' }}>
      <MissionHero />

      <Section>
        <RevealBlock>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: 16, marginBottom: 56,
          }}>
            <StatCard value="5"  label="Missions Completed" icon="◎" color="#38b8d8" />
            <StatCard value="2"  label="Live Deployments"   icon="◉" color="#60d8a0" />
            <StatCard value="97" label="ML Accuracy %"      icon="⚡" color="#a070e0" />
            <StatCard value="6"  label="Microservices"      icon="⬢" color="#c9a84c" />
          </div>
        </RevealBlock>

        <SectionTitle label="Mission Log" code="MISSION·CONTROL" color="#38b8d8" sub="Every project. Every decision. Documented." />
        <LoreCard
          accent="#38b8d8"
          text="A project isn't a project until it's deployed. Or until it teaches you something that changes how you approach the next one. Every mission in this log did both."
        />

        <div style={{ marginTop: 32, marginBottom: 40 }}>
          <MemoryFragment
            id="MF-07"
            quote="SentinelAI taught me that distributed systems don't fail loudly — they fail politely, multiplying your mistakes until the logs look like abstract art."
            author="Mission Log — SentinelAI Post-Mortem"
          />
        </div>
      </Section>

      <Section style={{ paddingTop: 0 }}>
        <SectionTitle label="Active and Completed Missions" code="MISSION·ARCHIVE" color="#c9a84c" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {MISSIONS.map((m, i) => (
            <MissionCard key={m.name} mission={m} index={i} />
          ))}
        </div>

        <div style={{ marginTop: 40 }}>
          <MemoryFragment
            id="MF-08"
            quote="The gap between a project that works and a project worth showing is documentation, architecture, and the courage to deploy it publicly."
            author="Mission Log — Engineering Notes"
          />
        </div>
      </Section>

      <div style={{ height: 80 }} />
    </div>
  )
}
