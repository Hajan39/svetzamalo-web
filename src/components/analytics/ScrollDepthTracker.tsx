import { useEffect, useRef, useCallback } from 'react'
import { useAnalytics } from './AnalyticsProvider'
import { useRouterState } from '@tanstack/react-router'

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

/**
 * Scroll Depth Tracking Component
 *
 * Tracks how far users scroll down pages for engagement analytics.
 * Privacy-compliant and performance-optimized.
 */

interface ScrollDepthTrackerProps {
  /** Milestones to track (percentages) */
  milestones?: number[]
  /** Throttle scroll events (ms) */
  throttleMs?: number
  /** Enable debug logging */
  debug?: boolean
}

/**
 * Scroll Depth Tracker Component
 *
 * Automatically tracks scroll depth milestones and maximum scroll depth.
 * Respects user privacy and analytics consent.
 */
export function ScrollDepthTracker({
  milestones = [25, 50, 75, 90, 100],
  throttleMs = 100,
  debug = false
}: ScrollDepthTrackerProps) {
  const { trackScrollDepth, isTrackingEnabled } = useAnalytics()

  // Don't render anything on the server
  if (!isBrowser) {
    return null
  }
  const routerState = useRouterState()

  const scrollDataRef = useRef({
    maxDepth: 0,
    milestonesReached: new Set<number>(),
    lastTrackedDepth: 0,
    lastTrackTime: 0,
  })

  // Throttled scroll handler
  const handleScroll = useCallback(() => {
    if (!isTrackingEnabled('trackScrollDepth')) return

    const now = Date.now()
    if (now - scrollDataRef.current.lastTrackTime < throttleMs) return

    const scrollTop = window.scrollY
    const documentHeight = document.documentElement.scrollHeight
    const windowHeight = window.innerHeight
    const scrollableHeight = documentHeight - windowHeight

    if (scrollableHeight <= 0) return // No scrollable content

    const currentDepth = Math.round((scrollTop / scrollableHeight) * 100)
    const clampedDepth = Math.min(100, Math.max(0, currentDepth))

    // Update max depth
    scrollDataRef.current.maxDepth = Math.max(scrollDataRef.current.maxDepth, clampedDepth)

    // Check for milestone achievements
    const newMilestones = milestones.filter(
      milestone => clampedDepth >= milestone && !scrollDataRef.current.milestonesReached.has(milestone)
    )

    // Track new milestones
    newMilestones.forEach(milestone => {
      scrollDataRef.current.milestonesReached.add(milestone)

      const scrollDepthData = {
        page: routerState.location.pathname,
        depth: milestone,
        maxDepth: scrollDataRef.current.maxDepth,
        timestamp: now,
      }

      trackScrollDepth(scrollDepthData)

      if (debug) {
        console.log(`[ScrollDepth] Milestone reached: ${milestone}%`, scrollDepthData)
      }
    })

    // Track significant depth changes (every 10% or so)
    if (Math.abs(clampedDepth - scrollDataRef.current.lastTrackedDepth) >= 10) {
      scrollDataRef.current.lastTrackedDepth = clampedDepth
      scrollDataRef.current.lastTrackTime = now

      const scrollDepthData = {
        page: routerState.location.pathname,
        depth: clampedDepth,
        maxDepth: scrollDataRef.current.maxDepth,
        timestamp: now,
      }

      trackScrollDepth(scrollDepthData)

      if (debug) {
        console.log(`[ScrollDepth] Depth update: ${clampedDepth}%`, scrollDepthData)
      }
    }
  }, [trackScrollDepth, isTrackingEnabled, milestones, throttleMs, routerState.location.pathname, debug])

  // Reset tracking data when route changes
  useEffect(() => {
    scrollDataRef.current = {
      maxDepth: 0,
      milestonesReached: new Set<number>(),
      lastTrackedDepth: 0,
      lastTrackTime: 0,
    }

    if (debug) {
      console.log('[ScrollDepth] Reset for new page:', routerState.location.pathname)
    }
  }, [routerState.location.pathname, debug])

  // Set up scroll listener
  useEffect(() => {
    if (!isTrackingEnabled('trackScrollDepth')) return

    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Initial scroll check (in case user starts scrolled)
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll, isTrackingEnabled])

  // Track final scroll depth when user leaves page
  useEffect(() => {
    if (!isTrackingEnabled('trackScrollDepth')) return

    const handleBeforeUnload = () => {
      if (scrollDataRef.current.maxDepth > 0) {
        const finalScrollData = {
          page: routerState.location.pathname,
          depth: scrollDataRef.current.maxDepth,
          maxDepth: scrollDataRef.current.maxDepth,
          timestamp: Date.now(),
        }

        trackScrollDepth(finalScrollData)

        if (debug) {
          console.log('[ScrollDepth] Final depth on page leave:', finalScrollData)
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [trackScrollDepth, isTrackingEnabled, routerState.location.pathname, debug])

  // This component doesn't render anything visible
  return null
}

/**
 * Hook for programmatic scroll depth tracking
 */
export function useScrollDepthTracking() {
  const { trackScrollDepth, isTrackingEnabled } = useAnalytics()

  const trackScrollDepthManually = useCallback((depth: number) => {
    if (!isTrackingEnabled('trackScrollDepth')) return

    const scrollDepthData = {
      page: window.location.pathname,
      depth: Math.min(100, Math.max(0, depth)),
      maxDepth: depth,
      timestamp: Date.now(),
    }

    trackScrollDepth(scrollDepthData)
  }, [trackScrollDepth, isTrackingEnabled])

  return {
    trackScrollDepth: trackScrollDepthManually,
    isEnabled: isTrackingEnabled('trackScrollDepth'),
  }
}

/**
 * Utility function to get current scroll depth
 */
export function getCurrentScrollDepth(): number {
  if (!isBrowser) return 0

  const scrollTop = window.scrollY
  const documentHeight = document.documentElement.scrollHeight
  const windowHeight = window.innerHeight
  const scrollableHeight = documentHeight - windowHeight

  if (scrollableHeight <= 0) return 0

  return Math.round((scrollTop / scrollableHeight) * 100)
}

/**
 * Utility function to check if element is in viewport
 */
export function isElementInViewport(element: Element): boolean {
  if (!isBrowser) return false

  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

/**
 * Future Enhancement: Element Visibility Tracking
 *
 * Track when specific elements (like images, videos, ads) come into view
 */
export function useElementVisibilityTracking() {
  const { trackEvent, isTrackingEnabled } = useAnalytics()

  const trackElementVisibility = useCallback((
    elementId: string,
    elementType: 'image' | 'video' | 'ad' | 'content'
  ) => {
    if (!isTrackingEnabled('trackCustomEvents')) return

    const element = document.getElementById(elementId)
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackEvent({
              name: 'element_visible',
              properties: {
                element_id: elementId,
                element_type: elementType,
                visibility_ratio: entry.intersectionRatio,
                page: window.location.pathname,
              },
            })
            observer.disconnect() // Only track once
          }
        })
      },
      { threshold: 0.5 } // 50% visible
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [trackEvent, isTrackingEnabled])

  return { trackElementVisibility }
}