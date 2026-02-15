/**
 * Strapi Content Type Definitions
 * 
 * Type definitions for Strapi content types matching the frontend types
 */

import type { Destination, Article } from '@/types'
import { strapiBlocksToHtml } from '@/lib/strapi-blocks-to-html'

/**
 * Strapi entity with common fields
 */
export interface StrapiEntity {
  id: number
  documentId?: string
  createdAt?: string
  updatedAt?: string
  publishedAt?: string
  locale?: string
  localizations?: unknown[]
}

/**
 * Strapi Destination entity
 * Minimal schema (from WordPress migration): name, slug, intro, cover
 * Full schema may include: type, continent, currency, heroImage, seo, etc.
 */
export interface StrapiDestination extends StrapiEntity {
  slug: string
  name: string
  type?: 'country' | 'region' | 'city' | 'microstate'
  parentId?: string | null
  continent?: string
  heroImage?: {
    data?: {
      id: number
      attributes: {
        url: string
        alternativeText?: string
        width: number
        height: number
      }
    } | null
  }
  /** Strapi v5 media field - cover image */
  cover?: {
    data?: {
      url?: string
      attributes?: { url?: string; alternativeText?: string }
      alternativeText?: string
    } | null
  } | null
  flagEmoji?: string
  currency?: {
    code: string
    name: string
    symbol: string
    exchangeRateToUsd: number
    budgetPerDay: {
      budget: number
      midRange: number
      luxury: number
    }
  }
  languages?: string[]
  timezone?: string
  visaInfo?: string
  bestTimeToVisit?: string
  seo?: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
  }
  /** Main content from WordPress migration (Strapi blocks) */
  intro?: unknown[]
  /** Content language – renamed from 'locale' (reserved in Strapi v5) */
  contentLang?: 'cs' | 'en'
}

/**
 * Strapi Article entity
 * Migrated articles (from WordPress) have: content (blocks), excerpt. No sections/destination.
 */
export interface StrapiArticle extends StrapiEntity {
  slug: string
  title: string
  intro?: string
  excerpt?: string
  content?: unknown[]
  articleType?: string
  destination?: {
    data?: StrapiDestination | null
  }
  destinationId?: string
  tags?: string[]
  sections?: Array<{
    id: string
    title: string
    content: string
  }>
  contentBlocks?: unknown[]
  places?: Array<{
    id: string
    name: string
    description: string
    latitude: number
    longitude: number
    type?: string
  }>
  faq?: Array<{
    id: string
    question: string
    answer: string
  }>
  monetization?: unknown[]
  featuredImage?: {
    data?: {
      id: number
      attributes: {
        url: string
        alternativeText?: string
        width: number
        height: number
      }
    } | null
  }
  /** Strapi media field (single image) – v5 schema uses "cover" */
  cover?: {
    data?: {
      id?: number
      documentId?: string
      url?: string
      attributes?: { url?: string; alternativeText?: string }
      alternativeText?: string
      width?: number
      height?: number
    } | null
  } | null
  seo?: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
  }
}

const STRAPI_BASE =
  (typeof import.meta !== 'undefined' && (import.meta as { env?: { VITE_STRAPI_URL?: string } }).env?.VITE_STRAPI_URL) || ''

const DEFAULT_CURRENCY: Destination['currency'] = {
  code: 'USD',
  name: 'US Dollar',
  symbol: '$',
  exchangeRateToUsd: 1,
  budgetPerDay: { budget: 50, midRange: 100, luxury: 200 },
}

/**
 * Transform Strapi destination to frontend Destination type
 * Handles minimal schema (from WordPress migration) with defaults
 */
