import { BookingFlights, BookingHotels, SkyscannerFlights, ExpediaTours, TravelInsurance } from './PartnerLinks'

interface MonetizationHubProps {
  destination: {
    name: string
    slug: string
  }
  compact?: boolean
}

/**
 * Monetization Hub Component
 *
 * Centralized location for all monetization opportunities.
 * Shows affiliate links, booking widgets, and other monetization options.
 * Designed to not interrupt reading flow.
 */
export function MonetizationHub({ destination, compact = false }: MonetizationHubProps) {
  if (compact) {
    return (
      <aside className="border border-border rounded-lg p-4 my-6 bg-background-secondary">
        <h4 className="font-semibold text-foreground mb-3">Book Your Trip</h4>
        <div className="flex flex-wrap gap-2">
          <BookingFlights destination={destination.slug} className="text-xs px-3 py-1" />
          <BookingHotels destination={destination.slug} className="text-xs px-3 py-1" />
        </div>
      </aside>
    )
  }

  return (
    <aside className="border border-border rounded-lg p-6 my-8 bg-background-secondary">
      <h3 className="text-xl font-semibold text-foreground mb-4">
        Plan Your Trip to {destination.name}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Flight Booking */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground flex items-center gap-2">
            <span className="text-lg">✈️</span>
            Flights to {destination.name}
          </h4>
          <div className="flex flex-col gap-2">
            <BookingFlights destination={destination.slug} />
            <SkyscannerFlights destination={destination.slug} />
          </div>
        </div>

        {/* Hotel Booking */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground flex items-center gap-2">
            <span className="text-lg">🏨</span>
            Hotels in {destination.name}
          </h4>
          <div className="flex flex-col gap-2">
            <BookingHotels destination={destination.slug} />
          </div>
        </div>

        {/* Tours & Activities */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground flex items-center gap-2">
            <span className="text-lg">🎯</span>
            Tours & Activities
          </h4>
          <div className="flex flex-col gap-2">
            <ExpediaTours destination={destination.slug} />
          </div>
        </div>

        {/* Travel Insurance */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground flex items-center gap-2">
            <span className="text-lg">🛡️</span>
            Travel Insurance
          </h4>
          <div className="flex flex-col gap-2">
            <TravelInsurance />
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border text-xs text-foreground-muted">
        <p>
          * Affiliate links help support this website. Prices and availability may change.
          Bookings made through these links may earn us a commission at no extra cost to you.
        </p>
      </div>
    </aside>
  )
}

/**
 * Quick Monetization Bar
 *
 * Minimal monetization component for article sidebars or footers.
 */
export function MonetizationBar({ destination }: { destination: { name: string, slug: string } }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 p-4 bg-primary-light rounded-lg">
      <div className="flex-1">
        <h4 className="font-medium text-foreground mb-1">Ready to book?</h4>
        <p className="text-sm text-foreground-secondary">
          Find the best deals for your trip to {destination.name}
        </p>
      </div>
      <div className="flex gap-2">
        <BookingFlights destination={destination.slug} className="text-sm" />
        <BookingHotels destination={destination.slug} className="text-sm" />
      </div>
    </div>
  )
}