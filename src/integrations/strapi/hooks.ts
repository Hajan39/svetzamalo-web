/**
 * React Query Hooks for Strapi
 *
 * Hooks for fetching Strapi content with React Query
 */

import { type UseQueryOptions, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useLocale } from "@/lib/i18n";
import type { Article, Destination } from "@/types";
import type { StrapiSiteConfig } from "./types";
import {
	fetchArticleById,
	fetchArticleBySlug,
	fetchArticles,
	fetchArticlesPage,
	fetchArticlesByDestination,
	fetchArticlesByTag,
	fetchDestinationById,
	fetchDestinationBySlug,
	fetchDestinations,
	fetchDestinationsByContinent,
	fetchLatestArticles,
	fetchSiteConfig,
	toContentLocale,
} from "./api";

/**
 * Query keys for React Query
 */
export const strapiQueryKeys = {
	all: ["strapi"] as const,
	siteConfig: (locale?: "cs" | "en") =>
		["strapi", "site-config", "locale", locale] as const,
	destinations: {
		all: ["strapi", "destinations"] as const,
		lists: () => [...strapiQueryKeys.destinations.all, "list"] as const,
		list: (filters?: unknown) =>
			[...strapiQueryKeys.destinations.lists(), filters] as const,
		listWithLocale: (locale?: "cs" | "en") =>
			[...strapiQueryKeys.destinations.lists(), "locale", locale] as const,
		details: () => [...strapiQueryKeys.destinations.all, "detail"] as const,
		detail: (id: string | number, locale?: "cs" | "en") =>
			[...strapiQueryKeys.destinations.details(), id, "locale", locale] as const,
		bySlug: (slug: string, locale?: "cs" | "en") =>
			[
				...strapiQueryKeys.destinations.details(),
				"slug",
				slug,
				"locale",
				locale,
			] as const,
		byContinent: (continent: string, locale?: "cs" | "en") =>
			[
				...strapiQueryKeys.destinations.lists(),
				"continent",
				continent,
				"locale",
				locale,
			] as const,
	},
	articles: {
		all: ["strapi", "articles"] as const,
		lists: () => [...strapiQueryKeys.articles.all, "list"] as const,
		list: (filters?: unknown, locale?: "cs" | "en") =>
			[...strapiQueryKeys.articles.lists(), filters, "locale", locale] as const,
		details: () => [...strapiQueryKeys.articles.all, "detail"] as const,
		detail: (id: string | number, locale?: "cs" | "en") =>
			[...strapiQueryKeys.articles.details(), id, "locale", locale] as const,
		bySlug: (slug: string, locale?: "cs" | "en") =>
			[
				...strapiQueryKeys.articles.details(),
				"slug",
				slug,
				"locale",
				locale,
			] as const,
		byDestination: (destinationId: string, locale?: "cs" | "en") =>
			[
				...strapiQueryKeys.articles.lists(),
				"destination",
				destinationId,
				"locale",
				locale,
			] as const,
		byTag: (tag: string, locale?: "cs" | "en") =>
			[...strapiQueryKeys.articles.lists(), "tag", tag, "locale", locale] as const,
		latest: (limit?: number, locale?: "cs" | "en") =>
			[...strapiQueryKeys.articles.lists(), "latest", limit, "locale", locale] as const,
	},
} as const;

/**
 * Hook to fetch all destinations (filtered by current locale)
 */
export function useDestinations(
	options?: Omit<UseQueryOptions<Destination[], Error>, "queryKey" | "queryFn">,
) {
	const appLocale = useLocale();
	const contentLocale = toContentLocale(appLocale);
	return useQuery({
		queryKey: strapiQueryKeys.destinations.listWithLocale(contentLocale),
		queryFn: () => fetchDestinations(contentLocale),
		staleTime: 1000 * 60 * 5, // 5 minutes
		...options,
	});
}

/**
 * Hook to fetch destination by slug
 */
export function useDestinationBySlug(
	slug: string,
	options?: Omit<
		UseQueryOptions<Destination | null, Error>,
		"queryKey" | "queryFn"
	>,
) {
	const appLocale = useLocale();
	const contentLocale = toContentLocale(appLocale);
	return useQuery({
		queryKey: strapiQueryKeys.destinations.bySlug(slug, contentLocale),
		queryFn: () => fetchDestinationBySlug(slug, contentLocale),
		enabled: !!slug,
		staleTime: 1000 * 60 * 5, // 5 minutes
		...options,
	});
}

/**
 * Hook to fetch destination by ID
 */
export function useDestinationById(
	id: string | number,
	options?: Omit<
		UseQueryOptions<Destination | null, Error>,
		"queryKey" | "queryFn"
	>,
) {
	const appLocale = useLocale();
	const contentLocale = toContentLocale(appLocale);
	return useQuery({
		queryKey: strapiQueryKeys.destinations.detail(id, contentLocale),
		queryFn: () => fetchDestinationById(id, contentLocale),
		enabled: !!id,
		staleTime: 1000 * 60 * 5, // 5 minutes
		...options,
	});
}

/**
 * Hook to fetch destinations by continent (filtered by current locale)
 */
