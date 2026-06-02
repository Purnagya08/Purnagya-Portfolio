import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { Container } from '@shared/components/ui/Container'
import { SystemBadge } from '@shared/components/ui/SystemBadge'
import { cn } from '@shared/utils/cn'
import {
  explorationPaths,
  futureDestinations,
  futureMilestones,
  futureSummary,
  missionForecasts,
  trajectoryBands,
} from '@modules/future-galaxy/data/futureGalaxy'
import { FragmentCollectionSection } from '@shared/components/archive/FragmentCollectionSection'

export function FutureGalaxyPage() {
  const [activeDestinationId, setActiveDestinationId] = useState(
    futureDestinations[0].id,
  )
  const pageRef = useRef(null)

  const activeDestination = useMemo(() => {
    return (
      futureDestinations.find(
        (destination) => destination.id === activeDestinationId,
      ) ?? futureDestinations[0]
    )
  }, [activeDestinationId])

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const context = gsap.context(() => {
      gsap.fromTo(
        '[data-future-reveal]',
        { autoAlpha: 0, y: reduceMotion ? 0 : 18 },
        {
          autoAlpha: 1,
          duration: reduceMotion ? 0.01 : 0.8,
          ease: 'power3.out',
          stagger: reduceMotion ? 0 : 0.07,
          y: 0,
        },
      )
    }, pageRef)

    return () => context.revert()
  }, [])

  return (
    <div className="relative isolate overflow-hidden bg-void-950" ref={pageRef}>
      <FutureAtmosphere />

      <Container className="relative py-section">
        <section
          className="grid items-end gap-nexus-8 lg:grid-cols-[1fr_24rem]"
          data-future-reveal
        >
          <div>
            <SystemBadge tone="brass">Uncharted Space</SystemBadge>
            <p className="mt-nexus-5 nexus-label text-starlight-500">
              Future Galaxy // long-horizon mission map
            </p>
            <h1 className="mt-nexus-4 max-w-4xl font-heading text-heading-xl font-semibold text-starlight-50">
              The story ends here only as a waypoint.
            </h1>
            <p className="mt-nexus-5 max-w-2xl text-body-lg text-starlight-300">
              This galaxy frames what comes next: research frontiers, startup
              ambition, open-source stewardship, systems at scale, and technical
              leadership. The map is intentionally unfinished so curiosity,
              optimism, and possibility remain active forces.
            </p>
          </div>

          <aside className="nexus-glass-subtle rounded-nexus-lg p-nexus-5">
            <p className="nexus-label text-signal-brass">Mission index</p>
            <dl className="mt-nexus-5 grid gap-px overflow-hidden rounded-nexus-sm border border-(--glass-border) bg-(--glass-border)">
              {futureSummary.map(([label, value]) => (
                <div className="bg-void-900/80 p-nexus-3" key={label}>
                  <dt className="font-mono text-[0.625rem] tracking-interface text-starlight-500 uppercase">
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm text-starlight-100">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-nexus-5 rounded-nexus-md border border-(--glass-border) bg-void-900/45 p-nexus-4">
              <p className="nexus-label text-starlight-500">Trajectory bands</p>
              <div className="mt-nexus-4 grid grid-cols-8 gap-1.5" aria-hidden="true">
                {trajectoryBands.map((value, index) => (
                  <div
                    className="flex h-24 items-end rounded-nexus-xs border border-(--glass-border) bg-void-950/55 p-1"
                    key={`${value}-${index}`}
                  >
                    <div
                      className={cn(
                        'w-full rounded-nexus-xs bg-nexus-archive',
                        index % 2 === 0 ? 'opacity-65' : 'opacity-90',
                      )}
                      style={{ height: `${value}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <div className="mt-nexus-9 nexus-hairline" data-future-reveal />

        <section
          className="mt-nexus-8 grid gap-nexus-6 xl:grid-cols-[1.07fr_0.93fr]"
          data-future-reveal
        >
          <div className="grid gap-nexus-4">
            <SectionLead
              eyebrow="Future destinations"
              title="Five destinations plotted in uncharted space"
              body="These are not static goals. They are directional commitments with evolving momentum and evidence."
            />

            {futureDestinations.map((destination, index) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                index={index}
                isActive={destination.id === activeDestinationId}
                onSelect={() => setActiveDestinationId(destination.id)}
              />
            ))}
          </div>

          <DestinationConsole destination={activeDestination} />
        </section>

        <section
          className="mt-nexus-8 grid gap-nexus-6 lg:grid-cols-[0.95fr_1.05fr]"
          data-future-reveal
        >
          <article className="nexus-glass-subtle rounded-nexus-lg p-nexus-5">
            <SectionLead
              eyebrow="Exploration paths"
              title="How the journey will be navigated"
              body="Each path defines a different mode of progress so ambition remains connected to real practice."
            />

            <div className="mt-nexus-5 grid gap-nexus-3">
              {explorationPaths.map((path, index) => (
                <article
                  className="rounded-nexus-md border border-(--glass-border) bg-void-900/45 p-nexus-4"
                  key={path.path}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-heading text-heading-md font-semibold text-starlight-50">
                      {path.path}
                    </h3>
                    <span className="font-mono text-[0.625rem] tracking-interface text-signal-sage uppercase">
                      V{String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="mt-nexus-3 text-body-sm text-starlight-300">
                    {path.note}
                  </p>
                  <p className="mt-nexus-3 nexus-label text-starlight-500">
                    Vector // {path.vector}
                  </p>
                </article>
              ))}
            </div>
          </article>

          <article className="nexus-glass-elevated rounded-nexus-lg p-nexus-5">
            <SectionLead
              eyebrow="Mission forecasts"
              title="Forecast windows for the next phases"
              body="Forecasts are scenario narratives, not startup KPI targets."
            />

            <div className="mt-nexus-5 grid gap-nexus-4">
              {missionForecasts.map((forecast) => (
                <article
                  className="rounded-nexus-md border border-(--glass-border) bg-void-900/40 p-nexus-4"
                  key={forecast.window}
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="nexus-label text-signal-brass">{forecast.window}</p>
                    <span className="rounded-nexus-pill border border-(--glass-border) bg-void-900/25 px-3 py-1 font-mono text-[0.575rem] tracking-interface text-starlight-300 uppercase">
                      Forecast
                    </span>
                  </div>

                  <h3 className="mt-nexus-2 font-heading text-heading-md font-semibold text-starlight-50">
                    {forecast.title}
                  </h3>
                  <p className="mt-nexus-3 text-body-sm text-starlight-300">
                    {forecast.objective}
                  </p>

                  <ul className="mt-nexus-4 space-y-2 text-body-sm text-starlight-200">
                    {forecast.checkpoints.map((checkpoint) => (
                      <li key={checkpoint}>• {checkpoint}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section
          className="mt-nexus-8 grid gap-nexus-6 xl:grid-cols-[1fr_0.96fr]"
          data-future-reveal
        >
          <article className="nexus-glass-subtle rounded-nexus-lg p-nexus-5">
            <SectionLead
              eyebrow="Future milestones"
              title="Milestones on the continuing route"
              body="Each marker is framed as a capability milestone so progress remains practical and grounded."
            />

            <div className="mt-nexus-5 space-y-3">
              {futureMilestones.map((milestone) => (
                <article
                  className="grid gap-nexus-3 rounded-nexus-md border border-(--glass-border) bg-void-900/55 px-nexus-4 py-nexus-4 md:grid-cols-[5rem_1fr] md:items-start"
                  key={milestone.marker}
                >
                  <div>
                    <p className="font-mono text-[0.625rem] tracking-interface text-signal-brass uppercase">
                      {milestone.marker}
                    </p>
                    <p className="mt-1 text-sm text-starlight-100">
                      {milestone.phase}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-heading text-heading-md font-semibold text-starlight-50">
                      {milestone.label}
                    </h3>
                    <p className="mt-nexus-2 text-body-sm text-starlight-300">
                      {milestone.detail}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className="nexus-glass-elevated rounded-nexus-lg p-nexus-5">
            <p className="nexus-label text-signal-sage">Story conclusion</p>
            <h2 className="mt-nexus-2 font-heading text-heading-lg font-semibold text-starlight-50">
              The map opens, the work continues.
            </h2>
            <p className="mt-nexus-4 text-body-md text-starlight-300">
              The earlier stations document origin, discipline, and active
              operations. Future Galaxy closes this chapter by pointing forward:
              the horizon is not a finish line but a widening field of work.
            </p>

            <div className="mt-nexus-5 rounded-nexus-md border border-(--glass-border) bg-void-900/40 p-nexus-4">
              <p className="nexus-label text-starlight-500">Next vector</p>
              <p className="mt-nexus-3 text-body-sm text-starlight-200">
                Continue from this map into the next mission cycle with curiosity
                intact, optimism grounded in practice, and possibility translated
                into ship-ready steps.
              </p>
            </div>

            <div className="mt-nexus-5 grid grid-cols-3 gap-3">
              {['Curiosity', 'Optimism', 'Possibility'].map((state) => (
                <div
                  className="rounded-nexus-sm border border-(--glass-border) bg-void-900/45 p-nexus-4 text-center"
                  key={state}
                >
                  <p className="font-mono text-[0.625rem] tracking-interface text-starlight-500 uppercase">
                    Signal
                  </p>
                  <p className="mt-2 text-sm text-starlight-100">{state}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-nexus-8" data-future-reveal>
          <FragmentCollectionSection
            location="future-galaxy"
            subtitle="Future fragments unlock as long-horizon destinations and milestones are explored."
            title="Future Galaxy memory fragments"
          />
        </section>
      </Container>
    </div>
  )
}

function FutureAtmosphere() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 -z-30 bg-nexus-space" />
      <div className="nexus-grid pointer-events-none absolute inset-0 -z-20 opacity-45" />
      <div className="pointer-events-none absolute top-20 left-[7%] -z-10 size-72 rounded-full bg-signal-blue/7 blur-3xl" />
      <div className="pointer-events-none absolute bottom-16 right-[9%] -z-10 size-80 rounded-full bg-signal-brass/7 blur-3xl" />
    </>
  )
}

function SectionLead({ eyebrow, title, body }) {
  return (
    <div className="max-w-2xl">
      <p className="nexus-label text-starlight-500">{eyebrow}</p>
      <h2 className="mt-nexus-2 font-heading text-heading-lg font-semibold text-starlight-50">
        {title}
      </h2>
      <p className="mt-nexus-3 text-body-sm text-starlight-300">{body}</p>
    </div>
  )
}

function DestinationCard({ destination, index, isActive, onSelect }) {
  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-nexus-lg border p-nexus-5 transition duration-300 ease-nexus-out',
        'bg-(--glass-panel) shadow-panel hover:-translate-y-0.5 hover:border-(--glass-border-highlight) hover:shadow-instrument',
        isActive ? 'border-(--glass-border-highlight)' : 'border-(--glass-border)',
      )}
      onMouseEnter={onSelect}
    >
      <button className="absolute inset-0 z-10" onClick={onSelect} type="button">
        <span className="sr-only">Inspect {destination.title}</span>
      </button>

      <div className="pointer-events-none relative z-20 grid gap-nexus-4">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="font-mono text-[0.625rem] tracking-data text-starlight-500 uppercase">
              Destination {String(index + 1).padStart(2, '0')}
            </p>
            <p className="mt-nexus-2 font-heading text-3xl font-semibold text-starlight-50/20 transition group-hover:text-starlight-50/35">
              {destination.code}
            </p>
          </div>
          <div className="rounded-nexus-sm border border-(--glass-border) bg-void-900/30 px-nexus-4 py-3 text-right">
            <p className="nexus-label text-starlight-500">Horizon</p>
            <p className="mt-nexus-2 font-mono text-[0.625rem] tracking-interface text-starlight-100 uppercase">
              {destination.horizon}
            </p>
          </div>
        </div>

        <h3 className="font-heading text-heading-md font-semibold text-starlight-50">
          {destination.title}
        </h3>
        <p className="text-body-sm text-starlight-300">{destination.mission}</p>

        <div>
          <div className="flex items-center justify-between gap-4">
            <p className="nexus-label text-signal-sage">Momentum</p>
            <p className="font-mono text-[0.625rem] tracking-interface text-signal-brass uppercase">
              {destination.momentum}%
            </p>
          </div>
          <div className="mt-nexus-3 h-2 overflow-hidden rounded-nexus-pill border border-(--glass-border) bg-void-950/70">
            <div
              className="h-full rounded-nexus-pill bg-gradient-to-r from-signal-sage via-signal-blue to-signal-brass"
              style={{ width: `${destination.momentum}%` }}
            />
          </div>
        </div>
      </div>
    </article>
  )
}

function DestinationConsole({ destination }) {
  return (
    <aside className="nexus-glass-elevated sticky top-24 h-fit rounded-nexus-lg p-nexus-5">
      <p className="nexus-label text-signal-brass">Destination console</p>
      <h2 className="mt-nexus-3 font-heading text-heading-md font-semibold text-starlight-50">
        {destination.title}
      </h2>
      <p className="mt-nexus-3 text-body-sm text-starlight-300">
        {destination.signal}
      </p>

      <div className="mt-nexus-5 rounded-nexus-md border border-(--glass-border) bg-void-900/40 p-nexus-4">
        <p className="nexus-label text-starlight-500">Mission directive</p>
        <p className="mt-nexus-3 text-body-sm text-starlight-200">
          {destination.mission}
        </p>
      </div>

      <div className="mt-nexus-5 rounded-nexus-md border border-(--glass-border) bg-void-900/40 p-nexus-4">
        <div className="flex items-center justify-between gap-4">
          <p className="nexus-label text-starlight-500">Current momentum</p>
          <p className="font-mono text-[0.625rem] tracking-interface text-starlight-100 uppercase">
            {destination.momentum}%
          </p>
        </div>
        <div className="mt-nexus-3 h-2 overflow-hidden rounded-nexus-pill border border-(--glass-border) bg-void-950/70">
          <div
            className="h-full rounded-nexus-pill bg-gradient-to-r from-signal-sage via-signal-blue to-signal-brass"
            style={{ width: `${destination.momentum}%` }}
          />
        </div>
      </div>
    </aside>
  )
}