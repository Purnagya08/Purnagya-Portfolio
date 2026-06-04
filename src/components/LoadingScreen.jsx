import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { SFX } from '../audio/audioEngine';

/**
 * Full-screen loading screen shown during initial app boot.
 * Displays animated NEXUS logo, rotating ring, optional progress bar.
 */
export default function LoadingScreen({ progress = 0, onComplete }) {
  const [visible, setVisible] = useState(true);
  const [dots, setDots] = useState('');

  // Animate loading dots
  useEffect(() => {
    const id = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 400);
    return () => clearInterval(id);
  }, []);

  // Play boot beep, auto-hide after 3s
  useEffect(() => {
    SFX.bootBeep(); // correct named SFX function
    const t = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 3000);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-label="Loading NEXUS Portfolio"
          className="fixed inset-0 flex flex-col items-center justify-center z-[10000] overflow-hidden"
          style={{ background: '#02040c' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Scanlines */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg,rgba(56,184,216,0.03) 0px,rgba(56,184,216,0.03) 1px,transparent 1px,transparent 4px)',
            }}
          />

          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center,transparent 50%,rgba(0,0,0,0.8) 100%)' }}
          />

          <div className="relative flex flex-col items-center gap-6">
            {/* Logo text */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1
                className="text-5xl sm:text-7xl font-bold tracking-[0.3em]"
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  color: '#38b8d8',
                  textShadow: '0 0 40px rgba(56,184,216,0.7), 0 0 80px rgba(56,184,216,0.3)',
                }}
              >
                NEXUS
              </h1>
              <p
                className="text-center text-[9px] tracking-[0.5em] mt-1 uppercase"
                style={{ color: 'rgba(56,184,216,0.4)', fontFamily: 'JetBrains Mono, monospace' }}
              >
                Portfolio System v6.0
              </p>
            </motion.div>

            {/* Spinning ring */}
            <motion.div
              className="relative w-24 h-24 sm:w-32 sm:h-32"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  border: '1px solid rgba(56,184,216,0.15)',
                  borderTop: '2px solid #38b8d8',
                  boxShadow: '0 0 16px rgba(56,184,216,0.3)',
                }}
              />
            </motion.div>

            {/* Status text */}
            <motion.p
              className="text-[10px] sm:text-xs tracking-widest uppercase"
              style={{ color: 'rgba(56,184,216,0.5)', fontFamily: 'JetBrains Mono, monospace' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Initializing systems{dots}
            </motion.p>

            {/* Progress bar */}
            {progress > 0 && (
              <div
                className="w-48 sm:w-64 h-px overflow-hidden"
                style={{ background: 'rgba(56,184,216,0.15)' }}
              >
                <motion.div
                  className="h-full"
                  style={{ background: 'linear-gradient(90deg, #38b8d8, #c9a84c)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress * 100, 100)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}
          </div>

          {/* Corner decorations */}
          {['top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4'].map((pos, i) => (
            <div
              key={i}
              className={`absolute ${pos} w-4 h-4`}
              style={{
                borderTop:    i < 2 ? '1px solid rgba(56,184,216,0.3)' : 'none',
                borderBottom: i >= 2 ? '1px solid rgba(56,184,216,0.3)' : 'none',
                borderLeft:   i % 2 === 0 ? '1px solid rgba(56,184,216,0.3)' : 'none',
                borderRight:  i % 2 === 1 ? '1px solid rgba(56,184,216,0.3)' : 'none',
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
