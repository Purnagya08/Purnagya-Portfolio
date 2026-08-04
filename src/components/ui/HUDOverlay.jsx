import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNexusStore } from '../../store/nexusStore'
import { toggleAudio, SFX } from '../../audio/audioEngine'
import ContactOverlay from '../overlays/ContactOverlay'
import MessageOverlay from '../overlays/MessageOverlay'
import NavMenu from './NavMenu'

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return mobile
}

// ─── Shared button base ───────────────────────────────────────
const btnBase = (color, active, mobile) => ({
  fontFamily: 'JetBrains Mono',
  fontSize: mobile ? 10 : 9,
  letterSpacing: '0.1em',
  color: active ? (color === 'gold' ? '#ffe080' : '#7dd8f0') : (color === 'gold' ? '#e8c96a' : '#38b8d8'),
  background: active
    ? (color === 'gold' ? 'rgba(201,168,76,0.22)' : 'rgba(56,184,216,0.2)')
    : (color === 'gold' ? 'rgba(201,168,76,0.1)'  : 'rgba(56,184,216,0.08)'),
  border: `1.5px solid ${active
    ? (color === 'gold' ? '#c9a84c' : '#38b8d8')
    : (color === 'gold' ? 'rgba(201,168,76,0.55)' : 'rgba(56,184,216,0.5)')}`,
  padding: mobile ? '6px 10px' : '5px 11px',
  cursor: 'none',
  display: 'flex', alignItems: 'center',
  gap: mobile ? 0 : 5,
  whiteSpace: 'nowrap',
  transition: 'all 0.2s',
  minWidth: mobile ? 36 : 'auto',
  justifyContent: 'center',
})

function ProfileButton({ mobile }) {
  const { navigateTo, currentModule, triggerWarp } = useNexusStore()
  const isActive = currentModule === 'profile'
  function handleClick() { SFX.click(); triggerWarp(); setTimeout(() => navigateTo(isActive ? null : 'profile'), 400) }
  return (
    <button onClick={handleClick} data-cursor="hover" title="Captain's Profile"
      style={btnBase('gold', isActive, mobile)}>
      <span>◈</span>
      {!mobile && <span>CAPTAIN</span>}
    </button>
  )
}

function NexusAIButton({ mobile }) {
  const { navigateTo, currentModule, triggerWarp } = useNexusStore()
  const isActive = currentModule === 'nexusai'
  function handleClick() { SFX.click(); triggerWarp(); setTimeout(() => navigateTo(isActive ? null : 'nexusai'), 400) }
  return (
    <button onClick={handleClick} data-cursor="hover" title="NEXUS AI"
      style={btnBase('cyan', isActive, mobile)}>
      <motion.div animate={{ opacity:[0.5,1,0.5] }} transition={{ duration:2, repeat:Infinity }}
        style={{ width:5, height:5, borderRadius:'50%', background:'#38b8d8', flexShrink:0 }} />
      {!mobile && <span>NEXUS·AI</span>}
    </button>
  )
}

function ContactButton({ mobile, active, onClick }) {
  return (
    <button onClick={onClick} data-cursor="hover" title="Contact Links"
      style={btnBase('gold', active, mobile)}>
      <span>✉</span>
      {!mobile && <span>CONTACT</span>}
    </button>
  )
}

function MessageButton({ mobile, active, onClick }) {
  return (
    <button onClick={onClick} data-cursor="hover" title="Send Message"
      style={btnBase('cyan', active, mobile)}>
      <span>⌨</span>
      {!mobile && <span>MESSAGE</span>}
    </button>
  )
}

function SystemClock() {
  const { systemTime, tickClock } = useNexusStore()
  useEffect(() => { const t = setInterval(tickClock, 1000); return () => clearInterval(t) }, [tickClock])
  const d    = new Date(systemTime)
  const time = d.toLocaleTimeString('en-US', { hour12: false })
  const date = d.toLocaleDateString('en-US', { month:'2-digit', day:'2-digit', year:'numeric' })
  return (
    <div style={{ textAlign:'right', lineHeight:1.65 }}>
      <div style={{ fontFamily:'JetBrains Mono', fontSize:8,  color:'#60b8d8', letterSpacing:'0.1em' }}>SYS.CLOCK</div>
      <div style={{ fontFamily:'JetBrains Mono', fontSize:11, color:'#38b8d8', fontWeight:700 }}>{time}</div>
      <div style={{ fontFamily:'JetBrains Mono', fontSize:8,  color:'#60b8d8' }}>{date}</div>
    </div>
  )
}

