import { cn } from '@shared/utils/cn'

export function Card({
  as: Component = 'article',
  children,
  className,
  interactive = false,
  ...props
}) {
  return (
    <Component
      className={cn(
        'nexus-card',
        !interactive && 'hover:translate-y-0 hover:border-(--glass-border)',
        className,
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </Component>
  )
}
