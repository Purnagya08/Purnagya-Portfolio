import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  RevealBlock, SectionTitle, MemoryFragment,
  Tag, StatCard, LoreCard, Section, CodeBlock
} from '../shared/ModuleComponents'

// ─── Hero ─────────────────────────────────────────────────────
function LabHero() {
  return (
    <div style={{
      position: 'relative', height: '65vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Neural network nodes animation */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }}>
        {Array.from({ length: 20 }, (_, i) => {
          const x1 = 10 + Math.random() * 80
          const y1 = 10 + Math.random() * 80
          const x2 = 10 + Math.random() * 80
          const y2 = 10 + Math.random() * 80
          return (
            <line
              key={i}
              x1={`${x1}%`} y1={`${y1}%`}
              x2={`${x2}%`} y2={`${y2}%`}
              stroke="#60d8a0" strokeWidth="0.5"
            />
          )
        })}
        {Array.from({ length: 15 }, (_, i) => (
          <motion.circle
            key={i}
            cx={`${10 + Math.random() * 80}%`}
            cy={`${10 + Math.random() * 80}%`}
            r={2 + Math.random() * 3}
            fill="#60d8a0"
            animate={{ opacity: [0.2, 0.8, 0.2], r: [2, 4, 2] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </svg>

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.4em', color: 'rgba(96,216,160,0.6)', marginBottom: 16 }}
        >◈ MOD-05 · RESEARCH LABS ◈</motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          style={{
            fontFamily: 'Orbitron', fontSize: 'clamp(34px, 7vw, 68px)',
            fontWeight: 800, color: '#60d8a0',
            textShadow: '0 0 60px rgba(96,216,160,0.35)',
            letterSpacing: '0.08em', lineHeight: 1.1, marginBottom: 16,
          }}
        >AI & ML<br />RESEARCH</motion.div>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{ fontFamily: 'Libre Baskerville', fontStyle: 'italic', fontSize: 'clamp(13px, 1.8vw, 16px)', color: 'rgba(216,228,240,0.82)', maxWidth: 480, margin: '0 auto' }}
        >
          Experiments, architectures, and the science behind the systems.
        </motion.div>
      </div>
    </div>
  )
}

// ─── Architecture diagram (pure CSS/SVG) ─────────────────────
function SentinelArchDiagram() {
  const nodes = [
    { id: 'attack', label: 'Attack\nSimulator', x: 60,  y: 40,  color: '#e74c3c' },
    { id: 'redis',  label: 'Redis\nStreams',    x: 260, y: 40,  color: '#c9a84c' },
    { id: 'ml',     label: 'ML Engine\n97%+',  x: 460, y: 40,  color: '#60d8a0' },
    { id: 'defense',label: 'Defense\nEngine',  x: 260, y: 160, color: '#38b8d8' },
    { id: 'alert',  label: 'Alert\nServer',    x: 460, y: 160, color: '#a070e0' },
    { id: 'react',  label: 'SOC\nDashboard',   x: 660, y: 100, color: '#38b8d8' },
  ]
  const edges = [
    ['attack', 'redis'], ['redis', 'ml'], ['redis', 'defense'],
    ['ml', 'alert'], ['defense', 'react'], ['alert', 'react'],
  ]

  const getNode = (id) => nodes.find(n => n.id === id)

  return (
    <RevealBlock>
      <div style={{
        padding: '24px', background: 'rgba(4,6,15,0.8)',
        border: '1px solid rgba(96,216,160,0.1)', overflow: 'auto',
      }}>
        <div style={{
          fontFamily: 'JetBrains Mono', fontSize: 8,
          color: 'rgba(96,216,160,0.8)', letterSpacing: '0.2em', marginBottom: 16,
        }}>
          SENTINELAI — MICROSERVICE ARCHITECTURE
        </div>
        <svg width="780" height="240" viewBox="0 0 780 240" style={{ maxWidth: '100%' }}>
          {/* Edges */}
          {edges.map(([a, b], i) => {
            const na = getNode(a), nb = getNode(b)
            const x1 = na.x + 60, y1 = na.y + 28
            const x2 = nb.x, y2 = nb.y + 28
            return (
              <motion.line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="rgba(56,184,216,0.5)"
                strokeWidth={1}
                strokeDasharray="4 6"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
              />
            )
          })}
          {/* Nodes */}
          {nodes.map((n, i) => (
            <motion.g
              key={n.id}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.08 }}
            >
              <rect
                x={n.x} y={n.y} width={110} height={56}
                rx={2}
                fill="rgba(8,11,24,0.9)"
                stroke={n.color + '50'}
                strokeWidth={1}
              />
              {/* Color top bar */}
              <rect x={n.x} y={n.y} width={110} height={2} fill={n.color} opacity={0.7} />
              <text
                x={n.x + 55} y={n.y + 24}
                textAnchor="middle"
                fill={n.color}
                fontSize={9}
                fontFamily="JetBrains Mono"
                letterSpacing="0.5"
              >
                {n.label.split('\n')[0]}
              </text>
              <text
                x={n.x + 55} y={n.y + 38}
                textAnchor="middle"
                fill={n.color + '80'}
                fontSize={8}
                fontFamily="JetBrains Mono"
              >
                {n.label.split('\n')[1]}
              </text>
            </motion.g>
          ))}
        </svg>
      </div>
    </RevealBlock>
  )
}

// ─── Research area card ───────────────────────────────────────
function ResearchCard({ title, code, icon, color, description, experiments, children }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      style={{ border: `1px solid ${color}18`, background: 'rgba(8,11,24,0.7)', overflow: 'hidden' }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        data-cursor="hover"
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'none',
          padding: '20px 24px',
          display: 'flex', alignItems: 'center', gap: 16,
          borderBottom: open ? `1px solid ${color}12` : 'none',
        }}
      >
        <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: `${color}55`, letterSpacing: '0.2em', marginBottom: 3 }}>{code}</div>
          <div style={{ fontFamily: 'Orbitron', fontSize: 14, fontWeight: 600, color: open ? color : `${color}cc`, letterSpacing: '0.06em' }}>{title}</div>
          <div style={{ fontFamily: 'Space Grotesk', fontSize: 12, color: 'rgba(216,228,240,0.78)', marginTop: 3 }}>{description}</div>
        </div>
        {experiments && (
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: `${color}60`, flexShrink: 0 }}>
            {experiments} exp.
          </div>
        )}
        <motion.div animate={{ rotate: open ? 90 : 0 }} style={{ color: `${color}50`, fontFamily: 'monospace', fontSize: 14 }}>▶</motion.div>
      </button>

      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ overflow: 'hidden' }}
      >
        <div style={{ padding: '20px 24px 24px' }}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── ML model accuracy visual ─────────────────────────────────
