import { useMemo } from 'react'
import { Card } from '@shared/components/ui/Card'
import { Container } from '@shared/components/ui/Container'
import { PageIntro } from '@shared/components/ui/PageIntro'

const challengeChapters = [
  {
    id: 'chapter-01',
    eyebrow: 'Launch briefing',
    title: 'You enter the galaxy to learn under pressure.',
    body:
      'Every challenge is a controlled failure: a measured environment where the only objective is clarity—what broke, why it broke, and what you can do next.',
    cards: [
      {
        label: 'Obstacle',
        value: 'Unstable assumptions',
        detail:
          'A passing build hides a brittle edge case. The first lesson is humility in your own certainty.',
      },
      {
        label: 'Failure mode',
        value: 'Silent mismatch',
        detail:
          'The system appears correct until data diverges. Instrumentation beats intuition.',
      },
    ],
  },
  {
    id: 'chapter-02',
    eyebrow: 'Competition record',
    title: 'Teams win by debugging together.',
    body:
      'The galaxy rewards method: reproduce the issue, isolate the smallest cause, then communicate the repair like an engineering report.',
    cards: [
      {
        label: 'Contest tempo',
        value: 'Triage → Test → Iterate',
        detail:
          'Momentum is not haste. It’s disciplined cycles with evidence at each step.',
      },
      {
        label: 'Collaboration',
        value: 'Explain the trace',
        detail:
          'A good fix is half shared context: what you saw, what you tried, and what changed.',
      },
    ],
  },
  {
    id: 'chapter-03',
    eyebrow: 'Logbook aftermath',
    title: 'Perseverance turns failure into capability.',
    body:
      'After the moment of defeat, the next build becomes wiser. Your logbook keeps the story so the next mission starts from advantage—not repetition.',
    cards: [
      {
        label: 'Lesson retained',
        value: 'Design for failure',
        detail:
          'Edge cases are not anomalies. They are future requirements waiting to be named.',
      },
      {
        label: 'Outcome',
        value: 'A stronger system',
        detail:
          'Each repaired flaw reduces friction for everything built after it.',
      },
    ],
  },
]

function NarrativeCard({ label, value, detail }) {
  return (
    <Card className="p-nexus-5" interactive>
      <p className="nexus-label text-starlight-400">{label}</p>
      <h3 className="mt-nexus-3 font-heading text-heading-md font-semibold text-starlight-50">
        {value}
      </h3>
      <p className="mt-nexus-3 text-body-md text-starlight-300">{detail}</p>
    </Card>
  )
}

export function ChallengeGalaxyPage() {
  const chapters = useMemo(() => challengeChapters, [])

  return (
    <main className="relative min-h-screen bg-void-950">
      <div className="nexus-grid absolute inset-0 -z-10 opacity-55" />
      <div className="bg-nexus-space absolute inset-0 -z-20" />

      <PageIntro eyebrow="Challenge Galaxy" title="Build through failure, then document it.">
        <p>
          This region of space is not a game. It is a logbook of builds—where
          obstacles become evidence, and every repair becomes a record for
          the next mission.
        </p>
      </PageIntro>

      <Container className="grid gap-nexus-6 pb-section">
        {chapters.map((chapter) => (
          <section
            key={chapter.id}
            className="relative rounded-nexus-lg border border-(--glass-border) bg-void-900/20 px-nexus-5 py-nexus-6"
          >
            <div className="mb-nexus-4">
              <p className="nexus-label text-starlight-500">{chapter.eyebrow}</p>
              <h2 className="mt-nexus-3 font-heading text-heading-lg font-semibold text-starlight-50">
                {chapter.title}
              </h2>
              <p className="mt-nexus-3 max-w-2xl text-body-md text-starlight-300">
                {chapter.body}
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {chapter.cards.map((c) => (
                <NarrativeCard key={c.value} {...c} />
              ))}
            </div>
          </section>
        ))}
      </Container>

      <Container className="pb-section">
        <div className="rounded-nexus-lg border border-(--glass-border) bg-void-900/10 px-nexus-5 py-nexus-6">
          <p className="nexus-label text-starlight-500">Field protocol</p>
          <h2 className="mt-nexus-3 font-heading text-heading-md font-semibold text-starlight-50">
            Your next build starts with a better question.
          </h2>
          <ul className="mt-nexus-4 space-y-3 font-mono text-body-sm text-starlight-300">
            <li>• What changed right before the failure appeared?</li>
            <li>• Can we reproduce the smallest broken case?</li>
            <li>• What evidence proves the repair fixed the root cause?</li>
            <li>• What should we instrument so the next mystery is shorter?</li>
          </ul>
        </div>
      </Container>
    </main>
  )
}

