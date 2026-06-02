import { cn } from '@shared/utils/cn'

const tones = {
  blue: 'border-signal-blue/45 text-signal-blue',
  brass: 'border-signal-brass/45 text-signal-brass',
  copper: 'border-signal-copper/45 text-signal-copper',
  sage: 'border-signal-sage/45 text-signal-sage',
  steel: 'border-signal-steel/45 text-signal-steel',
}

export function ModuleGlyph({ module, size = 'default' }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid shrink-0 place-items-center border bg-void-900/75 font-display font-bold tracking-interface',
        size === 'small'
          ? 'size-8 rounded-nexus-xs text-[0.55rem]'
          : 'size-13 rounded-nexus-sm text-xs',
        tones[module.tone],
      )}
    >
      {module.symbol}
    </span>
  )
}
