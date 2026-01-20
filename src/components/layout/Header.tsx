import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

/**
 * Site header with logo and main navigation
 * 
 * Responsibilities:
 * - Site branding / logo
 * - Main navigation (desktop + mobile)
 * - Semantic <header> element for SEO
 */

interface NavItem {
  label: string
  href: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Destinations', href: '/destinations' },
  { label: 'About', href: '/about' },
]

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header 
      className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div className="container-full">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Site Name */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-foreground hover:text-foreground transition-colors"
            aria-label="Lowcost Traveling - Home"
          >
            {/* Logo Icon */}
            <span className="text-2xl" role="img" aria-hidden="true">
              ✈️
            </span>
            {/* Site Name */}
            <span className="text-lg font-semibold tracking-tight">
              Lowcost Traveling
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav 
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="px-4 py-2 text-sm font-medium text-foreground-secondary hover:text-foreground hover:bg-background-secondary rounded-lg transition-colors"
                activeProps={{ 
                  className: 'px-4 py-2 text-sm font-medium text-accent bg-accent-light rounded-lg' 
                }}
                activeOptions={{ exact: item.href === '/' }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-foreground-secondary hover:text-foreground hover:bg-background-secondary rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav
            className="md:hidden py-4 border-t border-border"
            aria-label="Mobile navigation"
          >
            <ul className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="block px-4 py-3 text-foreground-secondary hover:text-foreground hover:bg-background-secondary rounded-lg transition-colors"
                    activeProps={{ 
                      className: 'block px-4 py-3 text-accent font-medium bg-accent-light rounded-lg' 
                    }}
                    activeOptions={{ exact: item.href === '/' }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
