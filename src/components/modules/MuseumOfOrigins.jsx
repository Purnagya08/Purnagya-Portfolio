import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  RevealBlock, SectionTitle, MemoryFragment,
  Timeline, Tag, StatCard, LoreCard, Section
} from '../shared/ModuleComponents'

// ─── Hero banner for this module ─────────────────────────────
function MuseumHero() {
  const ref = useRef()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y   = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const op  = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <div ref={ref} style={{ position: 'relative', height: '70vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Parallax starfield */}
      <motion.div style={{ position: 'absolute', inset: 0, y }}>
        {Array.from({ length: 120 }, (_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top:  `${Math.random() * 100}%`,
            width:  Math.random() < 0.1 ? 2 : 1,
            height: Math.random() < 0.1 ? 2 : 1,
            borderRadius: '50%',
            background: 'white',
            opacity: 0.1 + Math.random() * 0.5,
          }} />
        ))}
        {/* Nebula blobs */}
        <div style={{ position: 'absolute', width: '50%', height: '50%', top: '10%', left: '20%', background: 'radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', width: '40%', height: '40%', bottom: '15%', right: '10%', background: 'radial-gradient(ellipse, rgba(56,184,216,0.06) 0%, transparent 70%)', filter: 'blur(50px)' }} />
      </motion.div>

      {/* Content */}
      <motion.div style={{ position: 'relative', zIndex: 2, textAlign: 'center', opacity: op, padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
          style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.4em', color: 'rgba(201,168,76,0.6)', marginBottom: 16 }}
        >
          ◈ MOD-01 · MUSEUM OF ORIGINS ◈
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.9 }}
          style={{
            fontFamily: 'Orbitron', fontSize: 'clamp(36px, 7vw, 72px)',
            fontWeight: 800, color: '#c9a84c',
            textShadow: '0 0 60px rgba(201,168,76,0.35)',
            letterSpacing: '0.08em', lineHeight: 1.1, marginBottom: 16,
          }}
        >
          WHERE IT<br />ALL BEGAN
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }}
          style={{ fontFamily: 'Libre Baskerville', fontStyle: 'italic', fontSize: 'clamp(13px, 1.8vw, 16px)', color: 'rgba(176,192,216,0.6)', maxWidth: 500, margin: '0 auto' }}
        >
          A digital museum of the moments that forged an engineer.
        </motion.div>
        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          style={{ marginTop: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
        >
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(56,184,216,0.4)', letterSpacing: '0.2em' }}>SCROLL TO EXPLORE</div>
          <div style={{ width: 1, height: 32, background: 'linear-gradient(180deg, rgba(56,184,216,0.4), transparent)' }} />
        </motion.div>
      </motion.div>
    </div>
  )
}

// ─── Exhibit card ─────────────────────────────────────────────
function ExhibitCard({ number, title, description, detail, icon, color = '#c9a84c' }) {
  return (
    <RevealBlock>
      <div style={{
        display: 'grid', gridTemplateColumns: '64px 1fr', gap: 20,
        padding: '24px', background: 'rgba(8,11,24,0.6)',
        border: '1px solid rgba(201,168,76,0.1)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Exhibit number */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{
            fontFamily: 'Orbitron', fontSize: 28, fontWeight: 800,
            color: `${color}30`, lineHeight: 1,
          }}>
            {String(number).padStart(2, '0')}
          </div>
          <div style={{ fontSize: 22 }}>{icon}</div>
          <div style={{ flex: 1, width: 1, background: `${color}20`, minHeight: 20 }} />
        </div>
        {/* Content */}
        <div>
          <div style={{
            fontFamily: 'Orbitron', fontSize: 14, fontWeight: 600,
            color, letterSpacing: '0.06em', marginBottom: 8,
          }}>
            {title}
          </div>
          <div style={{
            fontFamily: 'Space Grotesk', fontSize: 13,
            color: 'rgba(176,192,216,0.75)', lineHeight: 1.7, marginBottom: 10,
          }}>
            {description}
          </div>
          {detail && (
            <div style={{
              fontFamily: 'JetBrains Mono', fontSize: 10,
              color: `${color}80`, letterSpacing: '0.05em',
              borderTop: `1px solid ${color}15`, paddingTop: 8,
            }}>
              {detail}
            </div>
          )}
        </div>
        {/* Bg accent */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: 80, height: 80,
          background: `radial-gradient(ellipse at top right, ${color}06, transparent)`,
          pointerEvents: 'none',
        }} />
      </div>
    </RevealBlock>
  )
}

