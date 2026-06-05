import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  RevealBlock, SectionTitle, MemoryFragment,
  Tag, StatCard, LoreCard, Section, CodeBlock
} from '../shared/ModuleComponents'

// ─── Hero ─────────────────────────────────────────────────────
function TrainingHero() {
  return (
    <div style={{
      position: 'relative', height: '65vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Animated grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(56,184,216,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(56,184,216,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
      }} />
      {/* Scan */}
      <motion.div
        style={{
          position: 'absolute', left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(56,184,216,0.4), transparent)',
        }}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.4em', color: 'rgba(56,184,216,0.6)', marginBottom: 16 }}
        >
          ◈ MOD-02 · TRAINING FACILITY ◈
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          style={{
            fontFamily: 'Orbitron', fontSize: 'clamp(34px, 7vw, 68px)',
            fontWeight: 800, color: '#38b8d8',
            textShadow: '0 0 60px rgba(56,184,216,0.35)',
            letterSpacing: '0.08em', lineHeight: 1.1, marginBottom: 16,
          }}
        >
          365 DAYS OF<br />UPSKILLING
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{ fontFamily: 'Libre Baskerville', fontStyle: 'italic', fontSize: 'clamp(13px, 1.8vw, 16px)', color: 'rgba(176,192,216,0.6)', maxWidth: 480, margin: '0 auto' }}
        >
          Every wing of this facility was built one concept at a time.
        </motion.div>
      </div>
    </div>
  )
}

// ─── Skill progress bar ────────────────────────────────────────
function SkillBar({ name, level, color = '#38b8d8', delay = 0 }) {
  const ref = useRef()
  const inView = useInView(ref, { once: true })
  return (
    <div ref={ref} style={{ marginBottom: 14 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontFamily: 'JetBrains Mono', fontSize: 10,
        color: 'rgba(176,192,216,0.6)', marginBottom: 5,
        letterSpacing: '0.08em',
      }}>
        <span>{name}</span>
        <span style={{ color }}>{level}%</span>
      </div>
      <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 1.2, delay: delay + 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: '100%',
            background: `linear-gradient(90deg, ${color}80, ${color})`,
            boxShadow: `0 0 8px ${color}60`,
            position: 'relative',
          }}
        >
          {/* Shimmer */}
          <motion.div
            animate={{ left: ['-100%', '200%'] }}
            transition={{ duration: 1.5, delay: delay + 1.2, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              width: '40%',
            }}
          />
        </motion.div>
      </div>
    </div>
  )
}

// ─── Wing card ────────────────────────────────────────────────
function WingCard({ title, code, description, skills, color, icon, children }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      style={{
        border: `1px solid ${color}20`,
        background: 'rgba(8,11,24,0.65)',
        overflow: 'hidden',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        data-cursor="hover"
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'none',
          padding: '20px 24px',
          display: 'flex', alignItems: 'center', gap: 16,
          borderBottom: open ? `1px solid ${color}15` : 'none',
          transition: 'background 0.2s',
        }}
      >
        <div style={{ fontSize: 24 }}>{icon}</div>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{
            fontFamily: 'JetBrains Mono', fontSize: 8,
            color: `${color}60`, letterSpacing: '0.2em', marginBottom: 3,
          }}>
            {code}
          </div>
          <div style={{
            fontFamily: 'Orbitron', fontSize: 14, fontWeight: 600,
            color, letterSpacing: '0.06em',
          }}>
            {title}
          </div>
          <div style={{
            fontFamily: 'Space Grotesk', fontSize: 12,
            color: 'rgba(176,192,216,0.55)', marginTop: 3,
          }}>
            {description}
          </div>
        </div>
        <motion.div
          animate={{ rotate: open ? 90 : 0 }}
          style={{ color: `${color}70`, fontSize: 14, fontFamily: 'monospace' }}
        >
          ▶
        </motion.div>
      </button>

      {/* Expanded content */}
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ overflow: 'hidden' }}
      >
        <div style={{ padding: '20px 24px 24px' }}>
          {skills && (
            <div style={{ marginBottom: 20 }}>
              {skills.map((s, i) => (
                <SkillBar key={s.name} name={s.name} level={s.level} color={color} delay={i * 0.1} />
              ))}
            </div>
          )}
          {children}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Training Facility module ─────────────────────────────────
