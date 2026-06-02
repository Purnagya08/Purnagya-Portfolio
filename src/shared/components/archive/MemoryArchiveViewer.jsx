import { useMemo, useState } from 'react'
import {
  completionMilestones,
  fragmentLocations,
  memoryFragments,
} from '@shared/constants/memoryFragments'
import { useMemoryFragmentStore } from '@shared/store/useMemoryFragmentStore'
import { cn } from '@shared/utils/cn'

export function MemoryArchiveViewer() {
  const discoveredIds = useMemoryFragmentStore((state) => state.discoveredIds)
  const [isOpen, setIsOpen] = useState(false)

  const totalCount = memoryFragments.length
  const discoveredCount = discoveredIds.length
  const completion = Math.round((discoveredCount / totalCount) * 100)

  const grouped = useMemo(() => {
    return Object.entries(fragmentLocations).map(([locationKey, locationLabel]) => {
      const locationFragments = memoryFragments.filter(
        (fragment) => fragment.location === locationKey,
      )

      const discoveredInLocation = locationFragments.filter((fragment) =>
        discoveredIds.includes(fragment.id),
      ).length

      return {
        discoveredInLocation,
        fragments: locationFragments,
        key: locationKey,
        label: locationLabel,
      }
    })
  }, [discoveredIds])

  const nextMilestone =
    completionMilestones.find((milestone) => completion < milestone) ?? 100

  return (
    <>
      <button
        className="nexus-glass-elevated fixed right-4 bottom-4 z-40 rounded-nexus-pill px-4 py-3"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <span className="font-mono text-[0.6rem] tracking-interface text-starlight-500 uppercase">
          Archive fragments
        </span>
        <div className="mt-1 flex items-center gap-3">
          <span className="font-heading text-lg font-semibold text-starlight-50">
            {discoveredCount}/{totalCount}
          </span>
          <span className="rounded-nexus-pill border border-(--glass-border) px-2 py-1 font-mono text-[0.55rem] tracking-interface text-signal-brass uppercase">
            {completion}%
          </span>
        </div>
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 bg-void-950/65 backdrop-blur-sm">
          <div className="mx-auto mt-8 flex max-h-[calc(100vh-4rem)] w-[min(72rem,95vw)] flex-col overflow-hidden rounded-nexus-lg border border-(--glass-border-highlight) bg-void-900/95">
            <header className="flex items-start justify-between gap-6 border-b border-(--glass-border) px-nexus-5 py-nexus-4">
              <div>
                <p className="nexus-label text-signal-brass">Global memory archive</p>
                <h2 className="mt-2 font-heading text-heading-md font-semibold text-starlight-50">
                  Discoverable personal archive
                </h2>
                <p className="mt-2 text-body-sm text-starlight-300">
                  Explore modules to collect fragments. Completion unlocks at 25%, 50%, 75%, and 100%.
                </p>
              </div>
              <button
                className="rounded-nexus-pill border border-(--glass-border) px-4 py-2 font-mono text-[0.6rem] tracking-interface text-starlight-300 uppercase transition hover:border-(--glass-border-highlight)"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                Close
              </button>
            </header>

            <div className="border-b border-(--glass-border) px-nexus-5 py-nexus-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-body-sm text-starlight-300">
                  {discoveredCount} of {totalCount} fragments archived.
                </p>
                <p className="font-mono text-[0.625rem] tracking-interface text-starlight-500 uppercase">
                  Next unlock: {nextMilestone}%
                </p>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-nexus-pill border border-(--glass-border) bg-void-950/70">
                <div
                  className="h-full rounded-nexus-pill bg-gradient-to-r from-signal-sage via-signal-blue to-signal-brass"
                  style={{ width: `${completion}%` }}
                />
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2">
                {completionMilestones.map((milestone) => (
                  <div
                    className={cn(
                      'rounded-nexus-sm border px-3 py-2 text-center',
                      completion >= milestone
                        ? 'border-signal-sage/40 bg-signal-sage/10'
                        : 'border-(--glass-border) bg-void-900/45',
                    )}
                    key={milestone}
                  >
                    <p className="font-mono text-[0.575rem] tracking-interface text-starlight-500 uppercase">
                      Unlock
                    </p>
                    <p className="mt-1 text-sm text-starlight-100">{milestone}%</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-y-auto px-nexus-5 py-nexus-5">
              <div className="grid gap-nexus-5 lg:grid-cols-2">
                {grouped.map((group) => (
                  <section
                    className="rounded-nexus-md border border-(--glass-border) bg-void-900/45 p-nexus-4"
                    key={group.key}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-heading text-lg font-semibold text-starlight-50">
                        {group.label}
                      </h3>
                      <span className="font-mono text-[0.625rem] tracking-interface text-starlight-400 uppercase">
                        {group.discoveredInLocation}/{group.fragments.length}
                      </span>
                    </div>

                    <ul className="mt-nexus-3 space-y-2">
                      {group.fragments.map((fragment) => {
                        const discovered = discoveredIds.includes(fragment.id)

                        return (
                          <li
                            className={cn(
                              'rounded-nexus-sm border px-nexus-3 py-nexus-3',
                              discovered
                                ? 'border-signal-sage/40 bg-signal-sage/10'
                                : 'border-(--glass-border) bg-void-900/55',
                            )}
                            key={fragment.id}
                          >
                            <div className="flex items-center justify-between gap-4">
                              <p className="font-mono text-[0.6rem] tracking-interface text-starlight-500 uppercase">
                                {fragment.code}
                              </p>
                              <span className="text-xs text-starlight-300">
                                {discovered ? 'Collected' : 'Hidden'}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-starlight-200">{fragment.title}</p>
                          </li>
                        )
                      })}
                    </ul>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}