export function useDestinationsByContinent(
	continent: string,
	options?: Omit<UseQueryOptions<Destination[], Error>, "queryKey" | "queryFn">,
) {
	const appLocale = useLocale();
	const contentLocale = toContentLocale(appLocale);
	return useQuery({
		queryKey: strapiQueryKeys.destinations.byContinent(
			continent,
			contentLocale,
		),
		queryFn: () => fetchDestinationsByContinent(continent, contentLocale),
		enabled: !!continent,
		staleTime: 1000 * 60 * 5, // 5 minutes
		...options,
	});
}

/**
 * Hook to fetch articles with infinite scroll (paginated)
 */
export function useInfiniteArticles() {
	const appLocale = useLocale();
	const contentLocale = toContentLocale(appLocale);
	return useInfiniteQuery({
		queryKey: [...strapiQueryKeys.articles.lists(), "infinite", contentLocale],
		queryFn: ({ pageParam }) => fetchArticlesPage(pageParam as number, contentLocale),
		initialPageParam: 1,
		getNextPageParam: (lastPage) =>
			lastPage.page < lastPage.pageCount ? lastPage.page + 1 : undefined,
		staleTime: 1000 * 60 * 5,
	});
}

/**
 * Hook to fetch all articles
 */
export function useArticles(
	options?: Omit<UseQueryOptions<Article[], Error>, "queryKey" | "queryFn">,
) {
	const appLocale = useLocale();
	const contentLocale = toContentLocale(appLocale);
	return useQuery({
		queryKey: strapiQueryKeys.articles.list(undefined, contentLocale),
		queryFn: () => fetchArticles(contentLocale),
		staleTime: 1000 * 60 * 5, // 5 minutes
		...options,
	});
}

/**
 * Hook to fetch article by slug
 */
export function useArticleBySlug(
	slug: string,
	options?: Omit<
		UseQueryOptions<Article | null, Error>,
		"queryKey" | "queryFn"
	>,
) {
	const appLocale = useLocale();
	const contentLocale = toContentLocale(appLocale);
	return useQuery({
		queryKey: strapiQueryKeys.articles.bySlug(slug, contentLocale),
		queryFn: () => fetchArticleBySlug(slug, contentLocale),
		enabled: !!slug,
		staleTime: 1000 * 60 * 5, // 5 minutes
		...options,
	});
}

/**
 * Hook to fetch article by ID
 */
export function useArticleById(
	id: string | number,
	options?: Omit<
		UseQueryOptions<Article | null, Error>,
		"queryKey" | "queryFn"
	>,
) {
	const appLocale = useLocale();
	const contentLocale = toContentLocale(appLocale);
	return useQuery({
		queryKey: strapiQueryKeys.articles.detail(id, contentLocale),
		queryFn: () => fetchArticleById(id, contentLocale),
		enabled: !!id,
		staleTime: 1000 * 60 * 5, // 5 minutes
		...options,
	});
}

/**
 * Hook to fetch articles by destination
 */
export function useArticlesByDestination(
	destinationId: string,
	options?: Omit<UseQueryOptions<Article[], Error>, "queryKey" | "queryFn">,
) {
	const appLocale = useLocale();
	const contentLocale = toContentLocale(appLocale);
	return useQuery({
		queryKey: strapiQueryKeys.articles.byDestination(
			destinationId,
			contentLocale,
		),
		queryFn: () => fetchArticlesByDestination(destinationId, contentLocale),
		enabled: !!destinationId,
		staleTime: 1000 * 60 * 5, // 5 minutes
		...options,
	});
}

/**
 * Hook to fetch articles by tag
 */
export function useArticlesByTag(
	tag: string,
	options?: Omit<UseQueryOptions<Article[], Error>, "queryKey" | "queryFn">,
) {
	const appLocale = useLocale();
	const contentLocale = toContentLocale(appLocale);
	return useQuery({
		queryKey: strapiQueryKeys.articles.byTag(tag, contentLocale),
		queryFn: () => fetchArticlesByTag(tag, contentLocale),
		enabled: !!tag,
		staleTime: 1000 * 60 * 5, // 5 minutes
		...options,
	});
}

/**
 * Hook to fetch latest articles
 */
export function useLatestArticles(
	limit = 6,
	options?: Omit<UseQueryOptions<Article[], Error>, "queryKey" | "queryFn">,
) {
	const appLocale = useLocale();
	const contentLocale = toContentLocale(appLocale);
	return useQuery({
		queryKey: strapiQueryKeys.articles.latest(limit, contentLocale),
		queryFn: () => fetchLatestArticles(limit, contentLocale),
		staleTime: 1000 * 60 * 5, // 5 minutes
		...options,
	});
}

/**
 * Hook to fetch site configuration from Strapi.
 * Data is cached for 10 minutes and treated as non-critical
 * (returns null on error so the app can fall back to env vars).
 */
export function useSiteConfig(
	options?: Omit<
		UseQueryOptions<StrapiSiteConfig | null, Error>,
		"queryKey" | "queryFn"
	>,
) {
	const appLocale = useLocale();
	const contentLocale = toContentLocale(appLocale);
	return useQuery({
		queryKey: strapiQueryKeys.siteConfig(contentLocale),
		queryFn: () => fetchSiteConfig(contentLocale),
		staleTime: 1000 * 60 * 10, // 10 minutes
		gcTime: 1000 * 60 * 30, // keep in cache 30 min
		retry: 1,
		...options,
	});
}