function AudioToggle({ mobile }) {
  const { audioEnabled } = useNexusStore()
  const on = audioEnabled
  return (
    <button onClick={toggleAudio} data-cursor="hover" title={on ? 'Mute' : 'Enable Audio'}
      style={{
        display:'flex', flexDirection:'column', alignItems:'center', gap:2,
        background: on ? 'rgba(201,168,76,0.12)' : 'rgba(231,76,60,0.1)',
        border: `1.5px solid ${on ? 'rgba(201,168,76,0.7)' : 'rgba(231,76,60,0.6)'}`,
        padding: mobile ? '4px 8px' : '5px 10px',
        cursor:'none', minWidth: mobile ? 36 : 46,
      }}>
      {!mobile && <div style={{ fontFamily:'JetBrains Mono', fontSize:7, color: on?'#e8c96a':'#e74c3c', letterSpacing:'0.1em' }}>AUDIO</div>}
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
        {on ? <>
          <path d="M1 4h3l4-3v10l-4-3H1V4z" stroke="#c9a84c" strokeWidth="1" fill="rgba(201,168,76,0.25)" />
          <path d="M11 2.5c1.2 1.2 1.8 2.8 1.8 4.5s-.6 3.3-1.8 4.5" stroke="#c9a84c" strokeWidth="1" strokeLinecap="round" />
        </> : <>
          <path d="M1 4h3l4-3v10l-4-3H1V4z" stroke="#e74c3c" strokeWidth="1" fill="none" />
          <path d="M11 3l4 6m0-6l-4 6" stroke="#e74c3c" strokeWidth="1" strokeLinecap="round" />
        </>}
      </svg>
      <div style={{ fontFamily:'JetBrains Mono', fontSize: mobile?8:8, color: on?'#e8c96a':'#e74c3c', fontWeight:700 }}>{on?'ON':'OFF'}</div>
    </button>
  )
}

function BottomLeft() {
  const { cursorPos, sessionId } = useNexusStore()
  const nx = ((cursorPos.x / (window.innerWidth  || 1)) * 100).toFixed(1)
  const ny = ((cursorPos.y / (window.innerHeight || 1)) * 100).toFixed(1)
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
      <div style={{ fontFamily:'JetBrains Mono', fontSize:9 }}>
        <span style={{ color:'#60b8d8' }}>X:</span><span style={{ color:'#38b8d8', marginLeft:3, fontWeight:700 }}>{nx}%</span>
        <span style={{ color:'#60b8d8', marginLeft:8 }}>Y:</span><span style={{ color:'#38b8d8', marginLeft:3, fontWeight:700 }}>{ny}%</span>
      </div>
      <div style={{ fontFamily:'JetBrains Mono', fontSize:8, color:'#60b8d8' }}>
        SID·<span style={{ color:'#38b8d8', fontWeight:700 }}>{sessionId}</span>
      </div>
    </div>
  )
}

function FragmentStatus({ mobile }) {
  const { collectedFragments, totalFragments } = useNexusStore()
  const collected = collectedFragments.length
  const pct = Math.min(Math.round((collected / totalFragments) * 100), 100)
  return (
    <div style={{ fontFamily:'JetBrains Mono', fontSize:9 }}>
      {!mobile && <div style={{ color:'#e8c96a', marginBottom:4, fontSize:8, fontWeight:700, letterSpacing:'0.1em' }}>MEMORY FRAGMENTS</div>}
      <div style={{ width: mobile?60:80, height:3, background:'rgba(201,168,76,0.25)', borderRadius:2, marginBottom:3 }}>
        <div style={{ width:`${pct}%`, height:'100%', background:'linear-gradient(90deg,#a07830,#e8c96a)', borderRadius:2, transition:'width 0.5s' }} />
      </div>
      <div style={{ color:'#e8c96a', fontSize:10, fontWeight:700 }}>{collected}/{totalFragments}</div>
    </div>
  )
}

