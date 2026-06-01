import { projects } from '@data/projects'
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
      <Container className="grid gap-5 pb-20 md:grid-cols-2">
        {projects.map((project) => (
          <article
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
            key={project.title}
          >
            <h2 className="text-xl font-semibold text-white">
              {project.title}
            </h2>
            <p className="mt-3 text-slate-300">{project.description}</p>
          </article>
        ))}
      </Container>
    </>
  )
}
