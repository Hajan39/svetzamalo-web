import type {Article, Destination, SupportedLocale} from '@/types'
import {stegaClean} from '@sanity/client/stega'
import {ARTICLE_COVER_FALLBACKS} from '../articleCoverFallbacks'
import {sanityPortableTextToHtml} from './portableText'
import {loadQuery} from './loadQuery'

export interface SanityFetchOptions {
  perspectiveCookie?: string
}

interface SanityImage {
  asset?: {
    url?: string
    metadata?: {
      dimensions?: {
        width?: number
        height?: number
      }
    }
  }
  alt?: string
  caption?: string
}

interface SanityContinent {
  name?: string
  slug?: string
}

interface SanityCountry {
  _id: string
  _createdAt?: string
  _updatedAt?: string
  name: string
  slug: string
  locale?: SupportedLocale
  cover?: SanityImage
  intro?: unknown[]
  quickFacts?: {
    currency?: string
    language?: string
    timezone?: string
    bestTime?: string
    visa?: string
    electricityPlug?: string
    drivingSide?: string
  }
  continent?: SanityContinent
  seoTitle?: string
  seoDescription?: string
}

interface SanityArticle {
  _id: string
  _createdAt?: string
  _updatedAt?: string
  title: string
  slug: string
  locale?: SupportedLocale
  excerpt?: string
  articleType?: string
  cover?: SanityImage
  content?: unknown[]
  relatedArticles?: SanityArticle[]
  country?: SanityCountry
  seoTitle?: string
  seoDescription?: string
}

const ARTICLES_PAGE_SIZE = 12
const ARTICLES_SEARCH_PAGE_SIZE = 100
const contentProjection = `
  ...,
  _type == "articleImage" => {
    ...,
    asset->{url, metadata{dimensions}}
  },
  markDefs[]{
    ...,
    _type == "internalArticleLink" => {
      ...,
      "articleSlug": article->slug.current
    }
  }
`

const imageProjection = `asset->{url, metadata{dimensions}}, alt, caption`

const countryProjection = `
  _id,
  _createdAt,
  _updatedAt,
  name,
  "slug": slug.current,
  locale,
  cover{${imageProjection}},
  intro[]{${contentProjection}},
  quickFacts,
  continent->{name, "slug": slug.current},
  seoTitle,
  seoDescription
`

const articleProjection = `
  _id,
  _createdAt,
  _updatedAt,
  title,
  "slug": slug.current,
  locale,
  excerpt,
  articleType,
  cover{${imageProjection}},
  content[]{${contentProjection}},
  relatedArticles[]->{
    _id,
    _createdAt,
    _updatedAt,
    title,
    "slug": slug.current,
    locale,
    excerpt,
    articleType,
    cover{${imageProjection}},
    country->{_id, name, "slug": slug.current, locale}
  },
  country->{${countryProjection}},
  seoTitle,
  seoDescription
`

function normalizeMedia(image?: SanityImage): Article['coverImage'] {
  const url = image?.asset?.url
  if (!url) return undefined

  return {
    src: url,
    alt: image.alt || '',
    width: image.asset?.metadata?.dimensions?.width,
    height: image.asset?.metadata?.dimensions?.height,
  }
}

function cleanString(value?: string): string | undefined {
  return value ? stegaClean(value) : value
}

function findFirstContentImage(content: unknown[] | undefined) {
  if (!Array.isArray(content)) return undefined

  for (const block of content) {
    const item = block as {_type?: string} & SanityImage
    if (item._type !== 'articleImage') continue

    const image = normalizeMedia(item)
    if (image) return image
  }

  return undefined
}

function shouldUseCoverFallback(cover: Article['coverImage'] | undefined) {
  return !cover
}

