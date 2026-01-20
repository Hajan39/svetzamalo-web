interface LeadMagnetProps {
  title: string
  description: string
  benefits?: string[]
  ctaText: string
}

export function LeadMagnet({
  title,
  description,
  benefits,
  ctaText,
}: LeadMagnetProps) {
  return (
    <aside className="border-2 border-accent rounded-xl bg-accent-light p-8 my-12">
      <div className="text-center max-w-lg mx-auto">
        <span className="text-3xl mb-4 block" role="img" aria-hidden="true">
          📋
        </span>
        <h3 className="text-xl font-semibold text-foreground mb-3">
          {title}
        </h3>
        <p className="text-foreground-secondary mb-4">
          {description}
        </p>
        
        {benefits && benefits.length > 0 && (
          <ul className="text-left text-foreground-secondary mb-6 space-y-2">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-2">
                <span className="text-accent">✓</span>
                {benefit}
              </li>
            ))}
          </ul>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <input
            type="email"
            placeholder="Your email"
            className="w-full sm:w-auto px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="button"
            className="w-full sm:w-auto bg-accent hover:bg-accent-hover text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            {ctaText}
          </button>
        </div>
        
        <p className="text-xs text-foreground-muted mt-4">
          No spam, unsubscribe anytime.
        </p>
      </div>
    </aside>
  )
}

export default LeadMagnet
