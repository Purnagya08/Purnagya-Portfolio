import { cn } from '@shared/utils/cn'

const tones = {
  amber: 'bg-signal-amber shadow-glow-amber',
  cyan: 'bg-signal-cyan shadow-glow-cyan',
  green: 'bg-signal-green',
  violet: 'bg-signal-violet shadow-glow-violet',
}

export function SystemBadge({ children, className, tone = 'cyan' }) {
  return (
    <span
      className={cn(
        'nexus-label inline-flex items-center gap-2 text-starlight-300',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn('size-1.5 rounded-full', tones[tone])}
      />
      {children}
    </span>
  )
}
