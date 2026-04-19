/**
 * Strapi Integration
 *
 * Main export file for Strapi integration
 */

// API methods
export {
	createComgateBookPayment,
	fetchArticleById,
	fetchArticleBySlug,
	fetchArticles,
	fetchArticlesByDestination,
	fetchArticlesByTag,
	fetchDestinationById,
	fetchDestinationBySlug,
	fetchDestinations,
	fetchDestinationsByContinent,
	fetchLatestArticles,
	fetchSiteConfig,
	submitBookInterest,
	toContentLocale,
} from "./api";
export type { StrapiError, StrapiQueryParams, StrapiResponse } from "./client";
// Client
export { strapiClient } from "./client";
// React Query hooks
export {
	strapiQueryKeys,
	useArticleById,
	useArticleBySlug,
	useArticles,
	useArticlesByDestination,
	useArticlesByTag,
	useDestinationById,
	useDestinationBySlug,
	useDestinations,
	useDestinationsByContinent,
	useLatestArticles,
	useSiteConfig,
} from "./hooks";
// Types
export type {
	StrapiArticle,
	StrapiDestination,
	StrapiEntity,
	StrapiSiteConfig,
} from "./types";
export { transformStrapiArticle, transformStrapiDestination } from "./types";
