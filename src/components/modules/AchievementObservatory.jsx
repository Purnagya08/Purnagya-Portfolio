import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  RevealBlock, SectionTitle, MemoryFragment,
  Tag, StatCard, LoreCard, Section
} from '../shared/ModuleComponents'

// ─── Hero ─────────────────────────────────────────────────────
function ObservatoryHero() {
  return (
    <div style={{
      position: 'relative', height: '65vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Orbiting achievement rings */}
      {[160, 260, 360].map((r, i) => (
        <motion.div
          key={r}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 20 + i * 8, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            width: r * 2, height: r * 2,
            borderRadius: '50%',
            border: `1px solid rgba(201,168,76,${0.12 - i * 0.03})`,
            top: '50%', left: '50%',
            marginTop: -r, marginLeft: -r,
          }}
        >
          {/* Orbiting dot */}
          <div style={{
            position: 'absolute',
            top: -3, left: '50%', marginLeft: -3,
            width: 6, height: 6, borderRadius: '50%',
            background: '#c9a84c',
            boxShadow: '0 0 8px #c9a84c',
          }} />
        </motion.div>
      ))}

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.4em', color: 'rgba(201,168,76,0.6)', marginBottom: 16 }}
        >◈ MOD-06 · ACHIEVEMENT OBSERVATORY ◈</motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          style={{
            fontFamily: 'Orbitron', fontSize: 'clamp(34px, 7vw, 68px)',
            fontWeight: 800, color: '#c9a84c',
            textShadow: '0 0 60px rgba(201,168,76,0.35)',
            letterSpacing: '0.08em', lineHeight: 1.1, marginBottom: 16,
          }}
        >MILESTONES &<br />ARTIFACTS</motion.div>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{ fontFamily: 'Libre Baskerville', fontStyle: 'italic', fontSize: 'clamp(13px, 1.8vw, 16px)', color: 'rgba(176,192,216,0.6)', maxWidth: 480, margin: '0 auto' }}
        >
          Every artifact has a story. Every number has a night behind it.
        </motion.div>
      </div>
    </div>
  )
}

// ─── Featured achievement artifact ───────────────────────────
function ArtifactCard({ rank, title, subtitle, detail, story, color, icon, tags, index }) {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.07 }}
      style={{
        display: 'grid',
        gridTemplateColumns: '64px 1fr',
        gap: 0,
        border: `1px solid ${color}20`,
        background: 'rgba(8,11,24,0.7)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Left accent strip */}
      <div style={{
        background: `${color}08`,
        borderRight: `1px solid ${color}15`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '20px 0', gap: 8,
      }}>
        <div style={{ fontSize: 20 }}>{icon}</div>
        <div style={{
          fontFamily: 'Orbitron', fontSize: 10, fontWeight: 700,
          color: `${color}60`, writingMode: 'vertical-rl',
          textOrientation: 'mixed', letterSpacing: '0.15em',
        }}>
          {rank}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px 24px' }}>
        <div style={{ marginBottom: 10 }}>
          <div style={{
            fontFamily: 'Orbitron', fontSize: 15, fontWeight: 700,
            color, letterSpacing: '0.05em', marginBottom: 3,
          }}>
            {title}
          </div>
          <div style={{
            fontFamily: 'JetBrains Mono', fontSize: 9,
            color: `${color}70`, letterSpacing: '0.1em',
          }}>
            {subtitle}
          </div>
        </div>

        <div style={{
          fontFamily: 'Space Grotesk', fontSize: 13,
          color: 'rgba(176,192,216,0.7)', lineHeight: 1.65, marginBottom: 12,
        }}>
          {detail}
        </div>

        {story && (
          <div style={{
            fontFamily: 'Libre Baskerville', fontStyle: 'italic',
            fontSize: 12, color: `${color}80`,
            borderLeft: `2px solid ${color}25`, paddingLeft: 10,
            lineHeight: 1.6, marginBottom: 12,
          }}>
            {story}
          </div>
        )}

        {tags && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {tags.map(t => <Tag key={t} label={t} color={color} />)}
          </div>
        )}
      </div>

      {/* Top-right corner glow */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 80, height: 80,
        background: `radial-gradient(ellipse at top right, ${color}08, transparent)`,
        pointerEvents: 'none',
      }} />
    </motion.div>
  )
}

