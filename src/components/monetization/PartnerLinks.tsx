import { Link } from '@tanstack/react-router'

interface PartnerLinkProps {
  partner: string
  type: 'booking' | 'flights' | 'tours' | 'insurance'
  destination: string
  className?: string
}

/**
 * Partner Links Component
 *
 * Provides standardized affiliate links for different travel services.
 * Easy to maintain and update tracking parameters.
 */
export function PartnerLinks({ partner, type, destination, className = '' }: PartnerLinkProps) {
  const getPartnerConfig = (partner: string, type: string) => {
    const configs = {
      booking: {
        flights: {
          url: `https://www.booking.com/flights`,
          params: { aid: '1234567', label: 'lowcost-traveling' },
          text: 'Search Flights on Booking.com'
        },
        hotels: {
          url: `https://www.booking.com/searchresults.html`,
          params: { aid: '1234567', label: 'lowcost-traveling', city: destination },
          text: 'Book Hotels on Booking.com'
        }
      },
      skyscanner: {
        flights: {
          url: `https://www.skyscanner.net/transport/flights`,
          params: { affiliateId: 'lowcosttraveling' },
          text: 'Find Cheap Flights on Skyscanner'
        }
      },
      expedia: {
        hotels: {
          url: `https://www.expedia.com/service/`,
          params: { affiliateId: 'lowcosttraveling' },
          text: 'Book Hotels on Expedia'
        },
        tours: {
          url: `https://www.expedia.com/service/`,
          params: { affiliateId: 'lowcosttraveling' },
          text: 'Book Tours on Expedia'
        }
      },
      travelinsurance: {
        insurance: {
          url: `https://www.travelinsurance.com`,
          params: { affiliateId: 'lowcosttraveling' },
          text: 'Get Travel Insurance'
        }
      }
    }

    return configs[partner]?.[type] || null
  }

  const config = getPartnerConfig(partner, type)

  if (!config) {
    return (
      <div className={`text-sm text-foreground-muted ${className}`}>
        Partner link not configured: {partner} - {type}
      </div>
    )
  }

  // Build URL with parameters
  const url = new URL(config.url)
  Object.entries(config.params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })

  return (
    <a
      href={url.toString()}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors ${className}`}
    >
      <span>{config.text}</span>
      <span aria-hidden="true">→</span>
    </a>
  )
}

/**
 * Pre-configured partner components for common use cases
 */
export function BookingFlights({ destination, className }: { destination: string, className?: string }) {
  return (
    <PartnerLinks
      partner="booking"
      type="flights"
      destination={destination}
      className={className}
    />
  )
}

export function BookingHotels({ destination, className }: { destination: string, className?: string }) {
  return (
    <PartnerLinks
      partner="booking"
      type="hotels"
      destination={destination}
      className={className}
    />
  )
}

export function SkyscannerFlights({ destination, className }: { destination: string, className?: string }) {
  return (
    <PartnerLinks
      partner="skyscanner"
      type="flights"
      destination={destination}
      className={className}
    />
  )
}

export function ExpediaTours({ destination, className }: { destination: string, className?: string }) {
  return (
    <PartnerLinks
      partner="expedia"
      type="tours"
      destination={destination}
      className={className}
    />
  )
}

export function TravelInsurance({ className }: { className?: string }) {
  return (
    <PartnerLinks
      partner="travelinsurance"
      type="insurance"
      destination=""
      className={className}
    />
  )
}