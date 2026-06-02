import { Container } from '@shared/components/ui/Container'
import { SystemBadge } from '@shared/components/ui/SystemBadge'

export function PageIntro({ eyebrow, title, children }) {
  return (
    <Container className="py-section">
      <SystemBadge>{eyebrow}</SystemBadge>
      <h1 className="mt-nexus-4 max-w-3xl font-heading text-heading-xl font-semibold text-starlight-50">
        {title}
      </h1>
      <div className="mt-nexus-5 max-w-2xl text-body-lg text-starlight-300">
        {children}
      </div>
    </Container>
  )
}
