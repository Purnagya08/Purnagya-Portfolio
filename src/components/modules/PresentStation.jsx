import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  RevealBlock, SectionTitle, MemoryFragment,
  Tag, StatCard, LoreCard, Section
} from '../shared/ModuleComponents'

// ─── Hero ─────────────────────────────────────────────────────
function PresentHero() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const hh = String(time.getHours()).padStart(2, '0')
  const mm = String(time.getMinutes()).padStart(2, '0')
  const ss = String(time.getSeconds()).padStart(2, '0')

  return (
    <div style={{
      position: 'relative', height: '65vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Pulsing rings */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0, 0.15] }}
          transition={{ duration: 3, delay: i * 1, repeat: Infinity }}
          style={{
            position: 'absolute',
            width: i * 180, height: i * 180,
            borderRadius: '50%',
            border: '1px solid rgba(56,184,216,0.6)',
            top: '50%', left: '50%',
            marginTop: -(i * 90), marginLeft: -(i * 90),
          }}
        />
      ))}

      {/* Live clock */}
      <div style={{
        position: 'absolute', bottom: '18%',
        fontFamily: 'JetBrains Mono', fontSize: 13,
        color: 'rgba(56,184,216,0.7)', letterSpacing: '0.2em',
      }}>
        {hh}:{mm}:{ss} · LOCAL
      </div>

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.4em', color: 'rgba(56,184,216,0.6)', marginBottom: 16 }}
        >◈ MOD-07 · PRESENT STATION ◈</motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          style={{
            fontFamily: 'Orbitron', fontSize: 'clamp(34px, 7vw, 68px)',
            fontWeight: 800, color: '#38b8d8',
            textShadow: '0 0 60px rgba(56,184,216,0.65)',
            letterSpacing: '0.08em', lineHeight: 1.1, marginBottom: 16,
          }}
        >LIVE STATUS<br />RIGHT NOW</motion.div>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{ fontFamily: 'Libre Baskerville', fontStyle: 'italic', fontSize: 'clamp(13px, 1.8vw, 16px)', color: 'rgba(216,228,240,0.82)', maxWidth: 480, margin: '0 auto' }}
        >
          What is being built, studied, and shipped — right now.
        </motion.div>
      </div>
    </div>
  )
}

// ─── Live status indicator ─────────────────────────────────────
function LiveStatus() {
  const items = [
    { label: 'Status',         value: 'Open to Internships',     color: '#60d8a0', pulse: true },
    { label: 'Current Build',  value: 'WarrantySafe v1',         color: '#38b8d8', pulse: true },
    { label: 'Studying',       value: 'System Design + DSA',     color: '#c9a84c', pulse: false },
    { label: 'Year',           value: 'B.Tech CSE — Year 3',     color: '#a070e0', pulse: false },
    { label: 'GPA',            value: '8.795 / 10',                color: '#c9a84c', pulse: false },
    { label: 'Location',       value: 'Jaipur, Rajasthan',       color: '#38b8d8', pulse: false },
  ]

  return (
    <RevealBlock>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 1,
        border: '1px solid rgba(56,184,216,0.1)',
        overflow: 'hidden',
      }}>
        {items.map((item, i) => (
          <div key={item.label} style={{
            padding: '16px 20px',
            background: i % 2 === 0 ? 'rgba(8,11,24,0.7)' : 'rgba(4,6,15,0.7)',
            borderBottom: '1px solid rgba(56,184,216,0.06)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            {item.pulse && (
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: item.color,
                  boxShadow: `0 0 8px ${item.color}`,
                  flexShrink: 0,
                }}
              />
            )}
            {!item.pulse && (
              <div style={{
                width: 7, height: 7, borderRadius: '50%',
                background: `${item.color}40`, flexShrink: 0,
              }} />
            )}
            <div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(216,228,240,0.85)', letterSpacing: '0.15em', marginBottom: 2 }}>
                {item.label.toUpperCase()}
              </div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: 13, fontWeight: 500, color: item.color }}>
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </RevealBlock>
  )
}

// ─── Current project card ─────────────────────────────────────
function ActiveProjectCard({ name, description, progress, stack, color, updated }) {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      style={{
        padding: '22px 24px',
        background: 'rgba(8,11,24,0.7)',
        border: `1px solid ${color}20`,
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Progress bar at top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.04)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${progress}%` } : {}}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: '100%',
            background: `linear-gradient(90deg, ${color}60, ${color})`,
            boxShadow: `0 0 8px ${color}`,
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 10 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 6, height: 6, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}`, flexShrink: 0 }}
            />
            <div style={{ fontFamily: 'Orbitron', fontSize: 14, fontWeight: 700, color, letterSpacing: '0.05em' }}>
              {name}
            </div>
          </div>
          <div style={{ fontFamily: 'Space Grotesk', fontSize: 12, color: 'rgba(216,228,240,0.82)' }}>
            {description}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontFamily: 'Orbitron', fontSize: 20, fontWeight: 800, color, lineHeight: 1 }}>{progress}%</div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: `${color}60`, letterSpacing: '0.1em', marginTop: 3 }}>COMPLETE</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {stack.map(t => <Tag key={t} label={t} color={color} />)}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: `${color}50`, letterSpacing: '0.1em' }}>
          {updated}
        </div>
      </div>
    </motion.div>
  )
}

