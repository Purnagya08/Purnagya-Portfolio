import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { SiteLayout } from '@core/layouts/SiteLayout'
import { BootSequencePage } from '@modules/boot-sequence'

const AboutPage = lazy(() =>
  import('@modules/about/pages/AboutPage').then((module) => ({
    default: module.AboutPage,
  })),
)
const ContactPage = lazy(() =>
  import('@modules/contact/pages/ContactPage').then((module) => ({
    default: module.ContactPage,
  })),
)
const NexusOsPage = lazy(() =>
  import('@modules/nexus-os/pages/NexusOsPage').then((module) => ({
    default: module.NexusOsPage,
  })),
)
const NotFoundPage = lazy(() =>
  import('@modules/not-found/pages/NotFoundPage').then((module) => ({
    default: module.NotFoundPage,
  })),
)
const ProjectsPage = lazy(() =>
  import('@modules/projects/pages/ProjectsPage').then((module) => ({
    default: module.ProjectsPage,
  })),
)

export function AppRouter() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route index element={<BootSequencePage />} />
        <Route path="nexus">
          <Route index element={<NexusOsPage />} />
          <Route element={<SiteLayout />}>
            <Route path="about" element={<AboutPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

function RouteFallback() {
  return <div className="min-h-screen bg-slate-950" />
}
