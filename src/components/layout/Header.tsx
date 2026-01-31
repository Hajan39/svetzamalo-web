import { Link } from '@tanstack/react-router'
import { Menu, X, Search, Plane } from 'lucide-react'
import { useState } from 'react'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { SearchModal } from '@/components/ui/SearchModal'
import { useTranslation } from '@/lib/i18n'

/**
 * Modern, responsive site header with logo and main navigation
 *
 * Features:
 * - Modern branding with travel theme
 * - Responsive mobile hamburger menu
 * - Smooth animations and transitions
 * - Search functionality placeholder
 * - Language switcher integration
 */

interface NavItem {
  label: string
  href: string
  description?: string
}

export function Header() {
  const { t } = useTranslation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  
  const NAV_ITEMS: NavItem[] = [
    { label: t('header.navHome'), href: '/', description: t('header.navHomeDesc') },
    { label: t('header.navDestinations'), href: '/destinations', description: t('header.navDestinationsDesc') },
    { label: t('header.navArticles'), href: '/articles', description: t('header.navArticlesDesc') },
    { label: t('header.navAbout'), href: '/about', description: t('header.navAboutDesc') },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const openSearch = () => {
    setIsSearchOpen(true)
    setIsMobileMenuOpen(false)
  }

  const closeSearch = () => {
    setIsSearchOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container-wide">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl lg:text-2xl font-bold text-foreground hover:text-primary transition-colors group"
            onClick={closeMobileMenu}
          >
            <Plane className="w-6 h-6 lg:w-8 lg:h-8 text-primary group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Lowcost Traveling</span>
            <span className="sm:hidden">Lowcost</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="relative px-4 py-2 text-sm font-medium text-foreground-secondary hover:text-primary transition-colors rounded-lg hover:bg-primary-light/50 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Search button */}
            <button
              onClick={openSearch}
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-foreground-secondary hover:text-primary hover:bg-primary-light/50 rounded-lg transition-colors"
              aria-label={t('header.search')}
            >
              <Search className="w-4 h-4" />
              <span className="hidden md:inline">{t('header.search')}</span>
            </button>

            {/* Language switcher */}
            <div className="hidden sm:block">
              <LanguageSwitcher variant="dropdown" showFlags={true} />
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-foreground-secondary hover:text-primary hover:bg-primary-light/50 rounded-lg transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background/98 backdrop-blur-sm">
            <nav className="container-narrow py-6 space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="block px-4 py-3 text-foreground-secondary hover:text-primary hover:bg-primary-light/50 rounded-lg transition-colors"
                  onClick={closeMobileMenu}
                >
                  <div className="font-medium">{item.label}</div>
                  {item.description && (
                    <div className="text-sm text-foreground-muted mt-1">
                      {item.description}
                    </div>
                  )}
                </Link>
              ))}

              {/* Mobile search and language switcher */}
              <div className="border-t border-border pt-4 mt-4 space-y-3">
                <button
                  onClick={openSearch}
                  className="flex items-center gap-3 w-full px-4 py-3 text-left text-foreground-secondary hover:text-primary hover:bg-primary-light/50 rounded-lg transition-colors"
                >
                  <Search className="w-4 h-4" />
                  <span>{t('header.searchPlaceholder')}</span>
                </button>

                <div className="px-4">
                  <LanguageSwitcher variant="dropdown" showFlags={true} />
                </div>
              </div>
            </nav>
          </div>
        )}

        {/* Search Modal */}
        <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
      </div>
    </header>
  )
}

export default Header
