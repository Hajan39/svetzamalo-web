export type SupportedLocale = "cs" | "en";

export type Continent =
	| "europe"
	| "asia"
	| "africa"
	| "oceania"
	| "south-america"
	| "north-america"
	| "caribbean";

export interface SeoMetadata {
	metaTitle: string;
	metaDescription: string;
	keywords?: string[];
}

export interface ImageAsset {
	src: string;
	alt: string;
	width?: number;
	height?: number;
}

export interface Article {
	id: string;
	slug: string;
	title: string;
	intro: string;
	htmlContent?: string;
	articleType?: string;
	destinationId?: string;
	countryName?: string;
	coverImage?: ImageAsset;
	relatedArticles?: Article[];
	tags?: string[];
	publishedAt?: string;
	updatedAt?: string;
	seo: SeoMetadata;
	locale: SupportedLocale;
}

export interface Destination {
	id: string;
	slug: string;
	name: string;
	continent: Continent;
	type: "country" | "region" | "city" | "microstate";
	flagEmoji?: string;
	languages: string[];
	timezone?: string;
	visaInfo?: string;
	bestTimeToVisit?: string;
	heroImage?: ImageAsset;
	introHtml?: string;
	seo: SeoMetadata;
	locale: SupportedLocale;
	currency?: {
		code: string;
		name: string;
		symbol: string;
		budgetPerDay: {
			budget: number;
			midRange: number;
			luxury: number;
		};
	};
}

export interface SiteConfig {
	siteName?: string;
	siteDescription?: string;
	siteEmail?: string;
	bookAvailable?: boolean;
	bookTitle?: string;
	bookDescription?: string;
	bookCover?: ImageAsset;
	bookBuyUrl?: string;
	bookPrice?: string;
	ebookPdfUrl?: string;
	freeEbookAvailable?: boolean;
	freeEbookTitle?: string;
	freeEbookDescription?: string;
	freeEbookCover?: ImageAsset;
	bookBankTransferEnabled?: boolean;
	bookBankAccountName?: string;
	bookBankAccountNumber?: string;
	bookBankCode?: string;
	bookBankIban?: string;
	bookBankBic?: string;
	bookBankAmount?: string;
	bookBankCurrency?: string;
	bookBankMessage?: string;
	bookBankContactEmail?: string;
	enableAnalytics?: boolean;
	enableAds?: boolean;
}
