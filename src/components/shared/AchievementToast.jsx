import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { SFX } from '../../audio/audioEngine';

export default function AchievementToast({ achievement, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Use existing SFX named functions — no .play() method on SFX object
    SFX.fragmentCollect();

    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="alert"
          aria-live="assertive"
          className="fixed top-6 right-6 z-[10000] flex items-start gap-3 p-4 rounded-lg
                     border border-[#38b8d8]/60 bg-[#02040c]/90 backdrop-blur-md shadow-2xl
                     max-w-xs w-full"
          style={{ boxShadow: '0 0 24px rgba(56,184,216,0.2)' }}
          initial={{ opacity: 0, x: 80, scale: 0.9 }}
          animate={{ opacity: 1, x: 0,  scale: 1 }}
          exit={{    opacity: 0, x: 80, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        >
          {/* Icon */}
          <div
            className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-lg"
            style={{ background: 'rgba(56,184,216,0.15)', border: '1px solid rgba(56,184,216,0.4)' }}
          >
            🏆
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p
              className="text-[10px] tracking-widest uppercase mb-0.5"
              style={{ color: '#c9a84c', fontFamily: 'JetBrains Mono, monospace' }}
            >
              Achievement Unlocked
            </p>
            <p
              className="text-sm font-semibold truncate"
              style={{ color: '#38b8d8', fontFamily: 'Orbitron, sans-serif' }}
            >
              {achievement.title}
            </p>
            {achievement.description && (
              <p
                className="text-[11px] mt-0.5 text-white/50 leading-tight"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                {achievement.description}
              </p>
            )}
          </div>

          {/* Close */}
          <button
            onClick={() => { setVisible(false); if (onClose) onClose(); }}
            aria-label="Dismiss achievement"
            className="shrink-0 text-white/30 hover:text-white/70 transition-colors text-xs focus:outline-none focus:ring-1 focus:ring-[#38b8d8]"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
