import { NavLink } from 'react-router-dom'
import { useAppStore } from '@core/store/useAppStore'
import { navigationItems } from '@data/navigation'
import { Container } from '@shared/components/ui/Container'

const navLinkClassName = ({ isActive }) =>
  `nexus-nav-link ${isActive ? 'text-signal-brass' : 'text-starlight-300 hover:text-starlight-50'}`

export function Header() {
  const { closeNavigation, isNavigationOpen, toggleNavigation } = useAppStore()

  return (
    <header className="nexus-glass-subtle sticky top-0 z-50 border-x-0 border-t-0">
      <Container className="flex h-16 items-center justify-between">
        <NavLink
          className="font-display text-sm font-bold tracking-display text-starlight-50 uppercase"
          to="/nexus"
        >
          NEXUS
        </NavLink>
        <button
          aria-expanded={isNavigationOpen}
          aria-label="Toggle navigation"
          className="nexus-button nexus-button-secondary min-h-0 px-3 py-2 md:hidden"
          onClick={toggleNavigation}
          type="button"
        >
          Menu
        </button>
        <nav
          className={`${isNavigationOpen ? 'flex' : 'hidden'} nexus-glass absolute inset-x-0 top-16 flex-col gap-5 border-x-0 px-(--spacing-gutter) py-5 md:static md:flex md:flex-row md:border-0 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none`}
        >
          {navigationItems.map((item) => (
            <NavLink
              className={navLinkClassName}
              key={item.href}
              onClick={closeNavigation}
              to={item.href}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </Container>
    </header>
  )
}
