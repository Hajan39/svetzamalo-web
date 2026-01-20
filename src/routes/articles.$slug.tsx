import { createFileRoute } from '@tanstack/react-router'
import { getArticleBySlug, getDestinationById } from '@/content'
import { ArticleHero, ArticleSection, ArticlePlaces, ArticleFaq } from '@/components/article'
import { AffiliateBox, LeadMagnet, NewsletterCta } from '@/components/monetization'
import { Breadcrumbs } from '@/components/seo'
import { ArticleStructuredData, FaqStructuredData } from '@/components/seo/StructuredData'

const SITE_URL = 'https://lowcosttraveling.com'

export const Route = createFileRoute('/articles/$slug')({
  head: ({ params }) => {
    const article = getArticleBySlug(params.slug)
    if (!article) {
      return {
        meta: [{ title: 'Article Not Found | Lowcost Traveling' }],
      }
    }
    const canonicalUrl = `${SITE_URL}/articles/${params.slug}`
    return {
      meta: [
        { title: article.seo.metaTitle },
        { name: 'description', content: article.seo.metaDescription },
        { name: 'keywords', content: article.seo.keywords.join(', ') },
        { property: 'og:title', content: article.seo.ogTitle || article.seo.metaTitle },
        { property: 'og:description', content: article.seo.ogDescription || article.seo.metaDescription },
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: canonicalUrl },
        ...(article.seo.ogImage ? [{ property: 'og:image', content: article.seo.ogImage.src }] : []),
      ],
      links: [
        { rel: 'canonical', href: canonicalUrl },
      ],
    }
  },
  component: ArticlePage,
})

function ArticlePage() {
  const { slug } = Route.useParams()
  const article = getArticleBySlug(slug)

  if (!article) {
    return (
      <div className="container-narrow py-16">
        <h1 className="text-2xl font-semibold text-foreground">Article not found</h1>
        <p className="text-foreground-secondary mt-2">
          The article "{slug}" does not exist.
        </p>
      </div>
    )
  }

  const destination = getDestinationById(article.destinationId)
  const currentUrl = `https://lowcosttraveling.com/articles/${slug}`

  return (
    <>
      {/* Structured Data */}
      <ArticleStructuredData article={article} url={currentUrl} />
      {article.faq && <FaqStructuredData items={article.faq} />}

      <article className="container-narrow py-12">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Destinations', href: '/destinations' },
            ...(destination
              ? [{ label: destination.name, href: `/destinations/${destination.slug}` }]
              : []),
            { label: article.title },
          ]}
        />

        {/* Hero */}
        <ArticleHero
          title={article.title}
          intro={article.intro}
          publishedAt={article.publishedAt}
          updatedAt={article.updatedAt}
        />

        {/* Content Sections with Monetization */}
        <div className="space-y-12">
          {article.sections.map((section) => (
            <div key={section.id}>
              <ArticleSection section={section} />

              {/* Contextual affiliate after "Getting There" section */}
              {section.id === 'getting-there' && destination && (
                <AffiliateBox
                  type="flight"
                  headline={`Book Your Flight to ${destination.name}`}
                  description={`Find the best deals on flights. We recommend booking 2-3 months in advance for the best prices.`}
                  ctaText="Search Flights"
                  link={`https://www.skyscanner.com/transport/flights/to/${destination.slug}`}
                  partner="Skyscanner"
                />
              )}

              {/* Contextual affiliate after "Where to Stay" section */}
              {section.id === 'where-to-stay' && destination && (
                <AffiliateBox
                  type="hotel"
                  headline={`Find Accommodation in ${destination.name}`}
                  description={`Compare prices from hostels to luxury resorts. Budget: $${destination.currency.budgetPerDay.budget}/night, Mid-range: $${destination.currency.budgetPerDay.midRange}/night.`}
                  ctaText="Check Prices"
                  link={`https://www.booking.com/destination/${destination.slug}`}
                  partner="Booking.com"
                />
              )}
            </div>
          ))}
        </div>

        {/* Places */}
        <ArticlePlaces places={article.places} />

        {/* Lead Magnet before FAQ */}
        {destination && (
          <LeadMagnet
            title={`Free: ${destination.name} Budget Planner`}
            description="Plan your trip with our detailed budget spreadsheet and packing checklist."
            benefits={[
              'Daily expense tracker',
              'Packing checklist',
              'Emergency contacts',
              'Local phrases',
            ]}
            ctaText="Get Free Download"
          />
        )}

        {/* FAQ */}
        <ArticleFaq items={article.faq || []} />

        {/* Newsletter CTA at end */}
        <div className="mt-16">
          <NewsletterCta />
        </div>
      </article>
    </>
  )
}
