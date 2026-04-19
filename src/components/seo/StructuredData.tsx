import type { Article, FaqItem } from "@/types";

interface ArticleStructuredDataProps {
	article: Article;
	url: string;
}

export function ArticleStructuredData({
	article,
	url,
}: ArticleStructuredDataProps) {
	const structuredData = {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: article.seo.metaTitle,
		description: article.seo.metaDescription,
		image: article.seo.ogImage?.src,
		datePublished: article.publishedAt,
		dateModified: article.updatedAt || article.publishedAt,
		author: {
			"@type": "Organization",
			name: "Svět za málo",
		},
		publisher: {
			"@type": "Organization",
			name: "Svět za málo",
			logo: {
				"@type": "ImageObject",
				url: "/logo.svg",
			},
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": url,
		},
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
		/>
	);
}

interface FaqStructuredDataProps {
	items: FaqItem[];
}

export function FaqStructuredData({ items }: FaqStructuredDataProps) {
	if (!items || items.length === 0) return null;

	const structuredData = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: items.map((item) => ({
			"@type": "Question",
			name: item.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: item.answer,
			},
		})),
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
		/>
	);
}

interface BreadcrumbItem {
	name: string;
	url: string;
}

interface BreadcrumbStructuredDataProps {
	items: BreadcrumbItem[];
}

export function BreadcrumbStructuredData({
	items,
}: BreadcrumbStructuredDataProps) {
	const structuredData = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: item.url,
		})),
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
		/>
	);
}

/**
 * Organization structured data for homepage
 */
export function OrganizationStructuredData() {
	const structuredData = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "Svět za málo",
		url: "https://lowcost-traveling.com",
		logo: "https://lowcost-traveling.com/logo.svg",
		description:
			"Discover budget travel destinations, practical guides, and insider tips from Svet za malo.",
		sameAs: [
			"https://www.facebook.com/lowcosttraveling",
			"https://www.instagram.com/lowcosttraveling",
			"https://www.twitter.com/lowcosttraveling",
		],
		contactPoint: {
			"@type": "ContactPoint",
			contactType: "customer service",
			email: "hello@lowcost-traveling.com",
		},
		foundingDate: "2024",
		knowsAbout: [
			"Budget Travel",
			"Backpacking",
			"Travel Guides",
			"Destination Reviews",
			"Travel Tips",
		],
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
		/>
	);
}

/**
 * WebSite structured data for search engine optimization
 */
export function WebSiteStructuredData() {
	const structuredData = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "Svět za málo",
		url: "https://lowcost-traveling.com",
		description:
			"Discover budget travel destinations, practical guides, and insider tips from Svet za malo.",
		inLanguage: ["en", "cs", "es", "de"],
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate:
					"https://lowcost-traveling.com/search?q={search_term_string}",
			},
			"query-input": "required name=search_term_string",
		},
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
		/>
	);
}