// ─── LinkedIn stats card ──────────────────────────────────────
function LinkedInStats() {
  const ref = useRef()
  const inView = useInView(ref, { once: true })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      style={{
        padding: '28px',
        background: 'rgba(8,11,24,0.7)',
        border: '1px solid rgba(56,184,216,0.15)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 20, alignItems: 'center',
      }}
    >
      <div>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(56,184,216,0.5)', letterSpacing: '0.2em', marginBottom: 8 }}>
          LINKEDIN · #365DAYSUPSKILLINGMYSELF
        </div>
        <div style={{ fontFamily: 'Orbitron', fontSize: 16, fontWeight: 700, color: '#38b8d8', marginBottom: 6 }}>
          365-Day Consistency Challenge
        </div>
        <div style={{ fontFamily: 'Space Grotesk', fontSize: 13, color: 'rgba(176,192,216,0.65)', lineHeight: 1.6 }}>
          One post, every day, for a full year. No skips. No ghosting. Every day a new concept, a new build, a new lesson. The discipline this required changed how I approach everything.
        </div>
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
      }}>
        {[
          { v: '2000+',  l: 'Followers' },
          { v: '365',    l: 'Posts'     },
          { v: '0',      l: 'Skipped'   },
          { v: '2025',   l: 'Year'      },
        ].map(({ v, l }) => (
          <div key={l} style={{
            padding: '12px', textAlign: 'center',
            background: 'rgba(56,184,216,0.04)',
            border: '1px solid rgba(56,184,216,0.1)',
          }}>
            <div style={{ fontFamily: 'Orbitron', fontSize: 18, fontWeight: 700, color: '#38b8d8' }}>{v}</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(56,184,216,0.5)', letterSpacing: '0.1em', marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── GPA constellation visual ─────────────────────────────────
function GPAConstellation() {
  const ref = useRef()
  const inView = useInView(ref, { once: true })
  const semesters = [
    { sem: 'S1', gpa: 8.5 },
    { sem: 'S2', gpa: 8.8 },
    { sem: 'S3', gpa: 9.0 },
    { sem: 'S4', gpa: 9.2 },
  ]
  const w = 400, h = 120
  const padX = 40, padY = 20
  const xStep = (w - padX * 2) / (semesters.length - 1)
  const pts = semesters.map((s, i) => ({
    x: padX + i * xStep,
    y: padY + (10 - s.gpa) * ((h - padY * 2) / 2),
    ...s,
  }))

  return (
    <RevealBlock>
      <div style={{
        padding: '24px', background: 'rgba(4,6,15,0.8)',
        border: '1px solid rgba(201,168,76,0.1)',
      }}>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(201,168,76,0.5)', letterSpacing: '0.2em', marginBottom: 16 }}>
          GPA TRAJECTORY — SEMESTER RANK HOLDER x3
        </div>
        <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
          {/* Grid lines */}
          {[8, 8.5, 9, 9.5, 10].map(v => {
            const y = padY + (10 - v) * ((h - padY * 2) / 2)
            return (
              <g key={v}>
                <line x1={padX} y1={y} x2={w - padX} y2={y} stroke="rgba(201,168,76,0.06)" strokeWidth={1} />
                <text x={padX - 6} y={y + 4} textAnchor="end" fontSize={8} fill="rgba(201,168,76,0.3)" fontFamily="JetBrains Mono">{v}</text>
              </g>
            )
          })}

          {/* Path */}
          <motion.polyline
            points={pts.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="rgba(201,168,76,0.4)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.3 }}
          />

          {/* Area fill */}
          <motion.polygon
            points={[...pts.map(p => `${p.x},${p.y}`), `${pts[pts.length-1].x},${h - padY}`, `${pts[0].x},${h - padY}`].join(' ')}
            fill="rgba(201,168,76,0.05)"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1.2 }}
          />

          {/* Data points */}
          {pts.map((p, i) => (
            <motion.g key={p.sem} initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.4 + i * 0.2 }}>
              <circle cx={p.x} cy={p.y} r={5} fill="#02040c" stroke="#c9a84c" strokeWidth={1.5} />
              <circle cx={p.x} cy={p.y} r={2} fill="#c9a84c" />
              <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize={9} fill="#c9a84c" fontFamily="JetBrains Mono">{p.gpa}</text>
              <text x={p.x} y={h - padY + 14} textAnchor="middle" fontSize={8} fill="rgba(201,168,76,0.4)" fontFamily="JetBrains Mono">{p.sem}</text>
            </motion.g>
          ))}
        </svg>
      </div>
    </RevealBlock>
  )
}

