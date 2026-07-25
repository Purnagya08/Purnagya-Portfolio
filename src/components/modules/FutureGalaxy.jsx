import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  RevealBlock, SectionTitle, MemoryFragment,
  Tag, StatCard, LoreCard, Section
} from '../shared/ModuleComponents'

// ─── Hero ─────────────────────────────────────────────────────
function FutureHero() {
  return (
    <div style={{
      position: 'relative', height: '70vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Expanding universe rings */}
      {[80, 160, 260, 380, 520].map((r, i) => (
        <motion.div
          key={r}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 0.06 + (i * 0.01), scale: 1 }}
          transition={{ delay: i * 0.15, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute',
            width: r * 2, height: r * 2, borderRadius: '50%',
            border: `1px solid rgba(160,112,224,${0.25 - i * 0.04})`,
            top: '50%', left: '50%',
            marginTop: -r, marginLeft: -r,
          }}
        />
      ))}

      {/* Floating coordinate dots */}
      {Array.from({ length: 18 }, (_, i) => {
        const angle  = (i / 18) * Math.PI * 2
        const radius = 150 + Math.random() * 180
        return (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
            style={{
              position: 'absolute',
              left: `calc(50% + ${Math.cos(angle) * radius}px)`,
              top:  `calc(50% + ${Math.sin(angle) * radius}px)`,
              width: 3, height: 3, borderRadius: '50%',
              background: '#a070e0',
              boxShadow: '0 0 6px #a070e0',
            }}
          />
        )
      })}

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.4em', color: 'rgba(160,112,224,0.85)', marginBottom: 16 }}
        >◌ MOD-08 · FUTURE GALAXY ◌</motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          style={{
            fontFamily: 'Orbitron', fontSize: 'clamp(34px, 7vw, 68px)',
            fontWeight: 800, color: '#a070e0',
            textShadow: '0 0 60px rgba(160,112,224,0.35)',
            letterSpacing: '0.08em', lineHeight: 1.1, marginBottom: 16,
          }}
        >WHERE THIS<br />IS HEADING</motion.div>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{ fontFamily: 'Libre Baskerville', fontStyle: 'italic', fontSize: 'clamp(13px, 1.8vw, 16px)', color: 'rgba(216,228,240,0.82)', maxWidth: 480, margin: '0 auto' }}
        >
          The coordinates of ambition. Approximate. Expanding.
        </motion.div>
      </div>
    </div>
  )
}

// ─── Horizon item (large ambition card) ───────────────────────
function HorizonCard({ index, title, subtitle, description, timeline, tags, color, icon, probability }) {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: 0,
        border: `1px solid ${color}18`,
        background: 'rgba(8,11,24,0.7)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Left number + timeline strip */}
      <div style={{
        background: `${color}06`,
        borderRight: `1px solid ${color}12`,
        padding: '24px 16px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 10,
        minWidth: 64,
      }}>
        <div style={{ fontSize: 22 }}>{icon}</div>
        <div style={{
          fontFamily: 'Orbitron', fontSize: 10, fontWeight: 700,
          color: `${color}50`,
          writingMode: 'vertical-rl',
          letterSpacing: '0.12em',
        }}>
          {String(index + 1).padStart(2, '0')}
        </div>
        <div style={{ flex: 1, width: 1, background: `${color}15`, minHeight: 20 }} />
        <div style={{
          fontFamily: 'JetBrains Mono', fontSize: 8,
          color: `${color}50`,
          writingMode: 'vertical-rl',
          letterSpacing: '0.1em',
        }}>
          {timeline}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '22px 24px' }}>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontFamily: 'Orbitron', fontSize: 15, fontWeight: 700, color, letterSpacing: '0.05em', marginBottom: 3 }}>
            {title}
          </div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: `${color}70`, letterSpacing: '0.1em' }}>
            {subtitle}
          </div>
        </div>

        <div style={{ fontFamily: 'Space Grotesk', fontSize: 13, color: 'rgba(176,192,216,0.72)', lineHeight: 1.75, marginBottom: 14 }}>
          {description}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {tags.map(t => <Tag key={t} label={t} color={color} />)}
          </div>
          {probability && (
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: `${color}50`, letterSpacing: '0.1em', marginBottom: 2 }}>PROBABILITY</div>
              <div style={{ fontFamily: 'Orbitron', fontSize: 14, fontWeight: 700, color }}>{probability}</div>
            </div>
          )}
        </div>
      </div>

      {/* Corner glow */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 100, height: 100,
        background: `radial-gradient(ellipse at top right, ${color}07, transparent)`,
        pointerEvents: 'none',
      }} />
    </motion.div>
  )
}

