/**
 * Strapi API Methods
 *
 * High-level API methods for fetching content from Strapi.
 * Data comes exclusively from Strapi – no local fallbacks.
 */

import type { Article, Destination } from "@/types";
import { strapiClient } from "./client";
import {
	type StrapiArticle,
	type StrapiDestination,
	type StrapiSiteConfig,
	transformStrapiArticle,
	transformStrapiDestination,
} from "./types";

/** Map app locale to Strapi content locale (destinations have cs | en) */
export function toContentLocale(appLocale: string): "cs" | "en" {
	return appLocale === "cs" ? "cs" : "en";
}

/**
 * Fetch all destinations, optionally filtered by content locale.
 */
export async function fetchDestinations(
	contentLocale?: "cs" | "en",
): Promise<Destination[]> {
	try {
		const response = await strapiClient.get<StrapiDestination[]>(
			"/countries/public",
			{
				populate: "*",
				sort: ["name:asc"],
				...(contentLocale ? { locale: contentLocale } : {}),
			},
		);

		const destinations = Array.isArray(response.data)
			? response.data
			: [response.data];
		return destinations.map(transformStrapiDestination);
	} catch (error) {
		console.warn("Strapi fetch destinations failed:", error);
		return [];
	}
}

/**
 * Fetch destination by slug
 */
export async function fetchDestinationBySlug(
	slug: string,
	contentLocale?: "cs" | "en",
): Promise<Destination | null> {
	try {
		const response = await strapiClient.get<StrapiDestination>(
			`/countries/public`,
			{
				filters: { slug: { $eq: slug } },
				populate: "*",
				...(contentLocale ? { locale: contentLocale } : {}),
			},
		);

		const destinations = Array.isArray(response.data)
			? response.data
			: [response.data];
		if (destinations.length === 0) {
			return null;
		}

		return transformStrapiDestination(destinations[0]);
	} catch (error) {
		console.warn("Strapi fetch destination by slug failed:", error);
		return null;
	}
}

/**
 * Fetch destination by ID
 */
export async function fetchDestinationById(
	id: string | number,
	contentLocale?: "cs" | "en",
): Promise<Destination | null> {
	try {
		const response = await strapiClient.get<StrapiDestination>(
			`/countries/public/${id}`,
			{
				populate: "*",
				...(contentLocale ? { locale: contentLocale } : {}),
			},
		);

		return transformStrapiDestination(response.data);
	} catch (error) {
		console.warn("Strapi fetch destination by id failed:", error);
		return null;
	}
}

/**
 * Fetch destinations by continent, optionally filtered by content locale.
 */
export async function fetchDestinationsByContinent(
	continent: string,
	contentLocale?: "cs" | "en",
): Promise<Destination[]> {
	const filters: Record<string, unknown> = { continent: { $eq: continent } };

	try {
		const response = await strapiClient.get<StrapiDestination[]>(
			"/countries/public",
			{
				filters,
				populate: "*",
				sort: ["name:asc"],
				...(contentLocale ? { locale: contentLocale } : {}),
			},
		);

		const destinations = Array.isArray(response.data)
			? response.data
			: [response.data];
		return destinations.map(transformStrapiDestination);
	} catch (error) {
		console.warn("Strapi fetch destinations by continent failed:", error);
		return [];
	}
}

/**
 * Fetch all articles
 */
export async function fetchArticles(
	contentLocale?: "cs" | "en",
): Promise<Article[]> {
	try {
		const response = await strapiClient.get<StrapiArticle[]>("/articles/public", {
			populate: ["cover", "country"],
			sort: ["publishedAt:desc"],
			...(contentLocale ? { locale: contentLocale } : {}),
		});

		const articles = Array.isArray(response.data)
			? response.data
			: [response.data];
		return articles.map(transformStrapiArticle);
	} catch (error) {
		console.warn("Strapi fetch articles failed:", error);
		return [];
	}
}

/**
 * Fetch article by slug
 */
export async function fetchArticleBySlug(
	slug: string,
	contentLocale?: "cs" | "en",
): Promise<Article | null> {
	try {
		const response = await strapiClient.get<StrapiArticle>("/articles/public", {
			filters: { slug: { $eq: slug } },
			populate: ["cover", "country"],
			...(contentLocale ? { locale: contentLocale } : {}),
		});

		const articles = Array.isArray(response.data)
			? response.data
			: [response.data];
		if (articles.length === 0) {
			return null;
		}

		return transformStrapiArticle(articles[0]);
	} catch (error) {
		console.warn("Strapi fetch article by slug failed:", error);
		return null;
	}
}

/**
 * Fetch article by ID
 */
