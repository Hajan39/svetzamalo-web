/**
 * Strapi Content Type Definitions
 * 
 * Type definitions for Strapi content types matching the frontend types
 */

import type { Destination, Article } from '@/types'

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
 */
export interface StrapiDestination extends StrapiEntity {
  slug: string
  name: string
  type: 'country' | 'region' | 'city' | 'microstate'
  parentId?: string | null
  continent: string
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
  flagEmoji?: string
  currency: {
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
  languages: string[]
  timezone?: string
  visaInfo?: string
  bestTimeToVisit?: string
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
  }
}

/**
 * Strapi Article entity
 */
export interface StrapiArticle extends StrapiEntity {
  slug: string
  title: string
  intro: string
  articleType: string
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
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
  }
}

/**
 * Transform Strapi destination to frontend Destination type
 */
export function transformStrapiDestination(
  strapiDest: StrapiDestination
): Destination {
  return {
    id: strapiDest.documentId || strapiDest.id.toString(),
    slug: strapiDest.slug,
    name: strapiDest.name,
    type: strapiDest.type,
    parentId: strapiDest.parentId || undefined,
    continent: strapiDest.continent as Destination['continent'],
    flagEmoji: strapiDest.flagEmoji,
    currency: strapiDest.currency,
    languages: strapiDest.languages,
    timezone: strapiDest.timezone,
    visaInfo: strapiDest.visaInfo,
    bestTimeToVisit: strapiDest.bestTimeToVisit,
    heroImage: strapiDest.heroImage?.data
      ? {
          url: strapiDest.heroImage.data.attributes.url,
          alt: strapiDest.heroImage.data.attributes.alternativeText || '',
          width: strapiDest.heroImage.data.attributes.width,
          height: strapiDest.heroImage.data.attributes.height,
        }
      : undefined,
    seo: strapiDest.seo,
  }
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

  return {
    id: strapiArticle.documentId || strapiArticle.id.toString(),
    slug: strapiArticle.slug,
    destinationId,
    articleType: strapiArticle.articleType as Article['articleType'],
    tags: strapiArticle.tags || [],
    title: strapiArticle.title,
    intro: strapiArticle.intro,
    sections: strapiArticle.sections || [],
    contentBlocks: strapiArticle.contentBlocks as Article['contentBlocks'],
    places: strapiArticle.places || [],
    faq: strapiArticle.faq,
    monetization: strapiArticle.monetization as Article['monetization'],
    seo: strapiArticle.seo,
    publishedAt: strapiArticle.publishedAt,
    updatedAt: strapiArticle.updatedAt,
  }
}
