import { createFileRoute, Link } from '@tanstack/react-router'
import { getDestinations } from '@/content'

const SITE_URL = 'https://lowcosttraveling.com'

export const Route = createFileRoute('/destinations')({
  head: () => ({
    meta: [
      { title: 'Travel Destinations | Lowcost Traveling' },
      {
        name: 'description',
        content:
          'Explore our budget travel guides for destinations around the world. Find tips, costs, and practical info for your next adventure.',
      },
      { property: 'og:title', content: 'Travel Destinations | Lowcost Traveling' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: `${SITE_URL}/destinations` },
    ],
    links: [{ rel: 'canonical', href: `${SITE_URL}/destinations` }],
  }),
  component: DestinationsPage,
})

function DestinationsPage() {
  const destinations = getDestinations()

  return (
    <div className="container-wide py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Travel Destinations
        </h1>
        <p className="text-xl text-foreground-secondary max-w-2xl">
          Explore our budget travel guides for destinations around the world.
          Each guide includes practical tips, costs, and insider advice.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((destination) => (
          <Link
            key={destination.id}
            to="/articles/$slug"
            params={{ slug: destination.slug }}
            className="group block border border-border rounded-xl overflow-hidden bg-background hover:border-accent hover:shadow-lg transition-all"
          >
            <div className="aspect-video bg-background-secondary flex items-center justify-center text-7xl">
              {destination.flagEmoji}
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors mb-2">
                {destination.name}
              </h2>
              <p className="text-foreground-muted text-sm mb-4 capitalize">
                {destination.type} • {destination.continent.replace('-', ' ')}
              </p>
              
              <div className="space-y-2 text-sm text-foreground-secondary">
                <div className="flex items-center gap-2">
                  <span>💰</span>
                  <span>From ${destination.currency.budgetPerDay.budget}/day</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🗣️</span>
                  <span>{destination.languages.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>💵</span>
                  <span>{destination.currency.name} ({destination.currency.code})</span>
                </div>
                {destination.bestTimeToVisit && (
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>Best: {destination.bestTimeToVisit}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <span className="text-accent font-medium inline-flex items-center gap-1">
                  Read travel guide <span aria-hidden="true">→</span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
