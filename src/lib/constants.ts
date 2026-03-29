/**
 * Application Constants
 *
 * Centralized configuration for all hardcoded values,
 * URLs, limits, and default settings.
 */

// ============================================================================
// SITE CONFIGURATION
// ============================================================================

export const SITE_CONFIG = {
  name: "Svět za málo",
  description: "Your ultimate guide to budget travel and adventure",
  url: process.env.VITE_SITE_URL || "https://lowcost-traveling.com",
  ogImage: "/images/og-default.jpg",
  twitterHandle: "@lowcosttraveling",
  email: "hello@lowcost-traveling.com",
  // i18n support
  supportedLocales: ["cs", "en"] as const,
  defaultLocale: "cs" as const,
} as const;

// ============================================================================
// EXTERNAL SERVICES & APIs
// ============================================================================

export const EXTERNAL_SERVICES = {
  // Analytics
  googleAnalytics: {
    trackingId: process.env.VITE_GA_TRACKING_ID,
    measurementId: process.env.VITE_GA_MEASUREMENT_ID,
  },

  // Ad Networks
  googleAdsense: {
    clientId: process.env.VITE_ADSENSE_CLIENT_ID,
  },

  // Affiliate Partners
  skyscanner: {
    baseUrl: "https://www.skyscanner.com",
    affiliateId: process.env.VITE_SKYSCANNER_AFFILIATE_ID,
  },

  booking: {
    baseUrl: "https://www.booking.com",
    affiliateId: process.env.VITE_BOOKING_AFFILIATE_ID,
  },

  // Strapi CMS
  strapi: {
    url: process.env.VITE_STRAPI_URL || "http://localhost:1337",
    apiToken: process.env.VITE_STRAPI_API_TOKEN,
    apiUrl: `${process.env.VITE_STRAPI_URL || "http://localhost:1337"}/api`,
  },

  // Book (sales page + sell on site)
  book: {
    buyUrl: process.env.VITE_BOOK_BUY_URL || "",
    ebookPdfUrl: process.env.VITE_EBOOK_PDF_URL || "",
    /** Display price e.g. "299 Kč" or "€9.99" – shown next to Buy button */
    price: process.env.VITE_BOOK_PRICE || "",
    /**
     * Whether to show book-related UI (nav, homepage section, full book page).
     * Controlled explicitly via VITE_BOOK_AVAILABLE so you can prepare env vars
     * (price, URLs, Comgate integration) without publishing the book yet.
     */
    available: process.env.VITE_BOOK_AVAILABLE === "true",
  },
} as const;

// ============================================================================
// FEATURE FLAGS & LIMITS
// ============================================================================

export const FEATURE_FLAGS = {
  enableAnalytics: process.env.VITE_ENABLE_ANALYTICS === "true",
  enableAds: process.env.VITE_ENABLE_ADS === "true",
  enableDebugTools: process.env.NODE_ENV === "development",
  enableAnalyticsDebugger: process.env.VITE_SHOW_ANALYTICS_DEBUGGER === "true",
} as const;

export const LIMITS = {
  // Content limits
  maxArticlesPerPage: 12,
  maxDestinationsPerPage: 24,
  maxRelatedArticles: 6,
  maxSearchResults: 50,

  // Performance limits
  scrollThrottleMs: 100,
  analyticsBatchSize: 10,
  cacheMaxAge: 300, // 5 minutes

  // UI limits
  maxBreadcrumbs: 5,
  maxTagsPerArticle: 8,
  maxPlacesPerArticle: 10,
} as const;

// ============================================================================
// ANALYTICS CONFIGURATION
// ============================================================================

export const ANALYTICS_CONFIG = {
  provider: process.env.VITE_ANALYTICS_PROVIDER || "none", // 'google-analytics' | 'plausible' | 'none'
  requireConsent: true,
  anonymizeIp: true,
  respectDoNotTrack: true,

  // Tracking settings
  trackPageViews: true,
  trackScrollDepth: true,
  trackCustomEvents: true,

  // Scroll depth milestones
  scrollMilestones: [25, 50, 75, 90, 100],

  // Performance tracking
  enableCoreWebVitals: true,
  enableCustomMetrics: true,
} as const;

// ============================================================================
// MONETIZATION CONFIGURATION
// ============================================================================

export const MONETIZATION_CONFIG = {
  provider: process.env.VITE_AD_PROVIDER || "none", // 'adsense' | 'none'
  requireConsent: false, // Ads can be shown without analytics consent

  slots: {
    "article-top": "article-top-banner",
    "article-end": "article-end-banner",
    sidebar: "destination-sidebar",
  },

  affiliate: {
    enabled: true,
    commission: 0.08, // 8% commission
    cookieDays: 30,
  },
} as const;

