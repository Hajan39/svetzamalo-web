import type {SupportedLocale} from '@/types'
import * as sanityApi from '@/lib/sanity/api'
import * as strapiApi from '@/lib/strapi/api'

export const fetchLatestArticles = sanityApi.fetchLatestArticles
export const fetchArticles = sanityApi.fetchArticles
export const fetchArticlesPage = sanityApi.fetchArticlesPage
export const fetchAllArticles = sanityApi.fetchAllArticles
export const fetchArticleBySlug = sanityApi.fetchArticleBySlug
export const fetchDestinations = sanityApi.fetchDestinations
export const fetchDestinationBySlug = sanityApi.fetchDestinationBySlug
export const fetchDestinationsByContinent = sanityApi.fetchDestinationsByContinent

export function fetchSiteConfig(locale: SupportedLocale = 'cs') {
  return strapiApi.fetchSiteConfig(locale)
}

export function fetchPageCopy(key: string, locale: SupportedLocale = 'cs') {
  return strapiApi.fetchPageCopy(key, locale)
}

export const createLead = strapiApi.createLead
export const createOrder = strapiApi.createOrder
