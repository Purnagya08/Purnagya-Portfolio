import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { answerArchiveQuery, getKnowledgeSourceStats } from '@modules/nexus-ai/lib/archiveQuery'
import { FragmentCollectionSection } from '@shared/components/archive/FragmentCollectionSection'
import { Container } from '@shared/components/ui/Container'
import { SystemBadge } from '@shared/components/ui/SystemBadge'

const sampleQuestions = [
  'Tell me about Devora',
  'What was the hardest challenge?',
  'Why Java?',
  'Show achievements',
  'What is the future vision?',
]

export function NexusAiPage() {
  const [query, setQuery] = useState(sampleQuestions[0])
  const [response, setResponse] = useState(() =>
    answerArchiveQuery(sampleQuestions[0]),
  )
  const pageRef = useRef(null)
  const sourceStats = getKnowledgeSourceStats()

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const context = gsap.context(() => {
      gsap.fromTo(
        '[data-ai-reveal]',
        { autoAlpha: 0, y: reduceMotion ? 0 : 14 },
        {
          autoAlpha: 1,
          duration: reduceMotion ? 0.01 : 0.72,
          ease: 'power3.out',
          stagger: reduceMotion ? 0 : 0.06,
          y: 0,
        },
      )
    }, pageRef)

    return () => context.revert()
  }, [])

  function handleQuery(nextQuery) {
    setQuery(nextQuery)
    setResponse(answerArchiveQuery(nextQuery))
  }

  function handleSubmit(event) {
    event.preventDefault()
    handleQuery(query)
  }

  return (
    <div className="relative isolate overflow-hidden bg-void-950" ref={pageRef}>
      <NexusAiAtmosphere />

      <Container className="relative py-section">
        <section
          className="grid items-end gap-nexus-8 lg:grid-cols-[1fr_24rem]"
          data-ai-reveal
        >
          <div>
            <SystemBadge tone="brass">Archive curator interface</SystemBadge>
            <p className="mt-nexus-5 nexus-label text-starlight-500">
              NEXUS AI // personal archive assistant
            </p>
            <h1 className="mt-nexus-4 max-w-4xl font-heading text-heading-xl font-semibold text-starlight-50">
              A curator for the engineer's archive.
            </h1>
            <p className="mt-nexus-5 max-w-2xl text-body-lg text-starlight-300">
              This assistant does not call external models. It retrieves and
              organizes records from a local knowledge base so visitors can
              navigate memories, projects, achievements, learning, and future
              goals instantly.
            </p>
          </div>

          <aside className="nexus-glass-subtle rounded-nexus-lg p-nexus-5">
            <p className="nexus-label text-signal-sage">Knowledge sources</p>
            <dl className="mt-nexus-5 grid gap-px overflow-hidden rounded-nexus-sm border border-(--glass-border) bg-(--glass-border)">
              {sourceStats.map((source) => (
                <div className="bg-void-900/80 p-nexus-3" key={source.key}>
                  <dt className="font-mono text-[0.625rem] tracking-interface text-starlight-500 uppercase">
                    {source.label}
                  </dt>
                  <dd className="mt-1 text-sm text-starlight-100">
                    {source.count} records
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </section>

        <section
          className="mt-nexus-8 grid gap-nexus-6 xl:grid-cols-[0.95fr_1.05fr]"
          data-ai-reveal
        >
          <article className="nexus-glass-subtle rounded-nexus-lg p-nexus-5">
            <p className="nexus-label text-signal-brass">Ask the archive</p>
            <h2 className="mt-nexus-2 font-heading text-heading-md font-semibold text-starlight-50">
              Query prompt
            </h2>

            <form className="mt-nexus-5" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="nexus-ai-query">
                Archive question
              </label>
              <textarea
                className="h-28 w-full rounded-nexus-md border border-(--glass-border) bg-void-900/55 px-nexus-4 py-nexus-3 text-body-sm text-starlight-100 outline-none transition focus:border-(--glass-border-highlight)"
                id="nexus-ai-query"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ask about projects, challenges, decisions, achievements, or future direction..."
                value={query}
              />
              <button className="nexus-button nexus-button-secondary mt-nexus-4" type="submit">
                Retrieve Archive Record
              </button>
            </form>

            <div className="mt-nexus-6">
              <p className="nexus-label text-starlight-500">Example prompts</p>
              <div className="mt-nexus-3 grid gap-2">
                {sampleQuestions.map((sample) => (
                  <button
                    className="rounded-nexus-sm border border-(--glass-border) bg-void-900/45 px-nexus-4 py-nexus-3 text-left text-body-sm text-starlight-300 transition hover:border-(--glass-border-highlight) hover:text-starlight-100"
                    key={sample}
                    onClick={() => handleQuery(sample)}
                    type="button"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          </article>

          <article className="nexus-glass-elevated rounded-nexus-lg p-nexus-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="nexus-label text-signal-sage">Curator response</p>
                <h2 className="mt-nexus-2 font-heading text-heading-md font-semibold text-starlight-50">
                  {response.heading}
                </h2>
              </div>
              <div className="rounded-nexus-sm border border-(--glass-border) bg-void-900/35 px-nexus-4 py-3 text-right">
                <p className="nexus-label text-starlight-500">Confidence</p>
                <p className="mt-1 font-mono text-[0.625rem] tracking-interface text-starlight-100 uppercase">
                  {Math.round(response.confidence * 100)}%
                </p>
              </div>
            </div>

            <p className="mt-nexus-4 text-body-md text-starlight-300">
              {response.narrative}
            </p>

            {response.entries.length > 0 ? (
              <div className="mt-nexus-6 grid gap-nexus-3">
                {response.entries.map((entry) => (
                  <article
                    className="rounded-nexus-md border border-(--glass-border) bg-void-900/45 p-nexus-4"
                    key={`${entry.source}-${entry.title}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-heading text-heading-md font-semibold text-starlight-50">
                        {entry.title}
                      </h3>
                      <span className="rounded-nexus-pill border border-(--glass-border) bg-void-900/25 px-3 py-1 font-mono text-[0.575rem] tracking-interface text-starlight-300 uppercase">
                        {entry.source}
                      </span>
                    </div>
                    <p className="mt-nexus-3 text-body-sm text-starlight-300">
                      {entry.summary}
                    </p>
                    {entry.tags.length > 0 ? (
                      <div className="mt-nexus-3 flex flex-wrap gap-2">
                        {entry.tags.slice(0, 4).map((tag) => (
                          <span
                            className="rounded-nexus-pill border border-(--glass-border) bg-void-900/25 px-3 py-1 font-mono text-[0.56rem] tracking-interface text-starlight-500 uppercase"
                            key={tag}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-nexus-6 text-body-sm text-starlight-400">
                No direct records matched. Try one of the curated example
                prompts.
              </p>
            )}
          </article>
        </section>

        <section className="mt-nexus-8" data-ai-reveal>
          <FragmentCollectionSection
            location="achievement-observatory"
            subtitle="Achievement Observatory fragments are unlocked by inspecting milestone evidence."
            title="Achievement Observatory memory fragments"
          />
        </section>
      </Container>
    </div>
  )
}

function NexusAiAtmosphere() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 -z-30 bg-nexus-space" />
      <div className="nexus-grid pointer-events-none absolute inset-0 -z-20 opacity-43" />
      <div className="pointer-events-none absolute top-24 left-[7%] -z-10 size-72 rounded-full bg-signal-sage/8 blur-3xl" />
      <div className="pointer-events-none absolute bottom-16 right-[8%] -z-10 size-80 rounded-full bg-signal-brass/7 blur-3xl" />
    </>
  )
}