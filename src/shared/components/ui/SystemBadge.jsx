import { cn } from '@shared/utils/cn'

const tones = {
  blue: 'bg-signal-blue',
  brass: 'bg-signal-brass',
  sage: 'bg-signal-sage',
  steel: 'bg-signal-steel',
}

export function SystemBadge({ children, className, tone = 'steel' }) {
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
