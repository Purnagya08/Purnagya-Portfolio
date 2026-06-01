import { Link } from 'react-router-dom'
import { PageIntro } from '@shared/components/ui/PageIntro'

export function NotFoundPage() {
  return (
    <PageIntro eyebrow="404" title="This page does not exist.">
      <Link className="text-cyan-300 hover:text-cyan-200" to="/">
        Return to the homepage
      </Link>
    </PageIntro>
  )
}
