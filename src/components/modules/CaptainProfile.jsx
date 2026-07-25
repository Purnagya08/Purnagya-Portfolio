import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  RevealBlock, SectionTitle, Tag, LoreCard, Section, StatCard
} from '../shared/ModuleComponents'
import { useNexusStore } from '../../store/nexusStore'
import { SFX } from '../../audio/audioEngine'

// ─── Reset Logbook component ──────────────────────────────────
function ResetLogbook() {
  const { collectedFragments, totalFragments, resetLogbook } = useNexusStore()
  const [confirm, setConfirm]   = useState(false)
  const [resetting, setResetting] = useState(false)

  function handleReset() {
    if (!confirm) { setConfirm(true); return }
    setResetting(true)
    SFX.glitch()
    setTimeout(() => {
      resetLogbook()
      setConfirm(false)
      setResetting(false)
    }, 600)
  }

  return (
    <div style={{
      padding: '20px 22px',
      background: 'rgba(8,4,4,0.7)',
      border: `1px solid ${confirm ? 'rgba(231,76,60,0.4)' : 'rgba(231,76,60,0.15)'}`,
      transition: 'border-color 0.3s',
      position: 'relative', overflow: 'hidden',
    }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(231,76,60,0.7)', letterSpacing: '0.2em', marginBottom: 4 }}>
              CAPTAIN OVERRIDE · LOGBOOK RESET
            </div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 13, color: 'rgba(216,228,240,0.78)', lineHeight: 1.5 }}>
              Clear all collected Memory Fragments and achievements. Use this to experience the logbook fresh.
            </div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'rgba(231,76,60,0.6)', marginTop: 6 }}>
              Currently collected: <span style={{ color: '#e74c3c', fontWeight: 700 }}>{collectedFragments.length}</span> / {totalFragments} fragments
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0, alignItems: 'flex-end' }}>
            <motion.button
              onClick={handleReset}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              data-cursor="hover"
              disabled={resetting}
              style={{
                fontFamily: 'JetBrains Mono', fontSize: 10,
                letterSpacing: '0.15em',
                color: confirm ? '#ff6b6b' : 'rgba(231,76,60,0.8)',
                background: confirm ? 'rgba(231,76,60,0.15)' : 'rgba(231,76,60,0.06)',
                border: `1px solid ${confirm ? 'rgba(231,76,60,0.6)' : 'rgba(231,76,60,0.3)'}`,
                padding: '8px 18px', cursor: 'none',
                transition: 'all 0.2s',
                boxShadow: confirm ? '0 0 16px rgba(231,76,60,0.2)' : 'none',
              }}
            >
              {resetting ? '⚡ RESETTING...' : confirm ? '⚠ CONFIRM RESET' : '↺ RESET LOGBOOK'}
            </motion.button>

            {confirm && (
              <motion.button
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setConfirm(false)}
                data-cursor="hover"
                style={{
                  fontFamily: 'JetBrains Mono', fontSize: 9,
                  letterSpacing: '0.12em',
                  color: 'rgba(176,192,216,0.6)',
                  background: 'transparent',
                  border: '1px solid rgba(176,192,216,0.2)',
                  padding: '5px 14px', cursor: 'none',
                }}
              >
                CANCEL
              </motion.button>
            )}
          </div>
        </div>

        {/* Shimmer on reset */}
        {resetting && (
          <motion.div
            initial={{ left: '-100%' }}
            animate={{ left: '200%' }}
            transition={{ duration: 0.6 }}
            style={{
              position: 'absolute', inset: 0, width: '60%',
              background: 'linear-gradient(90deg, transparent, rgba(231,76,60,0.12), transparent)',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
  )
}

// ─── Avatar placeholder (shows initials until user adds photo) ─
function Avatar() {
  const [imgError, setImgError] = useState(false)

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Orbit rings around avatar */}
      {[1, 2].map(i => (
        <motion.div
          key={i}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 10 + i * 6, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: -(i * 14),
            borderRadius: '50%',
            border: `1px solid rgba(201,168,76,${0.18 - i * 0.06})`,
          }}
        >
          <div style={{
            position: 'absolute', top: -3, left: '50%', marginLeft: -3,
            width: 6, height: 6, borderRadius: '50%',
            background: '#c9a84c', boxShadow: '0 0 8px #c9a84c',
          }} />
        </motion.div>
      ))}

      {/* Photo or initials fallback */}
      <div style={{
        width: 140, height: 140, borderRadius: '50%',
        border: '2px solid rgba(201,168,76,0.5)',
        background: 'rgba(8,11,24,0.9)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        boxShadow: '0 0 30px rgba(201,168,76,0.2)',
        position: 'relative',
      }}>
        {!imgError ? (
          <img
            src="/profile.jpg"
            alt="Purnagya Raj"
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
          />
        ) : (
          <div style={{
            fontFamily: 'Orbitron', fontSize: 36, fontWeight: 800,
            color: '#c9a84c',
            textShadow: '0 0 20px rgba(201,168,76,0.5)',
          }}>
            PR
          </div>
        )}
        {/* Bottom glow */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
          background: 'linear-gradient(transparent, rgba(201,168,76,0.08))',
          pointerEvents: 'none',
        }} />
      </div>
    </div>
  )
}

