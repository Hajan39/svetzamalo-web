import type {
	Article,
	Destination,
	SiteConfig,
	SupportedLocale,
} from "@/types";
import { ARTICLE_COVER_FALLBACKS } from "../articleCoverFallbacks";
import { ARTICLE_DESTINATION_SLUGS } from "../articleDestinationMap";
import { strapiBlocksToHtml } from "./blocks";
import { strapiGet, strapiPost } from "./client";

interface StrapiEntity {
	id: number;
	documentId?: string;
	createdAt?: string;
	updatedAt?: string;
	publishedAt?: string;
	locale?: string;
}

interface StrapiMedia {
	data?: StrapiMedia | null;
	url?: string;
	alternativeText?: string;
	width?: number;
	height?: number;
	attributes?: {
		url?: string;
		alternativeText?: string;
		width?: number;
		height?: number;
	};
}

interface StrapiDestination extends StrapiEntity {
	slug: string;
	name: string;
	continent?: string | StrapiContinent | { data?: StrapiContinent | null } | null;
	cover?: StrapiMedia | null;
	heroImage?: { data?: StrapiMedia | null };
	intro?: unknown[];
	contentLang?: SupportedLocale;
	flagEmoji?: string;
	timezone?: string;
	languages?: string[] | null;
	currencyCode?: string;
	currencyName?: string;
	currencySymbol?: string;
	budgetPerDayBudget?: number | null;
	budgetPerDayMidRange?: number | null;
	budgetPerDayLuxury?: number | null;
	bestTimeToVisit?: string;
	visaInfo?: string;
	destinationType?: Destination["type"];
	seo?: Destination["seo"];
}

interface StrapiContinent extends StrapiEntity {
	slug: string;
	name: string;
	countries?: StrapiDestination[] | { data?: StrapiDestination[] | null } | null;
}

interface StrapiArticle extends StrapiEntity {
	slug: string;
	title: string;
	intro?: string;
	excerpt?: string;
	content?: unknown[];
	contentLang?: SupportedLocale;
	articleType?: string;
	country?: {
		data?: StrapiDestination | null;
		documentId?: string;
		id?: number;
		slug?: string;
		name?: string;
	} | null;
	tags?: string[];
	cover?: StrapiMedia | null;
	featuredImage?: { data?: StrapiMedia | null };
	seo?: Article["seo"];
}

interface StrapiSiteConfig extends Omit<SiteConfig, "bookCover" | "freeEbookCover"> {
	bookCover?: StrapiMedia | { data?: StrapiMedia | null } | null;
	freeEbookCover?: StrapiMedia | { data?: StrapiMedia | null } | null;
}

interface StrapiImageBlock {
	type?: string;
	image?: StrapiMedia | null;
}

const STRAPI_BASE = (
	import.meta.env.STRAPI_URL ||
	import.meta.env.PUBLIC_STRAPI_URL ||
	"http://localhost:1337"
).replace(/\/$/, "");
const ARTICLES_PAGE_SIZE = 12;
const ARTICLES_SEARCH_PAGE_SIZE = 100;
const FALLBACK_COUNTRY_CONTINENTS: Record<string, Destination["continent"]> = {
	"mauricius-cs": "africa",
	"indonesie-cs": "asia",
	"malajsie-cs": "asia",
	"singapur-cs": "asia",
	"sri-lanka-cs": "asia",
	"thajsko-cs": "asia",
	"vietnam-cs": "asia",
	"americke-panenske-ostrovy-cs": "caribbean",
	"britske-panenske-ostrovy-cs": "caribbean",
	"dominikanska-republika-cs": "caribbean",
	"portoriko-cs": "caribbean",
	"andorra-cs": "europe",
	"francie-cs": "europe",
	"italie-cs": "europe",
	"lucemburk-cs": "europe",
	"monaco-cs": "europe",
	"nemecko-cs": "europe",
	"norsko-cs": "europe",
	"san-marino-cs": "europe",
	"slovinsko-cs": "europe",
	"spanelsko-cs": "europe",
	"svedsko-cs": "europe",
	"svycarsko-cs": "europe",
	"vatikan-cs": "europe",
	"samoa-cs": "oceania",
	"ekvador-cs": "south-america",
	"galapagy-cs": "south-america",
};

