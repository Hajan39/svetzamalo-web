/**
 * Strapi API Methods
 *
 * High-level API methods for fetching content from Strapi.
 * Falls back to local content data when Strapi is unavailable.
 */

import {
	getArticleById as getLocalArticleById,
	getArticleBySlug as getLocalArticleBySlug,
	getArticles as getLocalArticles,
	getArticlesByDestination as getLocalArticlesByDestination,
	getArticlesByTag as getLocalArticlesByTag,
	getDestinationById as getLocalDestinationById,
	getDestinationBySlug as getLocalDestinationBySlug,
	getDestinations as getLocalDestinations,
	getDestinationsByContinent as getLocalDestinationsByContinent,
	getLatestArticles as getLocalLatestArticles,
} from "@/content";
import type { Article, Destination } from "@/types";
import { type StrapiQueryParams, strapiClient } from "./client";
import {
	type StrapiArticle,
	type StrapiDestination,
	transformStrapiArticle,
	transformStrapiDestination,
} from "./types";

/**
 * Check if Strapi is enabled via environment variable
 */
const isStrapiEnabled = () => {
	const strapiUrl =
		typeof process !== "undefined"
			? process.env.VITE_STRAPI_URL
			: import.meta.env?.VITE_STRAPI_URL;
	return !!strapiUrl && strapiUrl !== "http://localhost:1337";
};

/**
 * Fetch all destinations
 * Falls back to local content if Strapi is unavailable
 */
export async function fetchDestinations(
	params?: StrapiQueryParams,
): Promise<Destination[]> {
	// Use local data if Strapi is not configured
	if (!isStrapiEnabled()) {
		return getLocalDestinations();
	}

	try {
		const response = await strapiClient.get<StrapiDestination[]>(
			"/destinations",
			{
				populate: "*",
				sort: ["name:asc"],
				...params,
			},
		);

		const destinations = Array.isArray(response.data)
			? response.data
			: [response.data];
		return destinations.map(transformStrapiDestination);
	} catch (error) {
		console.warn("Strapi unavailable, using local destinations:", error);
		return getLocalDestinations();
	}
}

/**
 * Fetch destination by slug
 * Falls back to local content if Strapi is unavailable
 */
