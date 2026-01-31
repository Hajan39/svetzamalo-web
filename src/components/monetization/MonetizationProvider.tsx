import React, { createContext, useContext, ReactNode } from 'react'
import type { MonetizationProvider as MonetizationProviderType } from './MonetizationSlot'
import { MONETIZATION_CONFIG, EXTERNAL_SERVICES } from '@/lib/constants'

/**
 * Monetization Provider Context
 *
 * Central configuration for all monetization across the site.
 * Easy to switch between providers, enable/disable globally, and configure settings.
 */

interface MonetizationConfig {
  provider: MonetizationProviderType
  isEnabled: boolean
  adSenseConfig?: {
    clientId: string
    slots: Record<string, string> // slotId -> adSlotId mapping
  }
  affiliateConfig?: {
    enabledPartners: string[]
    trackingParams: Record<string, string>
  }
}

interface MonetizationContextType {
  config: MonetizationConfig
  provider: MonetizationProviderType
  isEnabled: boolean
  // Helper methods for conditional rendering
  shouldShowSlot: (slotId: string) => boolean
  getAdSlotId: (slotId: string) => string | undefined
}

const MonetizationContext = createContext<MonetizationContextType | null>(null)

/**
 * Default configuration - easily changeable
 */
const DEFAULT_CONFIG: MonetizationConfig = {
  provider: 'placeholder', // Change to 'adsense' when ready
  isEnabled: true, // Set to false to disable all monetization
  adSenseConfig: {
    clientId: 'ca-pub-XXXXXXXXXX', // Replace with real AdSense ID
    slots: {
      'article-top': '1234567890',
      'article-end': '0987654321',
      'sidebar': '1122334455',
    },
  },
  affiliateConfig: {
    enabledPartners: ['booking', 'skyscanner', 'expedia'],
    trackingParams: {
      utm_source: 'lowcosttraveling',
      utm_medium: 'affiliate',
    },
  },
}

interface MonetizationProviderProps {
  children: ReactNode
  config?: Partial<MonetizationConfig>
}

/**
 * Monetization Provider Component
 *
 * Wrap your app or specific sections to enable monetization.
 * Configuration can be overridden per section if needed.
 */
export function MonetizationProvider({
  children,
  config: overrideConfig
}: MonetizationProviderProps) {
  const config = { ...DEFAULT_CONFIG, ...overrideConfig }

  const contextValue: MonetizationContextType = {
    config,
    provider: config.provider,
    isEnabled: config.isEnabled,
    shouldShowSlot: (slotId: string) => {
      // Add logic here for conditional slot display
      // e.g., don't show certain slots on mobile, or A/B testing
      return config.isEnabled
    },
    getAdSlotId: (slotId: string) => {
      return config.adSenseConfig?.slots[slotId]
    },
  }

  // Initialize AdSense when AdSense provider is selected
  React.useEffect(() => {
    if (config.provider === 'adsense' && config.isEnabled && config.adSenseConfig?.clientId) {
      initializeAdSense(config.adSenseConfig.clientId)
    }
  }, [config.provider, config.isEnabled, config.adSenseConfig?.clientId])

  return (
    <MonetizationContext.Provider value={contextValue}>
      {children}
    </MonetizationContext.Provider>
  )
}

/**
 * Hook to access monetization context
 */
export function useMonetization(): MonetizationContextType {
  const context = useContext(MonetizationContext)
  if (!context) {
    throw new Error('useMonetization must be used within a MonetizationProvider')
  }
  return context
}

/**
 * Hook for conditional monetization rendering
 */
export function useMonetizationSlot(slotId: string) {
  const { shouldShowSlot, getAdSlotId, provider } = useMonetization()

  return {
    shouldShow: shouldShowSlot(slotId),
    adSlotId: getAdSlotId(slotId),
    provider,
  }
}

/**
 * Environment-based configuration
 * Can be controlled via environment variables for different deployments
 */
export function getMonetizationConfig(): MonetizationConfig {
  const isProduction = process.env.NODE_ENV === 'production'
  const enableAds = MONETIZATION_CONFIG.provider !== 'none'

  return {
    ...DEFAULT_CONFIG,
    ...MONETIZATION_CONFIG,
    isEnabled: enableAds && (isProduction || MONETIZATION_CONFIG.provider === 'adsense'),
    provider: MONETIZATION_CONFIG.provider,
    adSenseConfig: {
      clientId: EXTERNAL_SERVICES.googleAdsense.clientId || 'ca-pub-XXXXXXXXXX',
      slots: MONETIZATION_CONFIG.slots,
    },
    affiliateConfig: {
      enabledPartners: ['booking', 'skyscanner', 'expedia'],
      trackingParams: {
        utm_source: 'lowcosttraveling',
        utm_medium: 'affiliate',
      },
    },
  }
}

/**
 * Future AdSense Integration Helper
 *
 * When ready to integrate AdSense, this function can be used
 * to initialize the AdSense script and load ads.
 */
export function initializeAdSense(clientId: string) {
  // Load AdSense script
  const script = document.createElement('script')
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`
  script.async = true
  script.crossOrigin = 'anonymous'
  document.head.appendChild(script)

  // Initialize ads
  if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
    try {
      ;(window as any).adsbygoogle = (window as any).adsbygoogle || []
      ;(window as any).adsbygoogle.push({})
    } catch (err) {
      console.error('AdSense initialization failed:', err)
    }
  }
}