function normalizeCollection<T>(data: T[] | T | null | undefined): T[] {
	if (Array.isArray(data))
		return data.filter((item): item is T => item != null);
	return data == null ? [] : [data];
}

function absoluteUrl(url?: string): string | undefined {
	if (!url) return undefined;
	if (url.startsWith("http")) return url;
	return `${STRAPI_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

function normalizeMedia(
	media?: StrapiMedia | { data?: StrapiMedia | null } | null,
) {
	const item =
		(media as { data?: StrapiMedia | null } | undefined)?.data ??
		(media as StrapiMedia | undefined);
	const url = item?.url ?? item?.attributes?.url;
	if (!url) return undefined;

	return {
		src: absoluteUrl(url) ?? url,
		alt: item?.alternativeText ?? item?.attributes?.alternativeText ?? "",
		width: item?.width ?? item?.attributes?.width,
		height: item?.height ?? item?.attributes?.height,
	};
}

function findFirstContentImage(content: unknown[] | undefined) {
	if (!Array.isArray(content)) return undefined;

	for (const block of content) {
		const item = block as StrapiImageBlock;
		if (item.type !== "image" || !item.image) continue;

		const image = normalizeMedia(item.image);
		if (image) return image;
	}

	return undefined;
}

function shouldUseCoverFallback(cover: Article["coverImage"] | undefined) {
	return !cover || cover.src.includes("localhost:1337");
}

function normalizeContinentSlug(
	continent?: StrapiDestination["continent"],
): Destination["continent"] | undefined {
	if (!continent) return undefined;
	if (typeof continent === "string") return continent as Destination["continent"];
	if ("slug" in continent && continent.slug) {
		return continent.slug as Destination["continent"];
	}
	if ("data" in continent) {
		return continent.data?.slug as Destination["continent"] | undefined;
	}
	return undefined;
}

function transformDestination(
	destination: StrapiDestination,
	continentByCountrySlug: Record<string, Destination["continent"]> = {},
): Destination {
	const image = normalizeMedia(destination.cover ?? destination.heroImage);
	const continent =
		normalizeContinentSlug(destination.continent) ??
		continentByCountrySlug[destination.slug] ??
		"europe";

	return {
		id: destination.documentId || String(destination.id),
		slug: destination.slug,
		name: destination.name,
		continent,
		type: destination.destinationType || "country",
		flagEmoji: destination.flagEmoji,
		languages: destination.languages || [],
		timezone: destination.timezone,
		visaInfo: destination.visaInfo,
		bestTimeToVisit: destination.bestTimeToVisit,
		heroImage: image
			? { ...image, alt: image.alt || destination.name }
			: undefined,
		introHtml: destination.intro?.length
			? strapiBlocksToHtml(destination.intro)
			: undefined,
		locale: destination.contentLang || "cs",
		seo: destination.seo || {
			metaTitle: `${destination.name} | Svět za málo`,
			metaDescription: `Lowcost průvodce pro ${destination.name}: rozpočet, doprava, tipy a praktické informace.`,
			keywords: [destination.name, "levné cestování"],
		},
		currency: destination.currencyCode
			? {
					code: destination.currencyCode,
					name: destination.currencyName || destination.currencyCode,
					symbol: destination.currencySymbol || destination.currencyCode,
					budgetPerDay: {
						budget: destination.budgetPerDayBudget ?? 50,
						midRange: destination.budgetPerDayMidRange ?? 100,
						luxury: destination.budgetPerDayLuxury ?? 200,
					},
				}
			: undefined,
	};
}

async function fetchCountryContinentMap(locale: SupportedLocale = "cs") {
	try {
		const response = await strapiGet<StrapiContinent[]>("/continents", {
			populate: { countries: { fields: ["slug"] } },
			locale,
		});
		const map: Record<string, Destination["continent"]> = {};

		for (const continent of normalizeCollection(response.data)) {
			const countries = normalizeCollection(
				(continent.countries as { data?: StrapiDestination[] | null } | null)?.data ??
				(continent.countries as StrapiDestination[] | undefined),
			);

			for (const country of countries) {
				if (country.slug) map[country.slug] = continent.slug as Destination["continent"];
			}
		}

		return { ...FALLBACK_COUNTRY_CONTINENTS, ...map };
	} catch {
		return FALLBACK_COUNTRY_CONTINENTS;
	}
}

function transformArticle(article: StrapiArticle): Article {
	const country = article.country?.data ?? article.country;
	const intro = article.intro ?? article.excerpt ?? "";
	const cover =
		normalizeMedia(article.cover ?? article.featuredImage) ??
		findFirstContentImage(article.content);
	const coverFallback = ARTICLE_COVER_FALLBACKS[article.slug];
	const resolvedCover = shouldUseCoverFallback(cover) ? coverFallback ?? cover : cover;

	return {
		id: article.documentId || String(article.id),
		slug: article.slug,
		title: article.title,
		intro,
		htmlContent: article.content?.length
			? strapiBlocksToHtml(article.content)
			: undefined,
		articleType: article.articleType || "destination-guide",
		destinationId:
			ARTICLE_DESTINATION_SLUGS[article.slug] ||
			country?.slug ||
			country?.documentId ||
			(country?.id ? String(country.id) : undefined),
		countryName: country?.name,
		coverImage: resolvedCover
			? { ...resolvedCover, alt: resolvedCover.alt || article.title }
			: undefined,
		tags: article.tags || [],
		publishedAt: article.publishedAt,
		updatedAt: article.updatedAt,
		locale: article.contentLang || "cs",
		seo: article.seo || {
			metaTitle: `${article.title} | Svět za málo`,
			metaDescription: intro.slice(0, 160),
			keywords: [article.title, "levné cestování"],
		},
	};
}

function mapSafely<TInput, TOutput>(
	items: TInput[],
	transform: (item: TInput) => TOutput,
	context: string,
): TOutput[] {
	const mapped: TOutput[] = [];
	for (const item of items) {
		try {
			mapped.push(transform(item));
		} catch (error) {
			console.warn(
				`Strapi transform failed (${context}), skipping record:`,
				error,
			);
		}
	}
	return mapped;
}

export async function fetchSiteConfig(
	locale: SupportedLocale = "cs",
): Promise<SiteConfig | null> {
	try {
		const response = await strapiGet<StrapiSiteConfig>("/site-config/public", {
			locale,
			populate: ["bookCover", "freeEbookCover"],
		});
		const config = response.data;
		if (!config) return null;

		const bookCover = normalizeMedia(config.bookCover);
		const freeEbookCover = normalizeMedia(config.freeEbookCover);

		return {
			...config,
			bookCover: bookCover
				? { ...bookCover, alt: bookCover.alt || config.bookTitle || "Kniha" }
				: undefined,
			freeEbookCover: freeEbookCover
				? { ...freeEbookCover, alt: freeEbookCover.alt || config.freeEbookTitle || "Ebook zdarma" }
				: undefined,
		};
	} catch (error) {
		console.warn("Strapi fetch site config failed:", error);
		return null;
	}
}

export async function fetchLatestArticles(
	limit = 6,
	locale: SupportedLocale = "cs",
): Promise<Article[]> {
	try {
		const response = await strapiGet<StrapiArticle[]>("/articles/public", {
			populate: ["cover", "country"],
			sort: ["publishedAt:desc"],
			pagination: { page: 1, pageSize: limit },
			locale,
		});
		return mapSafely(
			normalizeCollection(response.data).slice(0, limit),
			transformArticle,
			"latest articles",
		);
	} catch (error) {
		console.warn("Strapi fetch latest articles failed:", error);
		return [];
	}
}

export async function fetchArticles(
	locale: SupportedLocale = "cs",
): Promise<Article[]> {
	try {
		const response = await strapiGet<StrapiArticle[]>("/articles/public", {
			populate: ["cover", "country"],
			sort: ["publishedAt:desc"],
			locale,
		});
		return mapSafely(
			normalizeCollection(response.data),
			transformArticle,
			"articles",
		);
	} catch (error) {
		console.warn("Strapi fetch articles failed:", error);
		return [];
	}
}

export async function fetchArticlesPage(
	page = 1,
	locale: SupportedLocale = "cs",
	pageSize = ARTICLES_PAGE_SIZE,
) {
	try {
		const response = await strapiGet<StrapiArticle[]>("/articles/public", {
			populate: ["cover", "country"],
			sort: ["publishedAt:desc"],
			pagination: { page, pageSize },
			locale,
		});
		const meta = response.meta?.pagination;
		const articles = mapSafely(
			normalizeCollection(response.data),
			transformArticle,
			"articles page",
		);
		const total = meta?.total ?? articles.length;
		return {
			articles,
			page: meta?.page ?? page,
			pageCount: meta?.pageCount ?? Math.max(1, Math.ceil(total / pageSize)),
			total,
		};
	} catch (error) {
		console.warn("Strapi fetch articles page failed:", error);
		return { articles: [], page, pageCount: 1, total: 0 };
	}
}

export async function fetchAllArticles(
	locale: SupportedLocale = "cs",
): Promise<Article[]> {
	const articlesBySlug = new Map<string, Article>();
	let page = 1;
	let pageCount = 1;

	while (page <= pageCount) {
		const result = await fetchArticlesPage(page, locale, ARTICLES_SEARCH_PAGE_SIZE);
		let addedArticles = 0;

		for (const article of result.articles) {
			if (!articlesBySlug.has(article.slug)) {
				articlesBySlug.set(article.slug, article);
				addedArticles += 1;
			}
		}

		pageCount = result.pageCount;
		if (result.articles.length === 0 || addedArticles === 0) break;
		page += 1;
	}

	return Array.from(articlesBySlug.values());
}

export async function fetchArticleBySlug(
	slug: string,
	locale: SupportedLocale = "cs",
): Promise<Article | null> {
	try {
		const response = await strapiGet<StrapiArticle>(`/articles/public/${slug}`, {
			populate: ["cover", "country"],
			locale,
		});
		const article = response.data;
		return article ? transformArticle(article) : null;
	} catch (error) {
		console.warn("Strapi fetch article by slug failed:", error);
		return null;
	}
}

export async function fetchDestinations(
	locale: SupportedLocale = "cs",
): Promise<Destination[]> {
	try {
		const [response, continentByCountrySlug] = await Promise.all([
			strapiGet<StrapiDestination[]>("/countries/public", {
				populate: "*",
				sort: ["name:asc"],
				locale,
			}),
			fetchCountryContinentMap(locale),
		]);
		return mapSafely(
			normalizeCollection(response.data),
			(destination) => transformDestination(destination, continentByCountrySlug),
			"destinations",
		);
	} catch (error) {
		console.warn("Strapi fetch destinations failed:", error);
		return [];
	}
}

export async function fetchDestinationBySlug(
	slug: string,
	locale: SupportedLocale = "cs",
): Promise<Destination | null> {
	try {
		const [response, continentByCountrySlug] = await Promise.all([
			strapiGet<StrapiDestination[]>("/countries/public", {
				filters: { slug: { $eq: slug } },
				populate: "*",
				locale,
			}),
			fetchCountryContinentMap(locale),
		]);
		const [destination] = normalizeCollection(response.data);
		return destination
			? transformDestination(destination, continentByCountrySlug)
			: null;
	} catch (error) {
		console.warn("Strapi fetch destination by slug failed:", error);
		return null;
	}
}

export async function fetchDestinationsByContinent(
	continent: string,
	locale: SupportedLocale = "cs",
): Promise<Destination[]> {
	const destinations = await fetchDestinations(locale);
	return destinations.filter((destination) => destination.continent === continent);
}

export async function createLead(payload: {
	email: string;
	leadType: string;
	source?: string;
	locale?: SupportedLocale;
}) {
	return strapiPost("/book-interests", payload);
}

export async function createOrder(payload: Record<string, unknown>) {
	return strapiPost("/orders", payload);
}
