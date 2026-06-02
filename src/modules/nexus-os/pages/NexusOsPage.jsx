import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ModuleLauncher } from '@modules/nexus-os/components/ModuleLauncher'
import { NexusDock } from '@modules/nexus-os/components/NexusDock'
import { NexusWindow } from '@modules/nexus-os/components/NexusWindow'
import { osModuleMap, osModules } from '@modules/nexus-os/data/osModules'
import { useNexusOsStore } from '@modules/nexus-os/store/useNexusOsStore'
import { SystemBadge } from '@shared/components/ui/SystemBadge'

const StationHubScene = lazy(() =>
  import('@three/scenes/StationHubScene').then((module) => ({
    default: module.StationHubScene,
  })),
)

export function NexusOsPage() {
  const activeWindowId = useNexusOsStore((state) => state.activeWindowId)
  const closeWindow = useNexusOsStore((state) => state.closeWindow)
  const openWindow = useNexusOsStore((state) => state.openWindow)
  const openWindowIds = useNexusOsStore((state) => state.openWindowIds)
  const desktopRef = useRef(null)
  const launcherRefs = useRef([])
  const [focusedLauncher, setFocusedLauncher] = useState(0)

  useEffect(() => {
    function handleKeyDown(event) {
      if (
        event.target instanceof HTMLElement &&
        event.target.closest('input, textarea, select')
      ) {
        return
      }

      if (event.key === 'Escape' && activeWindowId) {
        closeWindow(activeWindowId)
        return
      }

      const shortcutIndex = Number(event.key) - 1

      if (shortcutIndex >= 0 && shortcutIndex < osModules.length) {
        openWindow(osModules[shortcutIndex].id)
        launcherRefs.current[shortcutIndex]?.focus()
        return
      }

      if (
        !['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp'].includes(event.key)
      ) {
        return
      }

      event.preventDefault()
      const direction = ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 1
      const nextIndex =
        (focusedLauncher + direction + osModules.length) % osModules.length

      setFocusedLauncher(nextIndex)
      launcherRefs.current[nextIndex]?.focus()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeWindowId, closeWindow, focusedLauncher, openWindow])

  return (
    <main
      className="relative isolate min-h-screen overflow-hidden bg-void-950"
      ref={desktopRef}
    >
      <div className="nexus-os-desktop__nebula absolute inset-0 -z-30" />
      <div className="nexus-grid absolute inset-0 -z-20 opacity-55" />
      <Suspense fallback={<div className="absolute inset-0 -z-10" />}>
        <StationHubScene
          activeModuleId={activeWindowId}
          modules={osModules}
          onSelect={openWindow}
        />
      </Suspense>
      <div className="nexus-scanlines pointer-events-none absolute inset-0 z-60" />

      <header className="nexus-glass-subtle flex h-16 items-center justify-between gap-4 border-x-0 border-t-0 px-(--spacing-gutter)">
        <div>
          <p className="font-display text-sm font-bold tracking-display text-starlight-50 uppercase">
            NEXUS OS
          </p>
          <p className="mt-1 font-mono text-[0.625rem] tracking-interface text-starlight-500 uppercase">
            Engineer logbook // Station hub
          </p>
        </div>
        <div className="hidden items-center gap-5 sm:flex">
          <SystemBadge tone="sage">System nominal</SystemBadge>
          <p className="font-mono text-[0.625rem] tracking-interface text-starlight-500 uppercase">
            Sector 08 // Online
          </p>
        </div>
      </header>

      <section className="relative min-h-[calc(100vh-4rem)] px-(--spacing-gutter) py-nexus-5 md:py-nexus-6">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md"
          initial={{ opacity: 0, y: 14 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <SystemBadge>Navigation layer ready</SystemBadge>
          <h1 className="mt-nexus-3 font-heading text-heading-lg font-semibold text-starlight-50">
            Station Hub
          </h1>
          <p className="mt-nexus-2 text-body-sm text-starlight-300">
            Select a module to inspect the engineer logbook. Use arrow keys,
            number keys 1-6, or the orbital dock to navigate.
          </p>
        </motion.div>

        <div
          aria-label="NEXUS OS modules"
          className="mt-nexus-6 grid max-w-2xl grid-cols-2 gap-nexus-3 sm:grid-cols-3"
          role="toolbar"
        >
          {osModules.map((module, index) => (
            <ModuleLauncher
              isActive={activeWindowId === module.id}
              key={module.id}
              module={module}
              onClick={() => openWindow(module.id)}
              onFocus={() => setFocusedLauncher(index)}
              setRef={(element) => {
                launcherRefs.current[index] = element
              }}
            />
          ))}
        </div>

        <div className="pointer-events-none absolute right-(--spacing-gutter) bottom-nexus-6 hidden text-right lg:block">
          <p className="font-display text-display-lg tracking-display text-starlight-50/4 uppercase">
            Nexus
          </p>
          <p className="nexus-label mt-nexus-2 text-starlight-500">
            Logbook navigation interface
          </p>
        </div>

        <AnimatePresence>
          {openWindowIds.map((windowId, stackIndex) => (
            <NexusWindow
              constraintsRef={desktopRef}
              key={windowId}
              module={osModuleMap[windowId]}
              stackIndex={stackIndex}
            />
          ))}
        </AnimatePresence>
      </section>

      <NexusDock />
    </main>
  )
}
