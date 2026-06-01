import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { SiteLayout } from '@core/layouts/SiteLayout'

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
const HomePage = lazy(() =>
  import('@modules/home/pages/HomePage').then((module) => ({
    default: module.HomePage,
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
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

function RouteFallback() {
  return <div className="min-h-screen bg-slate-950" />
}