function languagesFromQuickFacts(language?: string) {
  if (!language) return []
  return language
    .split(/[,/]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function normalizeContinent(continent?: SanityContinent): Destination['continent'] {
  return (cleanString(continent?.slug) || 'europe') as Destination['continent']
}

function parseCurrencyFromQuickFacts(currency?: string): Destination['currency'] {
  if (!currency) return undefined
  const line = currency.trim()
  if (!line) return undefined

  const upper = line.toUpperCase()
  const isoFromParens = line.match(/\(([A-Z]{3})\)/)?.[1]
  const isoFromWord = line.match(/\b([A-Z]{3})\b/)?.[1]
  const inferredCode =
    isoFromParens ||
    isoFromWord ||
    (upper.includes('EURO') || line.includes('€') ? 'EUR' : undefined) ||
    (upper.includes('DOLAR') || upper.includes('DOLLAR') || line.includes('$') ? 'USD' : undefined) ||
    (upper.includes('KORUNA') || upper.includes('CZK') || line.includes('Kč') ? 'CZK' : undefined) ||
    (upper.includes('LIBRA') || upper.includes('GBP') || line.includes('£') ? 'GBP' : undefined) ||
    (upper.includes('ZLOT') || upper.includes('PLN') || line.includes('zł') ? 'PLN' : undefined)

  if (!inferredCode) return undefined

  const symbolFromParens = line.match(/\(([^)]+)\)/)?.[1]
  return {
    code: inferredCode,
    name: line,
    symbol: symbolFromParens || inferredCode,
    budgetPerDay: {
      budget: 50,
      midRange: 100,
      luxury: 200,
    },
  }
}

function normalizeDrivingSide(value?: string): string | undefined {
  if (!value) return undefined
  const lower = value.toLowerCase()
  if (lower.includes('vlevo') || lower.includes('left') || lower.includes('levostr')) return 'vlevo'
  if (lower.includes('vpravo') || lower.includes('right') || lower.includes('pravostr')) return 'vpravo'
  return value
}

function transformDestination(destination: SanityCountry): Destination {
  const heroImage = normalizeMedia(destination.cover)
  const introHtml = sanityPortableTextToHtml(destination.intro)
  const name = cleanString(destination.name) || destination.name
  const metaDescription =
    cleanString(destination.seoDescription) ||
    introHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160) ||
    `Lowcost průvodce pro ${name}: rozpočet, doprava, tipy a praktické informace.`

  return {
    id: destination._id,
    slug: cleanString(destination.slug) || destination.slug,
    name,
    continent: normalizeContinent(destination.continent),
    type: 'country',
    languages: languagesFromQuickFacts(destination.quickFacts?.language),
    timezone: destination.quickFacts?.timezone,
    visaInfo: destination.quickFacts?.visa,
    bestTimeToVisit: destination.quickFacts?.bestTime,
    electricityPlug: destination.quickFacts?.electricityPlug,
    drivingSide: normalizeDrivingSide(destination.quickFacts?.drivingSide),
    heroImage: heroImage ? {...heroImage, alt: heroImage.alt || name} : undefined,
    introHtml: introHtml || undefined,
    locale: (cleanString(destination.locale) as SupportedLocale | undefined) || 'cs',
    currency: parseCurrencyFromQuickFacts(destination.quickFacts?.currency),
    seo: {
      metaTitle: cleanString(destination.seoTitle) || `${name} | Svět za málo`,
      metaDescription,
      keywords: [name, 'levné cestování'],
    },
  }
}

function transformArticle(article: SanityArticle): Article {
  const intro = article.excerpt || ''
  const cover = normalizeMedia(article.cover) ?? findFirstContentImage(article.content)
  const slug = cleanString(article.slug) || article.slug
  const title = article.title
  const cleanTitle = cleanString(article.title) || article.title
  const coverFallback = ARTICLE_COVER_FALLBACKS[slug]
  const resolvedCover = shouldUseCoverFallback(cover) ? coverFallback ?? cover : cover

  return {
    id: article._id,
    slug,
    title,
    intro,
    htmlContent: sanityPortableTextToHtml(article.content) || undefined,
    articleType: cleanString(article.articleType) || 'destination-guide',
    destinationId: cleanString(article.country?.slug),
    countryName: article.country?.name,
    coverImage: resolvedCover ? {...resolvedCover, alt: resolvedCover.alt || article.title} : undefined,
    relatedArticles: article.relatedArticles?.map(transformArticle).filter(Boolean),
    tags: [],
    publishedAt: article._createdAt,
    updatedAt: article._updatedAt,
    locale: (cleanString(article.locale) as SupportedLocale | undefined) || 'cs',
    seo: {
      metaTitle: cleanString(article.seoTitle) || `${cleanTitle} | Svět za málo`,
      metaDescription: cleanString(article.seoDescription) || cleanString(intro)?.slice(0, 160) || '',
      keywords: [cleanTitle, 'levné cestování'],
    },
  }
}

function mapSafely<TInput, TOutput>(items: TInput[], transform: (item: TInput) => TOutput, context: string): TOutput[] {
  const mapped: TOutput[] = []
  for (const item of items) {
    try {
      mapped.push(transform(item))
    } catch (error) {
      console.warn(`Sanity transform failed (${context}), skipping record:`, error)
    }
  }
  return mapped
}