// ─── Main Achievement Observatory ────────────────────────────
export default function AchievementObservatory() {
  const artifacts = [
    {
      rank: 'NPTEL',
      icon: '🥇',
      title: 'NPTEL Java — 100/100',
      subtitle: 'IIT Kharagpur · Top 1% Nationally · Course Topper',
      detail: 'Programming in Java — 12-week course by Prof. Debasis Samanta, IIT Kharagpur. 100% score across all quizzes and assignments. Ranked in the Top 1% nationally among 19,000+ candidates. Certified Elite + Gold.',
      story: 'I didn\'t aim for 100. I aimed to understand every topic well enough to not need to guess. The perfect score was a side effect.',
      color: '#c9a84c',
      tags: ['100/100', 'Top 1% National', '19,000+ Candidates', 'IIT Kharagpur', 'Elite + Gold'],
    },
    {
      rank: 'INTL',
      icon: '🌍',
      title: 'LaserHacks 2025 — International Finalist',
      subtitle: 'Lasell University, USA · 500+ Global Teams',
      detail: 'Reached the international finals of LaserHacks 2025, hosted at Lasell University, USA. Competed against 500+ teams from 20+ countries. One of a small number of Indian teams to reach the final round.',
      story: 'The moment I saw we were competing against teams from Stanford, Edinburgh, and Singapore — I stopped being nervous and started being focused. Different feeling.',
      color: '#38b8d8',
      tags: ['International', 'Lasell University USA', '500+ Teams', 'Top Finalist'],
    },
    {
      rank: 'WIN',
      icon: '🏆',
      title: '2x Inter-College Hackathon Winner',
      subtitle: 'Jaipur Region · 40+ Teams · Two Separate Events',
      detail: 'First place in two separate inter-college hackathons across Jaipur. Competed against teams from 12+ colleges. Both wins involved full-stack AI projects built and deployed within 24 hours.',
      story: 'Winning once felt lucky. Winning twice felt like confirmation. The system works — build well, demo clearly, explain your architecture without condescension.',
      color: '#60d8a0',
      tags: ['1st Place x2', '40+ Teams', 'Jaipur Region', '24h Builds'],
    },
    {
      rank: 'RANK',
      icon: '⭐',
      title: '3x Semester Rank Holder',
      subtitle: 'UEM Jaipur · 250+ Student Cohort · 9.0 GPA',
      detail: 'Ranked in the top positions of the CSE cohort (250+ students) for three consecutive semesters. Maintained a 9.0 cumulative GPA while simultaneously building projects, competing in hackathons, and running the 365-day upskilling challenge.',
      story: 'The question people always ask is how I balance it all. The answer is: I don\'t balance it. I prioritize. And the classroom is never deprioritized.',
      color: '#a070e0',
      tags: ['9.0 GPA', 'Top Rank', '250+ Cohort', '3 Semesters'],
    },
    {
      rank: 'NTL',
      icon: '🥈',
      title: '2x National Hackathon Finalist',
      subtitle: 'Top 15 from 800+ Teams',
      detail: 'Reached the national finals in two separate hackathons, each with 800+ submissions from across India. Presented technical projects to industry judge panels. SentinelAI was one of the projects that made it.',
      story: 'National finals mean you\'re in the top 2% of submissions. Which means the work was good enough. That\'s the bar. Clear it consistently.',
      color: '#c9a84c',
      tags: ['National Finals', 'Top 15', '800+ Teams', 'x2'],
    },
  ]

  return (
    <div style={{ background: 'transparent', minHeight: '100vh' }}>
      <ObservatoryHero />

      <Section>
        <RevealBlock>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16, marginBottom: 56 }}>
            <StatCard value="100"  label="NPTEL Score"        icon="★" color="#c9a84c" />
            <StatCard value="3"    label="Semester Ranks"     icon="◈" color="#a070e0" />
            <StatCard value="500"  label="Intl Teams Beaten"  icon="🌍" color="#38b8d8" />
            <StatCard value="2000" label="LinkedIn Followers" icon="◎" color="#60d8a0" />
          </div>
        </RevealBlock>

        <SectionTitle label="The Observatory" code="ACHIEVEMENT·LOG" color="#c9a84c" sub="Artifacts of a journey in progress." />
        <LoreCard
          accent="#c9a84c"
          text="Achievements aren't trophies. They're proof points — evidence that the system works. Every certification, every ranking, every win is a data point in a longer experiment whose hypothesis is: consistent, deliberate effort compiles."
        />

        <div style={{ marginTop: 32, marginBottom: 40 }}>
          <MemoryFragment
            id="MF-11"
            quote="Top 1% nationally. Among 19,000 candidates. I stared at that result for a long time. Not out of pride — out of curiosity. I wanted to understand exactly which study decisions got me there, so I could replicate them."
            author="Observatory Log — NPTEL Result Day"
          />
        </div>
      </Section>

      {/* GPA chart */}
      <Section style={{ paddingTop: 0 }}>
        <SectionTitle label="Academic Trajectory" code="OBSERVATORY·A" color="#c9a84c" />
        <GPAConstellation />
      </Section>

      {/* Artifact cards */}
      <Section style={{ paddingTop: 0 }}>
        <SectionTitle label="Achievement Artifacts" code="OBSERVATORY·B" color="#38b8d8" sub="Each one earned. Each one documented." />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {artifacts.map((a, i) => (
            <ArtifactCard key={a.title} {...a} index={i} />
          ))}
        </div>
      </Section>

      {/* LinkedIn */}
      <Section style={{ paddingTop: 0 }}>
        <SectionTitle label="365 Days of Upskilling" code="OBSERVATORY·C" color="#38b8d8" />
        <LinkedInStats />

        <div style={{ marginTop: 32 }}>
          <MemoryFragment
            id="MF-12"
            quote="Day 1 of 365: I have no idea if anyone will read this. Day 365: Nearly 2,000 people did. The audience was never the point. The discipline was."
            author="LinkedIn Log — Day 365"
          />
        </div>
      </Section>

      <div style={{ height: 80 }} />
    </div>
  )
}
