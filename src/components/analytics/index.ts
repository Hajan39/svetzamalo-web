export {
  AnalyticsProvider,
  useAnalytics,
  useAnalyticsConsent,
  getAnalyticsConfig,
  initializeGoogleAnalytics,
  initializePlausible,
} from './AnalyticsProvider'

export { ScrollDepthTracker, useScrollDepthTracking, useElementVisibilityTracking } from './ScrollDepthTracker'

export {
  ConsentBanner,
  useConsentBanner,
  PrivacySettingsModal,
  hasDoNotTrack,
  anonymizeIp,
  generatePrivacyId,
  shouldEnableAnalytics,
} from './ConsentBanner'

export {
  PerformanceTracker,
  usePerformanceTracking,
  measureExecutionTime,
  measureAsyncExecutionTime,
  RenderPerformanceTracker,
  reportWebVitals,
} from './PerformanceTracker'

export { AnalyticsDebugger, ConditionalAnalyticsDebugger, useAnalyticsTesting } from './AnalyticsDebugger'