// ─── Values / principles section ─────────────────────────────
function EngineeringPrinciples() {
  const principles = [
    { n: '01', text: 'Build for the user first. The architecture serves them, not your portfolio.' },
    { n: '02', text: 'Document as you go. Future-you is a different person and deserves clear notes.' },
    { n: '03', text: 'Ship something imperfect over nothing perfect. Iteration beats paralysis.' },
    { n: '04', text: 'The best engineers are curious first, skilled second. Curiosity compounds.' },
    { n: '05', text: 'Open source is not charity. It is the highest form of engineering education.' },
    { n: '06', text: 'An AI that cannot explain itself is a liability. Interpretability matters.' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
      {principles.map((p, i) => (
        <RevealBlock key={p.n} delay={i * 0.06}>
          <div style={{
            padding: '18px 20px',
            background: 'rgba(8,11,24,0.6)',
            border: '1px solid rgba(160,112,224,0.1)',
            height: '100%',
          }}>
            <div style={{ fontFamily: 'Orbitron', fontSize: 22, fontWeight: 800, color: 'rgba(160,112,224,0.80)', marginBottom: 8 }}>{p.n}</div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 13, color: 'rgba(216,228,240,0.88)', lineHeight: 1.7 }}>{p.text}</div>
          </div>
        </RevealBlock>
      ))}
    </div>
  )
}

// ─── Contact / connect panel ──────────────────────────────────
function ConnectPanel() {
  const links = [
    { label: 'GitHub',   value: 'github.com/Purnagya08',           icon: '⌥', color: '#38b8d8', href: 'https://github.com/Purnagya08' },
    { label: 'LinkedIn', value: 'linkedin.com/in/purnagya-raj',    icon: '◈', color: '#c9a84c', href: 'https://linkedin.com/in/purnagya-raj' },
    { label: 'Email',    value: 'purnagya.raj26nov@gmail.com',     icon: '◎', color: '#60d8a0', href: 'purnagya.raj26nov@gmail.com' },
    { label: 'LeetCode', value: 'leetcode.com/u/techXpurna',       icon: '⚡', color: '#a070e0', href: 'https://leetcode.com/u/techXpurna' },
  ]

  return (
    <RevealBlock>
      <div style={{
        padding: '28px',
        background: 'rgba(8,11,24,0.7)',
        border: '1px solid rgba(201,168,76,0.15)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.04), transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(201,168,76,0.8)', letterSpacing: '0.25em', marginBottom: 20 }}>
          OPEN FOR COLLABORATION · SWE INTERNSHIPS · AI PROJECTS
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {links.map(link => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              style={{
                padding: '14px 18px',
                background: `${link.color}06`,
                border: `1px solid ${link.color}25`,
                textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: 10,
                transition: 'background 0.2s, border-color 0.2s',
              }}
            >
              <span style={{ fontSize: 14, color: link.color }}>{link.icon}</span>
              <div>
                <div style={{ fontFamily: 'Orbitron', fontSize: 10, fontWeight: 600, color: link.color, letterSpacing: '0.08em' }}>
                  {link.label}
                </div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: `${link.color}70`, marginTop: 2 }}>
                  {link.value}
                </div>
              </div>
            </a>
          ))}
        </div>

        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(201,168,76,0.08)' }}>
          <div style={{ fontFamily: 'Libre Baskerville', fontStyle: 'italic', fontSize: 13, color: 'rgba(216,228,240,0.78)', lineHeight: 1.7 }}>
            If you are building something interesting in AI, full-stack systems, or developer tooling — I want to hear about it. Open to internships, collaborations, and conversations that lead somewhere worth going.
          </div>
        </div>
      </div>
    </RevealBlock>
  )
}

