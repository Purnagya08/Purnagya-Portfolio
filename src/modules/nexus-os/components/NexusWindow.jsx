import { motion, useDragControls } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ModuleGlyph } from '@modules/nexus-os/components/ModuleGlyph'
import { useNexusOsStore } from '@modules/nexus-os/store/useNexusOsStore'
import { Button } from '@shared/components/ui/Button'
import { useMediaQuery } from '@shared/hooks/useMediaQuery'
import { cn } from '@shared/utils/cn'

export function NexusWindow({ constraintsRef, module, stackIndex }) {
  const dragControls = useDragControls()
  const activeWindowId = useNexusOsStore((state) => state.activeWindowId)
  const closeWindow = useNexusOsStore((state) => state.closeWindow)
  const focusWindow = useNexusOsStore((state) => state.focusWindow)
  const minimizedWindowIds = useNexusOsStore(
    (state) => state.minimizedWindowIds,
  )
  const minimizeWindow = useNexusOsStore((state) => state.minimizeWindow)
  const position = useNexusOsStore((state) => state.positions[module.id])
  const setWindowPosition = useNexusOsStore((state) => state.setWindowPosition)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isActive = activeWindowId === module.id
  const isMinimized = minimizedWindowIds.includes(module.id)

  if (isMinimized) {
    return null
  }

  return (
    <motion.article
      animate={{ opacity: 1, scale: 1 }}
      aria-label={module.label}
      className={cn(
        'nexus-os-window nexus-glass-elevated absolute inset-x-nexus-3 top-nexus-4 overflow-hidden rounded-nexus-md md:inset-x-auto md:w-[min(36rem,calc(100%-3rem))]',
        isActive ? 'border-signal-brass/50' : 'border-(--glass-border)',
      )}
      drag={isDesktop}
      dragConstraints={constraintsRef}
      dragControls={dragControls}
      dragElastic={0.02}
      dragListener={false}
      dragMomentum={false}
      exit={{ opacity: 0, scale: 0.96 }}
      initial={{ opacity: 0, scale: 0.96 }}
      key={module.id}
      onDragEnd={(_, info) =>
        setWindowPosition(module.id, {
          x: position.x + info.offset.x,
          y: position.y + info.offset.y,
        })
      }
      onPointerDown={() => focusWindow(module.id)}
      style={{
        left: isDesktop ? position.x : undefined,
        top: isDesktop ? position.y : undefined,
        zIndex: 20 + stackIndex,
      }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      <header
        className="nexus-os-window__handle flex cursor-grab items-center justify-between gap-4 border-b border-(--glass-border) bg-void-900/50 px-nexus-4 py-nexus-3 active:cursor-grabbing"
        onPointerDown={(event) => {
          if (isDesktop) {
            dragControls.start(event)
          }
        }}
      >
        <div className="flex min-w-0 items-center gap-3">
          <ModuleGlyph module={module} size="small" />
          <div className="min-w-0">
            <p className="truncate font-heading text-sm font-semibold text-starlight-50">
              {module.label}
            </p>
            <p className="font-mono text-[0.625rem] tracking-interface text-starlight-500 uppercase">
              {module.code} // {module.status}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <WindowControl
            label={`Minimize ${module.label}`}
            onClick={() => minimizeWindow(module.id)}
          >
            _
          </WindowControl>
          <WindowControl
            label={`Close ${module.label}`}
            onClick={() => closeWindow(module.id)}
          >
            x
          </WindowControl>
        </div>
      </header>

      <div className="p-nexus-5">
        <p className="nexus-label text-signal-blue">{module.eyebrow}</p>
        <h2 className="mt-nexus-3 font-heading text-heading-md font-semibold text-starlight-50">
          {module.title}
        </h2>
        <p className="mt-nexus-3 text-body-sm text-starlight-300">
          {module.description}
        </p>

        <dl className="mt-nexus-5 grid gap-px overflow-hidden rounded-nexus-sm border border-(--glass-border) bg-(--glass-border) sm:grid-cols-3">
          {module.entries.map(([label, value]) => (
            <div className="bg-void-900/85 p-nexus-3" key={label}>
              <dt className="font-mono text-[0.625rem] tracking-interface text-starlight-500">
                {label}
              </dt>
              <dd className="mt-1 text-xs text-starlight-200">{value}</dd>
            </div>
          ))}
        </dl>

        {module.route ? (
          <Button as={Link} className="mt-nexus-5" to={module.route}>
            {module.actionLabel}
          </Button>
        ) : (
          <p className="mt-nexus-5 font-mono text-xs tracking-interface text-signal-brass uppercase">
            Module expansion scheduled
          </p>
        )}
      </div>
    </motion.article>
  )
}

function WindowControl({ children, label, onClick }) {
  return (
    <button
      aria-label={label}
      className="grid size-7 place-items-center rounded-full border border-(--glass-border) bg-void-900/70 font-mono text-xs text-starlight-300 transition hover:border-signal-brass/60 hover:text-signal-brass"
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      onPointerDown={(event) => event.stopPropagation()}
      type="button"
    >
      {children}
    </button>
  )
}
