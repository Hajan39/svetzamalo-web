/**
 * Strapi Integration
 * 
 * Main export file for Strapi integration
 */

// Client
export { strapiClient } from './client'
export type { StrapiResponse, StrapiError, StrapiQueryParams } from './client'

// Types
export type {
  StrapiEntity,
  StrapiDestination,
  StrapiArticle,
} from './types'
export { transformStrapiDestination, transformStrapiArticle } from './types'

// API methods
export {
  toContentLocale,
  fetchDestinations,
  fetchDestinationBySlug,
  fetchDestinationById,
  fetchDestinationsByContinent,
  fetchArticles,
  fetchArticleBySlug,
  fetchArticleById,
  fetchArticlesByDestination,
  fetchArticlesByTag,
  fetchLatestArticles,
} from './api'

// React Query hooks
export {
  strapiQueryKeys,
  useDestinations,
  useDestinationBySlug,
  useDestinationById,
  useDestinationsByContinent,
  useArticles,
  useArticleBySlug,
  useArticleById,
  useArticlesByDestination,
  useArticlesByTag,
  useLatestArticles,
} from './hooks'
