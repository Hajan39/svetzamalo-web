import type { SupportedLocale } from "@/types";
import * as sanityApi from "@/lib/sanity/api";
import * as sanitySiteConfig from "@/lib/sanity/siteConfig";
import { envSiteConfig } from "@/lib/envSiteConfig";

export const fetchLatestArticles = sanityApi.fetchLatestArticles;
export const fetchArticles = sanityApi.fetchArticles;
export const fetchArticlesPage = sanityApi.fetchArticlesPage;
export const fetchAllArticles = sanityApi.fetchAllArticles;
export const fetchArticleCount = sanityApi.fetchArticleCount;
export const fetchArticleFilterMeta = sanityApi.fetchArticleFilterMeta;
export const fetchArticleBySlug = sanityApi.fetchArticleBySlug;
export const fetchDestinations = sanityApi.fetchDestinations;
export const fetchDestinationBySlug = sanityApi.fetchDestinationBySlug;
export const fetchDestinationsByContinent =
	sanityApi.fetchDestinationsByContinent;
export const fetchAffiliateLinkBySlug = sanityApi.fetchAffiliateLinkBySlug;

/**
 * Sanity wins when an editor has filled in the Site config document; otherwise
 * the shop runs off environment variables. Either way there is no per-request
 * call to a paid CMS on the render path, and no single service whose outage
 * hides the shop.
 */
export async function fetchSiteConfig(locale: SupportedLocale = "cs") {
	const fromSanity = await sanitySiteConfig.fetchSiteConfig(locale);
	if (fromSanity) return fromSanity;

	return envSiteConfig();
}

