import { motion } from 'framer-motion';
import { useNexusStore } from '../store/nexusStore';

export default function NotFound() {
  const { setPhase } = useNexusStore();

  return (
    <motion.div
      role="main"
      aria-label="404 – Page not found"
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#02040c', fontFamily: 'JetBrains Mono, monospace' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg,rgba(56,184,216,0.03) 0px,rgba(56,184,216,0.03) 1px,transparent 1px,transparent 4px)',
        }}
      />

      <div className="relative z-10 text-center px-6">
        {/* Glitch 404 */}
        <motion.div
          className="text-[120px] sm:text-[180px] font-bold leading-none select-none"
          style={{
            fontFamily: 'Orbitron, sans-serif',
            color: '#38b8d8',
            textShadow: '0 0 40px rgba(56,184,216,0.5)',
          }}
          animate={{
            textShadow: [
              '0 0 40px rgba(56,184,216,0.5)',
              '4px 0 0 rgba(255,0,80,0.6), -4px 0 0 rgba(0,255,200,0.6)',
              '0 0 40px rgba(56,184,216,0.5)',
            ],
            x: [0, -3, 3, 0],
          }}
          transition={{ repeat: Infinity, duration: 3, repeatDelay: 2 }}
        >
          404
        </motion.div>

        <p
          className="text-sm sm:text-base tracking-widest uppercase mt-4 mb-2"
          style={{ color: '#c9a84c' }}
        >
          Signal Lost
        </p>
        <p
          className="text-xs sm:text-sm text-white/40 mb-10 max-w-xs mx-auto"
        >
          The sector you're looking for has been swallowed by a wormhole.
        </p>

        <button
          onClick={() => setPhase('hub')}
          className="px-8 py-3 text-xs tracking-[0.3em] uppercase transition-all focus:outline-none focus:ring-2 focus:ring-[#38b8d8]"
          style={{
            border: '1px solid rgba(56,184,216,0.5)',
            color: '#38b8d8',
            background: 'rgba(56,184,216,0.08)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(56,184,216,0.18)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(56,184,216,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(56,184,216,0.08)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Return to Hub
        </button>
      </div>
    </motion.div>
  );
}
