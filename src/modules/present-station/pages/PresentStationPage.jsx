import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { Container } from '@shared/components/ui/Container'
import { SystemBadge } from '@shared/components/ui/SystemBadge'
import { cn } from '@shared/utils/cn'
import {
  currentProjects,
  focusAreas,
  githubActivity,
  learningGoals,
  missionLog,
  readingList,
  researchInterests,
  stationSummary,
} from '@modules/present-station/data/presentStation'
import { FragmentCollectionSection } from '@shared/components/archive/FragmentCollectionSection'

export function PresentStationPage() {
  const [activeProjectId, setActiveProjectId] = useState(currentProjects[0].id)
  const [activeGoalId, setActiveGoalId] = useState(learningGoals[0].id)
  const pageRef = useRef(null)

  const activeProject = useMemo(() => {
    return (
      currentProjects.find((project) => project.id === activeProjectId) ??
      currentProjects[0]
    )
  }, [activeProjectId])

  const activeGoal = useMemo(() => {
    return (
      learningGoals.find((goal) => goal.id === activeGoalId) ??
      learningGoals[0]
    )
  }, [activeGoalId])

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const context = gsap.context(() => {
      gsap.fromTo(
        '[data-present-reveal]',
        { autoAlpha: 0, y: reduceMotion ? 0 : 16 },
        {
          autoAlpha: 1,
          duration: reduceMotion ? 0.01 : 0.76,
          ease: 'power3.out',
          stagger: reduceMotion ? 0 : 0.06,
          y: 0,
        },
      )
    }, pageRef)

    return () => context.revert()
  }, [])

  return (
    <div className="relative isolate overflow-hidden bg-void-950" ref={pageRef}>
      <StationAtmosphere />

      <Container className="relative py-section">
        <section
          className="grid items-end gap-nexus-8 lg:grid-cols-[1fr_24rem]"
          data-present-reveal
        >
          <div>
            <SystemBadge tone="sage">Active engineering operations center</SystemBadge>
            <p className="mt-nexus-5 nexus-label text-starlight-500">
              Present Station // live engineering logbook
            </p>
            <h1 className="mt-nexus-4 max-w-4xl font-heading text-heading-xl font-semibold text-starlight-50">
              The engineer\'s current state is kept live, not archived.
            </h1>
            <p className="mt-nexus-5 max-w-2xl text-body-lg text-starlight-300">
              This station records the work as it happens: current projects,
              learning goals, research interests, GitHub activity, reading, and
              focus areas. The page should read like a field log from a desk
              where the next move is still being planned.
            </p>
          </div>

          <aside className="nexus-glass-subtle rounded-nexus-lg p-nexus-5">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="nexus-label text-signal-sage">Station status</p>
                <p className="mt-nexus-2 text-body-sm text-starlight-300">
                  Engineering logbook online and updating.
                </p>
              </div>
              <div className="rounded-nexus-sm border border-(--glass-border) bg-void-900/35 px-nexus-4 py-3 text-right">
                <p className="nexus-label text-starlight-500">Mode</p>
                <p className="mt-1 font-mono text-[0.625rem] tracking-interface text-starlight-100 uppercase">
                  On duty
                </p>
              </div>
            </div>

            <dl className="mt-nexus-5 grid gap-px overflow-hidden rounded-nexus-sm border border-(--glass-border) bg-(--glass-border)">
              {stationSummary.map(([label, value]) => (
                <div className="bg-void-900/80 p-nexus-3" key={label}>
                  <dt className="font-mono text-[0.625rem] tracking-interface text-starlight-500 uppercase">
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm text-starlight-100">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-nexus-5 rounded-nexus-md border border-(--glass-border) bg-void-900/40 p-nexus-4">
              <div className="flex items-center justify-between gap-4">
                <p className="nexus-label text-starlight-500">Live vector</p>
                <p className="font-mono text-[0.625rem] tracking-interface text-signal-brass uppercase">
                  Current
                </p>
              </div>
              <div className="mt-nexus-4 grid grid-cols-6 gap-2" aria-hidden="true">
                {[44, 58, 63, 71, 66, 79].map((height, index) => (
                  <div
                    className="flex h-24 items-end rounded-nexus-xs border border-(--glass-border) bg-void-950/55 p-1"
                    key={`${height}-${index}`}
                  >
                    <div
                      className={cn(
                        'w-full rounded-nexus-xs bg-nexus-archive',
                        index % 2 === 0 ? 'opacity-65' : 'opacity-90',
                      )}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <div className="mt-nexus-9 nexus-hairline" data-present-reveal />

        <section
          className="mt-nexus-8 grid gap-nexus-6 xl:grid-cols-[1.08fr_0.92fr]"
          data-present-reveal
        >
          <div className="grid gap-nexus-4">
            <SectionHeading
              eyebrow="Current projects"
              title="Mission list in flight"
              body="Each card reads like a field entry. Select one to inspect the status, signals, and next move without collapsing the whole station into a dashboard."
            />

            {currentProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                index={index}
                isActive={activeProjectId === project.id}
                onSelect={() => setActiveProjectId(project.id)}
                project={project}
              />
            ))}
          </div>

          <ProjectConsole project={activeProject} />
        </section>

        <section
          className="mt-nexus-8 grid gap-nexus-6 lg:grid-cols-[0.95fr_1.05fr]"
          data-present-reveal
        >
          <LearningTracker
            activeGoal={activeGoal}
            activeGoalId={activeGoalId}
            onSelectGoal={setActiveGoalId}
          />
          <ResearchLedger />
        </section>

        <section
          className="mt-nexus-8 grid gap-nexus-6 xl:grid-cols-[1fr_0.96fr]"
          data-present-reveal
        >
          <GithubActivityPanel />
          <ReadingAndFocusPanel />
        </section>

        <section className="mt-nexus-8" data-present-reveal>
          <FragmentCollectionSection
            location="present-station"
            subtitle="Live operation fragments reward recurring visits while work evolves."
            title="Present Station memory fragments"
          />
        </section>

        <section className="mt-nexus-8 rounded-nexus-lg border border-(--glass-border) bg-void-900/30 p-nexus-5" data-present-reveal>
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="nexus-label text-signal-brass">Live engineering log</p>
              <h2 className="mt-nexus-2 font-heading text-heading-md font-semibold text-starlight-50">
                The station is still moving.
              </h2>
            </div>
            <p className="max-w-md text-right text-body-sm text-starlight-300">
              These notes record what changed today, which thread is active,
              and where the next pass should begin.
            </p>
          </div>

          <div className="mt-nexus-5 grid gap-nexus-3">
            {missionLog.map((entry) => (
              <article
                className="grid gap-nexus-3 rounded-nexus-md border border-(--glass-border) bg-void-900/55 px-nexus-4 py-nexus-4 md:grid-cols-[6rem_1fr] md:items-start"
                key={entry.time}
              >
                <div>
                  <p className="font-mono text-[0.625rem] tracking-interface text-signal-brass uppercase">
                    {entry.time}
                  </p>
                  <p className="mt-1 text-sm text-starlight-100">{entry.label}</p>
                </div>
                <p className="text-body-sm text-starlight-300">{entry.note}</p>
              </article>
            ))}
          </div>
        </section>
      </Container>
    </div>
  )
}

function StationAtmosphere() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 -z-30 bg-nexus-space" />
      <div className="nexus-grid pointer-events-none absolute inset-0 -z-20 opacity-45" />
      <div className="pointer-events-none absolute top-20 right-[8%] -z-10 size-80 rounded-full bg-signal-sage/8 blur-3xl" />
      <div className="pointer-events-none absolute bottom-16 left-[6%] -z-10 size-72 rounded-full bg-signal-blue/8 blur-3xl" />
    </>
  )
}

function SectionHeading({ eyebrow, title, body }) {
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

function ProjectCard({ index, isActive, onSelect, project }) {
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
        <span className="sr-only">Inspect {project.title}</span>
      </button>

      <div className="pointer-events-none relative z-20 grid gap-nexus-4">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="font-mono text-[0.625rem] tracking-data text-starlight-500 uppercase">
              Mission {String(index + 1).padStart(2, '0')}
            </p>
            <p className="mt-nexus-2 font-heading text-3xl font-semibold text-starlight-50/20 transition group-hover:text-starlight-50/35">
              {project.code}
            </p>
          </div>
          <div className="shrink-0 rounded-nexus-sm border border-(--glass-border) bg-void-900/30 px-nexus-4 py-3 text-right">
            <p className="nexus-label text-starlight-500">Status</p>
            <p className="mt-nexus-2 font-mono text-[0.625rem] tracking-interface text-starlight-100 uppercase">
              {project.status}
            </p>
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-heading text-heading-md font-semibold text-starlight-50">
              {project.title}
            </h3>
            <span className="rounded-nexus-pill border border-(--glass-border) bg-void-900/25 px-3 py-1 font-mono text-[0.6rem] tracking-interface text-starlight-300 uppercase">
              {project.phase}
            </span>
          </div>
          <p className="mt-nexus-3 max-w-2xl text-body-sm text-starlight-300">
            {project.summary}
          </p>
        </div>

        <div className="grid gap-nexus-3 md:grid-cols-[1fr_12rem] md:items-end">
          <div>
            <div className="flex items-center justify-between gap-4">
              <p className="nexus-label text-signal-sage">Signal</p>
              <p className="font-mono text-[0.625rem] tracking-interface text-signal-brass uppercase">
                {project.progress}%
              </p>
            </div>
            <div className="mt-nexus-3 h-2 overflow-hidden rounded-nexus-pill border border-(--glass-border) bg-void-950/70">
              <div
                className="h-full rounded-nexus-pill bg-gradient-to-r from-signal-sage via-signal-blue to-signal-brass"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-6 gap-1.5" aria-hidden="true">
            {project.pulse.map((height, pulseIndex) => (
              <div
                className="flex h-12 items-end rounded-nexus-xs border border-(--glass-border) bg-void-950/55 p-1"
                key={`${project.id}-${pulseIndex}`}
              >
                <div
                  className={cn(
                    'w-full rounded-nexus-xs bg-nexus-archive',
                    pulseIndex % 2 === 0 ? 'opacity-65' : 'opacity-90',
                  )}
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              className="rounded-nexus-pill border border-(--glass-border) bg-void-900/25 px-3 py-1 font-mono text-[0.575rem] tracking-interface text-starlight-300 uppercase"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}

function ProjectConsole({ project }) {
  return (
    <aside className="nexus-glass-elevated sticky top-24 h-fit rounded-nexus-lg p-nexus-5">
      <p className="nexus-label text-signal-brass">Mission console</p>
      <h2 className="mt-nexus-3 font-heading text-heading-md font-semibold text-starlight-50">
        {project.title}
      </h2>
      <p className="mt-nexus-3 text-body-sm text-starlight-300">
        {project.summary}
      </p>

      <div className="mt-nexus-5 rounded-nexus-md border border-(--glass-border) bg-void-900/35 p-nexus-4">
        <div className="flex items-center justify-between gap-4">
          <p className="nexus-label text-starlight-500">Next action</p>
          <p className="font-mono text-[0.625rem] tracking-interface text-signal-sage uppercase">
            {project.status}
          </p>
        </div>
        <p className="mt-nexus-3 text-body-sm text-starlight-200">
          {project.nextStep}
        </p>
      </div>

      <div className="mt-nexus-5 grid gap-nexus-3">
        <div className="rounded-nexus-sm border border-(--glass-border) bg-void-900/60 p-nexus-4">
          <p className="nexus-label text-starlight-500">Signal readout</p>
          <p className="mt-nexus-2 text-body-sm text-starlight-200">
            {project.signal}
          </p>
        </div>

        <div className="rounded-nexus-sm border border-(--glass-border) bg-void-900/60 p-nexus-4">
          <p className="nexus-label text-starlight-500">Progress</p>
          <div className="mt-nexus-3 h-2 overflow-hidden rounded-nexus-pill border border-(--glass-border) bg-void-950/70">
            <div
              className="h-full rounded-nexus-pill bg-gradient-to-r from-signal-sage via-signal-blue to-signal-brass"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <div className="mt-nexus-3 flex items-center justify-between gap-4 text-body-sm text-starlight-300">
            <span>{project.phase}</span>
            <span>{project.progress}% complete</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

function LearningTracker({ activeGoal, activeGoalId, onSelectGoal }) {
  return (
    <section className="nexus-glass-subtle rounded-nexus-lg p-nexus-5">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="nexus-label text-signal-sage">Current learning goals</p>
          <h2 className="mt-nexus-2 font-heading text-heading-md font-semibold text-starlight-50">
            Learning is being tracked in real time.
          </h2>
        </div>
        <div className="rounded-nexus-sm border border-(--glass-border) bg-void-900/35 px-nexus-4 py-3 text-right">
          <p className="nexus-label text-starlight-500">Selected goal</p>
          <p className="mt-1 font-mono text-[0.625rem] tracking-interface text-starlight-100 uppercase">
            {activeGoal.code}
          </p>
        </div>
      </div>

      <div className="mt-nexus-5 grid gap-nexus-3">
        {learningGoals.map((goal, index) => (
          <button
            className={cn(
              'group rounded-nexus-md border px-nexus-4 py-nexus-4 text-left transition duration-300 ease-nexus-out',
              activeGoalId === goal.id
                ? 'border-(--glass-border-highlight) bg-void-900/55 shadow-instrument'
                : 'border-(--glass-border) bg-void-900/30 hover:-translate-y-0.5 hover:border-(--glass-border-highlight)',
            )}
            key={goal.id}
            onClick={() => onSelectGoal(goal.id)}
            type="button"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[0.625rem] tracking-data text-starlight-500 uppercase">
                  Track {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-nexus-2 font-heading text-heading-md font-semibold text-starlight-50">
                  {goal.title}
                </h3>
              </div>
              <p className="font-mono text-[0.625rem] tracking-interface text-signal-brass uppercase">
                {goal.cadence}
              </p>
            </div>

            <p className="mt-nexus-3 text-body-sm text-starlight-300">
              {goal.focus}
            </p>

            <div className="mt-nexus-4 flex items-center justify-between gap-4">
              <p className="nexus-label text-starlight-500">Progress</p>
              <p className="font-mono text-[0.625rem] tracking-interface text-starlight-100 uppercase">
                {goal.progress}%
              </p>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-nexus-pill border border-(--glass-border) bg-void-950/70">
              <div
                className="h-full rounded-nexus-pill bg-gradient-to-r from-signal-sage via-signal-blue to-signal-brass"
                style={{ width: `${goal.progress}%` }}
              />
            </div>
          </button>
        ))}
      </div>

      <div className="mt-nexus-5 rounded-nexus-md border border-(--glass-border) bg-void-900/40 p-nexus-4">
        <p className="nexus-label text-starlight-500">Tracker note</p>
        <p className="mt-nexus-3 text-body-sm text-starlight-300">
          {activeGoal.nextMilestone}
        </p>
      </div>
    </section>
  )
}

function ResearchLedger() {
  return (
    <section className="nexus-glass-elevated rounded-nexus-lg p-nexus-5">
      <p className="nexus-label text-signal-brass">Current research interests</p>
      <h2 className="mt-nexus-2 font-heading text-heading-md font-semibold text-starlight-50">
        The station keeps three live threads in view.
      </h2>

      <div className="mt-nexus-5 grid gap-nexus-3">
        {researchInterests.map((interest) => (
          <article
            className="rounded-nexus-md border border-(--glass-border) bg-void-900/45 p-nexus-4"
            key={interest.title}
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-heading text-heading-md font-semibold text-starlight-50">
                {interest.title}
              </h3>
              <p className="font-mono text-[0.625rem] tracking-interface text-signal-brass uppercase">
                {interest.status}
              </p>
            </div>
            <p className="mt-nexus-3 text-body-sm text-starlight-300">
              {interest.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

function GithubActivityPanel() {
  return (
    <section className="nexus-glass-subtle rounded-nexus-lg p-nexus-5">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="nexus-label text-signal-sage">GitHub activity</p>
          <h2 className="mt-nexus-2 font-heading text-heading-md font-semibold text-starlight-50">
            {githubActivity.headline}
          </h2>
        </div>
        <div className="rounded-nexus-sm border border-(--glass-border) bg-void-900/35 px-nexus-4 py-3 text-right">
          <p className="nexus-label text-starlight-500">Streak</p>
          <p className="mt-1 font-mono text-[0.625rem] tracking-interface text-starlight-100 uppercase">
            {githubActivity.streak}
          </p>
        </div>
      </div>

      <p className="mt-nexus-3 max-w-2xl text-body-sm text-starlight-300">
        {githubActivity.note}
      </p>

      <div className="mt-nexus-5 grid gap-px overflow-hidden rounded-nexus-md border border-(--glass-border) bg-(--glass-border) md:grid-cols-4">
        {githubActivity.metrics.map(([label, value]) => (
          <div className="bg-void-900/75 p-nexus-4" key={label}>
            <p className="font-mono text-[0.625rem] tracking-interface text-starlight-500 uppercase">
              {label}
            </p>
            <p className="mt-1 text-sm text-starlight-100">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-nexus-5 rounded-nexus-md border border-(--glass-border) bg-void-900/40 p-nexus-4">
        <div className="flex items-center justify-between gap-4">
          <p className="nexus-label text-starlight-500">Recent cadence</p>
          <p className="font-mono text-[0.625rem] tracking-interface text-signal-brass uppercase">
            12 checkpoints
          </p>
        </div>

        <div className="mt-nexus-4 grid grid-cols-12 items-end gap-2" aria-hidden="true">
          {githubActivity.series.map((value, index) => (
            <div className="flex flex-col items-center gap-2" key={`${value}-${index}`}>
              <div className="flex h-32 w-full items-end rounded-nexus-xs border border-(--glass-border) bg-void-950/55 p-1">
                <div
                  className={cn(
                    'w-full rounded-nexus-xs bg-nexus-archive',
                    index % 3 === 0 ? 'opacity-60' : 'opacity-90',
                  )}
                  style={{ height: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <ul className="mt-nexus-4 space-y-2 text-body-sm text-starlight-300">
          {githubActivity.recentSignals.map((signal) => (
            <li key={signal}>• {signal}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function ReadingAndFocusPanel() {
  return (
    <section className="grid gap-nexus-6">
      <article className="nexus-glass-elevated rounded-nexus-lg p-nexus-5">
        <p className="nexus-label text-signal-brass">Reading list</p>
        <h2 className="mt-nexus-2 font-heading text-heading-md font-semibold text-starlight-50">
          Books in rotation while the station is active.
        </h2>

        <div className="mt-nexus-5 grid gap-nexus-3">
          {readingList.map((book) => (
            <div
              className="rounded-nexus-md border border-(--glass-border) bg-void-900/45 p-nexus-4"
              key={book.title}
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-heading text-heading-md font-semibold text-starlight-50">
                  {book.title}
                </h3>
                <p className="font-mono text-[0.625rem] tracking-interface text-signal-sage uppercase">
                  {book.status}
                </p>
              </div>
              <p className="mt-nexus-2 text-body-sm text-starlight-300">
                {book.note}
              </p>
            </div>
          ))}
        </div>
      </article>

      <article className="nexus-glass-subtle rounded-nexus-lg p-nexus-5">
        <p className="nexus-label text-signal-sage">Current focus areas</p>
        <h2 className="mt-nexus-2 font-heading text-heading-md font-semibold text-starlight-50">
          Attention is being budgeted deliberately.
        </h2>

        <div className="mt-nexus-5 grid gap-nexus-3">
          {focusAreas.map((area, index) => (
            <div key={area.label}>
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-starlight-100">{area.label}</p>
                <p className="font-mono text-[0.625rem] tracking-interface text-starlight-500 uppercase">
                  {area.value}
                </p>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-nexus-pill border border-(--glass-border) bg-void-950/70">
                <div
                  className={cn(
                    'h-full rounded-nexus-pill bg-gradient-to-r from-signal-sage via-signal-blue to-signal-brass',
                    index === 0 ? 'opacity-95' : 'opacity-80',
                  )}
                  style={{ width: area.value }}
                />
              </div>
              <p className="mt-nexus-2 text-body-sm text-starlight-300">
                {area.note}
              </p>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}