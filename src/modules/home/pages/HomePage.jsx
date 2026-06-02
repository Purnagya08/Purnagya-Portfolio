import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@shared/components/ui/Button'
import { Container } from '@shared/components/ui/Container'
import { GlassPanel } from '@shared/components/ui/GlassPanel'
import { SystemBadge } from '@shared/components/ui/SystemBadge'
import { NEXUS_MOTION } from '@shared/constants/motion'
import { useGsapReveal } from '@shared/hooks/useGsapReveal'

const HeroScene = lazy(() =>
  import('@three/scenes/HeroScene').then((module) => ({
    default: module.HeroScene,
  })),
)

export function HomePage() {
  const introRef = useGsapReveal({ distance: 18 })

  return (
    <section className="relative isolate overflow-hidden">
      <div className="nexus-grid absolute inset-0 -z-20 opacity-45" />
      <div className="nexus-scanlines pointer-events-none absolute inset-0 -z-10" />
      <Container className="grid min-h-[calc(100vh-8rem)] items-center gap-10 py-nexus-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div ref={introRef}>
          <SystemBadge>System online // Creative developer</SystemBadge>
          <h1 className="mt-nexus-5 font-display text-display-xl font-semibold tracking-display text-starlight-50 uppercase">
            Building thoughtful digital experiences.
          </h1>
          <p className="mt-nexus-5 max-w-xl text-body-lg text-starlight-300">
            A scalable React portfolio foundation for showcasing selected work,
            experiments, and the ideas behind them.
          </p>
          <motion.div
            {...NEXUS_MOTION.fadeUp}
            className="mt-nexus-6 flex flex-wrap gap-4"
            transition={{ ...NEXUS_MOTION.fadeUp.transition, delay: 0.55 }}
          >
            <Button as={Link} to="/projects">
              Explore projects
            </Button>
            <Button as={Link} to="/contact" variant="secondary">
              Start a conversation
            </Button>
          </motion.div>
        </div>
        <GlassPanel
          className="h-[22rem] overflow-hidden sm:h-[30rem]"
          variant="subtle"
        >
          <Suspense fallback={<SceneFallback />}>
            <HeroScene />
          </Suspense>
        </GlassPanel>
      </Container>
    </section>
  )
}

function SceneFallback() {
  return (
    <div className="h-full animate-nexus-pulse bg-[radial-gradient(circle,_rgb(89_243_255_/_0.18),_transparent_60%)]" />
  )
}
