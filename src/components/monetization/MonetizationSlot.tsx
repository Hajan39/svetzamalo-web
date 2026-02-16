import { useMonetization } from './MonetizationProvider'

/**
 * Monetization Slot System
 *
 * Clean abstraction for monetization that can be easily replaced with real ads.
 * Supports multiple slot types and positions without breaking reading flow.
 */

export type MonetizationSlotType =
  | 'banner-top'
  | 'banner-end'
  | 'sidebar-sticky'
  | 'content-inline'
  | 'native-article'

export type MonetizationProvider = 'adsense' | 'placeholder' | 'none'

interface MonetizationSlotProps {
  slotId: string
  type: MonetizationSlotType
  className?: string
  fallback?: React.ReactNode
}

/**
 * Core Monetization Slot Component
 *
 * This component provides a clean abstraction that can be easily swapped
 * between different ad providers (AdSense, affiliates, etc.) without
 * changing the placement logic.
 */
export function MonetizationSlot({
  slotId,
  type,
  className = '',
  fallback
}: MonetizationSlotProps) {
  const { provider, isEnabled } = useMonetization()

  // If monetization is disabled, show fallback or nothing
  if (!isEnabled) {
    return fallback ? <div className={className}>{fallback}</div> : null
  }

  // Render based on provider
  switch (provider) {
    case 'adsense':
      return <AdSenseSlot slotId={slotId} type={type} className={className} />
    case 'placeholder':
    default:
      return <PlaceholderSlot slotId={slotId} type={type} className={className} />
  }
}

/**
 * Placeholder Slot - For development and testing
 * Shows visual placeholders that can be easily replaced with real ads
 */
function PlaceholderSlot({ slotId, type, className }: Omit<MonetizationSlotProps, 'fallback'>) {
  const dimensions = getSlotDimensions(type)

  return (
    <aside
      className={`monetization-slot bg-linear-to-br from-primary/10 to-primary/5 border-2 border-dashed border-primary/30 rounded-lg flex items-center justify-center ${className}`}
      style={dimensions}
      aria-label={`Monetization slot: ${slotId}`}
      data-slot-id={slotId}
      data-slot-type={type}
    >
      <div className="text-center p-4">
        <div className="text-2xl mb-2">📢</div>
        <div className="text-sm font-medium text-primary mb-1">
          {getSlotLabel(type)}
        </div>
        <div className="text-xs text-foreground-secondary">
          Slot: {slotId}
        </div>
        <div className="text-xs text-foreground-muted mt-2">
          {dimensions.maxWidth ?? dimensions.width} × {dimensions.height ?? dimensions.minHeight}
        </div>
      </div>
    </aside>
  )
}

/**
 * AdSense Slot - Production-ready AdSense integration
 */
function AdSenseSlot({ slotId, type, className }: Omit<MonetizationSlotProps, 'fallback'>) {
  const { getAdSlotId } = useMonetization()
  const adSlotId = getAdSlotId(slotId)

  // If no ad slot configured, show placeholder
  if (!adSlotId) {
    return (
      <aside className={`text-center text-xs text-foreground-muted py-4 border border-dashed border-border rounded ${className}`}>
        AdSense slot not configured: {slotId}
      </aside>
    )
  }

  return (
    <aside className={`monetization-slot ${className}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
        }}
        data-ad-client={process.env.VITE_ADSENSE_CLIENT_ID}
        data-ad-slot={adSlotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `(adsbygoogle = window.adsbygoogle || []).push({});`
        }}
      />
    </aside>
  )
}

/**
 * Helper function to get slot dimensions based on type
 */
function getSlotDimensions(type: MonetizationSlotType): { width?: string; maxWidth?: string; height?: string; minHeight?: string } {
  switch (type) {
    case 'banner-top':
    case 'banner-end':
      return { width: '100%', height: '90px' }
    case 'sidebar-sticky':
      return { width: '100%', maxWidth: '300px', minHeight: '600px' }
    case 'content-inline':
      return { width: '100%', height: '250px' }
    case 'native-article':
      return { width: '100%', minHeight: '120px' }
    default:
      return { width: '100%', height: '90px' }
  }
}

/**
 * Helper function to get human-readable slot labels
 */
function getSlotLabel(type: MonetizationSlotType): string {
  switch (type) {
    case 'banner-top':
      return 'Top Banner'
    case 'banner-end':
      return 'End Banner'
    case 'sidebar-sticky':
      return 'Sidebar Ad'
    case 'content-inline':
      return 'Inline Content'
    case 'native-article':
      return 'Native Article'
    default:
      return 'Advertisement'
  }
}

/**
 * Pre-configured slot components for common use cases
 */
export function TopBannerSlot({ slotId, className }: { slotId: string; className?: string }) {
  return (
    <MonetizationSlot
      slotId={slotId}
      type="banner-top"
      className={`w-full mb-8 ${className}`}
    />
  )
}

export function EndBannerSlot({ slotId, className }: { slotId: string; className?: string }) {
  return (
    <MonetizationSlot
      slotId={slotId}
      type="banner-end"
      className={`w-full mt-8 ${className}`}
    />
  )
}

export function SidebarStickySlot({ slotId, className }: { slotId: string; className?: string }) {
  return (
    <MonetizationSlot
      slotId={slotId}
      type="sidebar-sticky"
      className={`sticky top-24 ${className}`}
    />
  )
}

export function ContentInlineSlot({ slotId, className }: { slotId: string; className?: string }) {
  return (
    <MonetizationSlot
      slotId={slotId}
      type="content-inline"
      className={`my-8 ${className}`}
    />
  )
}

export function NativeArticleSlot({ slotId, className }: { slotId: string; className?: string }) {
  return (
    <MonetizationSlot
      slotId={slotId}
      type="native-article"
      className={`my-6 ${className}`}
    />
  )
}