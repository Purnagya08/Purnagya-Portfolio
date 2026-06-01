import { NavLink } from 'react-router-dom'
import { useAppStore } from '@core/store/useAppStore'
import { navigationItems } from '@data/navigation'
import { Container } from '@shared/components/ui/Container'

const navLinkClassName = ({ isActive }) =>
  `transition hover:text-cyan-300 ${isActive ? 'text-cyan-300' : 'text-slate-300'}`

export function Header() {
  const { closeNavigation, isNavigationOpen, toggleNavigation } = useAppStore()

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <NavLink className="font-semibold tracking-wide text-white" to="/">
          Purnagya
        </NavLink>
        <button
          aria-expanded={isNavigationOpen}
          aria-label="Toggle navigation"
          className="rounded border border-white/15 px-3 py-1.5 text-sm text-slate-200 md:hidden"
          onClick={toggleNavigation}
          type="button"
        >
          Menu
        </button>
        <nav
          className={`${isNavigationOpen ? 'flex' : 'hidden'} absolute inset-x-0 top-16 flex-col gap-4 border-b border-white/10 bg-slate-950 px-6 py-5 md:static md:flex md:flex-row md:border-0 md:bg-transparent md:p-0`}
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
