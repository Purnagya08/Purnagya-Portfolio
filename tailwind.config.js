/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        space: {
          void:    '#02040c',
          deep:    '#04060f',
          dark:    '#080b18',
          mid:     '#0d1225',
          surface: '#111830',
          panel:   '#151d35',
          border:  '#1e2a4a',
          muted:   '#263352',
        },
        gold: {
          dim:    '#6b5520',
          base:   '#a07830',
          mid:    '#c9a84c',
          bright: '#e8c96a',
          glow:   '#f5e090',
        },
        cyan: {
          dim:    '#0a2535',
          base:   '#0e4060',
          mid:    '#1a7fa8',
          bright: '#38b8d8',
          glow:   '#7dd8f0',
        },
        text: {
          dim:      '#2a3654',
          muted:    '#4a5a80',
          secondary:'#7a8cb0',
          primary:  '#b0c0d8',
          bright:   '#d8e4f0',
          white:    '#eef4fa',
        },
      },
      fontFamily: {
        mono:  ['"JetBrains Mono"', 'monospace'],
        ui:    ['"Space Grotesk"', 'sans-serif'],
        story: ['"Libre Baskerville"', 'serif'],
        head:  ['"Orbitron"', 'sans-serif'],
      },
      animation: {
        'pulse-slow':    'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow':     'spin 20s linear infinite',
        'spin-medium':   'spin 8s linear infinite',
        'float':         'float 6s ease-in-out infinite',
        'scanline':      'scanline 8s linear infinite',
        'flicker':       'flicker 0.15s infinite',
        'glow-pulse':    'glowPulse 3s ease-in-out infinite',
        'orbit':         'orbit 12s linear infinite',
        'data-stream':   'dataStream 2s linear infinite',
        'boot-line':     'bootLine 0.05s steps(1) forwards',
        'cursor-blink':  'cursorBlink 1s steps(1) infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-20px)' },
        },
        scanline: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0.85' },
        },
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 20px rgba(201,168,76,0.3)' },
          '50%':     { boxShadow: '0 0 60px rgba(201,168,76,0.7)' },
        },
        orbit: {
          from: { transform: 'rotate(0deg) translateX(var(--orbit-r,40px)) rotate(0deg)' },
          to:   { transform: 'rotate(360deg) translateX(var(--orbit-r,40px)) rotate(-360deg)' },
        },
        dataStream: {
          '0%':   { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '0% 100%' },
        },
        bootLine: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        cursorBlink: {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0' },
        },
      },
      backgroundImage: {
        'star-field': `
          radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.9) 0%, transparent 100%),
          radial-gradient(1px 1px at 30% 60%, rgba(255,255,255,0.7) 0%, transparent 100%),
          radial-gradient(1px 1px at 60% 10%, rgba(255,255,255,0.8) 0%, transparent 100%),
          radial-gradient(1px 1px at 80% 80%, rgba(255,255,255,0.6) 0%, transparent 100%),
          radial-gradient(2px 2px at 50% 40%, rgba(255,255,255,0.5) 0%, transparent 100%)
        `,
        'nebula-1': 'radial-gradient(ellipse at 20% 50%, rgba(26,127,168,0.15) 0%, transparent 60%)',
        'nebula-2': 'radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.10) 0%, transparent 50%)',
        'grid-hud': `
          linear-gradient(rgba(56,184,216,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(56,184,216,0.04) 1px, transparent 1px)
        `,
      },
      boxShadow: {
        'gold':     '0 0 20px rgba(201,168,76,0.4), 0 0 60px rgba(201,168,76,0.15)',
        'gold-sm':  '0 0 10px rgba(201,168,76,0.3)',
        'cyan':     '0 0 20px rgba(56,184,216,0.4), 0 0 60px rgba(56,184,216,0.15)',
        'cyan-sm':  '0 0 10px rgba(56,184,216,0.3)',
        'panel':    '0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
        'inner-glow':'inset 0 0 40px rgba(56,184,216,0.05)',
      },
    },
  },
  plugins: [],
}
