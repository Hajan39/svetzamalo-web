import { useState, useEffect } from "react";
import { useAnalyticsConsent } from "./AnalyticsProvider";
import { useTranslation } from "@/lib/i18n";

/**
 * GDPR Consent Banner Component
 *
 * Privacy-compliant consent management for analytics tracking.
 * Only shows when consent is required and not yet given.
 * Respects user privacy and provides clear opt-in/opt-out options.
 */

interface ConsentBannerProps {
	/** Position of the banner */
	position?: "bottom" | "top";
	/** Custom styling */
	className?: string;
	/** Show debug information */
	debug?: boolean;
}

/**
 * Consent Banner Component
 *
 * Displays a GDPR-compliant consent banner for analytics tracking.
 * Provides clear options for users to grant or deny consent.
 */
export function ConsentBanner({
	position = "bottom",
	className = "",
	debug = false,
}: ConsentBannerProps) {
	const { consentStatus, grantConsent, denyConsent, canTrack } =
		useAnalyticsConsent();
	const { t } = useTranslation();
	const [isVisible, setIsVisible] = useState(false);

	// Check if banner should be shown
	useEffect(() => {
		const storedDismissed = localStorage.getItem("consent-banner-dismissed");
		const wasDismissed = storedDismissed === "true";

		// Show banner if:
		// 1. Consent is unknown (not granted or denied)
		// 2. Banner hasn't been permanently dismissed
		// 3. Analytics require consent
		const shouldShow = consentStatus === "unknown" && !wasDismissed;

		setIsVisible(shouldShow);

		if (debug) {
			console.log("[ConsentBanner] Status:", {
				consentStatus,
				wasDismissed,
				shouldShow,
			});
		}
	}, [consentStatus, debug]);

	// Handle consent acceptance
	const handleAccept = () => {
		grantConsent();
		setIsVisible(false);
		if (debug) {
			console.log("[ConsentBanner] Consent accepted");
		}
	};

	// Handle consent denial
	const handleDeny = () => {
		denyConsent();
		setIsVisible(false);
		if (debug) {
			console.log("[ConsentBanner] Consent denied");
		}
	};

	// Handle temporary dismissal (show again later)
	const handleDismiss = () => {
		setIsVisible(false);
		// Don't store dismissal - will show again on next visit
		if (debug) {
			console.log("[ConsentBanner] Banner dismissed temporarily");
		}
	};

	// Don't render if not visible
	if (!isVisible) return null;

	const bannerClasses = `
    fixed left-0 right-0 z-50 p-4 border-t border-border bg-background shadow-lg
    ${position === "top" ? "top-0 border-t-0 border-b" : "bottom-0"}
    ${className}
  `.trim();

	return (
		<div
			className={bannerClasses}
			role="dialog"
			aria-labelledby="consent-title"
			aria-describedby="consent-description"
			data-testid="consent-banner"
		>
			<div className="container-narrow">
				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
					{/* Content */}
					<div className="flex-1 min-w-0">
						<h2
							id="consent-title"
							className="text-lg font-semibold text-foreground mb-2"
						>
							{t("consent.title")}
						</h2>
						<p
							id="consent-description"
							className="text-sm text-foreground-secondary leading-relaxed"
						>
							{t("consent.description")}
						</p>

						{debug && (
							<div className="mt-2 text-xs text-foreground-muted">
								Debug: consentStatus={consentStatus}, canTrack={canTrack}
							</div>
						)}
					</div>

					{/* Actions */}
					<div className="flex flex-col sm:flex-row gap-2 shrink-0">
						<button
							onClick={handleAccept}
							className="px-6 py-2 bg-primary hover:bg-primary-hover text-primary-foreground font-medium rounded-lg transition-colors text-sm"
							data-testid="consent-accept"
						>
							{t("consent.accept")}
						</button>
						<button
							onClick={handleDeny}
							className="px-6 py-2 border border-border hover:border-primary text-foreground hover:text-primary font-medium rounded-lg transition-colors text-sm"
							data-testid="consent-deny"
						>
							{t("consent.decline")}
						</button>
						<button
							onClick={handleDismiss}
							className="px-4 py-2 text-foreground-muted hover:text-foreground text-sm underline"
							data-testid="consent-dismiss"
						>
							{t("consent.dismiss")}
						</button>
					</div>
				</div>

				{/* Footer links */}
				<div className="mt-4 pt-3 border-t border-border/50">
					<div className="flex flex-wrap gap-4 text-xs text-foreground-muted">
						<a
							href="/privacy"
							className="hover:text-primary transition-colors underline"
							target="_blank"
							rel="noopener noreferrer"
						>
							{t("consent.privacyPolicy")}
						</a>
						<a
							href="/cookies"
							className="hover:text-primary transition-colors underline"
							target="_blank"
							rel="noopener noreferrer"
						>
							{t("consent.cookiePolicy")}
						</a>
						<button
							onClick={() => {
								// Open privacy settings modal (future implementation)
								console.log("[ConsentBanner] Open privacy settings");
							}}
							className="hover:text-primary transition-colors underline"
						>
							Privacy Settings
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * Hook for managing consent banner visibility
 */
export function useConsentBanner() {
	const { consentStatus, resetConsent } = useAnalyticsConsent();

	const showConsentBanner = () => {
		// Force banner to show again
		localStorage.removeItem("consent-banner-dismissed");
		window.location.reload(); // Simple way to reset state
	};

	const resetAllConsent = () => {
		resetConsent();
		localStorage.removeItem("consent-banner-dismissed");
	};

	return {
		consentStatus,
		showConsentBanner,
		resetAllConsent,
	};
}

/**
 * Privacy Settings Modal Component (Future Implementation)
 *
 * A more detailed privacy settings interface that could be
 * triggered from the consent banner or a settings page.
 */
export function PrivacySettingsModal() {
	// Future implementation for granular privacy controls
	// - Analytics tracking preferences
	// - Cookie categories
	// - Data retention settings
	// - Export/delete data options

	return null; // Placeholder
}

/**
 * GDPR Compliance Utilities
 */

/**
 * Check if user has enabled Do Not Track
 */
export function hasDoNotTrack(): boolean {
	return (
		navigator.doNotTrack === "1" ||
		navigator.doNotTrack === "yes" ||
		(navigator as unknown as { doNotTrack?: string }).doNotTrack === "1"
	);
}

/**
 * Anonymize IP address for GDPR compliance
 */
export function anonymizeIp(ip: string): string {
	// Remove last octet of IPv4 or last 80 bits of IPv6
	if (ip.includes(".")) {
		// IPv4: 192.168.1.100 -> 192.168.1.0
		return `${ip.split(".").slice(0, 3).join(".")}.0`;
	} else if (ip.includes(":")) {
		// IPv6: anonymize last 80 bits (last 5 segments)
		const segments = ip.split(":");
		return `${segments.slice(0, Math.max(1, segments.length - 5)).join(":")}::`;
	}
	return ip;
}

/**
 * Generate a privacy-compliant user ID
 */
export function generatePrivacyId(): string {
	// Use crypto.randomUUID() for privacy-compliant unique IDs
	// This doesn't rely on device fingerprinting
	return crypto.randomUUID();
}

/**
 * Check if analytics should be enabled based on various privacy signals
 */
export function shouldEnableAnalytics(): boolean {
	// Check multiple privacy signals
	if (hasDoNotTrack()) return false;

	// Check for GDPR consent
	const consent = localStorage.getItem("analytics-consent");
	if (consent === "denied") return false;
	if (consent !== "granted") return false; // Require explicit consent

	// Check for CCPA/opt-out signals
	const ccpaOptOut = document.cookie.includes("ccpa-opt-out=true");
	if (ccpaOptOut) return false;

	return true;
}
