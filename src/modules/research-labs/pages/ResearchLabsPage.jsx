import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { Container } from '@shared/components/ui/Container'
import { SystemBadge } from '@shared/components/ui/SystemBadge'
import { cn } from '@shared/utils/cn'
import {
  publicationThemes,
  researchRooms,
  researchSummary,
} from '@modules/research-labs/data/researchRooms'

export function ResearchLabsPage() {
  const [activeRoomId, setActiveRoomId] = useState(researchRooms[0].id)
  const pageRef = useRef(null)

  const activeRoom = useMemo(() => {
    return (
      researchRooms.find((room) => room.id === activeRoomId) ??
      researchRooms[0]
    )
  }, [activeRoomId])

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-research-reveal]',
        { autoAlpha: 0, y: reduceMotion ? 0 : 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: reduceMotion ? 0.01 : 0.72,
          ease: 'power3.out',
          stagger: reduceMotion ? 0 : 0.06,
        },
      )
    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={pageRef}
      className="relative isolate overflow-hidden bg-void-950"
    >
      <ResearchAtmosphere />

      <Container className="relative py-section">
        <section
          className="grid items-end gap-nexus-8 lg:grid-cols-[1fr_24rem]"
          data-research-reveal
        >
          <div>
            <SystemBadge tone="sage">Scientific research center</SystemBadge>
            <p className="mt-nexus-5 nexus-label text-starlight-500">
              Research Labs // documented experiments
            </p>
            <h1 className="mt-nexus-4 max-w-4xl font-heading text-heading-xl font-semibold text-starlight-50">
              A museum-grade archive of evidence.
            </h1>
            <p className="mt-nexus-5 max-w-2xl text-body-lg text-starlight-300">
              These rooms are organized as instruments: each lab keeps a trace
              of method, measurement, and failure-case reasoning—so outcomes
              remain interpretable long after the run is complete.
            </p>
          </div>

          <aside className="nexus-glass-subtle rounded-nexus-lg p-nexus-5">
            <p className="nexus-label text-signal-sage">Center index</p>
            <dl className="mt-nexus-5 grid gap-px overflow-hidden rounded-nexus-sm border border-(--glass-border) bg-(--glass-border)">
              {researchSummary.map(([label, value]) => (
                <div className="bg-void-900/80 p-nexus-3" key={label}>
                  <dt className="font-mono text-[0.625rem] tracking-interface text-starlight-500 uppercase">
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm text-starlight-100">{value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </section>

        <section
          className="mt-nexus-9 grid gap-nexus-6 lg:grid-cols-[0.95fr_1.05fr]"
          data-research-reveal
        >
          <RoomGallery
            rooms={researchRooms}
            activeRoomId={activeRoomId}
            onSelect={setActiveRoomId}
          />

          <RoomRecord room={activeRoom} />
        </section>

        <div className="mt-nexus-9 nexus-hairline" data-research-reveal />

        <section className="mt-nexus-8" data-research-reveal>
          <div className="grid gap-nexus-6 lg:grid-cols-2">
            {publicationThemes.map((theme) => (
              <article
                key={theme.title}
                className="nexus-glass-elevated rounded-nexus-lg p-nexus-5"
              >
                <p className="nexus-label text-signal-brass">Theme</p>
                <h2 className="mt-nexus-3 font-heading text-heading-md font-semibold text-starlight-50">
                  {theme.title}
                </h2>
                <p className="mt-nexus-4 text-body-md text-starlight-300">
                  {theme.body}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-nexus-6 rounded-nexus-lg border border-(--glass-border) bg-void-900/15 px-nexus-5 py-nexus-6">
            <p className="nexus-label text-starlight-500">
              Research protocol
            </p>
            <ul className="mt-nexus-4 space-y-3 font-mono text-body-sm text-starlight-300">
              <li>• Define success signals before the run.</li>
              <li>• Record assumptions and data versions.</li>
              <li>• Map failures into categories, then iterate deliberately.</li>
              <li>• Archive results so future work begins with evidence.</li>
            </ul>
          </div>
        </section>
      </Container>
    </div>
  )
}

function ResearchAtmosphere() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 -z-30 bg-nexus-space" />
      <div className="nexus-grid pointer-events-none absolute inset-0 -z-20 opacity-45" />
      <div className="pointer-events-none absolute top-24 left-[6%] -z-10 size-72 rounded-full bg-signal-sage/7 blur-3xl" />
      <div className="pointer-events-none absolute bottom-16 right-[8%] -z-10 size-80 rounded-full bg-signal-brass/7 blur-3xl" />
    </>
  )
}

function RoomGallery({ rooms, activeRoomId, onSelect }) {
  return (
    <div className="grid gap-nexus-4">
      {rooms.map((room, index) => (
        <RoomCard
          key={room.id}
          room={room}
          index={index}
          isActive={room.id === activeRoomId}
          onSelect={() => onSelect(room.id)}
        />
      ))}
    </div>
  )
}

function RoomCard({ room, index, isActive, onSelect }) {
  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-nexus-lg border p-nexus-5 transition duration-300 ease-nexus-out',
        'bg-(--glass-panel) shadow-panel',
        isActive
          ? 'border-(--glass-border-highlight)'
          : 'border-(--glass-border) hover:translate-y-[-0.25rem] hover:border-(--glass-border-highlight)',
      )}
    >
      <button
        className="absolute inset-0 z-10"
        onClick={onSelect}
        type="button"
      >
        <span className="sr-only">Inspect {room.room}</span>
      </button>

      <div className="pointer-events-none relative z-20 grid gap-nexus-4">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="font-mono text-[0.625rem] tracking-data text-starlight-500 uppercase">
              {String(index + 1).padStart(2, '0')} // room code
            </p>
            <p className="mt-nexus-2 font-heading text-heading-md font-semibold text-starlight-50/30 group-hover:text-starlight-50/45">
              {room.code}
            </p>
          </div>
          <div className="shrink-0 rounded-nexus-sm border border-(--glass-border) bg-void-900/30 px-nexus-4 py-3">
            <p className="nexus-label text-starlight-400">Index</p>
            <p className="mt-nexus-2 font-mono text-[0.625rem] tracking-interface text-starlight-200 uppercase">
              {room.roomsCount}
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-heading text-heading-md font-semibold text-starlight-50">
            {room.room}
          </h2>
          <p className="mt-nexus-3 text-body-sm text-starlight-300">
            {room.focus}
          </p>
        </div>
      </div>
    </article>
  )
}

function RoomRecord({ room }) {
  return (
    <aside className="nexus-glass-elevated rounded-nexus-lg p-nexus-5 sticky top-24 h-fit">
      <p className="nexus-label text-signal-brass">Lab record</p>
      <h2 className="mt-nexus-3 font-heading text-heading-lg font-semibold text-starlight-50">
        {room.room}
      </h2>
      <p className="mt-nexus-4 text-body-md text-starlight-300">
        {room.story}
      </p>

      <div className="mt-nexus-6 rounded-nexus-md border border-(--glass-border) bg-void-900/40 p-nexus-4">
        <p className="nexus-label text-starlight-400">Instrumentation</p>
        <p className="mt-nexus-3 text-body-sm text-starlight-300">
          {room.equipment}
        </p>
      </div>

      <div className="mt-nexus-6">
        <p className="nexus-label text-starlight-500">Research questions</p>
        <ul className="mt-nexus-4 space-y-3 font-mono text-body-sm text-starlight-300">
          {room.questions.map((q) => (
            <li key={q}>• {q}</li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

