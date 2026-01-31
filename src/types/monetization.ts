/**
 * Monetization types for non-intrusive affiliate and ad placements
 */

export type MonetizationType =
	| "affiliate-flight"
	| "affiliate-hotel"
	| "affiliate-tour"
	| "lead-magnet"
	| "newsletter";

export type AffiliatePartner =
	| "skyscanner"
	| "booking"
	| "hostelworld"
	| "getyourguide"
	| "viator"
	| "airbnb";

export type AffiliateNetwork =
	| "direct"
	| "cj" // Commission Junction
	| "awin"
	| "tradedoubler";

export interface AffiliateConfig {
	partner: AffiliatePartner;
	network?: AffiliateNetwork;
	headline: string;
	description: string;
	ctaText: string;
	link: string;
	trackingId?: string;
	// CJ specific parameters
	cjPid?: string; // Publisher ID
	cjAid?: string; // Advertiser ID
}

export interface LeadMagnetConfig {
	title: string;
	description: string;
	benefits: string[];
	ctaText: string;
	downloadUrl?: string;
}

export interface NewsletterConfig {
	headline: string;
	description: string;
	ctaText: string;
}

export interface MonetizationSlot {
	id: string;
	type: MonetizationType;
	position: "after-section" | "end-of-article" | "sidebar";
	config: AffiliateConfig | LeadMagnetConfig | NewsletterConfig;
}
