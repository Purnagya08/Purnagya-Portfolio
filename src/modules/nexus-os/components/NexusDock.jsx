import { motion } from 'framer-motion'
import { osModuleMap } from '@modules/nexus-os/data/osModules'
import { ModuleGlyph } from '@modules/nexus-os/components/ModuleGlyph'
import { useNexusOsStore } from '@modules/nexus-os/store/useNexusOsStore'
import { cn } from '@shared/utils/cn'

export function NexusDock() {
  const activeWindowId = useNexusOsStore((state) => state.activeWindowId)
  const focusWindow = useNexusOsStore((state) => state.focusWindow)
  const minimizedWindowIds = useNexusOsStore(
    (state) => state.minimizedWindowIds,
  )
  const openWindowIds = useNexusOsStore((state) => state.openWindowIds)

  if (openWindowIds.length === 0) {
    return null
  }

  return (
    <motion.nav
      animate={{ opacity: 1, y: 0 }}
      aria-label="Open NEXUS modules"
      className="nexus-glass absolute bottom-nexus-4 left-1/2 z-50 flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2 rounded-nexus-pill px-nexus-3 py-nexus-2"
      initial={{ opacity: 0, y: 18 }}
    >
      {openWindowIds.map((windowId) => {
        const module = osModuleMap[windowId]
        const isActive = activeWindowId === windowId
        const isMinimized = minimizedWindowIds.includes(windowId)

        return (
          <button
            aria-label={`Focus ${module.label}`}
            className={cn(
              'relative rounded-nexus-sm p-1 transition hover:bg-hull-600/70',
              isActive && 'bg-hull-600/70',
            )}
            key={windowId}
            onClick={() => focusWindow(windowId)}
            title={module.label}
            type="button"
          >
            <ModuleGlyph module={module} size="small" />
            <span
              className={cn(
                'absolute -bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full',
                isMinimized ? 'bg-signal-brass' : 'bg-signal-blue',
              )}
            />
          </button>
        )
      })}
    </motion.nav>
  )
}