// ─── The full Museum of Origins module ───────────────────────
export default function MuseumOfOrigins() {
  const timelineEvents = [
    {
      year: '2005',
      title: 'Born in Asansol, West Bengal',
      description: 'A city of brotherhood. Where it was all a place one can think off',
      color: '#c9a84c',
      tags: ['Asansol', 'Beginning'],
    },
    {
      year: '2009',
      title: 'First Schooling',
      description: "A time began where this small kiddo doesn't even know what these machines are. He just know that he'll be awarded sweets if he attend school daily.",
      color: '#38b8d8',
      tags: ['Sweets', 'First Schooling'],
    },
    {
      year: '2013-14',
      title: 'Fell in love with Science & Maths',
      description: 'Awarded as SUBJECT TOPPER in MATH & SCIENCE and it gave birth to a curiosity inside this kiddo to deep dive into the field',
      color: '#60d8a0',
      tags: ['Python', 'Hello World'],
    },
    {
      year: '2017',
      title: 'Fitness Journey',
      description: 'Joined YOGA and won competitions and followed this for a long time',
      color: '#a070e0',
      tags: ['Fitness', 'YOGA'],
    },
    {
      year: '2022',
      title: 'Secondary Examinarion',
      description: 'Passed Class Xth with 90% marks overall',
      color: '#c9a84c',
      tags: ['Secondary Examination', 'Class Xth'],
    },
    {
      year: '2024',
      title: 'Senior Secondary Examination',
      description: 'Passed Class XIIth with 84% marks overall',
      color: '#38b8d8',
      tags: ['Full Stack', 'Next.js', 'AI'],
    },
    {
      year: '2024',
      title: 'Joined UEM Jaipur as a CSE Student through IEMJEE score of AIR 5',
      description: 'In 3rd Year persuing B.Tech in Computer Science & Engineering',
      color: '#60d8a0',
      tags: ['UEM Jaipur', 'B.Tech', 'CSE'],
    },
  ]

  return (
    <div style={{ background: 'transparent', minHeight: '100vh' }}>
      <MuseumHero />

      {/* ── STATS ROW ── */}
      <Section>
        <RevealBlock>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginBottom: 56 }}>
            <StatCard value="9.0"  label="GPA"                icon="◈" color="#c9a84c" />
            <StatCard value="250"  label="Students Ranked"    icon="★" color="#38b8d8" />
            <StatCard value="3"    label="Hackathon Wins"     icon="⚡" color="#60d8a0" />
            <StatCard value="2026" label="Graduating Year"    icon="◎" color="#a070e0" />
          </div>
        </RevealBlock>

        {/* ── LORE ── */}
        <SectionTitle label="The Origin Story" code="EXHIBIT·A" color="#c9a84c" />
        <LoreCard
          accent="#c9a84c"
          text="Every engineer has a moment — not the degree, not the first job, not the first commit. The moment. A screen lighting up and doing exactly what you told it to. For me, it was a Python print statement in a dusty school computer lab in 2017. The machine obeyed. And I never looked at the world the same way again."
        />

        <div style={{ marginTop: 32 }}>
          <MemoryFragment
            id="MF-01"
            quote="The first time I wrote a for loop and it actually worked, I sat there for a full minute just... staring. Like I had discovered fire."
            author="Captain's Log — Year One"
          />
        </div>
      </Section>

      {/* ── EXHIBITS ── */}
      <Section style={{ paddingTop: 0 }}>
        <SectionTitle label="Museum Exhibits" code="EXHIBIT·B" color="#38b8d8" sub="Objects and memories, preserved." />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ExhibitCard
            number={1}
            icon="💻"
            title="The First Machine"
            description="A second-hand Windows XP computer. 256MB RAM. A 15-inch CRT monitor that weighed more than a school bag. It crashed often. I learned patience before I learned programming."
            detail="OS: Windows XP SP2 | RAM: 256MB | Monitor: 15in CRT | Era: 2014"
            color="#c9a84c"
          />
          <ExhibitCard
            number={2}
            icon="🐍"
            title="The First Language"
            description="Python. Chosen by accident — it was what the school had installed. But its readable syntax made logic feel like English. The perfect first language for a mind just learning to think in instructions."
            detail="Language: Python 2.7 | IDE: IDLE | First Program: Temperature Converter"
            color="#60d8a0"
          />
          <ExhibitCard
            number={4}
            icon="🎓"
            title="The Admission"
            description="UEM Jaipur, Computer Science Engineering, 2024. Walked in knowing Python and curiosity. Left three years later with Java, React, AI/ML, and a logbook full of real projects."
            detail="Institute: UEM Jaipur | Branch: CSE | Batch: 2024-28 | Current GPA: 9.0"
            color="#a070e0"
          />
          <ExhibitCard
            number={3}
            icon="🏆"
            title="The First Competition"
            description="A college-level coding competition, 2025. Placed in top 10th. Went back hostel and stayed up until 2am solving the ones I had missed. That stubbornness became a superpower."
            detail="Event: College Coding Competition 2025 | Problems: 3/5 | Placement: 10th"
            color="#38b8d8"
          />
        </div>
      </Section>

      {/* ── TIMELINE ── */}
      <Section style={{ paddingTop: 0 }}>
        <SectionTitle label="The Logbook Timeline" code="EXHIBIT·C" color="#a070e0" sub="Every entry matters." />
        <Timeline events={timelineEvents} />
        <div style={{ marginTop: 32 }}>
          <MemoryFragment
            id="MF-02"
            quote="Engineering admission wasn't the destination. It was the launchpad. The real journey started on Day 1, Line 1 of the first Java file."
            author="Captain's Log — 2024"
          />
        </div>
      </Section>

      {/* ── SCHOOL LIFE ── */}
      <Section style={{ paddingTop: 0 }}>
        <SectionTitle label="School Life" code="EXHIBIT·D" color="#60d8a0" sub="Before the code, there was the curiosity." />
        <LoreCard
          accent="#60d8a0"
          text="School was where I learned that the right question is more powerful than the right answer. Science fairs, debate competitions, mathematics olympiads — none of it felt like preparation. It all felt like play. That playfulness is still the engine behind every project I build."
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 24 }}>
          {[
            { label: 'Favourite Subject',  value: 'Mathematics' },
            { label: 'First Achievement',  value: 'Science Fair 2018' },
            { label: 'Superpower',         value: 'Staying up till 2am' },
            { label: 'First Dream',        value: 'Build something real' },
          ].map(item => (
            <RevealBlock key={item.label}>
              <div style={{
                padding: '14px 18px',
                background: 'rgba(8,11,24,0.6)',
                border: '1px solid rgba(96,216,160,0.1)',
              }}>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(96,216,160,0.5)', letterSpacing: '0.15em', marginBottom: 4 }}>
                  {item.label.toUpperCase()}
                </div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: 13, color: '#d8e4f0', fontWeight: 500 }}>
                  {item.value}
                </div>
              </div>
            </RevealBlock>
          ))}
        </div>
      </Section>

      {/* Bottom spacer */}
      <div style={{ height: 80 }} />
    </div>
  )
}
