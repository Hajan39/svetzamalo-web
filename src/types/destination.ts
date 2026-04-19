import type { Image, SeoMetadata } from "./seo";

/**
 * Continent classification
 */
export type Continent =
	| "europe"
	| "asia"
	| "north-america"
	| "south-america"
	| "africa"
	| "oceania"
	| "caribbean";

/**
 * Destination type classification
 */
export type DestinationType = "country" | "region" | "city" | "microstate";

/**
 * Currency and budget information
 */
export interface Currency {
	code: string;
	name: string;
	symbol: string;
	exchangeRateToUsd: number;
	budgetPerDay: {
		budget: number;
		midRange: number;
		luxury: number;
	};
}

/**
 * Destination (Country/Region/City)
 */
export interface Destination {
	// Identity
	id: string;
	slug: string;
	name: string;

	// Classification
	type: DestinationType;
	parentId?: string;
	continent: Continent;

	// Display
	heroImage?: Image;
	flagEmoji?: string;

	// Practical info
	currency: Currency;
	languages: string[];
	timezone?: string;
	visaInfo?: string;
	bestTimeToVisit?: string;

	// SEO
	seo: SeoMetadata;

	/** HTML content (from Strapi intro blocks) – for destination detail page */
	introHtml?: string;

	/** Content language */
	locale?: "cs" | "en";
}
