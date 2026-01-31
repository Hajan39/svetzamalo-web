import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from '@/lib/i18n'

const SITE_URL = 'https://lowcosttraveling.com'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title: 'About Us | Lowcost Traveling' },
      {
        name: 'description',
        content:
          'Learn about Lowcost Traveling and our mission to help budget travelers explore the world.',
      },
      { property: 'og:title', content: 'About Us | Lowcost Traveling' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: `${SITE_URL}/about` },
    ],
    links: [{ rel: 'canonical', href: `${SITE_URL}/about` }],
  }),
  component: AboutPage,
})

function AboutPage() {
  const { t } = useTranslation()
  
  return (
    <div className="container-narrow py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-6">
          {t('about.title')}
        </h1>
        <p className="text-xl text-foreground-secondary">
          {t('about.subtitle')}
        </p>
      </header>

      <div className="prose prose-lg max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            {t('about.missionTitle')}
          </h2>
          <p className="text-foreground-secondary leading-relaxed mb-4">
            {t('about.missionText1')}
          </p>
          <p className="text-foreground-secondary leading-relaxed">
            {t('about.missionText2')}
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            {t('about.offerTitle')}
          </h2>
          <ul className="space-y-3 text-foreground-secondary">
            <li className="flex items-start gap-3">
              <span className="text-primary">✓</span>
              <span>{t('about.offer1')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary">✓</span>
              <span>{t('about.offer2')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary">✓</span>
              <span>{t('about.offer3')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary">✓</span>
              <span>{t('about.offer4')}</span>
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            {t('about.moneyTitle')}
          </h2>
          <p className="text-foreground-secondary leading-relaxed mb-4">
            {t('about.moneyText1')}
          </p>
          <p className="text-foreground-secondary leading-relaxed">
            {t('about.moneyText2')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            {t('about.contactTitle')}
          </h2>
          <p className="text-foreground-secondary leading-relaxed">
            {t('about.contactText')}{' '}
            <a href="mailto:hello@lowcosttraveling.com" className="text-primary hover:text-primary-hover">
              hello@lowcosttraveling.com
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
