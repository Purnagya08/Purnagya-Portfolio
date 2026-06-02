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
const MuseumOriginsPage = lazy(() =>
  import('@modules/museum-origins').then((module) => ({
    default: module.MuseumOriginsPage,
  })),
)
const TrainingFacilityPage = lazy(() =>
  import('@modules/training-facility').then((module) => ({
    default: module.TrainingFacilityPage,
  })),
)
const ChallengeGalaxyPage = lazy(() =>
  import('@modules/challenge-galaxy/pages/ChallengeGalaxyPage').then((module) => ({
    default: module.ChallengeGalaxyPage,
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
const ResearchLabsPage = lazy(() =>
  import('@modules/research-labs/pages/ResearchLabsPage').then((module) => ({
    default: module.ResearchLabsPage,
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
            <Route path="origins" element={<MuseumOriginsPage />} />
            <Route path="training" element={<TrainingFacilityPage />} />
            <Route path="challenges" element={<ChallengeGalaxyPage />} />
            <Route path="research" element={<ResearchLabsPage />} />
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
