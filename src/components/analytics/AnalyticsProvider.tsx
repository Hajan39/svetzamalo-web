import { useRouterState } from "@tanstack/react-router";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
} from "react";
import { ANALYTICS_CONFIG, EXTERNAL_SERVICES } from "@/lib/constants";

/**
 * Analytics & Performance Tracking System
 *
 * Privacy-first, GDPR-compliant analytics abstraction layer.
 * Supports page views, scroll depth, and custom events.
 * Ready for integration with any analytics provider (GA4, Plausible, etc.).
 */

export type AnalyticsProvider =
	| "google-analytics"
	| "plausible"
	| "custom"
	| "none";

export type ConsentStatus = "unknown" | "granted" | "denied";

export interface AnalyticsConfig {
	provider: AnalyticsProvider;
	isEnabled: boolean;
	consentStatus: ConsentStatus;
	trackingId?: string; // For Google Analytics, etc.
	domain?: string; // For Plausible, etc.
	customEndpoint?: string; // For custom analytics
	trackPageViews: boolean;
	trackScrollDepth: boolean;
	trackCustomEvents: boolean;
	// GDPR compliance settings
	requireConsent: boolean;
	anonymizeIp: boolean;
	respectDoNotTrack: boolean;
}

export interface AnalyticsEvent {
	name: string;
	properties?: Record<string, unknown>;
	timestamp?: number;
}

export interface PageViewData {
	page: string;
	title: string;
	referrer?: string;
	timestamp: number;
}

export interface ScrollDepthData {
	page: string;
	depth: number; // Percentage 0-100
	maxDepth: number; // Maximum scroll depth reached
	timestamp: number;
}