export async function fetchLatestArticles(limit = 6, locale: SupportedLocale = 'cs', options: SanityFetchOptions = {}): Promise<Article[]> {
  try {
    const {data} = await loadQuery<SanityArticle[]>({
      query: `*[_type == "article" && locale == $locale] | order(_createdAt desc)[0...$limit]{${articleProjection}}`,
      params: {locale, limit},
      ...options,
    })
    return mapSafely(data, transformArticle, 'latest articles')
  } catch (error) {
    console.warn('Sanity fetch latest articles failed:', error)
    return []
  }
}

export async function fetchArticles(locale: SupportedLocale = 'cs', options: SanityFetchOptions = {}): Promise<Article[]> {
  try {
    const {data} = await loadQuery<SanityArticle[]>({
      query: `*[_type == "article" && locale == $locale] | order(_createdAt desc){${articleProjection}}`,
      params: {locale},
      ...options,
    })
    return mapSafely(data, transformArticle, 'articles')
  } catch (error) {
    console.warn('Sanity fetch articles failed:', error)
    return []
  }
}

export async function fetchArticlesPage(page = 1, locale: SupportedLocale = 'cs', pageSize = ARTICLES_PAGE_SIZE, options: SanityFetchOptions = {}) {
  try {
    const start = Math.max(0, (page - 1) * pageSize)
    const end = start + pageSize
    const {data: result} = await loadQuery<{articles: SanityArticle[]; total: number}>({
      query: `{
        "articles": *[_type == "article" && locale == $locale] | order(_createdAt desc)[$start...$end]{${articleProjection}},
        "total": count(*[_type == "article" && locale == $locale])
      }`,
      params: {locale, start, end},
      ...options,
    })
    const articles = mapSafely(result.articles, transformArticle, 'articles page')
    const total = result.total ?? articles.length
    return {
      articles,
      page,
      pageCount: Math.max(1, Math.ceil(total / pageSize)),
      total,
    }
  } catch (error) {
    console.warn('Sanity fetch articles page failed:', error)
    return {articles: [], page, pageCount: 1, total: 0}
  }
}

export async function fetchAllArticles(locale: SupportedLocale = 'cs', options: SanityFetchOptions = {}): Promise<Article[]> {
  const articlesBySlug = new Map<string, Article>()
  let page = 1
  let pageCount = 1

  while (page <= pageCount) {
    const result = await fetchArticlesPage(page, locale, ARTICLES_SEARCH_PAGE_SIZE, options)
    let addedArticles = 0

    for (const article of result.articles) {
      if (!articlesBySlug.has(article.slug)) {
        articlesBySlug.set(article.slug, article)
        addedArticles += 1
      }
    }

    pageCount = result.pageCount
    if (result.articles.length === 0 || addedArticles === 0) break
    page += 1
  }

  return Array.from(articlesBySlug.values())
}

export async function fetchArticleBySlug(slug: string, locale: SupportedLocale = 'cs', options: SanityFetchOptions = {}): Promise<Article | null> {
  try {
    const {data} = await loadQuery<SanityArticle | null>({
      query: `*[_type == "article" && slug.current == $slug && locale == $locale][0]{${articleProjection}}`,
      params: {slug, locale},
      ...options,
    })
    return data ? transformArticle(data) : null
  } catch (error) {
    console.warn('Sanity fetch article by slug failed:', error)
    return null
  }
}

export async function fetchDestinations(locale: SupportedLocale = 'cs', options: SanityFetchOptions = {}): Promise<Destination[]> {
  try {
    const {data} = await loadQuery<SanityCountry[]>({
      query: `*[_type == "country" && locale == $locale] | order(name asc){${countryProjection}}`,
      params: {locale},
      ...options,
    })
    return mapSafely(data, transformDestination, 'destinations')
  } catch (error) {
    console.warn('Sanity fetch destinations failed:', error)
    return []
  }
}

export async function fetchDestinationBySlug(slug: string, locale: SupportedLocale = 'cs', options: SanityFetchOptions = {}): Promise<Destination | null> {
  try {
    const {data} = await loadQuery<SanityCountry | null>({
      query: `*[_type == "country" && slug.current == $slug && locale == $locale][0]{${countryProjection}}`,
      params: {slug, locale},
      ...options,
    })
    return data ? transformDestination(data) : null
  } catch (error) {
    console.warn('Sanity fetch destination by slug failed:', error)
    return null
  }
}

export async function fetchDestinationsByContinent(continent: string, locale: SupportedLocale = 'cs', options: SanityFetchOptions = {}): Promise<Destination[]> {
  const destinations = await fetchDestinations(locale, options)
  return destinations.filter((destination) => destination.continent === continent)
}
