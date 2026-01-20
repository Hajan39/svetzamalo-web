import { createFileRoute } from '@tanstack/react-router'

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
  return (
    <div className="container-narrow py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-6">
          About Lowcost Traveling
        </h1>
        <p className="text-xl text-foreground-secondary">
          Helping budget travelers explore the world since 2020.
        </p>
      </header>

      <div className="prose prose-lg max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Our Mission
          </h2>
          <p className="text-foreground-secondary leading-relaxed mb-4">
            We believe that travel should be accessible to everyone. Our mission is to
            provide honest, practical travel guides that help you explore amazing
            destinations without breaking the bank.
          </p>
          <p className="text-foreground-secondary leading-relaxed">
            Every guide we create is based on real experiences and thorough research.
            We focus on what matters most: how to get there affordably, where to stay
            on a budget, and what to see and do without overspending.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            What We Offer
          </h2>
          <ul className="space-y-3 text-foreground-secondary">
            <li className="flex items-start gap-3">
              <span className="text-accent">✓</span>
              <span>In-depth destination guides with real budget breakdowns</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent">✓</span>
              <span>Practical tips from experienced budget travelers</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent">✓</span>
              <span>Honest recommendations without hidden agendas</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent">✓</span>
              <span>Regular updates to keep information current</span>
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            How We Make Money
          </h2>
          <p className="text-foreground-secondary leading-relaxed mb-4">
            We're transparent about how we sustain this project. When you book flights,
            hotels, or tours through our affiliate links, we may earn a small commission
            at no extra cost to you.
          </p>
          <p className="text-foreground-secondary leading-relaxed">
            This helps us keep creating free content while maintaining our independence.
            We only recommend services we'd use ourselves.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Get in Touch
          </h2>
          <p className="text-foreground-secondary leading-relaxed">
            Have questions, suggestions, or just want to say hello? We'd love to hear
            from you. Reach out at{' '}
            <a href="mailto:hello@lowcosttraveling.com" className="text-accent hover:text-accent-hover">
              hello@lowcosttraveling.com
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
