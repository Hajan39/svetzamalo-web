interface AffiliateBoxProps {
  type: 'flight' | 'hotel' | 'tour'
  headline: string
  description: string
  ctaText: string
  link: string
  partner?: string
}

const typeConfig = {
  flight: {
    icon: '✈️',
    defaultHeadline: 'Book Your Flight',
  },
  hotel: {
    icon: '🏨',
    defaultHeadline: 'Find Accommodation',
  },
  tour: {
    icon: '🎯',
    defaultHeadline: 'Book Tours & Activities',
  },
}

export function AffiliateBox({
  type,
  headline,
  description,
  ctaText,
  link,
  partner,
}: AffiliateBoxProps) {
  const config = typeConfig[type]

  return (
    <aside className="border border-border border-l-4 border-l-primary rounded-r-lg bg-background-secondary p-4 sm:p-5 md:p-6 my-6 md:my-8">
      <div className="flex items-start gap-3 sm:gap-4">
        <span className="text-xl sm:text-2xl" role="img" aria-hidden="true">
          {config.icon}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
            {headline || config.defaultHeadline}
          </h3>
          <p className="text-foreground-secondary mb-3 md:mb-4 text-sm sm:text-base">
            {description}
          </p>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-medium px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
          >
            {ctaText}
            <span aria-hidden="true">→</span>
          </a>
          <p className="text-xs text-foreground-muted mt-3 md:mt-4">
            {partner && `Via ${partner}. `}
            We may earn a commission at no extra cost to you.
          </p>
        </div>
      </div>
    </aside>
  )
}

export default AffiliateBox
