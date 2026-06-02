import { cn } from '@shared/utils/cn'

const variants = {
  elevated: 'nexus-glass-elevated',
  panel: 'nexus-glass',
  subtle: 'nexus-glass-subtle',
}

export function GlassPanel({
  as: Component = 'div',
  children,
  className,
  variant = 'panel',
  ...props
}) {
  return (
    <Component
      className={cn('rounded-nexus-lg', variants[variant], className)}
      {...props}
    >
      {children}
    </Component>
  )
}
