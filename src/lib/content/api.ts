import type { SupportedLocale } from "@/types";
import * as sanityApi from "@/lib/sanity/api";
import * as sanitySiteConfig from "@/lib/sanity/siteConfig";
import * as strapiApi from "@/lib/strapi/api";

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

// Site config is read on every page render, so it must not sit behind a
// per-request-billed API. Sanity is the primary source; Strapi stays as a
// fallback until the siteConfig document is filled in, after which Strapi is
// no longer touched on the read path at all.
export async function fetchSiteConfig(locale: SupportedLocale = "cs") {
	const fromSanity = await sanitySiteConfig.fetchSiteConfig(locale);
	if (fromSanity) return fromSanity;

	return strapiApi.fetchSiteConfig(locale);
}

export function fetchPageCopy(key: string, locale: SupportedLocale = "cs") {
	return strapiApi.fetchPageCopy(key, locale);
}

export const createLead = strapiApi.createLead;
export const createOrder = strapiApi.createOrder;
