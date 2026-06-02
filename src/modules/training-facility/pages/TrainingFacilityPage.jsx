import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  learningMilestones,
  trainingRooms,
  trainingSummary,
} from '@modules/training-facility/data/trainingRooms'
import { FragmentCollectionSection } from '@shared/components/archive/FragmentCollectionSection'
import { Container } from '@shared/components/ui/Container'
import { SystemBadge } from '@shared/components/ui/SystemBadge'
import { cn } from '@shared/utils/cn'

const TOTAL_DAYS = 365

export function TrainingFacilityPage() {
  const [activeRoomId, setActiveRoomId] = useState(trainingRooms[0].id)
  const pageRef = useRef(null)
  const activeRoom =
    trainingRooms.find((room) => room.id === activeRoomId) ?? trainingRooms[0]
  const accumulatedDays = useMemo(
    () => trainingRooms.reduce((total, room) => total + room.days, 0),
    [],
  )

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const context = gsap.context(() => {
      gsap.fromTo(
        '[data-training-reveal]',
        { autoAlpha: 0, y: reduceMotion ? 0 : 18 },
        {
          autoAlpha: 1,
          duration: reduceMotion ? 0.01 : 0.78,
          ease: 'power3.out',
          stagger: reduceMotion ? 0 : 0.075,
          y: 0,
        },
      )
    }, pageRef)

    return () => context.revert()
  }, [])

  return (
    <div className="relative isolate overflow-hidden bg-void-950" ref={pageRef}>
      <TrainingAtmosphere />

      <Container className="relative py-section">
        <section
          className="grid items-end gap-nexus-8 lg:grid-cols-[1fr_24rem]"
          data-training-reveal
        >
          <div>
            <SystemBadge tone="blue">Engineering academy archive</SystemBadge>
            <p className="mt-nexus-5 nexus-label text-starlight-500">
              Training Facility // 365 days of upskilling
            </p>
            <h1 className="mt-nexus-4 max-w-4xl font-heading text-heading-xl font-semibold text-starlight-50">
              A year of disciplined learning, preserved as an engineering
              institution.
            </h1>
            <p className="mt-nexus-5 max-w-2xl text-body-lg text-starlight-300">
              This facility records the quiet weight of hundreds of days:
              language foundations, object modeling, data structures,
              concurrency, and the endurance required to keep returning to hard
              problems.
            </p>
          </div>

          <aside className="nexus-glass-subtle rounded-nexus-lg p-nexus-5">
            <p className="nexus-label text-signal-blue">Program index</p>
            <dl className="mt-nexus-5 grid gap-px overflow-hidden rounded-nexus-sm border border-(--glass-border) bg-(--glass-border)">
              {trainingSummary.map(([label, value]) => (
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
          className="mt-nexus-9 grid gap-nexus-6 lg:grid-cols-[0.9fr_1.1fr]"
          data-training-reveal
        >
          <ProgressArchive accumulatedDays={accumulatedDays} />
          <MilestoneLedger />
        </section>

        <div className="mt-nexus-9 nexus-hairline" data-training-reveal />

        <section
          className="mt-nexus-8 grid gap-nexus-6 lg:grid-cols-[1.1fr_0.9fr]"
          data-training-reveal
        >
          <div className="grid gap-nexus-4">
            {trainingRooms.map((room, index) => (
              <TrainingRoomCard
                index={index}
                isActive={activeRoomId === room.id}
                key={room.id}
                onSelect={() => setActiveRoomId(room.id)}
                room={room}
              />
            ))}
          </div>

          <MemoryFragments room={activeRoom} />
        </section>

        <section className="mt-nexus-8" data-training-reveal>
          <FragmentCollectionSection
            location="training-facility"
            subtitle="Collect milestones from foundational learning and systems discipline."
            title="Training memory fragments"
          />
        </section>
      </Container>
    </div>
  )
}

function TrainingAtmosphere() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 -z-30 bg-nexus-space" />
      <div className="nexus-grid pointer-events-none absolute inset-0 -z-20 opacity-45" />
      <div className="pointer-events-none absolute top-20 right-[10%] -z-10 size-80 rounded-full bg-signal-blue/8 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 left-[8%] -z-10 size-72 rounded-full bg-signal-sage/8 blur-3xl" />
    </>
  )
}

