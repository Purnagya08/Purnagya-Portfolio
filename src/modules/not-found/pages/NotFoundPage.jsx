import { Link } from 'react-router-dom'
import { PageIntro } from '@shared/components/ui/PageIntro'

export function NotFoundPage() {
  return (
    <PageIntro eyebrow="404" title="This page does not exist.">
      <Link className="text-signal-brass hover:text-starlight-50" to="/nexus">
        Return to NEXUS OS
      </Link>
    </PageIntro>
  )
}
