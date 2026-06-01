import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Container } from '@shared/components/ui/Container'
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
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,_rgba(8,145,178,0.18),_transparent_38%)]" />
      <Container className="grid min-h-[calc(100vh-8rem)] items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div ref={introRef}>
          <p className="text-sm font-semibold tracking-[0.3em] text-cyan-300 uppercase">
            Creative developer
          </p>
          <h1 className="mt-5 text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            Building thoughtful digital experiences.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            A scalable React portfolio foundation for showcasing selected work,
            experiments, and the ideas behind them.
          </p>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 12 }}
            transition={{ delay: 0.55, duration: 0.5 }}
          >
            <Link
              className="rounded-full bg-cyan-300 px-5 py-3 font-medium text-slate-950 transition hover:bg-cyan-200"
              to="/projects"
            >
              Explore projects
            </Link>
            <Link
              className="rounded-full border border-white/20 px-5 py-3 font-medium text-white transition hover:border-cyan-300"
              to="/contact"
            >
              Start a conversation
            </Link>
          </motion.div>
        </div>
        <div className="h-[22rem] overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 sm:h-[30rem]">
          <Suspense fallback={<SceneFallback />}>
            <HeroScene />
          </Suspense>
        </div>
      </Container>
    </section>
  )
}

function SceneFallback() {
  return (
    <div className="h-full animate-pulse bg-[radial-gradient(circle,_rgba(34,211,238,0.18),_transparent_60%)]" />
  )
}
