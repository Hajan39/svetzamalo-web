import type {SupportedLocale} from '@/types'
import * as sanityApi from '@/lib/sanity/api'
import * as strapiApi from '@/lib/strapi/api'

const CONTENT_SOURCE = (import.meta.env.PUBLIC_CONTENT_SOURCE || 'sanity').toLowerCase()
const useSanityPrimary = CONTENT_SOURCE !== 'strapi'

function shouldFallbackCollection(items: unknown[]): boolean {
  return items.length === 0
}

function shouldFallbackNullable<T>(item: T | null): boolean {
  return item == null
}

type ArticlesPageResult = Awaited<ReturnType<typeof sanityApi.fetchArticlesPage>>

function shouldFallbackArticlesPage(page: ArticlesPageResult): boolean {
  return page.total === 0 || page.articles.length === 0
}

export async function fetchLatestArticles(limit = 6, locale: SupportedLocale = 'cs') {
  if (!useSanityPrimary) return strapiApi.fetchLatestArticles(limit, locale)

  const sanityData = await sanityApi.fetchLatestArticles(limit, locale)
  if (!shouldFallbackCollection(sanityData)) return sanityData

  console.warn('Sanity latest articles empty, falling back to Strapi')
  return strapiApi.fetchLatestArticles(limit, locale)
}

export async function fetchArticles(locale: SupportedLocale = 'cs') {
  if (!useSanityPrimary) return strapiApi.fetchArticles(locale)

  const sanityData = await sanityApi.fetchArticles(locale)
  if (!shouldFallbackCollection(sanityData)) return sanityData

  console.warn('Sanity articles empty, falling back to Strapi')
  return strapiApi.fetchArticles(locale)
}

export async function fetchArticlesPage(page = 1, locale: SupportedLocale = 'cs', pageSize = 12) {
  if (!useSanityPrimary) return strapiApi.fetchArticlesPage(page, locale, pageSize)

  const sanityData = await sanityApi.fetchArticlesPage(page, locale, pageSize)
  if (!shouldFallbackArticlesPage(sanityData)) return sanityData

  console.warn('Sanity articles page empty, falling back to Strapi')
  return strapiApi.fetchArticlesPage(page, locale, pageSize)
}

export async function fetchAllArticles(locale: SupportedLocale = 'cs') {
  if (!useSanityPrimary) return strapiApi.fetchAllArticles(locale)

  const sanityData = await sanityApi.fetchAllArticles(locale)
  if (!shouldFallbackCollection(sanityData)) return sanityData

  console.warn('Sanity all articles empty, falling back to Strapi')
  return strapiApi.fetchAllArticles(locale)
}

export async function fetchArticleBySlug(slug: string, locale: SupportedLocale = 'cs') {
  if (!useSanityPrimary) return strapiApi.fetchArticleBySlug(slug, locale)

  const sanityData = await sanityApi.fetchArticleBySlug(slug, locale)
  if (!shouldFallbackNullable(sanityData)) return sanityData

  console.warn(`Sanity article "${slug}" missing, falling back to Strapi`)
  return strapiApi.fetchArticleBySlug(slug, locale)
}

export async function fetchDestinations(locale: SupportedLocale = 'cs') {
  if (!useSanityPrimary) return strapiApi.fetchDestinations(locale)

  const sanityData = await sanityApi.fetchDestinations(locale)
  if (!shouldFallbackCollection(sanityData)) return sanityData

  console.warn('Sanity destinations empty, falling back to Strapi')
  return strapiApi.fetchDestinations(locale)
}

export async function fetchDestinationBySlug(slug: string, locale: SupportedLocale = 'cs') {
  if (!useSanityPrimary) return strapiApi.fetchDestinationBySlug(slug, locale)

  const sanityData = await sanityApi.fetchDestinationBySlug(slug, locale)
  if (!shouldFallbackNullable(sanityData)) return sanityData

  console.warn(`Sanity destination "${slug}" missing, falling back to Strapi`)
  return strapiApi.fetchDestinationBySlug(slug, locale)
}

export async function fetchDestinationsByContinent(continent: string, locale: SupportedLocale = 'cs') {
  if (!useSanityPrimary) return strapiApi.fetchDestinationsByContinent(continent, locale)

  const sanityData = await sanityApi.fetchDestinationsByContinent(continent, locale)
  if (!shouldFallbackCollection(sanityData)) return sanityData

  console.warn(`Sanity destinations for continent "${continent}" empty, falling back to Strapi`)
  return strapiApi.fetchDestinationsByContinent(continent, locale)
}

export function fetchSiteConfig(locale: SupportedLocale = 'cs') {
  return strapiApi.fetchSiteConfig(locale)
}

export const createLead = strapiApi.createLead
export const createOrder = strapiApi.createOrder
