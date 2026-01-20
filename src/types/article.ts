import type { SeoMetadata } from './seo'
import type { ContentBlock } from './content-blocks'
import type { MonetizationSlot } from './monetization'

/**
 * Article type classification
 */
export type ArticleType =
  | 'destination-guide'
  | 'place-guide'
  | 'practical-info'
  | 'itinerary'
  | 'list'

/**
 * Place/location within an article
 */
export interface Place {
  id: string
  name: string
  description: string
  latitude: number
  longitude: number
  type?: 'beach' | 'landmark' | 'city' | 'nature' | 'restaurant' | 'hotel'
}

/**
 * FAQ item for structured data
 */
export interface FaqItem {
  id: string
  question: string
  answer: string
}

/**
 * Simple section for backward compatibility
 */
export interface ArticleSection {
  id: string
  title: string
  content: string
}

/**
 * Main Article interface
 */
export interface Article {
  // Identity
  id: string
  slug: string

  // Relation
  destinationId: string

  // Classification
  articleType: ArticleType
  tags?: string[]

  // Content
  title: string
  intro: string
  sections: ArticleSection[]
  contentBlocks?: ContentBlock[]

  // Places (for maps)
  places: Place[]

  // FAQ (for structured data)
  faq?: FaqItem[]

  // Monetization slots
  monetization?: MonetizationSlot[]

  // SEO
  seo: SeoMetadata

  // Publishing
  publishedAt?: string
  updatedAt?: string
}
