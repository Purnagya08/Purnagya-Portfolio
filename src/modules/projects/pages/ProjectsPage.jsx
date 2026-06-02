import { projects } from '@data/projects'
import { Card } from '@shared/components/ui/Card'
import { Container } from '@shared/components/ui/Container'
import { PageIntro } from '@shared/components/ui/PageIntro'

export function ProjectsPage() {
  return (
    <>
      <PageIntro eyebrow="Projects" title="Selected work and experiments.">
        <p>
          Replace the starter entries with detailed case studies as the
          portfolio grows.
        </p>
      </PageIntro>
      <Container className="grid gap-5 pb-section md:grid-cols-2">
        {projects.map((project) => (
          <Card className="p-nexus-5" interactive key={project.title}>
            <h2 className="font-heading text-heading-md font-semibold text-starlight-50">
              {project.title}
            </h2>
            <p className="mt-nexus-3 text-body-md text-starlight-300">
              {project.description}
            </p>
          </Card>
        ))}
      </Container>
    </>
  )
}
