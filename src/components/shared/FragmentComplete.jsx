import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { SFX } from '../../audio/audioEngine';

/**
 * Modal displayed when a memory fragment is collected.
 * Shows fragment name and auto-dismisses after 5 seconds.
 */
export default function FragmentComplete({ fragment, onDismiss }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    SFX.fragmentCollect(); // correct: named function, not SFX.play()
    const timer = setTimeout(() => {
      setShow(false);
      if (onDismiss) onDismiss();
    }, 5000);
    return () => clearTimeout(timer);
  }, [fragment, onDismiss]);

  if (!fragment) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Memory fragment acquired"
          className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-[#02040c] border border-[#38b8d8]/60 p-8 sm:p-12 rounded-xl text-center max-w-sm w-full mx-4"
            style={{ boxShadow: '0 0 60px rgba(56,184,216,0.25), inset 0 0 40px rgba(56,184,216,0.05)' }}
            initial={{ scale: 0.7, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            {/* Glow ring */}
            <motion.div
              className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-4xl"
              style={{ background: 'rgba(56,184,216,0.1)', border: '1px solid rgba(56,184,216,0.4)' }}
              animate={{ boxShadow: ['0 0 0px rgba(56,184,216,0.4)', '0 0 30px rgba(56,184,216,0.8)', '0 0 0px rgba(56,184,216,0.4)'] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              🔮
            </motion.div>

            <p
              className="text-[10px] tracking-[0.4em] uppercase mb-2"
              style={{ color: '#c9a84c', fontFamily: 'JetBrains Mono, monospace' }}
            >
              Memory Fragment Acquired
            </p>
            <h2
              className="text-xl sm:text-2xl font-bold mb-2"
              style={{ color: '#38b8d8', fontFamily: 'Orbitron, sans-serif' }}
            >
              {fragment.name ?? `Fragment #${fragment.id}`}
            </h2>
            {fragment.description && (
              <p
                className="text-xs text-white/50 mb-6 leading-relaxed"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                {fragment.description}
              </p>
            )}

            <button
              className="px-6 py-2.5 text-sm tracking-widest uppercase transition-all focus:outline-none focus:ring-2 focus:ring-[#38b8d8]"
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                background: 'rgba(56,184,216,0.12)',
                border: '1px solid rgba(56,184,216,0.5)',
                color: '#38b8d8',
              }}
              onClick={() => { setShow(false); if (onDismiss) onDismiss(); }}
            >
              Continue
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