// ─── Side panel (desktop hub only) ───────────────────────────
function DataPanel({ side }) {
  const { collectedFragments, totalFragments, sessionId } = useNexusStore()
  const isLeft = side === 'left'
  const items = isLeft ? [
    { label:'STATION', value:'NEXUS-7G',  color:'#e8c96a' },
    { label:'STATUS',  value:'NOMINAL',   color:'#60d8a0' },
    { label:'MODULES', value:'09 / 09',   color:'#e8c96a' },
    { label:'SESSION', value:sessionId,   color:'#38b8d8' },
  ] : [
    { label:'FRAGMENTS', value:`${collectedFragments.length} / ${totalFragments}`, color:'#e8c96a' },
    { label:'ENGINEER',  value:'PURNAGYA', color:'#ffffff' },
    { label:'VERSION',   value:'v4.2.1',   color:'#e8c96a' },
    { label:'UPTIME',    value:'99.8%',    color:'#60d8a0' },
  ]
  return (
    <motion.div
      initial={{ opacity:0, x: isLeft?-16:16 }} animate={{ opacity:1, x:0 }}
      transition={{ delay:1, duration:0.6 }}
      style={{ position:'fixed', [isLeft?'left':'right']:14, top:'50%', transform:'translateY(-50%)', display:'flex', flexDirection:'column', gap:10, padding:'14px 13px', background:'rgba(2,5,14,0.9)', border:'1px solid rgba(56,184,216,0.3)', backdropFilter:'blur(14px)', width:126, zIndex:25, pointerEvents:'none' }}>
      <div style={{ fontFamily:'JetBrains Mono', fontSize:8, color:'#38b8d8', letterSpacing:'0.18em', fontWeight:700, borderBottom:'1px solid rgba(56,184,216,0.25)', paddingBottom:6 }}>
        {isLeft ? '◂ SYS.STATUS' : 'CAPTAIN.LOG ▸'}
      </div>
      {items.map(item => (
        <div key={item.label}>
          <div style={{ fontFamily:'JetBrains Mono', fontSize:7.5, color:'#5ab4d4', letterSpacing:'0.1em', marginBottom:2 }}>{item.label}</div>
          <div style={{ fontFamily:'JetBrains Mono', fontSize:10, color:item.color, fontWeight:700 }}>{item.value}</div>
        </div>
      ))}
      <motion.div animate={{ opacity:[0.4,1,0.4] }} transition={{ duration:2, repeat:Infinity }}
        style={{ width:5, height:5, borderRadius:'50%', background:'#60d8a0', boxShadow:'0 0 6px #60d8a0', alignSelf: isLeft?'flex-start':'flex-end' }} />
    </motion.div>
  )
}