export default function TrainingFacility() {
  return (
    <div style={{ background: 'transparent', minHeight: '100vh' }}>
      <TrainingHero />

      {/* Stats */}
      <Section>
        <RevealBlock>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginBottom: 56 }}>
            <StatCard value="365" label="Days of Practice" icon="📅" color="#38b8d8" />
            <StatCard value="500" label="Problems Solved" icon="⚡" color="#60d8a0" />
            <StatCard value="8" label="Languages Learned" icon="💻" color="#c9a84c" />
            <StatCard value="100" label="NPTEL Java Score" icon="★" color="#a070e0" />
          </div>
        </RevealBlock>

        <SectionTitle label="The Facility" code="TRAINING·WING" color="#38b8d8" sub="Every hall is a skill. Every skill is a weapon." />

        <LoreCard
          accent="#38b8d8"
          text="The training wasn't a course or a curriculum. It was a compulsion. Every day, one more problem. One more concept. One more layer of understanding peeled back to see what was underneath. 365 days isn't discipline — it's obsession wearing a schedule."
        />

        <div style={{ marginTop: 32, marginBottom: 32 }}>
          <MemoryFragment
            id="MF-03"
            quote="Day 247. Recursion finally clicked. Not just 'I understand recursion' — I FELT it. The stack unwinding in my head like a memory coming back."
            author="Training Log — Day 247"
          />
        </div>
      </Section>

      {/* Wings */}
      <Section style={{ paddingTop: 0 }}>
        <SectionTitle label="Training Wings" code="FACILITY·MAP" color="#c9a84c" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Java Wing */}
          <WingCard
            title="Java Wing"
            code="WING-01"
            description="Core Java, OOP, Collections, Streams, I/O"
            icon="☕"
            color="#c9a84c"
            skills={[
              { name: 'Core Java & Syntax', level: 95 },
              { name: 'OOP Principles', level: 92 },
              { name: 'Collections Framework', level: 88 },
              { name: 'Java Streams & Lambdas', level: 82 },
              { name: 'Exception Handling', level: 90 },
              { name: 'File I/O & Serialization', level: 78 },
            ]}
          >
            <CodeBlock lang="java" code={`// Day 12 — First time I understood polymorphism
abstract class Shape {
    abstract double area();
    void describe() {
        System.out.println("Area: " + area());
    }
}

class Circle extends Shape {
    double r;
    Circle(double r) { this.r = r; }
    
    @Override
    double area() { return Math.PI * r * r; }
}

// The moment this worked, everything changed.
Shape s = new Circle(5);
s.describe(); // → Area: 78.539...`} />
          </WingCard>

          {/* DSA Arena */}
          <WingCard
            title="DSA Arena"
            code="WING-02"
            description="Arrays, Trees, Graphs, DP, Sorting, Searching"
            icon="⚔️"
            color="#38b8d8"
            skills={[
              { name: 'Arrays & Strings', level: 90 },
              { name: 'LinkedList & Stack/Queue', level: 85 },
              { name: 'Trees & BST', level: 82 },
              { name: 'Graphs & BFS/DFS', level: 75 },
              { name: 'Dynamic Programming', level: 70 },
              { name: 'Sorting & Searching', level: 88 },
            ]}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['Two Pointer', 'Sliding Window', 'Binary Search', 'Recursion', 'Memoization',
                'BFS', 'DFS', 'Dijkstra', 'Union-Find', 'Segment Tree'].map(t => (
                  <Tag key={t} label={t} color="#38b8d8" />
                ))}
            </div>
          </WingCard>

          {/* Multithreading Lab */}
          <WingCard
            title="Multithreading Lab"
            code="WING-03"
            description="Threads, Synchronization, Concurrency, Executors"
            icon="🔄"
            color="#60d8a0"
            skills={[
              { name: 'Thread Lifecycle', level: 80 },
              { name: 'Synchronization', level: 75 },
              { name: 'ExecutorService', level: 72 },
              { name: 'Callable & Future', level: 68 },
              { name: 'volatile & atomic ops', level: 65 },
            ]}
          >
            <CodeBlock lang="java" code={`// Callable + Future — when you need results back
ExecutorService pool = Executors.newFixedThreadPool(4);

Callable<Integer> task = () -> {
    Thread.sleep(100);
    return 42; // the answer
};

Future<Integer> result = pool.submit(task);
System.out.println(result.get()); // → 42
pool.shutdown();`} />
          </WingCard>

          {/* Web & Full Stack Hall */}
          <WingCard
            title="Full Stack Hall"
            code="WING-04"
            description="React, Next.js, Node, Express, FastAPI, Databases"
            icon="🌐"
            color="#a070e0"
            skills={[
              { name: 'React & Next.js (App Router)', level: 88 },
              { name: 'TypeScript', level: 80 },
              { name: 'Node.js & Express', level: 82 },
              { name: 'FastAPI & Python', level: 78 },
              { name: 'PostgreSQL & Prisma', level: 75 },
              { name: 'Redis & Pub/Sub', level: 70 },
              { name: 'Docker & Deployment', level: 72 },
              { name: 'REST API Design', level: 85 },
            ]}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {['TailwindCSS', 'Framer Motion', 'Prisma ORM', 'JWT Auth', 'WebSockets',
                'Docker Compose', 'GitHub Actions', 'Vercel', 'GCR'].map(t => (
                  <Tag key={t} label={t} color="#a070e0" />
                ))}
            </div>
          </WingCard>

          {/* AI/ML Chamber */}
          <WingCard
            title="AI/ML Chamber"
            code="WING-05"
            description="ML, PyTorch, Computer Vision, NLP, Data Analytics"
            icon="🤖"
            color="#38b8d8"
            skills={[
              { name: 'Scikit-learn & Classical ML', level: 78 },
              { name: 'PyTorch (MLP, CNN)', level: 72 },
              { name: 'Data Analysis (Pandas/NumPy)', level: 82 },
              { name: 'Computer Vision (OpenCV)', level: 68 },
              { name: 'NLP & Text Processing', level: 65 },
              { name: 'Redis Streams (Event-driven)', level: 70 },
            ]}
          >
            <LoreCard
              accent="#38b8d8"
              text="ML isn't magic. It's just linear algebra with a really good marketing team. Once that clicked, every model became a tool — not a mystery."
            />
          </WingCard>

        </div>
      </Section>

      {/* NPTEL */}
      <Section style={{ paddingTop: 0 }}>
        <SectionTitle label="NPTEL Certification" code="ACHIEVEMENT·LOG" color="#a070e0" />
        <RevealBlock>
          <div style={{
            padding: '28px', background: 'rgba(8,11,24,0.7)',
            border: '1px solid rgba(160,112,224,0.2)',
            display: 'grid', gridTemplateColumns: '1fr auto', gap: 20,
            alignItems: 'center',
          }}>
            <div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(160,112,224,0.6)', letterSpacing: '0.2em', marginBottom: 8 }}>
                NPTEL · IIT KHARAGPUR
              </div>
              <div style={{ fontFamily: 'Orbitron', fontSize: 18, fontWeight: 700, color: '#a070e0', marginBottom: 8 }}>
                Programming in Java
              </div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: 13, color: 'rgba(176,192,216,0.7)', lineHeight: 1.6, marginBottom: 12 }}>
                12-week course by Prof. Debasis Samanta, IIT Kharagpur. Covered core Java, OOP, generics, multithreading, JDBC, and GUI. Scored 100/100 — top among the cohort.
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Tag label="100 / 100" color="#c9a84c" />
                <Tag label="IIT Kharagpur" color="#a070e0" />
                <Tag label="12 Weeks" color="#38b8d8" />
                <Tag label="Elite + Gold" color="#60d8a0" />
              </div>
            </div>
            <div style={{ textAlign: 'center', padding: '12px 20px', border: '1px solid rgba(201,168,76,0.2)', background: 'rgba(201,168,76,0.04)' }}>
              <div style={{ fontFamily: 'Orbitron', fontSize: 36, fontWeight: 800, color: '#c9a84c', textShadow: '0 0 20px rgba(201,168,76,0.5)' }}>100</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(201,168,76,0.5)', letterSpacing: '0.15em' }}>PERFECT</div>
            </div>
          </div>
        </RevealBlock>

        <div style={{ marginTop: 32 }}>
          <MemoryFragment
            id="MF-04"
            quote="A perfect score doesn't mean you know everything. It means you understood the questions well enough to know exactly which things you didn't know — and covered them anyway."
            author="Training Log — NPTEL Week 12"
          />
        </div>
      </Section>

      <div style={{ height: 80 }} />
    </div>
  )
}