// ─── GitHub heatmap (simulated with realistic data) ───────────
function GitHubHeatmap() {
  const weeks = 26
  const days  = 7
  // Simulate realistic commit data
  const data = Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: days }, (_, d) => {
      // More activity on weekdays, slightly less on weekends
      const isWeekend  = d === 0 || d === 6
      const baseChance = isWeekend ? 0.4 : 0.7
      const rand       = Math.random()
      if (rand > baseChance) return 0
      if (rand > baseChance - 0.2) return 1
      if (rand > baseChance - 0.4) return 2
      if (rand > baseChance - 0.5) return 3
      return 4
    })
  )

  const colors = ['#0d1525', '#1a3a28', '#2d6b45', '#3a9960', '#4dc97c']

  return (
    <RevealBlock>
      <div style={{
        padding: '20px 24px',
        background: 'rgba(8,11,24,0.7)',
        border: '1px solid rgba(56,184,216,0.1)',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 16,
        }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(56,184,216,0.75)', letterSpacing: '0.2em', marginBottom: 3 }}>
              GITHUB ACTIVITY — LAST 26 WEEKS
            </div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 12, color: 'rgba(216,228,240,0.78)' }}>
              github.com/Purnagya08
            </div>
          </div>
          <div style={{ fontFamily: 'Orbitron', fontSize: 18, fontWeight: 700, color: '#60d8a0' }}>
            200
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'rgba(96,216,160,0.8)', marginLeft: 6, fontWeight: 400 }}>commits</span>
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: 'flex', gap: 3 }}>
          {data.map((week, wi) => (
            <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {week.map((level, di) => (
                <motion.div
                  key={di}
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (wi * 7 + di) * 0.003, duration: 0.2 }}
                  title={`${level} contributions`}
                  style={{
                    width: 10, height: 10,
                    borderRadius: 2,
                    background: colors[level],
                    border: level > 0 ? `1px solid ${colors[level]}80` : '1px solid rgba(255,255,255,0.03)',
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          marginTop: 10, justifyContent: 'flex-end',
        }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(216,228,240,0.85)' }}>Less</span>
          {colors.map((c, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
          ))}
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(216,228,240,0.85)' }}>More</span>
        </div>
      </div>
    </RevealBlock>
  )
}

// ─── Reading list ─────────────────────────────────────────────
function ReadingList() {
  const books = [
    { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', status: 'READING', color: '#38b8d8' },
    { title: 'Clean Architecture',                    author: 'Robert C. Martin',  status: 'READING', color: '#38b8d8' },
    { title: 'The Pragmatic Programmer',              author: 'Hunt & Thomas',     status: 'COMPLETED', color: '#60d8a0' },
    { title: 'System Design Interview Vol. 2',        author: 'Alex Xu',           status: 'QUEUE',   color: '#c9a84c' },
    { title: 'Deep Learning (Goodfellow)',            author: 'Goodfellow et al.', status: 'QUEUE',   color: '#a070e0' },
  ]

  return (
    <RevealBlock>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {books.map((book, i) => (
          <motion.div
            key={book.title}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              alignItems: 'center',
              gap: 12,
              padding: '14px 18px',
              background: 'rgba(8,11,24,0.6)',
              border: '1px solid rgba(56,184,216,0.06)',
            }}
          >
            <div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: 13, fontWeight: 500, color: '#d8e4f0', marginBottom: 2 }}>
                {book.title}
              </div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'rgba(216,228,240,0.85)', letterSpacing: '0.08em' }}>
                {book.author}
              </div>
            </div>
            <div style={{
              fontFamily: 'JetBrains Mono', fontSize: 8,
              color: book.color, border: `1px solid ${book.color}35`,
              background: `${book.color}08`,
              padding: '3px 10px', whiteSpace: 'nowrap',
              letterSpacing: '0.1em',
            }}>
              {book.status}
            </div>
          </motion.div>
        ))}
      </div>
    </RevealBlock>
  )
}

