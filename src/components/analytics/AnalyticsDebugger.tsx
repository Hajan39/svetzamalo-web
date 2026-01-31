import { useState, useEffect } from 'react'
import { useAnalytics, useAnalyticsConsent } from './AnalyticsProvider'
import { getCurrentScrollDepth } from './ScrollDepthTracker'

/**
 * Analytics Debugger Component
 *
 * Development-only component for testing and debugging analytics.
 * Shows real-time analytics events, consent status, and tracking state.
 * Should only be used in development mode.
 */

interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp: number
}

/**
 * Analytics Debugger Panel
 *
 * Shows live analytics data for development and testing.
 * Includes controls for testing different analytics features.
 */
export function AnalyticsDebugger() {
  const { config, trackEvent, trackScrollDepth, canTrack, isTrackingEnabled } = useAnalytics()
  const { consentStatus, grantConsent, denyConsent, resetConsent } = useAnalyticsConsent()

  const [events, setEvents] = useState<AnalyticsEvent[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [scrollDepth, setScrollDepth] = useState(0)

  // Mock analytics calls to capture events for debugging
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    // Override console.log to capture analytics events
    const originalLog = console.log
    console.log = (...args) => {
      originalLog.apply(console, args)

      // Check if this is an analytics event
      if (args[0]?.includes?.('[Analytics]')) {
        const eventName = args[1] || 'unknown'
        const properties = args[2] || {}

        setEvents(prev => [...prev.slice(-9), { // Keep last 10 events
          name: eventName,
          properties,
          timestamp: Date.now(),
        }])
      }
    }

    return () => {
      console.log = originalLog
    }
  }, [])

  // Update scroll depth display
  useEffect(() => {
    const updateScrollDepth = () => setScrollDepth(getCurrentScrollDepth())
    updateScrollDepth()

    window.addEventListener('scroll', updateScrollDepth, { passive: true })
    return () => window.removeEventListener('scroll', updateScrollDepth)
  }, [])

  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary-hover transition-colors"
        title="Toggle Analytics Debugger"
      >
        📊
      </button>

      {/* Debug Panel */}
      {isVisible && (
        <div className="fixed bottom-20 right-4 z-40 w-96 max-h-96 bg-background border border-border rounded-lg shadow-xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Analytics Debugger</h3>
            <div className="text-xs text-foreground-secondary mt-1">
              Track: {canTrack() ? '✅' : '❌'} | Consent: {consentStatus}
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {/* Status Section */}
            <div className="p-3 border-b border-border bg-background-secondary">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>Provider: {config.provider}</div>
                <div>Enabled: {config.isEnabled ? '✅' : '❌'}</div>
                <div>Page Views: {isTrackingEnabled('trackPageViews') ? '✅' : '❌'}</div>
                <div>Scroll Depth: {isTrackingEnabled('trackScrollDepth') ? '✅' : '❌'}</div>
                <div>Events: {isTrackingEnabled('trackCustomEvents') ? '✅' : '❌'}</div>
                <div>Scroll: {scrollDepth}%</div>
              </div>
            </div>

            {/* Consent Controls */}
            <div className="p-3 border-b border-border">
              <div className="text-xs font-medium mb-2">Consent Controls:</div>
              <div className="flex gap-1">
                <button
                  onClick={grantConsent}
                  className="px-2 py-1 bg-success text-success-foreground text-xs rounded hover:bg-success-hover transition-colors"
                  disabled={consentStatus === 'granted'}
                >
                  Grant
                </button>
                <button
                  onClick={denyConsent}
                  className="px-2 py-1 bg-danger text-danger-foreground text-xs rounded hover:bg-danger-hover transition-colors"
                  disabled={consentStatus === 'denied'}
                >
                  Deny
                </button>
                <button
                  onClick={resetConsent}
                  className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded hover:bg-secondary-hover transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Test Events */}
            <div className="p-3 border-b border-border">
              <div className="text-xs font-medium mb-2">Test Events:</div>
              <div className="flex gap-1 flex-wrap">
                <button
                  onClick={() => trackEvent({ name: 'test_event', properties: { source: 'debugger' } })}
                  className="px-2 py-1 bg-info text-info-foreground text-xs rounded hover:bg-info-hover transition-colors"
                >
                  Test Event
                </button>
                <button
                  onClick={() => trackScrollDepth({
                    page: window.location.pathname,
                    depth: scrollDepth,
                    maxDepth: scrollDepth,
                    timestamp: Date.now()
                  })}
                  className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded hover:bg-secondary-hover transition-colors"
                >
                  Test Scroll
                </button>
              </div>
            </div>

            {/* Recent Events */}
            <div className="p-3">
              <div className="text-xs font-medium mb-2">Recent Events:</div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {events.length === 0 ? (
                  <div className="text-xs text-foreground-muted">No events yet</div>
                ) : (
                  events.map((event, index) => (
                    <div key={index} className="text-xs bg-background-secondary p-2 rounded">
                      <div className="font-medium">{event.name}</div>
                      {event.properties && Object.keys(event.properties).length > 0 && (
                        <div className="text-foreground-muted mt-1">
                          {JSON.stringify(event.properties, null, 2)}
                        </div>
                      )}
                      <div className="text-foreground-muted mt-1">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/**
 * Hook for programmatic analytics testing
 */
export function useAnalyticsTesting() {
  const { trackEvent, trackScrollDepth, trackPageView } = useAnalytics()

  const testPageView = () => {
    trackPageView({
      page: '/test-page',
      title: 'Test Page',
      timestamp: Date.now(),
    })
  }

  const testEvent = () => {
    trackEvent({
      name: 'test_interaction',
      properties: {
        element: 'test_button',
        action: 'click',
        page: window.location.pathname,
      },
    })
  }

  const testScrollDepth = () => {
    trackScrollDepth({
      page: window.location.pathname,
      depth: Math.floor(Math.random() * 100),
      maxDepth: 85,
      timestamp: Date.now(),
    })
  }

  return {
    testPageView,
    testEvent,
    testScrollDepth,
  }
}

/**
 * Environment-based debugging
 *
 * Only show debugger in development with explicit flag
 */
export function ConditionalAnalyticsDebugger() {
  const showDebugger = process.env.NODE_ENV === 'development' &&
                      process.env.VITE_SHOW_ANALYTICS_DEBUGGER === 'true'

  if (!showDebugger) return null

  return <AnalyticsDebugger />
}