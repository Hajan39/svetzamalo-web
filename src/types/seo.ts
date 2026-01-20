/**
 * Image type for SEO and content
 */
export interface Image {
  src: string
  alt: string
  width?: number
  height?: number
  caption?: string
}

/**
 * SEO metadata for pages
 */
export interface SeoMetadata {
  metaTitle: string
  metaDescription: string

  // Open Graph
  ogTitle?: string
  ogDescription?: string
  ogImage?: Image

  // Keywords
  keywords: string[]

  // Structured data hints
  structuredDataType?: 'Article' | 'TravelGuide' | 'FAQPage' | 'TouristDestination'
}