function ProgressArchive({ accumulatedDays }) {
  return (
    <article className="nexus-glass-elevated rounded-nexus-lg p-nexus-5">
      <p className="nexus-label text-signal-brass">Progression record</p>
      <div className="mt-nexus-4 flex items-end justify-between gap-nexus-5">
        <div>
          <p className="font-heading text-display-lg font-semibold text-starlight-50">
            {TOTAL_DAYS}
          </p>
          <p className="nexus-label mt-nexus-2 text-starlight-500">
            days committed
          </p>
        </div>
        <p className="max-w-52 text-right text-body-sm text-starlight-300">
          The archive measures progress as accumulated attention, not speed.
        </p>
      </div>

      <div className="mt-nexus-6 overflow-hidden rounded-nexus-pill border border-(--glass-border) bg-void-900/80 p-1">
        <div
          className="h-3 rounded-nexus-pill bg-nexus-archive"
          style={{
            width: `${Math.min(accumulatedDays / TOTAL_DAYS, 1) * 100}%`,
          }}
        />
      </div>

      <div className="mt-nexus-5 grid grid-cols-5 gap-2">
        {trainingRooms.map((room) => (
          <div key={room.id}>
            <div
              className="h-16 rounded-nexus-xs border border-(--glass-border) bg-hull-700/55"
              style={{ opacity: 0.35 + room.completion / 160 }}
            />
            <p className="mt-2 font-mono text-[0.55rem] tracking-interface text-starlight-500 uppercase">
              {room.code}
            </p>
          </div>
        ))}
      </div>
    </article>
  )
}

function MilestoneLedger() {
  return (
    <article className="nexus-glass-subtle rounded-nexus-lg p-nexus-5">
      <p className="nexus-label text-signal-sage">Learning milestones</p>
      <div className="mt-nexus-5 grid gap-nexus-3">
        {learningMilestones.map((milestone, index) => (
          <div
            className="grid grid-cols-[3rem_1fr] gap-nexus-4 rounded-nexus-sm border border-(--glass-border) bg-void-900/60 p-nexus-4"
            key={milestone}
          >
            <p className="font-mono text-[0.625rem] tracking-data text-starlight-500">
              {String(index + 1).padStart(2, '0')}
            </p>
            <p className="text-body-sm text-starlight-200">{milestone}</p>
          </div>
        ))}
      </div>
    </article>
  )
}

function TrainingRoomCard({ index, isActive, onSelect, room }) {
  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-nexus-lg border p-nexus-5 transition duration-300 ease-nexus-out',
        'bg-(--glass-panel) shadow-panel hover:-translate-y-0.5 hover:border-(--glass-border-highlight) hover:shadow-instrument',
        isActive
          ? 'border-(--glass-border-highlight)'
          : 'border-(--glass-border)',
      )}
      onMouseEnter={onSelect}
    >
      <button
        className="absolute inset-0 z-10"
        onClick={onSelect}
        type="button"
      >
        <span className="sr-only">Inspect {room.room}</span>
      </button>

      <div className="pointer-events-none relative z-20 grid gap-nexus-5 md:grid-cols-[7rem_1fr]">
        <div>
          <p className="font-mono text-[0.625rem] tracking-data text-signal-blue uppercase">
            Room {String(index + 1).padStart(2, '0')}
          </p>
          <p className="mt-nexus-2 font-heading text-3xl font-semibold text-starlight-50/20 transition group-hover:text-starlight-50/35">
            {room.code}
          </p>
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-nexus-3">
            <p className="nexus-label text-starlight-500">{room.focus}</p>
            <p className="font-mono text-[0.625rem] tracking-interface text-signal-brass uppercase">
              {room.days} days recorded
            </p>
          </div>
          <h2 className="mt-nexus-2 font-heading text-heading-md font-semibold text-starlight-50">
            {room.room}
          </h2>
          <p className="mt-nexus-4 max-w-2xl text-body-sm text-starlight-300">
            {room.story}
          </p>
        </div>
      </div>
    </article>
  )
}

function MemoryFragments({ room }) {
  return (
    <aside className="nexus-glass-elevated sticky top-24 h-fit rounded-nexus-lg p-nexus-5">
      <p className="nexus-label text-signal-brass">Memory fragments</p>
      <h2 className="mt-nexus-3 font-heading text-heading-md font-semibold text-starlight-50">
        {room.room}
      </h2>
      <p className="mt-nexus-4 border-l border-signal-blue/50 pl-nexus-4 text-body-sm text-starlight-300">
        {room.milestone}
      </p>

      <div className="mt-nexus-6 grid gap-nexus-3">
        {room.fragments.map((fragment, index) => (
          <div
            className="rounded-nexus-sm border border-(--glass-border) bg-void-900/70 p-nexus-4 transition duration-300 hover:border-signal-brass/40 hover:bg-hull-700/45"
            key={fragment}
          >
            <p className="font-mono text-[0.625rem] tracking-data text-starlight-500 uppercase">
              Fragment {String(index + 1).padStart(2, '0')}
            </p>
            <p className="mt-nexus-2 text-body-sm text-starlight-200">
              {fragment}
            </p>
          </div>
        ))}
      </div>
    </aside>
  )
}
