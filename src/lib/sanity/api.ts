import type {Article, Destination, SupportedLocale} from '@/types'
import {ARTICLE_COVER_FALLBACKS} from '../articleCoverFallbacks'
import {sanityPortableTextToHtml} from './portableText'
import {sanityClient} from './client'

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
  return !cover || cover.src.includes('localhost:1337')
}

function languagesFromQuickFacts(language?: string) {
  if (!language) return []
  return language
    .split(/[,/]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function normalizeContinent(continent?: SanityContinent): Destination['continent'] {
  return (continent?.slug || 'europe') as Destination['continent']
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
  const metaDescription =
    destination.seoDescription ||
    introHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160) ||
    `Lowcost průvodce pro ${destination.name}: rozpočet, doprava, tipy a praktické informace.`

  return {
    id: destination._id,
    slug: destination.slug,
    name: destination.name,
    continent: normalizeContinent(destination.continent),
    type: 'country',
    languages: languagesFromQuickFacts(destination.quickFacts?.language),
    timezone: destination.quickFacts?.timezone,
    visaInfo: destination.quickFacts?.visa,
    bestTimeToVisit: destination.quickFacts?.bestTime,
    electricityPlug: destination.quickFacts?.electricityPlug,
    drivingSide: normalizeDrivingSide(destination.quickFacts?.drivingSide),
    heroImage: heroImage ? {...heroImage, alt: heroImage.alt || destination.name} : undefined,
    introHtml: introHtml || undefined,
    locale: destination.locale || 'cs',
    currency: parseCurrencyFromQuickFacts(destination.quickFacts?.currency),
    seo: {
      metaTitle: destination.seoTitle || `${destination.name} | Svět za málo`,
      metaDescription,
      keywords: [destination.name, 'levné cestování'],
    },
  }
}

function transformArticle(article: SanityArticle): Article {
  const intro = article.excerpt || ''
  const cover = normalizeMedia(article.cover) ?? findFirstContentImage(article.content)
  const coverFallback = ARTICLE_COVER_FALLBACKS[article.slug]
  const resolvedCover = shouldUseCoverFallback(cover) ? coverFallback ?? cover : cover

  return {
    id: article._id,
    slug: article.slug,
    title: article.title,
    intro,
    htmlContent: sanityPortableTextToHtml(article.content) || undefined,
    articleType: article.articleType || 'destination-guide',
    destinationId: article.country?.slug,
    countryName: article.country?.name,
    coverImage: resolvedCover ? {...resolvedCover, alt: resolvedCover.alt || article.title} : undefined,
    relatedArticles: article.relatedArticles?.map(transformArticle).filter(Boolean),
    tags: [],
    publishedAt: article._createdAt,
    updatedAt: article._updatedAt,
    locale: article.locale || 'cs',
    seo: {
      metaTitle: article.seoTitle || `${article.title} | Svět za málo`,
      metaDescription: article.seoDescription || intro.slice(0, 160),
      keywords: [article.title, 'levné cestování'],
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

export async function fetchLatestArticles(limit = 6, locale: SupportedLocale = 'cs'): Promise<Article[]> {
  try {
    const articles = await sanityClient.fetch<SanityArticle[]>(
      `*[_type == "article" && locale == $locale] | order(_createdAt desc)[0...$limit]{${articleProjection}}`,
      {locale, limit},
    )
    return mapSafely(articles, transformArticle, 'latest articles')
  } catch (error) {
    console.warn('Sanity fetch latest articles failed:', error)
    return []
  }
}

export async function fetchArticles(locale: SupportedLocale = 'cs'): Promise<Article[]> {
  try {
    const articles = await sanityClient.fetch<SanityArticle[]>(
      `*[_type == "article" && locale == $locale] | order(_createdAt desc){${articleProjection}}`,
      {locale},
    )
    return mapSafely(articles, transformArticle, 'articles')
  } catch (error) {
    console.warn('Sanity fetch articles failed:', error)
    return []
  }
}

export async function fetchArticlesPage(page = 1, locale: SupportedLocale = 'cs', pageSize = ARTICLES_PAGE_SIZE) {
  try {
    const start = Math.max(0, (page - 1) * pageSize)
    const end = start + pageSize
    const result = await sanityClient.fetch<{articles: SanityArticle[]; total: number}>(
      `{
        "articles": *[_type == "article" && locale == $locale] | order(_createdAt desc)[$start...$end]{${articleProjection}},
        "total": count(*[_type == "article" && locale == $locale])
      }`,
      {locale, start, end},
    )
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

export async function fetchAllArticles(locale: SupportedLocale = 'cs'): Promise<Article[]> {
  const articlesBySlug = new Map<string, Article>()
  let page = 1
  let pageCount = 1

  while (page <= pageCount) {
    const result = await fetchArticlesPage(page, locale, ARTICLES_SEARCH_PAGE_SIZE)
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

export async function fetchArticleBySlug(slug: string, locale: SupportedLocale = 'cs'): Promise<Article | null> {
  try {
    const article = await sanityClient.fetch<SanityArticle | null>(
      `*[_type == "article" && slug.current == $slug && locale == $locale][0]{${articleProjection}}`,
      {slug, locale},
    )
    return article ? transformArticle(article) : null
  } catch (error) {
    console.warn('Sanity fetch article by slug failed:', error)
    return null
  }
}

export async function fetchDestinations(locale: SupportedLocale = 'cs'): Promise<Destination[]> {
  try {
    const destinations = await sanityClient.fetch<SanityCountry[]>(
      `*[_type == "country" && locale == $locale] | order(name asc){${countryProjection}}`,
      {locale},
    )
    return mapSafely(destinations, transformDestination, 'destinations')
  } catch (error) {
    console.warn('Sanity fetch destinations failed:', error)
    return []
  }
}

export async function fetchDestinationBySlug(slug: string, locale: SupportedLocale = 'cs'): Promise<Destination | null> {
  try {
    const destination = await sanityClient.fetch<SanityCountry | null>(
      `*[_type == "country" && slug.current == $slug && locale == $locale][0]{${countryProjection}}`,
      {slug, locale},
    )
    return destination ? transformDestination(destination) : null
  } catch (error) {
    console.warn('Sanity fetch destination by slug failed:', error)
    return null
  }
}

export async function fetchDestinationsByContinent(continent: string, locale: SupportedLocale = 'cs'): Promise<Destination[]> {
  const destinations = await fetchDestinations(locale)
  return destinations.filter((destination) => destination.continent === continent)
}