export async function fetchDestinationBySlug(
	slug: string,
): Promise<Destination | null> {
	// Use local data if Strapi is not configured
	if (!isStrapiEnabled()) {
		return getLocalDestinationBySlug(slug) || null;
	}

	try {
		const response = await strapiClient.get<StrapiDestination>(
			`/destinations`,
			{
				filters: { slug: { $eq: slug } },
				populate: "*",
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
		console.warn("Strapi unavailable, using local destination:", error);
		return getLocalDestinationBySlug(slug) || null;
	}
}

/**
 * Fetch destination by ID
 * Falls back to local content if Strapi is unavailable
 */
export async function fetchDestinationById(
	id: string | number,
): Promise<Destination | null> {
	// Use local data if Strapi is not configured
	if (!isStrapiEnabled()) {
		return getLocalDestinationById(String(id)) || null;
	}

	try {
		const response = await strapiClient.get<StrapiDestination>(
			`/destinations/${id}`,
			{
				populate: "*",
			},
		);

		return transformStrapiDestination(response.data);
	} catch (error) {
		console.warn("Strapi unavailable, using local destination:", error);
		return getLocalDestinationById(String(id)) || null;
	}
}

/**
 * Fetch destinations by continent
 * Falls back to local content if Strapi is unavailable
 */
export async function fetchDestinationsByContinent(
	continent: string,
): Promise<Destination[]> {
	// Use local data if Strapi is not configured
	if (!isStrapiEnabled()) {
		return getLocalDestinationsByContinent(continent);
	}

	try {
		const response = await strapiClient.get<StrapiDestination[]>(
			"/destinations",
			{
				filters: { continent: { $eq: continent } },
				populate: "*",
				sort: ["name:asc"],
			},
		);

		const destinations = Array.isArray(response.data)
			? response.data
			: [response.data];
		return destinations.map(transformStrapiDestination);
	} catch (error) {
		console.warn("Strapi unavailable, using local destinations:", error);
		return getLocalDestinationsByContinent(continent);
	}
}

/**
 * Fetch all articles
 * Falls back to local content if Strapi is unavailable
 */
export async function fetchArticles(
	params?: StrapiQueryParams,
): Promise<Article[]> {
	// Use local data if Strapi is not configured
	if (!isStrapiEnabled()) {
		return getLocalArticles();
	}

	try {
		const response = await strapiClient.get<StrapiArticle[]>("/articles", {
			populate: {
				destination: {
					populate: "*",
				},
				featuredImage: "*",
			},
			sort: ["publishedAt:desc"],
			...params,
		});

		const articles = Array.isArray(response.data)
			? response.data
			: [response.data];
		return articles.map(transformStrapiArticle);
	} catch (error) {
		console.warn("Strapi unavailable, using local articles:", error);
		return getLocalArticles();
	}
}

/**
 * Fetch article by slug
 * Falls back to local content if Strapi is unavailable
 */
export async function fetchArticleBySlug(
	slug: string,
): Promise<Article | null> {
	// Use local data if Strapi is not configured
	if (!isStrapiEnabled()) {
		return getLocalArticleBySlug(slug) || null;
	}

	try {
		const response = await strapiClient.get<StrapiArticle>("/articles", {
			filters: { slug: { $eq: slug } },
			populate: {
				destination: {
					populate: "*",
				},
				featuredImage: "*",
			},
		});

		const articles = Array.isArray(response.data)
			? response.data
			: [response.data];
		if (articles.length === 0) {
			return getLocalArticleBySlug(slug) || null;
		}

		return transformStrapiArticle(articles[0]);
	} catch (error) {
		console.warn("Strapi unavailable, using local article:", error);
		return getLocalArticleBySlug(slug) || null;
	}
}

/**
 * Fetch article by ID
 * Falls back to local content if Strapi is unavailable
 */
export async function fetchArticleById(
	id: string | number,
): Promise<Article | null> {
	// Use local data if Strapi is not configured
	if (!isStrapiEnabled()) {
		return getLocalArticleById(String(id)) || null;
	}

	try {
		const response = await strapiClient.get<StrapiArticle>(`/articles/${id}`, {
			populate: {
				destination: {
					populate: "*",
				},
				featuredImage: "*",
			},
		});

		return transformStrapiArticle(response.data);
	} catch (error) {
		console.warn("Strapi unavailable, using local article:", error);
		return getLocalArticleById(String(id)) || null;
	}
}

/**
 * Fetch articles by destination
 * Falls back to local content if Strapi is unavailable
 */
export async function fetchArticlesByDestination(
	destinationId: string,
): Promise<Article[]> {
	// Use local data if Strapi is not configured
	if (!isStrapiEnabled()) {
		return getLocalArticlesByDestination(destinationId);
	}

	try {
		const response = await strapiClient.get<StrapiArticle[]>("/articles", {
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
				],
			},
			populate: {
				destination: {
					populate: "*",
				},
				featuredImage: "*",
			},
			sort: ["publishedAt:desc"],
		});

		const articles = Array.isArray(response.data)
			? response.data
			: [response.data];
		return articles.map(transformStrapiArticle);
	} catch (error) {
		console.warn("Strapi unavailable, using local articles:", error);
		return getLocalArticlesByDestination(destinationId);
	}
}

/**
 * Fetch articles by tag
 * Falls back to local content if Strapi is unavailable
 */
export async function fetchArticlesByTag(tag: string): Promise<Article[]> {
	// Use local data if Strapi is not configured
	if (!isStrapiEnabled()) {
		return getLocalArticlesByTag(tag);
	}

	try {
		const response = await strapiClient.get<StrapiArticle[]>("/articles", {
			filters: {
				tags: {
					$contains: tag,
				},
			},
			populate: {
				destination: {
					populate: "*",
				},
				featuredImage: "*",
			},
			sort: ["publishedAt:desc"],
		});

		const articles = Array.isArray(response.data)
			? response.data
			: [response.data];
		return articles.map(transformStrapiArticle);
	} catch (error) {
		console.warn("Strapi unavailable, using local articles:", error);
		return getLocalArticlesByTag(tag);
	}
}

/**
 * Fetch latest articles
 * Falls back to local content if Strapi is unavailable
 */
export async function fetchLatestArticles(limit = 6): Promise<Article[]> {
	// Use local data if Strapi is not configured
	if (!isStrapiEnabled()) {
		return getLocalLatestArticles(limit);
	}

	try {
		const response = await strapiClient.get<StrapiArticle[]>("/articles", {
			populate: {
				destination: {
					populate: "*",
				},
				featuredImage: "*",
			},
			sort: ["publishedAt:desc"],
			pagination: {
				limit,
			},
		});

		const articles = Array.isArray(response.data)
			? response.data
			: [response.data];
		return articles.map(transformStrapiArticle);
	} catch (error) {
		console.warn("Strapi unavailable, using local articles:", error);
		return getLocalLatestArticles(limit);
	}
}