// ─── Main Future Galaxy ───────────────────────────────────────
export default function FutureGalaxy() {
  const horizons = [
    {
      icon: '🚀',
      title: 'SWE Internship — Tier 1 Company',
      subtitle: 'Target: 2025–2026 Internship Season',
      description: 'The immediate target. A role at a company building real infrastructure — AI, systems, or developer tooling. Not just for the title. For the engineering environment, the mentorship density, and the exposure to systems at scale.',
      timeline: '2026-27',
      tags: ['Full Stack', 'AI/ML', 'Backend', 'System Design'],
      color: '#c9a84c',
      probability: 'HIGH',
    },
    {
      icon: '🤖',
      title: 'Deep AI Research',
      subtitle: 'Post-Graduation Research Track',
      description: 'Transformer architecture internals. Interpretability. Building models that can explain why they made a decision. I believe the next decade of AI progress depends on tools that make models inspectable, not just accurate.',
      timeline: '2026-27',
      tags: ['Transformers', 'Interpretability', 'Research', 'PyTorch'],
      color: '#38b8d8',
      probability: 'COMMITTED',
    },
    {
      icon: '🌐',
      title: 'Open Source Contribution',
      subtitle: 'Meaningful, sustained contribution to a real project',
      description: 'Not just a PR to fix a typo. A real contribution — to a framework, a library, or a tool that other engineers use daily. I want to understand a codebase deeply enough to improve it.',
      timeline: '2025-26',
      tags: ['Open Source', 'GitHub', 'Community'],
      color: '#60d8a0',
      probability: 'IN PROGRESS',
    },
    {
      icon: '🎓',
      title: 'Graduate Studies — AI / Systems',
      subtitle: 'M.Tech or MS at a top institution',
      description: 'The theory underneath the practice. Graduate research gives access to the problems that are too hard for product teams and too applied for pure math departments. That gap is where interesting engineering lives.',
      timeline: '2028-29',
      tags: ['M.Tech', 'MS', 'AI Research', 'Systems'],
      color: '#c9a84c',
      probability: 'LIKELY',
    },
    {
      icon: '🔭',
      title: 'Publish — Technical Writing',
      subtitle: 'Engineering blog, conference talks, or a paper',
      description: 'Writing forces clarity. Every concept I think I understand but cannot explain clearly — I don\'t actually understand. The discipline of writing about engineering makes the engineering better.',
      timeline: '2025+',
      tags: ['Writing', 'Teaching', 'Knowledge Sharing'],
      color: '#38b8d8',
      probability: 'ACTIVE',
    },
  ]

  return (
    <div style={{ background: 'transparent', minHeight: '100vh' }}>
      <FutureHero />

      <Section>
        <RevealBlock>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16, marginBottom: 56 }}>
            <StatCard value="6"    label="Horizon Goals"     icon="◌" color="#a070e0" />
            <StatCard value="2028" label="Graduation Year"   icon="🎓" color="#c9a84c" />
            <StatCard value="∞"    label="Curiosity Level"   icon="◈" color="#38b8d8" />
          </div>
        </RevealBlock>

        <SectionTitle label="The Horizon" code="FUTURE·GALAXY" color="#a070e0" sub="Coordinates approximate. Direction fixed." />
        <LoreCard
          accent="#a070e0"
          text="The future isn't a plan. It's a direction. I know which problems I want to work on, which environments I want to learn in, and what kind of engineer I want to become. The specific coordinates will update. The heading stays the same."
        />

        <div style={{ marginTop: 32, marginBottom: 40 }}>
          <MemoryFragment
            id="MF-FUTURE-1"
            quote="The engineers I most respect aren't the ones with the most credentials. They're the ones still curious at year 20. Still asking why. Still building things they don't fully understand yet."
            author="Future Galaxy — Navigation Notes"
          />
        </div>
      </Section>

      {/* Horizon cards */}
      <Section style={{ paddingTop: 0 }}>
        <SectionTitle label="Horizon Targets" code="NAVIGATION·LOG" color="#c9a84c" sub="Where the ship is pointed." />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {horizons.map((h, i) => (
            <HorizonCard key={h.title} {...h} index={i} />
          ))}
        </div>
      </Section>

      {/* Principles */}
      <Section style={{ paddingTop: 0 }}>
        <SectionTitle label="Engineering Principles" code="CORE·VALUES" color="#38b8d8" sub="What this logbook is built on." />
        <EngineeringPrinciples />
        <div style={{ marginTop: 32 }}>
          <MemoryFragment
            id="MF-FUTURE-2"
            quote="Build things. Break them. Understand why. Rebuild better. That is the whole curriculum. Everything else is commentary."
            author="Future Galaxy — Captain's Final Log"
          />
        </div>
      </Section>

      {/* Connect */}
      <Section style={{ paddingTop: 0 }}>
        <SectionTitle label="Open Channel" code="COMMUNICATION·TERMINAL" color="#c9a84c" sub="Let's build something." />
        <ConnectPanel />
      </Section>

      <div style={{ height: 80 }} />
    </div>
  )
}
