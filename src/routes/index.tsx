import { createFileRoute, Link } from '@tanstack/react-router'
import { useLatestArticles, useDestinations } from '@/integrations/strapi'
import { useTranslation } from '@/lib/i18n'

const SITE_URL = 'https://lowcosttraveling.com'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Lowcost Traveling – Budget Travel Guides & Tips' },
      {
        name: 'description',
        content:
          'Discover budget-friendly travel guides, insider tips, and destination insights. Plan your next adventure without breaking the bank.',
      },
      { property: 'og:title', content: 'Lowcost Traveling – Budget Travel Guides & Tips' },
      { property: 'og:description', content: 'Discover budget-friendly travel guides and tips.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: SITE_URL },
    ],
    links: [{ rel: 'canonical', href: SITE_URL }],
  }),
  component: HomePage,
})

function HomePage() {
  const { t } = useTranslation()
  const { data: articles = [], isLoading: articlesLoading } = useLatestArticles(4)
  const { data: destinations = [], isLoading: destinationsLoading } = useDestinations()

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary-light py-16 md:py-24">
        <div className="container-wide text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('homePage.heroTitle')}
          </h1>
          <p className="text-xl text-foreground-secondary max-w-2xl mx-auto mb-8">
            {t('homePage.heroDescription')}
          </p>
          <Link
            to="/destinations"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-primary-foreground font-medium px-8 py-4 rounded-lg transition-colors text-lg"
          >
            {t('homePage.exploreDestinations')}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16">
        <div className="container-wide">
          <h2 className="text-3xl font-semibold text-foreground mb-8">
            {t('homePage.featuredDestinations')}
          </h2>
          {destinationsLoading ? (
            <div className="text-center py-8 text-foreground-secondary">
              Loading destinations...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((destination) => (
              <Link
                key={destination.id}
                to="/articles/$slug"
                params={{ slug: destination.slug }}
                className="group block border border-border rounded-xl overflow-hidden bg-background hover:border-primary transition-colors"
              >
                <div className="aspect-video bg-background-secondary flex items-center justify-center text-6xl">
                  {destination.flagEmoji}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                    {destination.name}
                  </h3>
                  <p className="text-foreground-muted text-sm mb-3">
                    {destination.type === 'country' ? t('homePage.country') : destination.type} •{' '}
                    {destination.continent.replace('-', ' ')}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-foreground-secondary">
                    <span>💰 {t('homePage.from')} ${destination.currency.budgetPerDay.budget}{t('homePage.perDay')}</span>
                    <span>🗣️ {destination.languages[0]}</span>
                  </div>
                </div>
              </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-16 bg-background-secondary">
        <div className="container-wide">
          <h2 className="text-3xl font-semibold text-foreground mb-8">
            {t('homePage.latestTravelGuides')}
          </h2>
          {articlesLoading ? (
            <div className="text-center py-8 text-foreground-secondary">
              Loading articles...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
              <Link
                key={article.id}
                to="/articles/$slug"
                params={{ slug: article.slug }}
                className="group block border border-border rounded-xl p-6 bg-background hover:border-primary transition-colors"
              >
                <span className="inline-block text-xs font-medium text-primary bg-primary-light px-2 py-1 rounded mb-3">
                  {article.articleType.replace('-', ' ')}
                </span>
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                  {article.title}
                </h3>
                <p className="text-foreground-secondary line-clamp-2 mb-4">
                  {article.intro}
                </p>
                <span className="text-primary font-medium inline-flex items-center gap-1">
                  {t('homePage.readGuide')} <span aria-hidden="true">→</span>
                </span>
              </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container-narrow text-center">
          <h2 className="text-3xl font-semibold text-foreground mb-4">
            {t('homePage.readyToStart')}
          </h2>
          <p className="text-foreground-secondary mb-8">
            {t('homePage.newsletterDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto">
            <input
              type="email"
              placeholder={t('homePage.newsletterPlaceholder')}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-primary-foreground font-medium px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
            >
              {t('homePage.subscribe')}
            </button>
          </div>
          <p className="text-xs text-foreground-muted mt-4">
            {t('homePage.noSpam')}
          </p>
        </div>
      </section>
    </div>
  )
}