function AccuracyBar({ label, value, color }) {
  const ref = useRef()
  const inView = useInView(ref, { once: true })
  return (
    <div ref={ref} style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'JetBrains Mono', fontSize: 10, color: 'rgba(216,228,240,0.82)', marginBottom: 4 }}>
        <span>{label}</span><span style={{ color }}>{value}%</span>
      </div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 2, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : {}}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: '100%', background: `linear-gradient(90deg, ${color}60, ${color})`, borderRadius: 2 }}
        />
      </div>
    </div>
  )
}

// ─── Main Research Labs ───────────────────────────────────────
export default function ResearchLabs() {
  return (
    <div style={{ background: 'transparent', minHeight: '100vh' }}>
      <LabHero />

      <Section>
        <RevealBlock>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16, marginBottom: 56 }}>
            <StatCard value="97"  label="Best Model Accuracy" icon="🎯" color="#60d8a0" />
            <StatCard value="3"   label="ML Models Built"     icon="🤖" color="#38b8d8" />
            <StatCard value="6"   label="Research Areas"      icon="⬢" color="#a070e0" />
            <StatCard value="2"   label="Papers Studied"      icon="📄" color="#c9a84c" />
          </div>
        </RevealBlock>

        <SectionTitle label="Research Areas" code="LAB·DIRECTORY" color="#60d8a0" sub="Experiments in progress and completed." />
        <LoreCard
          accent="#60d8a0"
          text="Research isn't just reading papers. It's building the thing, watching it fail, understanding why, and rebuilding. Every model in this lab started as a question: can I actually make this work?"
        />

        <div style={{ marginTop: 32, marginBottom: 40 }}>
          <MemoryFragment
            id="MF-09"
            quote="The PyTorch MLP in SentinelAI wasn't the first model I built. It was the fifth. The first four didn't converge, overfit, or just produced garbage. The fifth one hit 97%. That's research."
            author="Lab Notes — SentinelAI ML Engine"
          />
        </div>
      </Section>

      {/* Architecture diagram */}
      <Section style={{ paddingTop: 0 }}>
        <SectionTitle label="SentinelAI Architecture" code="EXPERIMENT·01" color="#38b8d8" />
        <SentinelArchDiagram />
      </Section>

      {/* Research cards */}
      <Section style={{ paddingTop: 0 }}>
        <SectionTitle label="Lab Experiments" code="LAB·EXPERIMENTS" color="#a070e0" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          <ResearchCard
            title="Machine Learning — Ensemble Methods"
            code="LAB-01"
            icon="🧠"
            color="#60d8a0"
            description="PyTorch MLP + Random Forest ensemble for network intrusion detection"
            experiments={8}
          >
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(96,216,160,0.8)', letterSpacing: '0.2em', marginBottom: 12 }}>MODEL ACCURACY COMPARISON</div>
              <AccuracyBar label="Ensemble (MLP + RF)"        value={97} color="#60d8a0" />
              <AccuracyBar label="Random Forest (standalone)" value={93} color="#38b8d8" />
              <AccuracyBar label="MLP (standalone)"           value={89} color="#a070e0" />
              <AccuracyBar label="Logistic Regression"        value={82} color="#c9a84c" />
            </div>
            <LoreCard accent="#60d8a0" text="The ensemble outperformed both individual models because each catches different attack patterns. RF is better on structured, categorical features. MLP handles temporal patterns. Together: 97%+." />
          </ResearchCard>

          <ResearchCard
            title="Computer Vision — OCR Pipeline"
            code="LAB-02"
            icon="👁️"
            color="#38b8d8"
            description="Tesseract + OpenCV preprocessing pipeline for document intelligence"
            experiments={5}
          >
            <CodeBlock lang="python" code={`# OCR preprocessing pipeline
import cv2
import numpy as np
import pytesseract

def preprocess(img_path):
    img = cv2.imread(img_path)
    
    # Grayscale + adaptive threshold
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    thresh = cv2.adaptiveThreshold(
        gray, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY, 11, 2
    )
    
    # Deskew
    coords = np.column_stack(np.where(thresh > 0))
    angle = cv2.minAreaRect(coords)[-1]
    if angle < -45: angle = -(90 + angle)
    
    M = cv2.getRotationMatrix2D(
        (img.shape[1]//2, img.shape[0]//2), angle, 1.0
    )
    return cv2.warpAffine(thresh, M, img.shape[1::-1])

# Extract text
text = pytesseract.image_to_string(preprocess('receipt.jpg'))
# → "Total: Rs. 1,240.00 | Date: 12/03/2024"`} />
          </ResearchCard>

          <ResearchCard
            title="Event-Driven Architecture — Redis Streams"
            code="LAB-03"
            icon="⚡"
            color="#c9a84c"
            description="Building real-time microservice pipelines with Redis Pub/Sub and Consumer Groups"
            experiments={4}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { title: 'Consumer Group Isolation', desc: 'Each microservice has its own consumer group so events are processed exactly once per service, not broadcast.' },
                { title: 'Backpressure Handling', desc: 'Stream length capped at 10,000 entries. Older entries auto-trimmed. No memory runaway under load.' },
                { title: 'Dead Letter Queue', desc: 'Failed processing moves events to a DLQ stream. Retry logic with exponential backoff. Zero event loss.' },
              ].map(item => (
                <div key={item.title} style={{ padding: '12px 16px', background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.1)' }}>
                  <div style={{ fontFamily: 'Orbitron', fontSize: 11, fontWeight: 600, color: '#c9a84c', marginBottom: 5 }}>{item.title}</div>
                  <div style={{ fontFamily: 'Space Grotesk', fontSize: 12, color: 'rgba(216,228,240,0.82)', lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </ResearchCard>

          <ResearchCard
            title="NLP — Document Q&A"
            code="LAB-04"
            icon="📝"
            color="#a070e0"
            description="LangChain + OpenAI embeddings for conversational document understanding"
            experiments={3}
          >
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {['LangChain', 'OpenAI Embeddings', 'FAISS', 'Vector Store', 'RAG', 'Chunking Strategy'].map(t => (
                <Tag key={t} label={t} color="#a070e0" />
              ))}
            </div>
            <LoreCard accent="#a070e0" text="RAG (Retrieval-Augmented Generation) over OCR output. The model doesn't memorize your document — it retrieves the right chunk, then generates an answer grounded in your actual text." />
          </ResearchCard>

          <ResearchCard
            title="Data Analytics — Minor Project"
            code="LAB-05"
            icon="📊"
            color="#38b8d8"
            description="Exploratory data analysis, feature engineering, visualization pipelines"
            experiments={6}
          >
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Scikit-learn', 'Feature Engineering', 'EDA', 'Correlation Analysis'].map(t => (
                <Tag key={t} label={t} color="#38b8d8" />
              ))}
            </div>
          </ResearchCard>

        </div>

        <div style={{ marginTop: 40 }}>
          <MemoryFragment
            id="MF-10"
            quote="Machine learning isn't sorcery. It's just pattern matching — made fast, made automated, made to scale. Once that clicked, every black box opened up."
            author="Lab Notes — Research Philosophy"
          />
        </div>
      </Section>

      <div style={{ height: 80 }} />
    </div>
  )
}