// ─── Focus areas (what's being learned right now) ─────────────
function FocusBar({ label, pct, color, note, delay }) {
  const ref = useRef()
  const inView = useInView(ref, { once: true })
  return (
    <div ref={ref}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, gap: 12 }}>
        <div>
          <span style={{ fontFamily: 'Space Grotesk', fontSize: 13, color: '#d8e4f0', fontWeight: 500 }}>{label}</span>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'rgba(216,228,240,0.85)', marginLeft: 10 }}>{note}</span>
        </div>
        <span style={{ fontFamily: 'Orbitron', fontSize: 11, color, flexShrink: 0 }}>{pct}%</span>
      </div>
      <div style={{ height: 3, background: 'rgba(255,255,255,0.04)', borderRadius: 2, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 1.2, delay: delay * 0.1 + 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: '100%', background: `linear-gradient(90deg, ${color}60, ${color})`, borderRadius: 2 }}
        />
      </div>
    </div>
  )
}

function FocusAreas() {
  const areas = [
    { label: 'System Design',       pct: 65, color: '#38b8d8', note: 'Scalable architecture patterns' },
    { label: 'DSA — Advanced',      pct: 55, color: '#a070e0', note: 'DP, Graphs, advanced trees' },
    { label: 'WarrantySafe Build',  pct: 70, color: '#c9a84c', note: 'Full-stack, shipping v1' },
    { label: 'Internship Prep',     pct: 60, color: '#60d8a0', note: 'Resume, outreach, LeetCode' },
    { label: 'ML Research',         pct: 40, color: '#38b8d8', note: 'Transformer architecture study' },
  ]
  return (
    <RevealBlock>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {areas.map((a, i) => <FocusBar key={a.label} {...a} delay={i} />)}
      </div>
    </RevealBlock>
  )
}

// ─── Main Present Station ─────────────────────────────────────
export default function PresentStation() {
  return (
    <div style={{ background: 'transparent', minHeight: '100vh' }}>
      <PresentHero />

      <Section>
        <RevealBlock>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16, marginBottom: 56 }}>
            <StatCard value="3"    label="Active Projects"   icon="◉" color="#38b8d8" />
            <StatCard value="200"  label="GitHub Commits"    icon="⌥" color="#60d8a0" />
            <StatCard value="2026" label="Target Internship" icon="★" color="#c9a84c" />
            <StatCard value="8.795"  label="Current GPA"       icon="◈" color="#a070e0" />
          </div>
        </RevealBlock>

        <SectionTitle label="Current Status" code="PRESENT·STATION" color="#38b8d8" sub="Snapshot as of today." />
        <LiveStatus />

        <div style={{ marginTop: 32 }}>
          <LoreCard
            accent="#38b8d8"
            text="Year 3. The student phase is winding down. The engineer phase is ramping up. Every day has something being built, something being studied, and something being shipped. The station is live."
          />
        </div>
      </Section>

      {/* Active projects */}
      <Section style={{ paddingTop: 0 }}>
        <SectionTitle label="Active Missions" code="CURRENT·BUILDS" color="#c9a84c" sub="In-progress right now." />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <ActiveProjectCard
            name="WarrantySafe"
            description="Consumer warranty management platform — building v1 toward public launch"
            progress={70}
            stack={['Next.js', 'Node.js', 'PostgreSQL', 'Prisma']}
            color="#c9a84c"
            updated="UPDATED THIS WEEK"
          />
          <ActiveProjectCard
            name="NEXUS Portfolio"
            description="This portfolio — the logbook itself. Part of the system is documenting the system."
            progress={85}
            stack={['React', 'R3F', 'Framer Motion', 'Vite']}
            color="#38b8d8"
            updated="UPDATED TODAY"
          />
          <ActiveProjectCard
            name="DSA Practice"
            description="LeetCode + HackerRank grind — targeting top 500 in Java on HackerRank"
            progress={55}
            stack={['Java', 'LeetCode', 'HackerRank']}
            color="#a070e0"
            updated="DAILY PRACTICE"
          />
        </div>
      </Section>

      {/* GitHub heatmap */}
      <Section style={{ paddingTop: 0 }}>
        <SectionTitle label="GitHub Activity" code="COMMIT·LOG" color="#60d8a0" />
        <GitHubHeatmap />
      </Section>

      {/* Focus areas */}
      <Section style={{ paddingTop: 0 }}>
        <SectionTitle label="Active Focus Areas" code="LEARNING·QUEUE" color="#a070e0" sub="What the mind is pointed at right now." />
        <FocusAreas />
        <div style={{ marginTop: 32 }}>
          <MemoryFragment
            id="MF-PRESENT-1"
            quote="The best time to start building your next project was last year. The second best time is right now, before you finish reading this sentence."
            author="Present Station — Active Log"
          />
        </div>
      </Section>

      {/* Reading list */}
      <Section style={{ paddingTop: 0 }}>
        <SectionTitle label="Reading List" code="STUDY·LOG" color="#38b8d8" sub="Books currently in the queue." />
        <ReadingList />
      </Section>

      <div style={{ height: 80 }} />
    </div>
  )
}
