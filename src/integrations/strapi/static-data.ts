/**
 * Static Data Source
 *
 * Loads destination and article JSON files exported from the WordPress
 * migration (same shape as Strapi entities) and exposes them so the
 * frontend can run completely without a live Strapi backend.
 */

import type { StrapiArticle, StrapiDestination } from "./types";

// ---------------------------------------------------------------------------
// Destinations
// ---------------------------------------------------------------------------

const destinationModules = import.meta.glob<{ default: StrapiDestination }>(
  "../../data/destinations/*.json",
  { eager: true },
);

const ALL_DESTINATIONS: StrapiDestination[] = Object.values(destinationModules)
  .map((m) => (m as { default: StrapiDestination }).default)
  .filter((d) => d && typeof d === "object" && "slug" in d);

const DESTINATION_BY_SLUG = new Map<string, StrapiDestination>(
  ALL_DESTINATIONS.map((d) => [d.slug, d]),
);

function matchesLocale<T extends { contentLang?: "cs" | "en" }>(
  entity: T,
  contentLocale?: "cs" | "en",
): boolean {
  if (!contentLocale) return true;
  if (contentLocale === "en") return entity.contentLang === "en";
  return entity.contentLang === "cs" || entity.contentLang == null;
}

function byName(a: StrapiDestination, b: StrapiDestination): number {
  return (a.name || "").localeCompare(b.name || "");
}

/** Static replacement for fetchDestinations(). */
export function staticGetDestinations(
  contentLocale?: "cs" | "en",
): StrapiDestination[] {
  return ALL_DESTINATIONS.filter((d) => matchesLocale(d, contentLocale)).sort(
    byName,
  );
}

/** Static replacement for fetchDestinationBySlug(). */
export function staticGetDestinationBySlug(
  slug: string,
): StrapiDestination | null {
  return DESTINATION_BY_SLUG.get(slug) ?? null;
}

/** Static replacement for fetchDestinationById(). */
export function staticGetDestinationById(
  id: string | number,
): StrapiDestination | null {
  const asString = String(id);
  return (
    ALL_DESTINATIONS.find(
      (d) => d.documentId === asString || String(d.id) === asString,
    ) ?? null
  );
}

/** Static replacement for fetchDestinationsByContinent(). */
export function staticGetDestinationsByContinent(
  continent: string,
  contentLocale?: "cs" | "en",
): StrapiDestination[] {
  return ALL_DESTINATIONS.filter(
    (d) => d.continent === continent && matchesLocale(d, contentLocale),
  ).sort(byName);
}

// ---------------------------------------------------------------------------
// Articles
// ---------------------------------------------------------------------------

/**
 * Shape of the WordPress-migration article JSON.
 * Fewer fields than a real Strapi entity; we enrich them below.
 */
interface RawArticleJson {
  title: string;
  slug: string;
  excerpt?: string;
  articleType?: string;
  contentLang?: "cs" | "en";
  tags?: string[];
  destinationSlug?: string;
  listDestinationSlugs?: string[];
  publish?: boolean;
  readingTime?: number;
  content?: unknown[];
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

const articleModules = import.meta.glob<{ default: RawArticleJson }>(
  "../../data/articles/*.json",
  { eager: true },
);

/** Deterministic numeric id derived from the slug – stable across reloads. */
function slugToId(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) | 0;
  }
  // Keep it positive; collisions are acceptable since we also use documentId = slug.
  return Math.abs(h);
}

function rawToStrapiArticle(raw: RawArticleJson): StrapiArticle {
  const destination = raw.destinationSlug
    ? DESTINATION_BY_SLUG.get(raw.destinationSlug)
    : undefined;

  return {
    id: slugToId(raw.slug),
    documentId: raw.slug,
    slug: raw.slug,
    title: raw.title,
    excerpt: raw.excerpt,
    intro: raw.excerpt,
    articleType: raw.articleType,
    tags: raw.tags ?? [],
    content: raw.content as unknown[] | undefined,
    contentLang: raw.contentLang,
    publishedAt: raw.publishedAt,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    destinationId: destination?.documentId || destination?.id?.toString(),
  } as StrapiArticle;
}

const ALL_ARTICLES: StrapiArticle[] = Object.values(articleModules)
  .map((m) => (m as { default: RawArticleJson }).default)
  .filter(
    (a) => a && typeof a === "object" && "slug" in a && a.publish !== false,
  )
  .map(rawToStrapiArticle);

const ARTICLE_BY_SLUG = new Map<string, StrapiArticle>(
  ALL_ARTICLES.map((a) => [a.slug, a]),
);

function articlesForLocale(contentLocale?: "cs" | "en"): StrapiArticle[] {
  return ALL_ARTICLES.filter((a) => matchesLocale(a, contentLocale));
}

/** Static replacement for fetchArticles(). */
export function staticGetArticles(
  contentLocale?: "cs" | "en",
): StrapiArticle[] {
  return articlesForLocale(contentLocale);
}

/** Static replacement for fetchArticleBySlug(). */
export function staticGetArticleBySlug(slug: string): StrapiArticle | null {
  return ARTICLE_BY_SLUG.get(slug) ?? null;
}

/** Static replacement for fetchArticleById(). */
export function staticGetArticleById(
  id: string | number,
): StrapiArticle | null {
  const asString = String(id);
  return (
    ALL_ARTICLES.find(
      (a) => a.documentId === asString || String(a.id) === asString,
    ) ?? null
  );
}

/** Static replacement for fetchArticlesByDestination(). */
export function staticGetArticlesByDestination(
  destinationId: string,
  contentLocale?: "cs" | "en",
): StrapiArticle[] {
  return articlesForLocale(contentLocale).filter(
    (a) => a.destinationId === destinationId,
  );
}

/** Static replacement for fetchArticlesByTag(). */
export function staticGetArticlesByTag(
  tag: string,
  contentLocale?: "cs" | "en",
): StrapiArticle[] {
  const needle = tag.toLowerCase();
  return articlesForLocale(contentLocale).filter((a) =>
    (a.tags ?? []).some((t) => t.toLowerCase() === needle),
  );
}

/** Static replacement for fetchLatestArticles(). */
export function staticGetLatestArticles(
  limit = 6,
  contentLocale?: "cs" | "en",
): StrapiArticle[] {
  return articlesForLocale(contentLocale).slice(0, limit);
}
