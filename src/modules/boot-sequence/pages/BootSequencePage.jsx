import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { TerminalLine } from '@modules/boot-sequence/components/TerminalLine'
import { bootOperations } from '@modules/boot-sequence/data/bootSequence'
import { useBootSequence } from '@modules/boot-sequence/hooks/useBootSequence'

export function BootSequencePage() {
  const navigate = useNavigate()
  const enterNexus = useCallback(
    () => navigate('/nexus', { replace: true }),
    [navigate],
  )
  const { isExiting, lineRefs, progress, progressRefs, rootRef } =
    useBootSequence({ onComplete: enterNexus })

  return (
    <motion.main
      animate={isExiting ? 'exit' : 'active'}
      className="boot-terminal relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-void-950 px-(--spacing-gutter) py-nexus-6"
      initial="initial"
      ref={rootRef}
      variants={{
        active: { opacity: 1, scale: 1 },
        exit: {
          filter: 'blur(10px)',
          opacity: 0,
          scale: 1.025,
          transition: { duration: 0.7, ease: [0.65, 0, 0.35, 1] },
        },
        initial: { opacity: 0, scale: 0.99 },
      }}
    >
      <div className="nexus-grid absolute inset-0 -z-30 opacity-55" />
      <div className="boot-terminal__wash absolute inset-0 -z-20" />
      <div className="nexus-scanlines pointer-events-none absolute inset-0 z-20" />
      <div className="boot-terminal__scan pointer-events-none absolute inset-x-0 top-0 z-10 h-24" />

      <section
        aria-label="NEXUS system initialization"
        className="nexus-glass relative w-full max-w-3xl overflow-hidden rounded-nexus-md"
      >
        <header className="flex items-center justify-between border-b border-(--glass-border) px-nexus-4 py-nexus-3">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-signal-red" />
            <span className="size-2 rounded-full bg-signal-brass" />
            <span className="size-2 rounded-full bg-signal-sage" />
          </div>
          <span className="nexus-label text-starlight-400">
            NEXUS // BOOT PROTOCOL
          </span>
        </header>

        <div className="p-nexus-5 sm:p-nexus-6">
          <p className="font-mono text-label tracking-data text-signal-blue uppercase">
            Engineer logbook interface
          </p>
          <h1 className="mt-nexus-3 font-display text-2xl font-bold tracking-display text-starlight-50 uppercase sm:text-4xl">
            NEXUS
          </h1>
          <p className="mt-nexus-2 font-mono text-xs tracking-interface text-starlight-500 uppercase">
            Secure station handshake // protocol 08
          </p>

          <ol
            aria-live="polite"
            className="mt-nexus-7 space-y-nexus-5 font-mono text-body-sm"
          >
            {bootOperations.map((operation, index) => (
              <TerminalLine
                index={index}
                key={operation.id}
                lineRef={(element) => {
                  lineRefs.current[index] = element
                }}
                progressRef={(element) => {
                  progressRefs.current[index] = element
                }}
              />
            ))}
          </ol>

          <footer className="mt-nexus-7 flex items-end justify-between gap-5 border-t border-(--glass-border) pt-nexus-4">
            <div>
              <p className="nexus-label text-starlight-500">System readiness</p>
              <p className="mt-1 font-mono text-xs text-signal-sage">
                {progress < 100 ? 'CALIBRATING' : 'TRANSFER READY'}
              </p>
            </div>
            <p className="font-display text-xl tracking-display text-signal-brass">
              {String(progress).padStart(3, '0')}%
            </p>
          </footer>
        </div>
      </section>

      <p className="nexus-label absolute bottom-nexus-5 text-starlight-500">
        Automatic station transfer enabled
        <span className="boot-terminal__cursor ml-1 text-signal-brass">_</span>
      </p>
    </motion.main>
  )
}
