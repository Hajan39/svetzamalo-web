import { createFileRoute, Link } from '@tanstack/react-router'
import { useArticles, fetchArticles } from '@/integrations/strapi'
import { ArticleCard } from '@/components/article'
import { useTranslation } from '@/lib/i18n'
import type { Article } from '@/types'

const SITE_URL = 'https://lowcosttraveling.com'

export const Route = createFileRoute('/articles/')({
  loader: async ({ context }) => {
    const { queryClient } = context
    const { strapiQueryKeys } = await import('@/integrations/strapi')
    
    await queryClient.prefetchQuery({
      queryKey: strapiQueryKeys.articles.lists(),
      queryFn: () => fetchArticles(),
    })
    
    return {}
  },
  head: () => ({
    meta: [
      { title: 'Travel Articles & Guides | Lowcost Traveling' },
      {
        name: 'description',
        content:
          'Browse our collection of budget travel guides, destination articles, and insider tips to help you explore the world affordably.',
      },
      { property: 'og:title', content: 'Travel Articles & Guides | Lowcost Traveling' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: `${SITE_URL}/articles` },
    ],
    links: [{ rel: 'canonical', href: `${SITE_URL}/articles` }],
  }),
  component: ArticlesPage,
})

function ArticlesPage() {
  const { t } = useTranslation()
  const { data: articles = [], isLoading, error } = useArticles()

  // Group articles by type
  const articlesByType = articles.reduce<Record<string, Article[]>>((acc, article) => {
    const type = article.articleType || 'other'
    if (!acc[type]) {
      acc[type] = []
    }
    acc[type].push(article)
    return acc
  }, {})

  const typeLabels: Record<string, string> = {
    'destination-guide': t('articles.typeDestinationGuide'),
    'place-guide': t('articles.typePlaceGuide'),
    'practical-info': t('articles.typePracticalInfo'),
    itinerary: t('articles.typeItinerary'),
    list: t('articles.typeList'),
    other: t('articles.typeOther'),
  }

  if (isLoading) {
    return (
      <div className="container-wide py-12">
        <div className="text-center py-16">
          <p className="text-foreground-secondary">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-wide py-12">
        <div className="text-center py-16">
          <p className="text-error">{t('common.errorLoading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-wide py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          {t('articlesPage.title')}
        </h1>
        <p className="text-xl text-foreground-secondary max-w-2xl">
          {t('articlesPage.description')}
        </p>
      </header>

      {/* All articles grid */}
      {articles.length === 0 ? (
        <div className="text-center py-16 bg-background-secondary rounded-xl">
          <p className="text-foreground-secondary text-lg mb-4">
            {t('articlesPage.noArticles')}
          </p>
          <Link
            to="/destinations"
            className="text-primary hover:text-primary-hover font-medium"
          >
            {t('articlesPage.exploreDestinations')} →
          </Link>
        </div>
      ) : (
        <>
          {/* Featured articles (first 2) */}
          {articles.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                {t('articlesPage.featured')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.slice(0, 2).map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    variant="featured"
                  />
                ))}
              </div>
            </section>
          )}

          {/* All articles */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              {t('articlesPage.allArticles')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>

          {/* Articles by type */}
          {Object.entries(articlesByType).map(([type, typeArticles]) => (
            <section key={type} className="mt-16">
              <h2 className="text-2xl font-semibold text-foreground mb-6 capitalize">
                {typeLabels[type] || type.replace('-', ' ')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {typeArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="compact" />
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  )
}