export function transformStrapiDestination(
  strapiDest: StrapiDestination
): Destination {
  // Strapi v5: cover is returned directly (not wrapped in .data)
  // Strapi v4: cover is in .data or .data.attributes
  const cover = strapiDest.cover?.data ?? strapiDest.cover ?? strapiDest.heroImage?.data
  const coverUrl = (cover as { url?: string; attributes?: { url?: string } })?.url
    ?? (cover as { attributes?: { url?: string } })?.attributes?.url
  return {
    id: strapiDest.documentId || strapiDest.id.toString(),
    slug: strapiDest.slug,
    name: strapiDest.name,
    type: (strapiDest.type as Destination['type']) || 'country',
    parentId: strapiDest.parentId || undefined,
    continent: (strapiDest.continent as Destination['continent']) || 'europe',
    flagEmoji: strapiDest.flagEmoji,
    currency: strapiDest.currency || DEFAULT_CURRENCY,
    languages: strapiDest.languages || [],
    timezone: strapiDest.timezone,
    visaInfo: strapiDest.visaInfo,
    bestTimeToVisit: strapiDest.bestTimeToVisit,
    heroImage: coverUrl
      ? {
          url: coverUrl.startsWith('http') ? coverUrl : `${STRAPI_BASE.replace(/\/$/, '')}${coverUrl.startsWith('/') ? '' : '/'}${coverUrl}`,
          alt: (cover as { alternativeText?: string; attributes?: { alternativeText?: string } })?.alternativeText
            ?? (cover as { attributes?: { alternativeText?: string } })?.attributes?.alternativeText ?? '',
          width: (cover as { width?: number })?.width ?? 800,
          height: (cover as { height?: number })?.height ?? 600,
        }
      : undefined,
    seo: strapiDest.seo || {
      metaTitle: `${strapiDest.name} Travel Guide | Lowcost Traveling`,
      metaDescription: `Budget travel guide for ${strapiDest.name}. Tips, costs, and practical info.`,
      keywords: [strapiDest.name.toLowerCase(), 'travel', 'budget'],
    },
    introHtml: strapiDest.intro?.length
      ? strapiBlocksToHtml(strapiDest.intro as Parameters<typeof strapiBlocksToHtml>[0])
      : undefined,
    locale: strapiDest.contentLang || 'cs',
  }
}

/** Resolve cover/featured image URL and alt from Strapi article */
function getStrapiCoverImage(strapiArticle: StrapiArticle): Article['coverImage'] {
  const toFullUrl = (url: string) =>
    url.startsWith('http') ? url : `${STRAPI_BASE.replace(/\/$/, '')}${url.startsWith('/') ? '' : '/'}${url}`

  // Strapi v5: cover is returned directly; Strapi v4: cover is in .data
  const cover = (strapiArticle.cover?.data ?? strapiArticle.cover) as { url?: string; attributes?: { url?: string; alternativeText?: string }; alternativeText?: string } | undefined
  const coverUrl = cover?.url ?? cover?.attributes?.url
  if (coverUrl) {
    return {
      src: toFullUrl(coverUrl),
      alt: cover?.alternativeText ?? cover?.attributes?.alternativeText ?? strapiArticle.title ?? '',
    }
  }
  // Legacy: featuredImage
  const feat = strapiArticle.featuredImage?.data?.attributes
  if (feat?.url) {
    return {
      src: toFullUrl(feat.url),
      alt: feat.alternativeText ?? strapiArticle.title ?? '',
    }
  }
  return undefined
}

/**
 * Transform Strapi article to frontend Article type
 */
export function transformStrapiArticle(strapiArticle: StrapiArticle): Article {
  // Get destination ID from relation or direct field
  const destinationId =
    strapiArticle.destinationId ||
    strapiArticle.destination?.data?.documentId ||
    strapiArticle.destination?.data?.id?.toString() ||
    ''

  const intro = strapiArticle.intro ?? strapiArticle.excerpt ?? ''
  const contentBlocks = strapiArticle.contentBlocks as Article['contentBlocks']
  const content = strapiArticle.content
  const htmlContent =
    content && Array.isArray(content) && content.length > 0
      ? strapiBlocksToHtml(content)
      : undefined

  const metaTitle = strapiArticle.seo?.metaTitle ?? `${strapiArticle.title} | Lowcost Traveling`
  const metaDescription = strapiArticle.seo?.metaDescription ?? intro.slice(0, 160)
  const keywords = strapiArticle.seo?.keywords ?? [strapiArticle.title]

  return {
    id: strapiArticle.documentId || strapiArticle.id.toString(),
    slug: strapiArticle.slug,
    destinationId,
    articleType: (strapiArticle.articleType as Article['articleType']) ?? 'destination-guide',
    tags: strapiArticle.tags ?? [],
    coverImage: getStrapiCoverImage(strapiArticle),
    title: strapiArticle.title,
    intro,
    sections: strapiArticle.sections ?? [],
    contentBlocks: htmlContent ? undefined : contentBlocks,
    htmlContent,
    places: strapiArticle.places ?? [],
    faq: strapiArticle.faq,
    monetization: strapiArticle.monetization as Article['monetization'],
    seo: {
      metaTitle,
      metaDescription,
      keywords,
      ogTitle: strapiArticle.seo?.ogTitle,
      ogDescription: strapiArticle.seo?.ogDescription,
      ogImage: strapiArticle.seo?.ogImage,
    },
    publishedAt: strapiArticle.publishedAt,
    updatedAt: strapiArticle.updatedAt,
  }
}
