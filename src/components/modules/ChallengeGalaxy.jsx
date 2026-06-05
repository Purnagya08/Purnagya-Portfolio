import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  RevealBlock, SectionTitle, MemoryFragment,
  Tag, StatCard, LoreCard, Section
} from '../shared/ModuleComponents'

// ─── Hero ─────────────────────────────────────────────────────
function ChallengeHero() {
  return (
    <div style={{
      position: 'relative', height: '65vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Star burst pattern */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            width: 1, height: '35vw',
            background: `linear-gradient(180deg, rgba(160,112,224,${0.08 - i * 0.008}), transparent)`,
            transformOrigin: 'top center',
            transform: `translate(-50%, 0) rotate(${i * 45}deg)`,
          }}
          animate={{ opacity: [0.3, 0.7, 0.3], scaleY: [0.95, 1.05, 0.95] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.4em', color: 'rgba(160,112,224,0.6)', marginBottom: 16 }}
        >
          ◈ MOD-03 · CHALLENGE GALAXY ◈
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          style={{
            fontFamily: 'Orbitron', fontSize: 'clamp(34px, 7vw, 68px)',
            fontWeight: 800, color: '#a070e0',
            textShadow: '0 0 60px rgba(160,112,224,0.35)',
            letterSpacing: '0.08em', lineHeight: 1.1, marginBottom: 16,
          }}
        >
          COMPETE.<br />FAIL. LEARN.<br />REPEAT.
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{ fontFamily: 'Libre Baskerville', fontStyle: 'italic', fontSize: 'clamp(13px, 1.8vw, 16px)', color: 'rgba(176,192,216,0.6)', maxWidth: 480, margin: '0 auto' }}
        >
          Every failure was a bug report. Every win was a deployment.
        </motion.div>
      </div>
    </div>
  )
}

// ─── Hackathon card ───────────────────────────────────────────
function HackathonCard({ event, result, description, team, tech, outcome, color = '#a070e0', index }) {
  const [hover, setHover] = useState(false)
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-40px' })

  const isWin = result.toLowerCase().includes('win') || result.toLowerCase().includes('finalist') || result.toLowerCase().includes('1st')

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      data-cursor="hover"
      style={{
        padding: '24px',
        background: hover ? 'rgba(12,16,32,0.9)' : 'rgba(8,11,24,0.65)',
        border: `1px solid ${hover ? color + '50' : color + '18'}`,
        backdropFilter: 'blur(8px)',
        transition: 'background 0.25s, border-color 0.25s',
        position: 'relative', overflow: 'hidden',
        cursor: 'none',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <div>
          <div style={{
            fontFamily: 'Orbitron', fontSize: 15, fontWeight: 700,
            color: hover ? color : `${color}cc`,
            letterSpacing: '0.05em', marginBottom: 4,
            transition: 'color 0.25s',
          }}>
            {event}
          </div>
          {team && (
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'rgba(176,192,216,0.4)', letterSpacing: '0.1em' }}>
              TEAM: {team}
            </div>
          )}
        </div>
        <div style={{
          fontFamily: 'Orbitron', fontSize: 11, fontWeight: 600,
          color: isWin ? '#60d8a0' : '#c9a84c',
          background: isWin ? 'rgba(96,216,160,0.1)' : 'rgba(201,168,76,0.08)',
          border: `1px solid ${isWin ? 'rgba(96,216,160,0.25)' : 'rgba(201,168,76,0.2)'}`,
          padding: '4px 12px',
          whiteSpace: 'nowrap',
          letterSpacing: '0.05em',
          flexShrink: 0,
        }}>
          {result}
        </div>
      </div>

      <div style={{
        fontFamily: 'Space Grotesk', fontSize: 13,
        color: 'rgba(176,192,216,0.7)', lineHeight: 1.7, marginBottom: 12,
      }}>
        {description}
      </div>

      {outcome && (
        <div style={{
          fontFamily: 'Libre Baskerville', fontStyle: 'italic',
          fontSize: 12, color: `${color}80`,
          borderLeft: `2px solid ${color}30`, paddingLeft: 10,
          marginBottom: 12, lineHeight: 1.6,
        }}>
          {outcome}
        </div>
      )}

      {tech && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {tech.map(t => <Tag key={t} label={t} color={color} />)}
        </div>
      )}

      {/* Corner accent */}
      <div style={{
        position: 'absolute', top: 0, right: 0, width: 0, height: 0,
        borderLeft: `20px solid transparent`,
        borderTop: `20px solid ${color}20`,
      }} />
    </motion.div>
  )
}

