import { cn } from '@shared/utils/cn'

export function Container({ as: Component = 'div', className = '', children }) {
  return (
    <Component
      className={cn(
        'mx-auto w-full max-w-6xl px-(--spacing-gutter)',
        className,
      )}
    >
      {children}
    </Component>
  )
}
