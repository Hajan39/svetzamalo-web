interface NewsletterCtaProps {
  headline?: string
  description?: string
  ctaText?: string
}

export function NewsletterCta({
  headline = 'Get Travel Deals & Tips',
  description = 'Join budget travelers. Weekly tips, no spam.',
  ctaText = 'Subscribe',
}: NewsletterCtaProps) {
  return (
    <aside className="border border-border rounded-lg bg-background-secondary p-6 my-8">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-semibold text-foreground mb-1">
            ✉️ {headline}
          </h3>
          <p className="text-sm text-foreground-muted">
            {description}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="email"
            placeholder="Your email"
            className="flex-1 sm:w-48 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent text-sm"
          />
          <button
            type="button"
            className="bg-accent hover:bg-accent-hover text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm"
          >
            {ctaText}
          </button>
        </div>
      </div>
    </aside>
  )
}

export default NewsletterCta