// ─── Failure / debugging story card ───────────────────────────
function DebugStory({ title, bug, fix, lesson, index }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      style={{
        border: '1px solid rgba(231,76,60,0.15)',
        background: 'rgba(8,11,24,0.65)',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        data-cursor="hover"
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'none',
          padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
        }}
      >
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'rgba(231,76,60,0.1)',
          border: '1px solid rgba(231,76,60,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          fontFamily: 'monospace', fontSize: 12, color: '#e74c3c',
        }}>
          ✕
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Space Grotesk', fontSize: 13, fontWeight: 600, color: '#d8e4f0' }}>
            {title}
          </div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'rgba(231,76,60,0.5)', letterSpacing: '0.1em', marginTop: 2 }}>
            BUG REPORT · CLICK TO EXPAND
          </div>
        </div>
        <motion.div
          animate={{ rotate: open ? 90 : 0 }}
          style={{ color: 'rgba(231,76,60,0.4)', fontFamily: 'monospace', fontSize: 12 }}
        >
          ▶
        </motion.div>
      </button>

      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        style={{ overflow: 'hidden' }}
      >
        <div style={{ padding: '4px 20px 20px', borderTop: '1px solid rgba(231,76,60,0.1)' }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'rgba(231,76,60,0.5)', letterSpacing: '0.15em', marginBottom: 5 }}>THE BUG</div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 12, color: 'rgba(176,192,216,0.7)', lineHeight: 1.6 }}>{bug}</div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'rgba(96,216,160,0.5)', letterSpacing: '0.15em', marginBottom: 5 }}>THE FIX</div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 12, color: 'rgba(176,192,216,0.7)', lineHeight: 1.6 }}>{fix}</div>
          </div>
          <div style={{ padding: '10px 14px', background: 'rgba(201,168,76,0.05)', borderLeft: '2px solid rgba(201,168,76,0.3)' }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(201,168,76,0.5)', letterSpacing: '0.15em', marginBottom: 4 }}>LESSON LOGGED</div>
            <div style={{ fontFamily: 'Libre Baskerville', fontStyle: 'italic', fontSize: 12, color: 'rgba(201,168,76,0.8)', lineHeight: 1.6 }}>{lesson}</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Main Challenge Galaxy ────────────────────────────────────
export default function ChallengeGalaxy() {
  const hackathons = [
    {
      event: 'LaserHacks 2025',
      result: 'International Finalist',
      description: 'International hackathon with participants from 20+ countries. Built an AI-powered solution under 36 hours. Reached the final round against teams from US, UK, and Southeast Asia.',
      team: 'Team HACK SHASTRA',
      tech: ['React', 'FastAPI', 'Python', 'AI/ML', 'Redis'],
      outcome: 'The most intense 36 hours of engineering I have ever lived through. Sleep-deprived, coffee-fueled, and absolutely alive.',
      color: '#c9a84c',
    },
    {
      event: 'Inter-College Hackathon',
      result: '1st Place — Winner',
      description: 'Competed against 60+ teams from 1st, 2nd, 3rd & 4th year. Built a full-stack AI platform in 24 hours. Judges praised the production quality and demo delivery.',
      team: 'Team HACK SHASTRA',
      tech: ['Next.js', 'Node.js', 'PostgreSQL', 'TailwindCSS'],
      outcome: 'Winning felt less like a reward and more like proof — proof that building things properly, even under time pressure, is always the right call.',
      color: '#60d8a0',
    },
    {
      event: 'National Hackathon Finals',
      result: 'National Finalist',
      description: 'Top 15 teams selected from over 800 national submissions. Presented SentinelAI — an autonomous cybersecurity platform — to a panel of industry judges.',
      team: 'Team HACK SHASTRA',
      tech: ['Docker', 'Redis Streams', 'FastAPI', 'PyTorch', 'React'],
      outcome: 'Making the national finals from a pool of 800 teams wasn\'t luck. It was architecture decisions made at 2am that no one saw coming.',
      color: '#38b8d8',
    },
    {
      event: 'ACEHACK 5.0',
      result: 'Top 10 Finalist',
      description: 'Built HackFlow AI — an AI-powered hackathon management platform with ML-based project evaluation, team matching, and mentor assignment.',
      team: 'Team HACK SHASTRA',
      tech: ['Next.js 16', 'TypeScript', 'FastAPI', 'Prisma', 'PostgreSQL'],
      outcome: 'Pre-Planned moves better approach hence maximised outcome. Learned more about leadership in 12 hours than in 12 months.',
      color: '#a070e0',
    },
  ]

  const debugStories = [
    {
      title: 'The Redis Stream That Consumed Everything',
      bug: 'During SentinelAI development, Redis Pub/Sub was firing duplicate events — the ML pipeline was processing every attack packet 3x. The entire simulation was running at 300% capacity.',
      fix: 'Found a race condition in the consumer group configuration. Three microservices were all subscribing to the same stream without proper consumer group partitioning. One config line fix.',
      lesson: 'Distributed systems don\'t fail loudly. They fail politely, silently multiplying your mistakes until you question reality itself.',
    },
    {
      title: 'Docker TLS Failure in Production — Jaipur Edition',
      bug: 'Docker Hub TLS handshake failures on the deployment machine in Jaipur. The images wouldn\'t pull. The hackathon deadline was in 4 hours.',
      fix: 'Switched to Google Container Registry (GCR) as a mirror. Rewrote the docker-compose.yml to pull from GCR instead. Deployed in 20 minutes.',
      lesson: 'Infra problems don\'t care about your deadlines. Having a backup registry and knowing how to pivot fast is part of engineering, not an edge case.',
    },
    {
      title: 'The 2am Segmentation Fault',
      bug: 'A C++ submission for a competitive programming problem kept segfaulting on edge cases. Spent 3 hours staring at pointer arithmetic that looked perfectly correct.',
      fix: 'Off-by-one error in array initialization. Index was 0 to n, but array was sized n, not n+1.',
      lesson: 'The bug is never where you\'re looking. It\'s always one scope level above where your intuition takes you first.',
    },
    {
      title: 'The Silent JWT Expiry',
      bug: 'HackFlow AI users were getting mysteriously logged out. No error, no alert, just silent session death. Took two days to reproduce.',
      fix: 'JWT tokens were expiring at midnight UTC, but the refresh endpoint had a timezone mismatch. Frontend was comparing local time vs UTC expiry.',
      lesson: 'Time is the most deceptive variable in software. Always store and compare in UTC. Always.',
    },
  ]

  return (
    <div style={{ background: 'transparent', minHeight: '100vh' }}>
      <ChallengeHero />

      {/* Stats */}
      <Section>
        <RevealBlock>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16, marginBottom: 56 }}>
            <StatCard value="4"    label="Hackathons Entered"   icon="⚡" color="#a070e0" />
            <StatCard value="3"    label="Finals Reached"       icon="★" color="#c9a84c" />
            <StatCard value="1"    label="International Stage"  icon="🌍" color="#38b8d8" />
            <StatCard value="800"  label="Teams Outranked"      icon="◎" color="#60d8a0" />
          </div>
        </RevealBlock>

        <SectionTitle label="Battle Record" code="MISSION·LOG" color="#a070e0" sub="Every entry is a story." />
        <LoreCard
          accent="#a070e0"
          text="Hackathons aren't competitions. They're simulations. 24 hours of compressed engineering time, where the gap between 'can you build it' and 'can you build it well under pressure' becomes very, very visible. I've been on both sides of that gap."
        />

        <div style={{ marginTop: 32, marginBottom: 40 }}>
          <MemoryFragment
            id="MF-05"
            quote="LaserHacks 2025. International Finalist. 36 hours. I looked at the other teams and thought: we're not smaller, we're just less known. That changes tonight."
            author="Battle Log — LaserHacks 2025"
          />
        </div>
      </Section>

      {/* Hackathon records */}
      <Section style={{ paddingTop: 0 }}>
        <SectionTitle label="Hackathon Records" code="CHALLENGE·GALAXY" color="#c9a84c" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {hackathons.map((h, i) => (
            <HackathonCard key={h.event} {...h} index={i} />
          ))}
        </div>
      </Section>

      {/* Debug stories */}
      <Section style={{ paddingTop: 0 }}>
        <SectionTitle label="Bug Report Archive" code="DEBUGGING·LOGS" color="#e74c3c" sub="The failures that made me." />
        <LoreCard
          accent="#e74c3c"
          text="The best engineers I know have the longest debugging stories. Not because they write buggy code — but because they take on problems hard enough to produce interesting failures. Here are mine."
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
          {debugStories.map((s, i) => (
            <DebugStory key={s.title} {...s} index={i} />
          ))}
        </div>

        <div style={{ marginTop: 32 }}>
          <MemoryFragment
            id="MF-06"
            quote="Every bug you fix teaches you something a tutorial never could. The curriculum of real engineering is written entirely in error messages."
            author="Debug Archive — Captain's Note"
          />
        </div>
      </Section>

      {/* Lessons section */}
      <Section style={{ paddingTop: 0 }}>
        <SectionTitle label="Lessons From the Galaxy" code="CAPTAIN·LOG" color="#60d8a0" sub="Hard-won. Non-transferable. Yours anyway." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {[
            { num: '01', lesson: 'Ship a working demo. A perfect unfinished product loses to a rough working one every single time.' },
            { num: '02', lesson: 'Documentation is part of the build. If you can\'t explain it, you don\'t understand it yet.' },
            { num: '03', lesson: 'Sleep is infrastructure. 4 hours of sharp thinking beats 12 hours of foggy grinding.' },
            { num: '04', lesson: 'The team that communicates wins. Not the team with the best individual skills.' },
            { num: '05', lesson: 'Start with the demo flow, then build backwards. Judges see the demo, not the internals.' },
            { num: '06', lesson: 'Failure is just telemetry. Collect it, analyze it, improve the system.' },
          ].map(item => (
            <RevealBlock key={item.num}>
              <div style={{
                padding: '18px 20px',
                background: 'rgba(8,11,24,0.6)',
                border: '1px solid rgba(96,216,160,0.1)',
                height: '100%',
              }}>
                <div style={{
                  fontFamily: 'Orbitron', fontSize: 22, fontWeight: 800,
                  color: 'rgba(96,216,160,0.15)', marginBottom: 8,
                }}>
                  {item.num}
                </div>
                <div style={{
                  fontFamily: 'Space Grotesk', fontSize: 13,
                  color: 'rgba(176,192,216,0.7)', lineHeight: 1.7,
                }}>
                  {item.lesson}
                </div>
              </div>
            </RevealBlock>
          ))}
        </div>
      </Section>

      <div style={{ height: 80 }} />
    </div>
  )
}
