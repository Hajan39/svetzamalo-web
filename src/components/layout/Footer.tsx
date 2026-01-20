import { Link } from '@tanstack/react-router'

/**
 * Site footer with legal links and site info
 * 
 * Responsibilities:
 * - Copyright notice
 * - Legal/policy links
 * - Site description
 * - Semantic <footer> element for SEO
 */

interface FooterLink {
  label: string
  href: string
  external?: boolean
}

const LEGAL_LINKS: FooterLink[] = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
  { label: 'Cookie Policy', href: '/cookies' },
]

const SITE_LINKS: FooterLink[] = [
  { label: 'About', href: '/about' },
  { label: 'Destinations', href: '/destinations' },
  { label: 'Contact', href: '/contact' },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background-secondary">
      <div className="container-full py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-foreground hover:text-foreground transition-colors"
            >
              <span className="text-xl" role="img" aria-hidden="true">✈️</span>
              <span className="text-lg font-semibold">Lowcost Traveling</span>
            </Link>
            <p className="mt-3 text-sm text-foreground-muted max-w-xs">
              Budget travel guides and tips for adventurous travelers. 
              Explore the world without breaking the bank.
            </p>
          </div>

          {/* Site Links */}
          <nav aria-label="Footer navigation">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Explore
            </h2>
            <ul className="space-y-2">
              {SITE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-foreground-muted hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal Links */}
          <nav aria-label="Legal links">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Legal
            </h2>
            <ul className="space-y-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-foreground-muted hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-foreground-muted">
              © {currentYear} Lowcost Traveling. All rights reserved.
            </p>

            {/* Affiliate Disclosure */}
            <p className="text-xs text-foreground-muted text-center sm:text-right max-w-md">
              Some links may be affiliate links. We may earn a commission at no extra cost to you.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
