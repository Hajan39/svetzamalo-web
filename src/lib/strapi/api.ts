import type {
	PageCopy,
	SiteConfig,
	SupportedLocale,
} from "@/types";
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

interface StrapiSiteConfig extends Omit<SiteConfig, "bookCover" | "freeEbookCover"> {
	bookCover?: StrapiMedia | { data?: StrapiMedia | null } | null;
	freeEbookCover?: StrapiMedia | { data?: StrapiMedia | null } | null;
}

interface StrapiPageCopy extends StrapiEntity, PageCopy {}

const STRAPI_BASE = (
	import.meta.env.STRAPI_URL ||
	import.meta.env.PUBLIC_STRAPI_URL ||
	"http://localhost:1337"
).replace(/\/$/, "");

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

export async function fetchPageCopy(
	key: string,
	locale: SupportedLocale = "cs",
): Promise<PageCopy | null> {
	try {
		const response = await strapiGet<StrapiPageCopy>(`/page-copies/public/${encodeURIComponent(key)}`, {
			locale,
		});
		return response.data || null;
	} catch (error) {
		console.warn(`Strapi fetch page copy failed for ${key}:`, error);
		return null;
	}
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