// ============================================================================
// CONTENT CONFIGURATION
// ============================================================================

export const CONTENT_CONFIG = {
  // Supported languages
  languages: ["en"] as const,

  // Article types
  articleTypes: [
    "destination-guide",
    "place-guide",
    "practical-info",
    "itinerary",
    "list",
  ] as const,

  // Destination types
  destinationTypes: ["country", "region", "city"] as const,

  // Currency display
  defaultCurrency: "USD",
  supportedCurrencies: ["USD", "EUR", "GBP", "CAD", "AUD"] as const,
} as const;

// ============================================================================
// SEO CONFIGURATION
// ============================================================================

export const SEO_CONFIG = {
  // Default meta tags
  defaultTitle: SITE_CONFIG.name,
  titleTemplate: `%s | ${SITE_CONFIG.name}`,
  defaultDescription: SITE_CONFIG.description,

  // Open Graph
  ogType: "website",
  ogImageWidth: 1200,
  ogImageHeight: 630,

  // Twitter Card
  twitterCard: "summary_large_image",

  // Structured Data
  organization: {
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/images/logo.png`,
    sameAs: [
      `https://twitter.com/${SITE_CONFIG.twitterHandle.replace("@", "")}`,
    ],
  },

  // Sitemap
  sitemap: {
    changefreq: "weekly" as const,
    priority: {
      homepage: 1.0,
      destinations: 0.9,
      articles: 0.8,
      static: 0.6,
    },
  },
} as const;

// ============================================================================
// UI CONFIGURATION
// ============================================================================

export const UI_CONFIG = {
  // Breakpoints (Tailwind CSS)
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },

  // Animation durations
  animations: {
    fast: 150,
    normal: 300,
    slow: 500,
  },

  // Z-index layers
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },

  // Color scheme
  theme: {
    primary: "#2563eb", // blue-600
    secondary: "#64748b", // slate-500
    accent: "#f59e0b", // amber-500
    success: "#10b981", // emerald-500
    warning: "#f59e0b", // amber-500
    error: "#ef4444", // red-500
  },
} as const;

// ============================================================================
// DEVELOPMENT CONFIGURATION
// ============================================================================

export const DEV_CONFIG = {
  // Mock data
  enableMockData: process.env.VITE_ENABLE_MOCK_DATA === "true",

  // Logging
  enableConsoleLogging: process.env.NODE_ENV === "development",
  logLevel: process.env.VITE_LOG_LEVEL || "info",

  // Performance monitoring
  enablePerformanceMonitoring: process.env.NODE_ENV === "development",

  // Hot reload
  enableFastRefresh: true,
} as const;

// ============================================================================
// DEPLOYMENT CONFIGURATION
// ============================================================================

export const DEPLOYMENT_CONFIG = {
  // Vercel-specific
  vercel: {
    functions: {
      maxDuration: 30, // seconds
      memory: 1024, // MB
    },
    regions: ["fra1"], // Frankfurt for EU users
  },

  // CDN
  cdn: {
    url: process.env.VITE_CDN_URL,
    images: `${process.env.VITE_CDN_URL}/images`,
    assets: `${process.env.VITE_CDN_URL}/assets`,
  },

  // Caching
  cache: {
    static: {
      maxAge: 31536000, // 1 year
      immutable: true,
    },
    dynamic: {
      maxAge: 300, // 5 minutes
      staleWhileRevalidate: 86400, // 24 hours
    },
  },
} as const;

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

export const VALIDATION_RULES = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 254,
  },

  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
  },

  url: {
    pattern: /^https?:\/\/.+/,
    maxLength: 2048,
  },

  slug: {
    pattern: /^[a-z0-9-]+$/,
    maxLength: 100,
  },
} as const;

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  generic: "Something went wrong. Please try again.",
  network: "Network error. Please check your connection.",
  validation: "Please check your input and try again.",
  notFound: "The requested resource was not found.",
  unauthorized: "You are not authorized to perform this action.",
  forbidden: "Access to this resource is forbidden.",
  server: "Server error. Please try again later.",
} as const;

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

export const SUCCESS_MESSAGES = {
  saved: "Changes saved successfully.",
  sent: "Message sent successfully.",
  subscribed: "Successfully subscribed to newsletter.",
  consentGranted: "Analytics consent granted.",
  consentDenied: "Analytics consent denied.",
} as const;
