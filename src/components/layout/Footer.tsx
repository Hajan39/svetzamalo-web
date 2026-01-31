import { Link } from '@tanstack/react-router'
import { Plane, Facebook, Twitter, Instagram, Youtube, Mail, MapPin } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

/**
 * Modern site footer with comprehensive links, social media, and branding
 *
 * Features:
 * - Brand section with description
 * - Organized link sections
 * - Social media links
 * - Newsletter signup
 * - Legal links
 * - Modern design with proper spacing
 */

interface FooterLink {
  label: string
  href: string
  external?: boolean
}

interface SocialLink {
  name: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  external: true
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'Facebook',
    icon: Facebook,
    href: 'https://facebook.com/lowcosttraveling',
    external: true,
  },
  {
    name: 'Twitter',
    icon: Twitter,
    href: 'https://twitter.com/lowcosttravel',
    external: true,
  },
  {
    name: 'Instagram',
    icon: Instagram,
    href: 'https://instagram.com/lowcosttraveling',
    external: true,
  },
  {
    name: 'YouTube',
    icon: Youtube,
    href: 'https://youtube.com/@lowcosttraveling',
    external: true,
  },
]

function FooterLinkItem({ link }: { link: FooterLink }) {
  return (
    <li>
      <Link
        to={link.href}
        className="text-foreground-secondary hover:text-primary transition-colors text-sm"
        {...(link.external && { target: '_blank', rel: 'noopener noreferrer' })}
      >
        {link.label}
      </Link>
    </li>
  )
}

function SocialLinkItem({ link }: { link: SocialLink }) {
  const Icon = link.icon
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-10 h-10 bg-primary-light hover:bg-primary text-primary hover:text-primary-foreground rounded-lg transition-all duration-300 hover:scale-110"
      aria-label={`Follow us on ${link.name}`}
    >
      <Icon className="w-5 h-5" />
    </a>
  )
}

export function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()
  
  const EXPLORE_LINKS: FooterLink[] = [
    { label: t('footer.destinations'), href: '/destinations' },
    { label: t('footer.articles'), href: '/articles' },
    { label: t('footer.aboutUs'), href: '/about' },
    { label: t('footer.contact'), href: '/contact' },
  ]

  const TRAVEL_LINKS: FooterLink[] = [
    { label: t('footer.budgetTips'), href: '/articles?tag=budget' },
    { label: t('footer.travelPlanning'), href: '/articles?tag=planning' },
    { label: t('footer.packingGuides'), href: '/articles?tag=packing' },
    { label: t('footer.safetyTips'), href: '/articles?tag=safety' },
  ]

  const LEGAL_LINKS: FooterLink[] = [
    { label: t('footer.privacyPolicy'), href: '/privacy' },
    { label: t('footer.termsOfUse'), href: '/terms' },
    { label: t('footer.cookiePolicy'), href: '/cookies' },
    { label: t('footer.disclaimer'), href: '/disclaimer' },
  ]

  return (
    <footer className="bg-background border-t border-border">
      {/* Main Footer Content */}
      <div className="container-full py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <Link
              to="/"
              className="inline-flex items-center gap-3 text-foreground hover:text-primary transition-colors group mb-4"
            >
              <Plane className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-2xl font-bold">Lowcost Traveling</span>
            </Link>

            <p className="text-foreground-secondary mb-6 leading-relaxed max-w-sm">
              {t('footer.description')}
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-foreground-muted">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>{t('footer.email')}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{t('footer.location')}</span>
              </div>
            </div>
          </div>

          {/* Explore Links */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-foreground mb-4">{t('footer.explore')}</h3>
            <nav>
              <ul className="space-y-3">
                {EXPLORE_LINKS.map((link) => (
                  <FooterLinkItem key={link.href} link={link} />
                ))}
              </ul>
            </nav>
          </div>

          {/* Travel Links */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-foreground mb-4">{t('footer.travelTips')}</h3>
            <nav>
              <ul className="space-y-3">
                {TRAVEL_LINKS.map((link) => (
                  <FooterLinkItem key={link.href} link={link} />
                ))}
              </ul>
            </nav>
          </div>

          {/* Legal Links */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-foreground mb-4">{t('footer.legal')}</h3>
            <nav>
              <ul className="space-y-3">
                {LEGAL_LINKS.map((link) => (
                  <FooterLinkItem key={link.href} link={link} />
                ))}
              </ul>
            </nav>
          </div>

          {/* Social & Newsletter */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-foreground mb-4">{t('footer.followUs')}</h3>

            {/* Social Links */}
            <div className="flex gap-3 mb-6">
              {SOCIAL_LINKS.map((link) => (
                <SocialLinkItem key={link.name} link={link} />
              ))}
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-sm text-foreground-secondary mb-3">
                {t('footer.newsletterTitle')}
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder={t('footer.newsletterPlaceholder')}
                  className="flex-1 px-3 py-2 text-sm bg-background-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-medium rounded-lg transition-colors"
                >
                  {t('footer.newsletterButton')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border bg-background-secondary/50">
        <div className="container-full py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-foreground-muted">
              © {currentYear} Lowcost Traveling. {t('footer.copyright')}
            </p>

            {/* Affiliate Disclosure */}
            <p className="text-xs text-foreground-muted text-center md:text-right max-w-md">
              {t('footer.affiliate')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