// ─── Hobby card ───────────────────────────────────────────────
function HobbyCard({ icon, title, description, color, index }) {
  const [hovered, setHovered] = useState(false)
  const ref    = useRef()
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '20px 20px',
        background: hovered ? `${color}08` : 'rgba(8,11,24,0.65)',
        border: `1px solid ${hovered ? color + '40' : color + '15'}`,
        backdropFilter: 'blur(8px)',
        transition: 'all 0.25s',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Top accent bar */}
      <motion.div
        animate={{ width: hovered ? '100%' : '0%' }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute', top: 0, left: 0,
          height: 2,
          background: `linear-gradient(90deg, ${color}, transparent)`,
        }}
      />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <motion.div
          animate={{ scale: hovered ? 1.15 : 1 }}
          style={{ fontSize: 26, flexShrink: 0, lineHeight: 1 }}
        >
          {icon}
        </motion.div>
        <div>
          <div style={{
            fontFamily: 'Orbitron', fontSize: 12, fontWeight: 600,
            color: hovered ? color : `${color}cc`,
            letterSpacing: '0.06em', marginBottom: 6,
            transition: 'color 0.25s',
          }}>
            {title}
          </div>
          <div style={{
            fontFamily: 'Space Grotesk', fontSize: 13,
            color: 'rgba(216,228,240,0.78)', lineHeight: 1.65,
          }}>
            {description}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Interest pill cluster ────────────────────────────────────
function InterestCloud({ items }) {
  return (
    <RevealBlock>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 16px',
              background: `${item.color}08`,
              border: `1px solid ${item.color}28`,
              borderRadius: 2,
            }}
          >
            <span style={{ fontSize: 14 }}>{item.icon}</span>
            <span style={{
              fontFamily: 'Space Grotesk', fontSize: 12,
              color: item.color, fontWeight: 500,
              letterSpacing: '0.03em',
            }}>
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>
    </RevealBlock>
  )
}

// ─── Fun fact card ────────────────────────────────────────────
function FunFact({ number, fact }) {
  const ref    = useRef()
  const inView = useInView(ref, { once: true, margin: '-30px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4 }}
      style={{
        display: 'flex', gap: 16, alignItems: 'flex-start',
        padding: '14px 18px',
        background: 'rgba(8,11,24,0.6)',
        border: '1px solid rgba(201,168,76,0.12)',
        borderLeft: '2px solid rgba(201,168,76,0.5)',
      }}
    >
      <div style={{
        fontFamily: 'Orbitron', fontSize: 18, fontWeight: 800,
        color: 'rgba(201,168,76,0.80)', flexShrink: 0, lineHeight: 1,
      }}>
        {String(number).padStart(2, '0')}
      </div>
      <div style={{
        fontFamily: 'Space Grotesk', fontSize: 13,
        color: 'rgba(216,228,240,0.82)', lineHeight: 1.65,
      }}>
        {fact}
      </div>
    </motion.div>
  )
}

// ─── Personality trait bar ────────────────────────────────────
function TraitBar({ trait, level, color, index }) {
  const ref    = useRef()
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} style={{ marginBottom: 12 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontFamily: 'JetBrains Mono', fontSize: 10,
        marginBottom: 5,
      }}>
        <span style={{ color: 'rgba(216,228,240,0.78)' }}>{trait}</span>
        <span style={{ color }}>{level}%</span>
      </div>
      <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 1.2, delay: index * 0.1 + 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: '100%',
            background: `linear-gradient(90deg, ${color}60, ${color})`,
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  )
}

