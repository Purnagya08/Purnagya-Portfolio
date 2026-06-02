import { motion } from 'framer-motion'
import { memoryFragments } from '@shared/constants/memoryFragments'
import { useMemoryFragmentStore } from '@shared/store/useMemoryFragmentStore'
import { cn } from '@shared/utils/cn'

export function MemoryFragmentBeacon({ fragmentId }) {
  const discoverFragment = useMemoryFragmentStore((state) => state.discoverFragment)
  const discoveredIds = useMemoryFragmentStore((state) => state.discoveredIds)
  const fragment = memoryFragments.find((item) => item.id === fragmentId)
  const isDiscovered = discoveredIds.includes(fragmentId)

  if (!fragment) {
    return null
  }

  return (
    <motion.article
      animate={isDiscovered ? { opacity: 1, scale: 1 } : { opacity: 0.96, scale: 1 }}
      className={cn(
        'rounded-nexus-md border bg-void-900/55 p-nexus-4',
        isDiscovered
          ? 'border-signal-sage/45'
          : 'border-(--glass-border) hover:border-(--glass-border-highlight)',
      )}
      initial={{ opacity: 0.94, y: 8 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[0.625rem] tracking-interface text-starlight-500 uppercase">
            {fragment.code}
          </p>
          <h3 className="mt-1 font-heading text-base font-semibold text-starlight-100">
            {fragment.title}
          </h3>
        </div>
        <span
          className={cn(
            'rounded-nexus-pill border px-3 py-1 font-mono text-[0.55rem] tracking-interface uppercase',
            isDiscovered
              ? 'border-signal-sage/40 bg-signal-sage/10 text-starlight-100'
              : 'border-(--glass-border) text-starlight-400',
          )}
        >
          {isDiscovered ? 'Archived' : 'Undiscovered'}
        </span>
      </div>

      <p className="mt-nexus-3 text-body-sm text-starlight-300">{fragment.excerpt}</p>

      <button
        className={cn(
          'mt-nexus-4 rounded-nexus-pill border px-4 py-2 font-mono text-[0.6rem] tracking-interface uppercase transition',
          isDiscovered
            ? 'cursor-default border-signal-sage/40 bg-signal-sage/8 text-starlight-200'
            : 'border-(--glass-border) bg-void-900/40 text-starlight-200 hover:border-(--glass-border-highlight) hover:bg-hull-700/45',
        )}
        disabled={isDiscovered}
        onClick={() => discoverFragment(fragmentId)}
        type="button"
      >
        {isDiscovered ? 'Fragment Collected' : 'Collect Fragment'}
      </button>
    </motion.article>
  )
}