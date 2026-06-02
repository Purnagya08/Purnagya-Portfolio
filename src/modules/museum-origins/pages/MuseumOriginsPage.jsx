import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  museumStats,
  originExhibits,
} from '@modules/museum-origins/data/originExhibits'
import { FragmentCollectionSection } from '@shared/components/archive/FragmentCollectionSection'
import { Container } from '@shared/components/ui/Container'
import { SystemBadge } from '@shared/components/ui/SystemBadge'
import { cn } from '@shared/utils/cn'

export function MuseumOriginsPage() {
  const [activeExhibitId, setActiveExhibitId] = useState(originExhibits[0].id)
  const pageRef = useRef(null)
  const activeExhibit =
    originExhibits.find((exhibit) => exhibit.id === activeExhibitId) ??
    originExhibits[0]

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const context = gsap.context(() => {
      gsap.fromTo(
        '[data-museum-reveal]',
        { autoAlpha: 0, y: reduceMotion ? 0 : 18 },
        {
          autoAlpha: 1,
          duration: reduceMotion ? 0.01 : 0.8,
          ease: 'power3.out',
          stagger: reduceMotion ? 0 : 0.08,
          y: 0,
        },
      )
    }, pageRef)

    return () => context.revert()
  }, [])

  return (
    <div className="relative isolate overflow-hidden bg-void-950" ref={pageRef}>
      <MuseumAtmosphere />

      <Container className="relative py-section">
        <section
          className="grid items-end gap-nexus-8 lg:grid-cols-[1fr_24rem]"
          data-museum-reveal
        >
          <div>
            <SystemBadge tone="copper">Curated origins collection</SystemBadge>
            <p className="mt-nexus-5 nexus-label text-starlight-500">
              Digital archive // early history of an engineer
            </p>
            <h1 className="mt-nexus-4 max-w-4xl font-heading text-heading-xl font-semibold text-starlight-50">
              The Museum of Origins preserves the quiet beginnings behind the
              work.
            </h1>
            <p className="mt-nexus-5 max-w-2xl text-body-lg text-starlight-300">
              This wing is arranged as a set of carefully lit rooms: childhood
              curiosity, school discipline, the threshold into engineering, and
              the first moment code felt alive.
            </p>
          </div>

          <aside className="nexus-glass-subtle rounded-nexus-lg p-nexus-5">
            <p className="nexus-label text-signal-copper">Archive index</p>
            <dl className="mt-nexus-5 grid gap-px overflow-hidden rounded-nexus-sm border border-(--glass-border) bg-(--glass-border)">
              {museumStats.map(([label, value]) => (
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

        <div className="mt-nexus-9 nexus-hairline" data-museum-reveal />

        <section
          className="mt-nexus-8 grid gap-nexus-6 lg:grid-cols-[1.15fr_0.85fr]"
          data-museum-reveal
        >
          <div className="grid gap-nexus-4">
            {originExhibits.map((exhibit, index) => (
              <ExhibitCard
                exhibit={exhibit}
                index={index}
                isActive={activeExhibitId === exhibit.id}
                key={exhibit.id}
                onSelect={() => setActiveExhibitId(exhibit.id)}
              />
            ))}
          </div>

          <MemoryVault exhibit={activeExhibit} />
        </section>

        <section className="mt-nexus-8" data-museum-reveal>
          <FragmentCollectionSection
            location="museum-origins"
            subtitle="Hidden archival markers from the earliest engineering chapters."
            title="Museum memory fragments"
          />
        </section>
      </Container>
    </div>
  )
}

function MuseumAtmosphere() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 -z-30 bg-nexus-space" />
      <div className="nexus-grid pointer-events-none absolute inset-0 -z-20 opacity-45" />
      <div className="pointer-events-none absolute top-24 right-[8%] -z-10 size-72 rounded-full bg-signal-copper/8 blur-3xl" />
      <div className="pointer-events-none absolute bottom-16 left-[6%] -z-10 size-80 rounded-full bg-signal-blue/8 blur-3xl" />
    </>
  )
}

function ExhibitCard({ exhibit, index, isActive, onSelect }) {
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
        <span className="sr-only">Inspect {exhibit.section}</span>
      </button>

      <div className="pointer-events-none relative z-20 grid gap-nexus-5 md:grid-cols-[7rem_1fr]">
        <div>
          <p className="font-mono text-[0.625rem] tracking-data text-signal-copper uppercase">
            Gallery {String(index + 1).padStart(2, '0')}
          </p>
          <p className="mt-nexus-2 font-heading text-3xl font-semibold text-starlight-50/20 transition group-hover:text-starlight-50/35">
            {exhibit.accession}
          </p>
        </div>

        <div>
          <p className="nexus-label text-starlight-500">{exhibit.material}</p>
          <h2 className="mt-nexus-2 font-heading text-heading-md font-semibold text-starlight-50">
            {exhibit.section}
          </h2>
          <p className="mt-nexus-2 text-sm font-medium text-starlight-100">
            {exhibit.artifact}
          </p>
          <p className="mt-nexus-4 max-w-2xl text-body-sm text-starlight-300">
            {exhibit.story}
          </p>
        </div>
      </div>
    </article>
  )
}

function MemoryVault({ exhibit }) {
  return (
    <aside className="nexus-glass-elevated sticky top-24 h-fit rounded-nexus-lg p-nexus-5">
      <p className="nexus-label text-signal-brass">Memory fragments</p>
      <h2 className="mt-nexus-3 font-heading text-heading-md font-semibold text-starlight-50">
        {exhibit.artifact}
      </h2>
      <p className="mt-nexus-4 border-l border-signal-copper/50 pl-nexus-4 text-body-sm text-starlight-300">
        {exhibit.curatorNote}
      </p>

      <div className="mt-nexus-6 grid gap-nexus-3">
        {exhibit.fragments.map((fragment, index) => (
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