// ─── Main CaptainProfile module ───────────────────────────────
export default function CaptainProfile() {
  const hobbies = [
    {
      icon: '🎵',
      title: 'Music',
      description: 'Music is the background thread — always running. From Bollywood to Hollywood and all around the world. Playlists change, the headphones don\'t.',
      color: '#a070e0',
    },
    {
      icon: '🚴',
      title: 'Outdoor Games',
      description: 'Mud, sweat, and no stack traces. The one place where bugs are just bugs.',
      color: '#60d8a0',
    },
    {
      icon: '🎮',
      title: 'Gaming',
      description: 'I told myself it was "systems thinking research." My sleep schedule disagreed.',
      color: '#38b8d8',
    },
    {
      icon: '✍️',
      title: 'Writing',
      description: 'The LinkedIn challenge was 365 posts. Writing daily forces you to find something worth saying every day. That habit rewires how you observe the world.',
      color: '#c9a84c',
    },
  ]

  const interests = [
    { icon: '🤖', label: 'Artificial Intelligence',    color: '#38b8d8' },
    { icon: '🌌', label: 'Space & Cosmology',           color: '#a070e0' },
    { icon: '⚙️', label: 'Systems Architecture',        color: '#c9a84c' },
    { icon: '🧠', label: 'Neuroscience',                color: '#38b8d8' },
    { icon: '🌍', label: 'Geopolitics',                 color: '#a070e0' },
    { icon: '🎬', label: 'Cinema & Storytelling',       color: '#60d8a0' },
    { icon: '🔭', label: 'Open Source Culture',         color: '#38b8d8' },
    { icon: '🏗️', label: 'Product Design',              color: '#c9a84c' },
    { icon: '📡', label: 'Distributed Systems',         color: '#a070e0' },
    { icon: '🌱', label: 'Sustainability & Tech',       color: '#60d8a0' },
  ]

  const funFacts = [
    'I solved my first competitive programming problem at 1:47am and went to sleep feeling richer than I had any right to.',
    'My first "Hello World" was in Python which was bricked at school. I switched to Java at 1st Year later and never fully forgave myself.',
    'I set a personal rule: if I can\'t explain a concept to someone with no CS background, I don\'t actually understand it yet.',
    'The NEXUS portfolio itself was built over weeks of late nights. This logbook is a project too — it just documents the others.',
    'I\'ve rewritten my resume more times than I\'ve eaten breakfast in the last year. Neither number is high enough.',
    'My debugging process: read the error, Google it, read Stack Overflow, close 14 tabs, re-read the error, fix it in 30 seconds.',
  ]

  const traits = [
    { trait: 'Curiosity',        level: 96, color: '#38b8d8' },
    { trait: 'Consistency',      level: 92, color: '#c9a84c' },
    { trait: 'Problem Solving',  level: 90, color: '#a070e0' },
    { trait: 'Communication',    level: 82, color: '#60d8a0' },
    { trait: 'Patience',         level: 75, color: '#38b8d8' },
    { trait: 'Stubbornness',     level: 88, color: '#c9a84c' },
  ]

  return (
    <div style={{ background: 'transparent', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <div style={{
        position: 'relative', minHeight: '60vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', padding: '60px 24px 40px',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 40%, rgba(201,168,76,0.07) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}
        >
          {/* Module label */}
          <div style={{
            fontFamily: 'JetBrains Mono', fontSize: 10,
            letterSpacing: '0.4em', color: 'rgba(201,168,76,0.7)',
            marginBottom: 32,
          }}>
            ◈ CAPTAIN'S PROFILE ◈
          </div>

          {/* Avatar */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <Avatar />
          </div>

          {/* Name */}
          <div style={{
            fontFamily: 'Orbitron', fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 800, color: '#c9a84c',
            textShadow: '0 0 40px rgba(201,168,76,0.35)',
            letterSpacing: '0.1em', marginBottom: 6,
          }}>
            PURNAGYA RAJ
          </div>

          {/* Role */}
          <div style={{
            fontFamily: 'Space Grotesk', fontSize: 'clamp(13px, 1.8vw, 16px)',
            color: 'rgba(216,228,240,0.78)',
            letterSpacing: '0.06em', marginBottom: 10,
          }}>
            Software Engineer · Builder · Curious Human
          </div>

          {/* Tagline */}
          <div style={{
            fontFamily: 'Libre Baskerville', fontStyle: 'italic',
            fontSize: 'clamp(12px, 1.5vw, 15px)',
            color: 'rgba(201,168,76,0.75)',
            maxWidth: 480, margin: '0 auto 28px',
            lineHeight: 1.7,
          }}>
            "I build things, break them, understand why, and rebuild them better."
          </div>

          {/* Quick tags */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 8 }}>
            {['Jaipur, India', 'B.Tech CSE 2024-26', 'Open to Internships', '8.795 GPA'].map(t => (
              <span key={t} style={{
                fontFamily: 'JetBrains Mono', fontSize: 9,
                color: 'rgba(56,184,216,0.8)',
                border: '1px solid rgba(56,184,216,0.25)',
                background: 'rgba(56,184,216,0.06)',
                padding: '3px 12px', letterSpacing: '0.08em',
              }}>
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Stats ── */}
      <Section>
        <RevealBlock>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16, marginBottom: 52 }}>
            <StatCard value="365"  label="Days of Posting"    icon="✍️" color="#c9a84c" />
            <StatCard value="2000" label="LinkedIn Followers" icon="◎"  color="#38b8d8" />
            <StatCard value="6"    label="Hobbies Active"     icon="⚡" color="#a070e0" />
            <StatCard value="∞"    label="40000+ Interactions" icon="📚" color="#60d8a0" />
          </div>
        </RevealBlock>

        {/* ── About ── */}
        <SectionTitle label="The Human Behind the Code" code="PROFILE·A" color="#c9a84c" />
        <LoreCard
          accent="#c9a84c"
          text="Engineering is what I do, but curiosity defines who I am. Growing up in Asansol, a city built on unity and known for its contribution to the nation through SAIL's steel plants, inspired me to value both innovation and hard work."
        />
        <div style={{ marginTop: 16 }}>
          <LoreCard
            accent="#38b8d8"
            text="I started the 365-day LinkedIn challenge not because I had something to say every day, but because I wanted to build the discipline of finding something worth saying every day. That distinction matters. The posts were never the goal. The habit of noticing was."
          />
        </div>
      </Section>

      {/* ── Personality traits ── */}
      <Section style={{ paddingTop: 0 }}>
        <SectionTitle label="Personality Readout" code="PROFILE·B" color="#38b8d8" sub="Self-reported. Margin of error: high." />
        <RevealBlock>
          <div style={{ maxWidth: 500 }}>
            {traits.map((t, i) => (
              <TraitBar key={t.trait} {...t} index={i} />
            ))}
          </div>
        </RevealBlock>
      </Section>

      {/* ── Hobbies ── */}
      <Section style={{ paddingTop: 0 }}>
        <SectionTitle label="Off-Duty Modules" code="PROFILE·C" color="#a070e0" sub="What runs when the IDE is closed." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
          {hobbies.map((h, i) => (
            <HobbyCard key={h.title} {...h} index={i} />
          ))}
        </div>
      </Section>

      {/* ── Interests ── */}
      <Section style={{ paddingTop: 0 }}>
        <SectionTitle label="Interest Cluster" code="PROFILE·D" color="#60d8a0" sub="Topics that pull attention without being asked." />
        <InterestCloud items={interests} />
      </Section>

      {/* ── Fun facts ── */}
      <Section style={{ paddingTop: 0 }}>
        <SectionTitle label="Captain's Log — Personal Entries" code="PROFILE·E" color="#c9a84c" sub="Things that didn't fit anywhere else." />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {funFacts.map((f, i) => (
            <FunFact key={i} number={i + 1} fact={f} />
          ))}
        </div>
      </Section>

      {/* ── Reset Logbook ── */}
      <Section style={{ paddingTop: 0 }}>
        <div style={{
          fontFamily: 'JetBrains Mono', fontSize: 8,
          color: 'rgba(231,76,60,0.7)', letterSpacing: '0.25em',
          marginBottom: 14,
        }}>
          ⚠ CAPTAIN OVERRIDE · LOGBOOK RESET
        </div>
        <ResetLogbook />
      </Section>

      <div style={{ height: 80 }} />
    </div>
  )
}
