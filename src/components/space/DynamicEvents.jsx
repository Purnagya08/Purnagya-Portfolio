import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SFX } from '../../audio/audioEngine';

// Helper: Random integer in [min, max]
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ─── Sub-components ───────────────────────────────────────────────────────────

function Meteor({ id, startX }) {
  const duration = rand(2, 4) * 0.001; // converted below
  const angle = rand(30, 60); // degrees
  const length = rand(80, 200);

  return (
    <motion.div
      key={id}
      initial={{ x: startX, y: -20, opacity: 1 }}
      animate={{ x: startX + length * Math.cos((angle * Math.PI) / 180),
                 y: window.innerHeight + 40, opacity: 0 }}
      transition={{ duration: rand(20, 40) / 10, ease: 'linear' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: rand(60, 160),
        height: 1.5,
        background:
          'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 60%, rgba(255,255,255,0) 100%)',
        filter: 'blur(0.5px)',
        pointerEvents: 'none',
        zIndex: 9,
        transform: `rotate(${angle}deg)`,
        transformOrigin: 'left center',
      }}
    />
  );
}

function SolarFlare({ onComplete }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.5, 0.3, 0] }}
      transition={{ duration: 3, ease: 'easeInOut', times: [0, 0.2, 0.6, 1] }}
      onAnimationComplete={onComplete}
      style={{
        position: 'fixed',
        inset: 0,
        background:
          'radial-gradient(ellipse at 50% -10%, rgba(255,180,0,0.55), transparent 60%)',
        pointerEvents: 'none',
        zIndex: 8,
      }}
    />
  );
}

function WormholePulse({ onComplete }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 0.4, 0], scale: [0, 1.8, 3] }}
      transition={{ duration: 2.5, ease: 'easeOut' }}
      onAnimationComplete={onComplete}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background:
          'radial-gradient(circle, rgba(0,230,255,0.5), rgba(100,0,255,0.2), transparent 70%)',
        pointerEvents: 'none',
        zIndex: 8,
      }}
    />
  );
}

function SignalInterference({ onComplete }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.15, 0, 0.1, 0] }}
      transition={{ duration: 1.5, ease: 'linear' }}
      onAnimationComplete={onComplete}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundImage:
          'repeating-linear-gradient(0deg, rgba(0,255,100,0.08) 0px, rgba(0,255,100,0.08) 1px, transparent 1px, transparent 4px)',
        pointerEvents: 'none',
        zIndex: 8,
      }}
    />
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function DynamicEvents() {
  const [meteors,     setMeteors]     = useState([]);
  const [flare,       setFlare]       = useState(false);
  const [wormhole,    setWormhole]    = useState(false);
  const [signal,      setSignal]      = useState(false);

  // Remove a meteor after it finishes
  const removeMeteor = useCallback((id) => {
    setMeteors((prev) => prev.filter((m) => m.id !== id));
  }, []);

  // Recurring meteor shower
  useEffect(() => {
    const spawn = () => {
      const count = rand(2, 6);
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          const id = Date.now() + i;
          setMeteors((prev) => [
            ...prev,
            { id, startX: rand(0, window.innerWidth) },
          ]);
          // Auto-remove after max animation time
          setTimeout(() => removeMeteor(id), 5000);
        }, i * rand(100, 400));
      }
      SFX.warp(); // use existing SFX
    };

    const interval = setInterval(spawn, rand(15000, 30000));
    // Trigger once on mount after a short delay
    const initial = setTimeout(spawn, 3000);
    return () => {
      clearInterval(interval);
      clearTimeout(initial);
    };
  }, [removeMeteor]);

  // Solar flare – random timing
  useEffect(() => {
    const schedule = () => {
      const t = setTimeout(() => {
        if (!flare) {
          setFlare(true);
          SFX.portalOpen();
        }
        schedule();
      }, rand(40000, 90000));
      return t;
    };
    const t = schedule();
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Wormhole pulse
  useEffect(() => {
    const schedule = () => {
      const t = setTimeout(() => {
        if (!wormhole) {
          setWormhole(true);
          SFX.moduleEnter();
        }
        schedule();
      }, rand(60000, 120000));
      return t;
    };
    const t = schedule();
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Signal interference
  useEffect(() => {
    const schedule = () => {
      const t = setTimeout(() => {
        if (!signal) {
          setSignal(true);
          SFX.glitch();
        }
        schedule();
      }, rand(20000, 50000));
      return t;
    };
    const t = schedule();
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {meteors.map((m) => (
        <Meteor key={m.id} id={m.id} startX={m.startX} />
      ))}
      {flare     && <SolarFlare       key="flare"    onComplete={() => setFlare(false)} />}
      {wormhole  && <WormholePulse    key="wormhole" onComplete={() => setWormhole(false)} />}
      {signal    && <SignalInterference key="signal" onComplete={() => setSignal(false)} />}
    </AnimatePresence>
  );
}