interface AnalyticsContextType {
	config: AnalyticsConfig;
	consentStatus: ConsentStatus;
	// Core tracking methods
	trackPageView: (data: PageViewData) => void;
	trackEvent: (event: AnalyticsEvent) => void;
	trackScrollDepth: (data: ScrollDepthData) => void;
	// Privacy & consent methods
	grantConsent: () => void;
	denyConsent: () => void;
	resetConsent: () => void;
	// Utility methods
	canTrack: () => boolean;
	isTrackingEnabled: (
		feature: keyof Pick<
			AnalyticsConfig,
			"trackPageViews" | "trackScrollDepth" | "trackCustomEvents"
		>,
	) => boolean;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

/**
 * Default analytics configuration
 * Environment-based and privacy-focused by default
 */
const DEFAULT_CONFIG: AnalyticsConfig = {
	provider: "none", // Change to 'google-analytics' or 'plausible' when ready
	isEnabled: false, // Only enable when vendor is integrated
	consentStatus: "unknown",
	trackPageViews: true,
	trackScrollDepth: true,
	trackCustomEvents: true,
	// GDPR compliance - strict by default
	requireConsent: true,
	anonymizeIp: true,
	respectDoNotTrack: true,
};

/**
 * Analytics Provider Component
 *
 * Wraps the app and provides analytics functionality.
 * Automatically tracks page views and manages consent.
 */
export function AnalyticsProvider({
	children,
	config: overrideConfig,
}: {
	children: ReactNode;
	config?: Partial<AnalyticsConfig>;
}) {
	const config = { ...DEFAULT_CONFIG, ...overrideConfig };

	// Get current route for automatic page view tracking
	const routerState = useRouterState();

	// Check if tracking is allowed based on privacy settings
	const canTrack = useCallback(() => {
		// Respect Do Not Track header
		if (config.respectDoNotTrack && navigator.doNotTrack === "1") {
			return false;
		}

		// Check consent status if required
		if (config.requireConsent && config.consentStatus !== "granted") {
			return false;
		}

		return config.isEnabled;
	}, [
		config.respectDoNotTrack,
		config.requireConsent,
		config.consentStatus,
		config.isEnabled,
	]);

	// Check if specific tracking feature is enabled
	// biome-ignore lint/correctness/useExhaustiveDependencies: dynamic config[feature] access covers all trackX props
	const isTrackingEnabled = useCallback(
		(
			feature: keyof Pick<
				AnalyticsConfig,
				"trackPageViews" | "trackScrollDepth" | "trackCustomEvents"
			>,
		) => {
			return config[feature] && canTrack();
		},
		[
			config.trackPageViews,
			config.trackScrollDepth,
			config.trackCustomEvents,
			canTrack,
		],
	);

	// Core tracking methods (placeholder implementations)
	const trackPageView = useCallback(
		(data: PageViewData) => {
			if (!isTrackingEnabled("trackPageViews")) return;

			// Placeholder - replace with actual provider implementation
			console.log("[Analytics] Page view:", data);

			// Future implementation:
			// if (config.provider === 'google-analytics') {
			//   gtag('event', 'page_view', data)
			// } else if (config.provider === 'plausible') {
			//   plausible('pageview')
			// }
		},
		[isTrackingEnabled],
	);

	const trackEvent = useCallback(
		(event: AnalyticsEvent) => {
			if (!isTrackingEnabled("trackCustomEvents")) return;

			console.log("[Analytics] Event:", event);

			// Future implementation:
			// if (config.provider === 'google-analytics') {
			//   gtag('event', event.name, event.properties)
			// }
		},
		[isTrackingEnabled],
	);

	const trackScrollDepth = useCallback(
		(data: ScrollDepthData) => {
			if (!isTrackingEnabled("trackScrollDepth")) return;

			console.log("[Analytics] Scroll depth:", data);

			// Future implementation:
			// Custom scroll depth tracking logic
		},
		[isTrackingEnabled],
	);

	// Consent management
	const grantConsent = useCallback(() => {
		// Store consent in localStorage for GDPR compliance
		localStorage.setItem("analytics-consent", "granted");
		// Update config (this would trigger a re-render)
		console.log("[Analytics] Consent granted");
	}, []);

	const denyConsent = useCallback(() => {
		localStorage.setItem("analytics-consent", "denied");
		console.log("[Analytics] Consent denied");
	}, []);

	const resetConsent = useCallback(() => {
		localStorage.removeItem("analytics-consent");
		console.log("[Analytics] Consent reset");
	}, []);

	// Load consent status from localStorage on mount
	useEffect(() => {
		const storedConsent = localStorage.getItem(
			"analytics-consent",
		) as ConsentStatus | null;
		if (storedConsent && ["granted", "denied"].includes(storedConsent)) {
			// Update config with stored consent
			console.log("[Analytics] Loaded consent status:", storedConsent);
		}
	}, []);

	// Automatic page view tracking
	useEffect(() => {
		if (!routerState.location.pathname) return;

		const pageViewData: PageViewData = {
			page: routerState.location.pathname,
			title: document.title,
			referrer: document.referrer || undefined,
			timestamp: Date.now(),
		};

		trackPageView(pageViewData);
	}, [routerState.location.pathname, trackPageView]);

	// Initialize analytics provider when component mounts
	useEffect(() => {
		if (!canTrack()) return;

		// Placeholder for provider initialization
		console.log("[Analytics] Initializing provider:", config.provider);

		// Initialize analytics providers
		if (config.provider === "google-analytics" && config.trackingId) {
			initializeGoogleAnalytics(config.trackingId);
		} else if (config.provider === "plausible" && config.domain) {
			initializePlausible(config.domain);
		}
	}, [canTrack, config.provider, config.trackingId, config.domain]);

	const contextValue: AnalyticsContextType = {
		config,
		consentStatus: config.consentStatus,
		trackPageView,
		trackEvent,
		trackScrollDepth,
		grantConsent,
		denyConsent,
		resetConsent,
		canTrack,
		isTrackingEnabled,
	};

	return (
		<AnalyticsContext.Provider value={contextValue}>
			{children}
		</AnalyticsContext.Provider>
	);
}

/**
 * Hook to access analytics functionality
 */
export function useAnalytics(): AnalyticsContextType {
	const context = useContext(AnalyticsContext);
	if (!context) {
		throw new Error("useAnalytics must be used within an AnalyticsProvider");
	}
	return context;
}

/**
 * Hook for conditional analytics rendering/tracking
 */
export function useAnalyticsConsent() {
	const { consentStatus, grantConsent, denyConsent, resetConsent, canTrack } =
		useAnalytics();

	return {
		consentStatus,
		canTrack: canTrack(),
		grantConsent,
		denyConsent,
		resetConsent,
	};
}

/**
 * Environment-based analytics configuration
 */
export function getAnalyticsConfig(): AnalyticsConfig {
	const isProduction = process.env.NODE_ENV === "production";
	const enableAnalytics = ANALYTICS_CONFIG.provider !== "none";

	return {
		...DEFAULT_CONFIG,
		...ANALYTICS_CONFIG,
		isEnabled:
			enableAnalytics &&
			(isProduction || ANALYTICS_CONFIG.provider === "google-analytics"),
		provider: ANALYTICS_CONFIG.provider,
		trackingId: EXTERNAL_SERVICES.googleAnalytics.trackingId,
		domain: EXTERNAL_SERVICES.plausible?.domain,
	};
}

/**
 * Future Analytics Provider Integrations
 * These functions will be implemented when integrating actual providers
 */

export function initializeGoogleAnalytics(trackingId: string) {
	// Load Google Analytics script
	const script = document.createElement("script");
	script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
	script.async = true;
	document.head.appendChild(script);

	// Initialize gtag
	type GTagFn = (...args: unknown[]) => void;
	interface WindowWithGtag extends Window {
		dataLayer: unknown[];
		gtag?: GTagFn;
	}
	const w = window as unknown as WindowWithGtag;
	w.dataLayer = w.dataLayer || [];
	const gtag: GTagFn = (...args: unknown[]) => {
		w.dataLayer.push(args);
	};
	gtag("js", new Date());
	gtag("config", trackingId, {
		anonymize_ip: true,
		allow_google_signals: false,
		allow_ad_features: false,
	});

	// Make gtag globally available
	w.gtag = gtag;
}

export function initializePlausible(domain: string) {
	const script = document.createElement("script");
	script.src = "https://plausible.io/js/script.js";
	script.defer = true;
	script.setAttribute("data-domain", domain);
	document.head.appendChild(script);
}