// ─── Main HUD ─────────────────────────────────────────────────
export default function HUDOverlay({ visible = true }) {
  const { phase, currentModule } = useNexusStore()
  const [contactOpen, setContactOpen] = useState(false)
  const [messageOpen, setMessageOpen] = useState(false)
  const mobile = useIsMobile()

  if (!visible || phase === 'entry') return null

  const showPanels = currentModule === null && !mobile

  const divider = (
    <div style={{ width:1, background:'rgba(56,184,216,0.2)', alignSelf:'stretch' }} />
  )

  return (
    <>
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:200 }}>

        {/* ── Top-left: logo ── */}
        <div style={{
          position:'absolute', top:10, left:10,
          display:'flex', alignItems:'center', gap: mobile?6:8,
          pointerEvents:'all',
          background:'rgba(2,5,14,0.85)',
          border:'1px solid rgba(201,168,76,0.3)',
          padding: mobile?'5px 8px':'5px 10px',
          backdropFilter:'blur(12px)',
        }}>
          <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="12" stroke="#c9a84c" strokeWidth="1.2"/>
            <circle cx="14" cy="14" r="6"  stroke="#38b8d8" strokeWidth="1"/>
            <circle cx="14" cy="14" r="2.5" fill="#c9a84c"/>
          </svg>
          <div>
            <div style={{ fontFamily:'Orbitron', fontSize: mobile?9:11, color:'#e8c96a', letterSpacing:'0.2em', fontWeight:700 }}>NEXUS</div>
            {!mobile && <div style={{ fontFamily:'JetBrains Mono', fontSize:7, color:'#38b8d8', letterSpacing:'0.1em' }}>STATION·OS</div>}
          </div>
        </div>

        {/* ── Top-right: controls ── */}
        <div style={{
          position:'absolute', top:10, right:10,
          display:'flex', alignItems:'stretch', gap: mobile?3:6,
          pointerEvents:'all',
          background:'rgba(2,5,14,0.85)',
          border:'1px solid rgba(56,184,216,0.3)',
          padding: mobile?'5px 6px':'8px 10px',
          backdropFilter:'blur(14px)',
        }}>
          <ProfileButton mobile={mobile} />
          {divider}
          <NexusAIButton mobile={mobile} />
          {divider}
          <ContactButton mobile={mobile} active={contactOpen}
            onClick={() => { SFX.click(); setContactOpen(o=>!o); setMessageOpen(false) }} />
          {divider}
          <MessageButton mobile={mobile} active={messageOpen}
            onClick={() => { SFX.click(); setMessageOpen(o=>!o); setContactOpen(false) }} />
          {divider}
          {!mobile && <><SystemClock />{divider}</>}
          <AudioToggle mobile={mobile} />
        </div>

        {/* ── Side panels — desktop hub only ── */}
        {showPanels && <DataPanel side="left"  />}
        {showPanels && <DataPanel side="right" />}

        {/* ── Bottom-left — desktop only ── */}
        {!mobile && (
          <div style={{ position:'absolute', bottom:14, left:16, pointerEvents:'none' }}>
            <BottomLeft />
          </div>
        )}

        {/* ── Bottom-right ── */}
        <div style={{ position:'absolute', bottom:14, right: mobile?10:16, pointerEvents:'all' }}>
          <FragmentStatus mobile={mobile} />
        </div>

        {/* ── Corner lines — desktop only ── */}
        {!mobile && <>
          <svg style={{ position:'absolute', top:0, left:0 }} width="60" height="60" viewBox="0 0 60 60" fill="none">
            <path d="M0 30 L0 0 L30 0" stroke="rgba(56,184,216,0.3)" strokeWidth="1"/>
            <path d="M0 14 L0 0 L14 0" stroke="rgba(56,184,216,0.55)" strokeWidth="1"/>
          </svg>
          <svg style={{ position:'absolute', top:0, right:0 }} width="60" height="60" viewBox="0 0 60 60" fill="none">
            <path d="M60 30 L60 0 L30 0" stroke="rgba(56,184,216,0.3)" strokeWidth="1"/>
            <path d="M60 14 L60 0 L46 0" stroke="rgba(56,184,216,0.55)" strokeWidth="1"/>
          </svg>
          <svg style={{ position:'absolute', bottom:0, left:0 }} width="60" height="60" viewBox="0 0 60 60" fill="none">
            <path d="M0 30 L0 60 L30 60" stroke="rgba(201,168,76,0.3)" strokeWidth="1"/>
            <path d="M0 46 L0 60 L14 60" stroke="rgba(201,168,76,0.55)" strokeWidth="1"/>
          </svg>
          <svg style={{ position:'absolute', bottom:0, right:0 }} width="60" height="60" viewBox="0 0 60 60" fill="none">
            <path d="M60 30 L60 60 L30 60" stroke="rgba(201,168,76,0.3)" strokeWidth="1"/>
            <path d="M60 46 L60 60 L46 60" stroke="rgba(201,168,76,0.55)" strokeWidth="1"/>
          </svg>
        </>}

        {/* ── Nav sidebar — desktop only ── */}
        {!mobile && <NavMenu />}

        {/* ── Scan line ── */}
        <div style={{
          position:'absolute', top:0, left:0, width:'100%', height:1,
          background:'linear-gradient(90deg, transparent, rgba(56,184,216,0.5), transparent)',
          animation:'scanline 12s linear infinite',
        }} />
      </div>

      {/* ── Overlays outside pointerEvents:none ── */}
      <ContactOverlay open={contactOpen} onClose={() => setContactOpen(false)} />
      <MessageOverlay open={messageOpen} onClose={() => setMessageOpen(false)} />
    </>
  )
}
