import { projects } from '@data/projects'
import { FragmentCollectionSection } from '@shared/components/archive/FragmentCollectionSection'
import { Card } from '@shared/components/ui/Card'
import { Container } from '@shared/components/ui/Container'
import { PageIntro } from '@shared/components/ui/PageIntro'

function MissionRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-6">
      <dt className="font-mono text-[0.625rem] tracking-interface text-starlight-500 uppercase">
        {label}
      </dt>
      <dd className="text-body-md text-starlight-300">{value}</dd>
    </div>
  )
}

function MissionCard({ mission }) {
  return (
    <Card className="p-nexus-5" interactive={false}>
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="font-heading text-heading-md font-semibold text-starlight-50">
            {mission.title}
          </h2>
          <p className="mt-nexus-3 text-body-md text-starlight-300">
            {mission.summary}
          </p>
        </div>
        <div className="shrink-0 rounded-nexus-sm border border-(--glass-border) bg-void-900/20 px-nexus-4 py-3">
          <p className="nexus-label text-starlight-500">MISSION</p>
          <p className="mt-nexus-2 font-mono text-xs text-starlight-200">
            {mission.code}
          </p>
        </div>
      </div>

      <div className="mt-nexus-5 grid gap-nexus-4 md:grid-cols-2">
        <div className="rounded-nexus-md border border-(--glass-border) bg-void-900/15 px-nexus-4 py-nexus-4">
          <MissionRow label="Problem" value={mission.problem} />
          <div className="mt-nexus-4 h-px bg-hull-700" />
          <MissionRow label="Objective" value={mission.objective} />
        </div>

        <div className="rounded-nexus-md border border-(--glass-border) bg-void-900/15 px-nexus-4 py-nexus-4">
          <MissionRow label="Obstacles" value={mission.obstacles} />
          <div className="mt-nexus-4 h-px bg-hull-700" />
          <MissionRow label="Solution" value={mission.solution} />
        </div>
      </div>

      <div className="mt-nexus-5 rounded-nexus-md border border-(--glass-border) bg-void-900/15 px-nexus-4 py-nexus-4">
        <MissionRow label="Outcome" value={mission.outcome} />
      </div>
    </Card>
  )
}

export function ProjectsPage() {
  return (
    <>
      <PageIntro eyebrow="Mission Briefing Center" title="Engineering missions">
        <p>
          Each project is documented like a technical brief: problem, objective,
          obstacles, solution, and outcome.
        </p>
      </PageIntro>
      <Container className="grid gap-5 pb-section md:grid-cols-2">
        {projects.map((mission) => (
          <MissionCard key={mission.code ?? mission.title} mission={mission} />
        ))}
      </Container>

      <Container className="pb-section">
        <FragmentCollectionSection
          location="mission-control"
          subtitle="Mission Control fragments track decisions, outcomes, and reusable operating patterns."
          title="Mission Control memory fragments"
        />
      </Container>
    </>
  )
}

