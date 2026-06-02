import { cn } from '@shared/utils/cn'

const variants = {
  ghost: 'nexus-button-ghost',
  primary: 'nexus-button-primary',
  secondary: 'nexus-button-secondary',
}

export function Button({
  as: Component = 'button',
  children,
  className,
  type,
  variant = 'primary',
  ...props
}) {
  const buttonProps =
    Component === 'button' ? { type: type ?? 'button' } : undefined

  return (
    <Component
      className={cn('nexus-button', variants[variant], className)}
      {...buttonProps}
      {...props}
    >
      {children}
    </Component>
  )
}
