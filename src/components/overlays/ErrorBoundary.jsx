import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('NEXUS ERROR BOUNDARY:', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div style={{
        position: 'fixed', inset: 0,
        background: '#02040c',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 16,
        fontFamily: 'JetBrains Mono',
        padding: 32,
      }}>
        {/* Scanlines */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(231,76,60,0.03) 2px, rgba(231,76,60,0.03) 4px)',
        }} />

        <div style={{ fontSize: 36, color: '#e74c3c' }}>⚠</div>

        <div style={{
          fontFamily: 'Orbitron', fontSize: 'clamp(18px, 4vw, 28px)',
          fontWeight: 700, color: '#e74c3c',
          textShadow: '0 0 30px rgba(231,76,60,0.4)',
          letterSpacing: '0.08em', textAlign: 'center',
        }}>
          SYSTEM FAULT
        </div>

        <div style={{
          fontSize: 10, color: 'rgba(231,76,60,0.80)',
          letterSpacing: '0.2em', textAlign: 'center',
        }}>
          NEXUS OS ENCOUNTERED AN UNHANDLED EXCEPTION
        </div>

        {this.state.error && (
          <div style={{
            maxWidth: 480, width: '100%',
            padding: '12px 16px',
            background: 'rgba(231,76,60,0.06)',
            border: '1px solid rgba(231,76,60,0.2)',
            fontSize: 10,
            color: 'rgba(231,76,60,0.7)',
            lineHeight: 1.6,
            wordBreak: 'break-all',
            textAlign: 'left',
          }}>
            <div style={{ color: 'rgba(231,76,60,0.80)', marginBottom: 4 }}>ERROR LOG:</div>
            {this.state.error.message}
          </div>
        )}

        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: 8,
            fontFamily: 'JetBrains Mono', fontSize: 10,
            letterSpacing: '0.2em', color: '#e74c3c',
            background: 'none',
            border: '1px solid rgba(231,76,60,0.4)',
            padding: '10px 28px', cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          REBOOT NEXUS
        </button>

        <div style={{ fontSize: 8, color: 'rgba(56,184,216,0.75)', letterSpacing: '0.15em', marginTop: 8 }}>
          NEXUS OS v4.2.1 · FAULT RECOVERY MODE
        </div>
      </div>
    )
  }
}
