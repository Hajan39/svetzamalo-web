import { useEffect, useRef } from 'react'
import { useAnalytics } from './AnalyticsProvider'

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof performance !== 'undefined'

/**
 * Performance Tracking Component
 *
 * Monitors and tracks page performance metrics like:
 * - Page load times
 * - First Contentful Paint (FCP)
 * - Largest Contentful Paint (LCP)
 * - First Input Delay (FID)
 * - Cumulative Layout Shift (CLS)
 *
 * Privacy-compliant and uses Performance Observer API.
 */

interface PerformanceMetrics {
  page: string
  timestamp: number
  // Core Web Vitals
  fcp?: number // First Contentful Paint
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay
  cls?: number // Cumulative Layout Shift
  // Additional metrics
  ttfb?: number // Time to First Byte
  domContentLoaded?: number
  loadComplete?: number
  // Custom metrics
  timeToInteractive?: number
}

/**
 * Performance Tracker Component
 *
 * Automatically tracks performance metrics using the Performance Observer API.
 * Reports metrics to analytics system when available.
 */
export function PerformanceTracker() {
  const { trackEvent, isTrackingEnabled } = useAnalytics()
  const metricsRef = useRef<Partial<PerformanceMetrics>>({
    page: isBrowser ? window.location.pathname : '',
    timestamp: Date.now(),
  })
  const observersRef = useRef<PerformanceObserver[]>([])

  // Don't render anything on the server
  if (!isBrowser) {
    return null
  }

  // Track navigation timing
  useEffect(() => {
    if (!isBrowser || !isTrackingEnabled('trackCustomEvents')) return

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

    if (navigation) {
      metricsRef.current = {
        ...metricsRef.current,
        ttfb: navigation.responseStart - navigation.requestStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        timeToInteractive: navigation.domInteractive - navigation.fetchStart,
      }
    }
  }, [isTrackingEnabled])

  // Track Core Web Vitals
  useEffect(() => {
    if (!isBrowser || !isTrackingEnabled('trackCustomEvents') || !('PerformanceObserver' in window)) return

    // First Contentful Paint
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as PerformancePaintTiming

        metricsRef.current.fcp = lastEntry.startTime

        trackEvent({
          name: 'web_vitals',
          properties: {
            metric: 'FCP',
            value: lastEntry.startTime,
            page: metricsRef.current.page,
          },
        })
      })
      fcpObserver.observe({ entryTypes: ['paint'] })
      observersRef.current.push(fcpObserver)
    } catch (error) {
      console.warn('[PerformanceTracker] FCP tracking not supported:', error)
    }

    // Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as LargestContentfulPaint

        metricsRef.current.lcp = lastEntry.startTime

        trackEvent({
          name: 'web_vitals',
          properties: {
            metric: 'LCP',
            value: lastEntry.startTime,
            element: lastEntry.element?.tagName,
            page: metricsRef.current.page,
          },
        })
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      observersRef.current.push(lcpObserver)
    } catch (error) {
      console.warn('[PerformanceTracker] LCP tracking not supported:', error)
    }

    // First Input Delay
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          const fidEntry = entry as any // FID entry type

          metricsRef.current.fid = fidEntry.processingStart - entry.startTime

          trackEvent({
            name: 'web_vitals',
            properties: {
              metric: 'FID',
              value: fidEntry.processingStart - entry.startTime,
              input_type: entry.name,
              page: metricsRef.current.page,
            },
          })
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })
      observersRef.current.push(fidObserver)
    } catch (error) {
      console.warn('[PerformanceTracker] FID tracking not supported:', error)
    }

    // Cumulative Layout Shift
    try {
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0
        const entries = list.getEntries() as any[] // LayoutShift[]

        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })

        metricsRef.current.cls = clsValue

        trackEvent({
          name: 'web_vitals',
          properties: {
            metric: 'CLS',
            value: clsValue,
            page: metricsRef.current.page,
          },
        })
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
      observersRef.current.push(clsObserver)
    } catch (error) {
      console.warn('[PerformanceTracker] CLS tracking not supported:', error)
    }

    // Cleanup observers on unmount
    return () => {
      observersRef.current.forEach(observer => observer.disconnect())
      observersRef.current = []
    }
  }, [trackEvent, isTrackingEnabled])

  // Send final metrics when page unloads
  useEffect(() => {
    if (!isBrowser || !isTrackingEnabled('trackCustomEvents')) return

    const handleBeforeUnload = () => {
      if (Object.keys(metricsRef.current).length > 2) { // More than just page and timestamp
        trackEvent({
          name: 'page_performance',
          properties: metricsRef.current,
        })
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [trackEvent, isTrackingEnabled])

  // Reset metrics on page change
  useEffect(() => {
    if (!isBrowser) return

    metricsRef.current = {
      page: window.location.pathname,
      timestamp: Date.now(),
    }
  }, [])

  // This component doesn't render anything
  return null
}

/**
 * Hook for custom performance tracking
 */
export function usePerformanceTracking() {
  const { trackEvent, isTrackingEnabled } = useAnalytics()

  const trackCustomMetric = (name: string, value: number, properties?: Record<string, any>) => {
    if (!isTrackingEnabled('trackCustomEvents')) return

    trackEvent({
      name: 'custom_performance_metric',
      properties: {
        metric_name: name,
        value,
        page: window.location.pathname,
        ...properties,
      },
    })
  }

  const startTiming = (name: string) => {
    const startTime = performance.now()
    return {
      end: () => {
        const duration = performance.now() - startTime
        trackCustomMetric(name, duration, { type: 'timing' })
        return duration
      }
    }
  }

  return {
    trackCustomMetric,
    startTiming,
    isEnabled: isTrackingEnabled('trackCustomEvents'),
  }
}

/**
 * Utility function to measure function execution time
 */
export function measureExecutionTime<T>(
  fn: () => T,
  metricName: string,
  properties?: Record<string, any>
): T {
  const start = performance.now()
  const result = fn()
  const duration = performance.now() - start

  // Use analytics if available, otherwise console.log
  try {
    const { trackCustomMetric } = usePerformanceTracking()
    trackCustomMetric(metricName, duration, properties)
  } catch {
    console.log(`[Performance] ${metricName}: ${duration.toFixed(2)}ms`, properties)
  }

  return result
}

/**
 * Utility function to measure async function execution time
 */
export async function measureAsyncExecutionTime<T>(
  fn: () => Promise<T>,
  metricName: string,
  properties?: Record<string, any>
): Promise<T> {
  const start = performance.now()
  const result = await fn()
  const duration = performance.now() - start

  try {
    const { trackCustomMetric } = usePerformanceTracking()
    trackCustomMetric(metricName, duration, properties)
  } catch {
    console.log(`[Performance] ${metricName}: ${duration.toFixed(2)}ms`, properties)
  }

  return result
}

/**
 * Component for measuring render performance
 */
export function RenderPerformanceTracker({
  name,
  children
}: {
  name: string
  children: React.ReactNode
}) {
  const { startTiming } = usePerformanceTracking()

  useEffect(() => {
    const timer = startTiming(`render_${name}`)
    return () => {
      timer.end()
    }
  })

  return <>{children}</>
}

/**
 * Web Vitals Reporting Utility
 *
 * Can be used to report Core Web Vitals to external services
 * like Google's Web Vitals library or custom endpoints.
 */
export function reportWebVitals(metric: any) {
  // Placeholder for Web Vitals reporting
  // Can be integrated with web-vitals library:
  // https://github.com/GoogleChrome/web-vitals

  console.log('[WebVitals]', metric)

  // Future implementation:
  // - Send to analytics provider
  // - Send to monitoring service
  // - Store locally for debugging
}