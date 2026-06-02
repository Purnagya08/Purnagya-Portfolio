import { Outlet } from 'react-router-dom'
import { MemoryArchiveViewer } from '@shared/components/archive/MemoryArchiveViewer'
import { Footer } from '@shared/components/layout/Footer'
import { Header } from '@shared/components/layout/Header'

export function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <MemoryArchiveViewer />
      <Footer />
    </div>
  )
}