export async function fetchArticleById(
	id: string | number,
	contentLocale?: "cs" | "en",
): Promise<Article | null> {
	try {
		const response = await strapiClient.get<StrapiArticle>(
			`/articles/public/${id}`,
			{
				populate: ["cover", "country"],
				...(contentLocale ? { locale: contentLocale } : {}),
			},
		);

		return transformStrapiArticle(response.data);
	} catch (error) {
		console.warn("Strapi fetch article by id failed:", error);
		return null;
	}
}

/**
 * Fetch articles by destination
 */
export async function fetchArticlesByDestination(
	destinationId: string,
	contentLocale?: "cs" | "en",
): Promise<Article[]> {
	try {
		const response = await strapiClient.get<StrapiArticle[]>("/articles/public", {
			filters: {
				$or: [
					{
						destination: {
							documentId: { $eq: destinationId },
						},
					},
					{
						destinationId: { $eq: destinationId },
					},
					{
						country: {
							slug: { $eq: destinationId },
						},
					},
					{
						country: {
							documentId: { $eq: destinationId },
						},
					},
					{
						country: {
							id: { $eq: destinationId },
						},
					},
				],
			},
			populate: ["cover", "country"],
			sort: ["publishedAt:desc"],
			...(contentLocale ? { locale: contentLocale } : {}),
		});

		const articles = Array.isArray(response.data)
			? response.data
			: [response.data];
		return articles.map(transformStrapiArticle);
	} catch (error) {
		console.warn("Strapi fetch articles by destination failed:", error);
		return [];
	}
}

/**
 * Fetch articles by tag
 */
export async function fetchArticlesByTag(
	tag: string,
	contentLocale?: "cs" | "en",
): Promise<Article[]> {
	try {
		const response = await strapiClient.get<StrapiArticle[]>("/articles/public", {
			filters: {
				tags: {
					$contains: tag,
				},
			},
			populate: ["cover", "country"],
			sort: ["publishedAt:desc"],
			...(contentLocale ? { locale: contentLocale } : {}),
		});

		const articles = Array.isArray(response.data)
			? response.data
			: [response.data];
		return articles.map(transformStrapiArticle);
	} catch (error) {
		console.warn("Strapi fetch articles by tag failed:", error);
		return [];
	}
}

/**
 * Fetch latest articles
 */
export async function fetchLatestArticles(
	limit = 6,
	contentLocale?: "cs" | "en",
): Promise<Article[]> {
	try {
		const response = await strapiClient.get<StrapiArticle[]>("/articles/public", {
			populate: ["cover", "country"],
			sort: ["publishedAt:desc"],
			pagination: {
				limit,
			},
			...(contentLocale ? { locale: contentLocale } : {}),
		});

		const articles = Array.isArray(response.data)
			? response.data
			: [response.data];
		return articles.map(transformStrapiArticle);
	} catch (error) {
		console.warn("Strapi fetch latest articles failed:", error);
		return [];
	}
}

/**
 * Submit book interest (notify when book is available) or ebook lead (free PDF).
 * Requires Strapi API token with create permission on book-interest.
 */
export async function submitBookInterest(
	email: string,
	leadType: "book_notify" | "ebook" | "newsletter" = "book_notify",
): Promise<void> {
	await strapiClient.post("/book-interests", { email, leadType });
}

/**
 * Create Comgate payment for book purchase. Returns redirect URL to send the user to.
 * Requires Strapi to have COMGATE_MERCHANT_ID and COMGATE_SECRET configured.
 */
/** Comgate create-payment returns { redirect } directly (no Strapi data wrapper). */
export async function createComgateBookPayment(
	email: string,
	fullName: string,
): Promise<string> {
	const raw = (await strapiClient.post(
		"/book-interests/create-comgate-payment",
		{ email: email.trim(), fullName: fullName.trim() || "Zákazník" },
	)) as unknown as { redirect?: string };
	const redirect = raw?.redirect;
	if (!redirect || typeof redirect !== "string") {
		throw new Error("Payment gateway did not return redirect URL.");
	}
	return redirect;
}

/**
 * Fetch site configuration from Strapi Single Type.
 * Returns null when Strapi is unreachable so the FE can fall back to env vars.
 */
export async function fetchSiteConfig(
	contentLocale?: "cs" | "en",
): Promise<StrapiSiteConfig | null> {
	try {
		const response =
			await strapiClient.get<StrapiSiteConfig>("/site-config/public", {
				...(contentLocale ? { locale: contentLocale } : {}),
			});
		return response.data ?? null;
	} catch (error) {
		console.warn("Strapi fetch site-config failed, using env fallbacks:", error);
		return null;
	}
}
