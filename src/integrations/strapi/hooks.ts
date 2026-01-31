/**
 * React Query Hooks for Strapi
 * 
 * Hooks for fetching Strapi content with React Query
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import {
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
import type { Destination, Article } from '@/types'

/**
 * Query keys for React Query
 */
export const strapiQueryKeys = {
  all: ['strapi'] as const,
  destinations: {
    all: ['strapi', 'destinations'] as const,
    lists: () => [...strapiQueryKeys.destinations.all, 'list'] as const,
    list: (filters?: unknown) =>
      [...strapiQueryKeys.destinations.lists(), filters] as const,
    details: () => [...strapiQueryKeys.destinations.all, 'detail'] as const,
    detail: (id: string | number) =>
      [...strapiQueryKeys.destinations.details(), id] as const,
    bySlug: (slug: string) =>
      [...strapiQueryKeys.destinations.details(), 'slug', slug] as const,
    byContinent: (continent: string) =>
      [...strapiQueryKeys.destinations.lists(), 'continent', continent] as const,
  },
  articles: {
    all: ['strapi', 'articles'] as const,
    lists: () => [...strapiQueryKeys.articles.all, 'list'] as const,
    list: (filters?: unknown) =>
      [...strapiQueryKeys.articles.lists(), filters] as const,
    details: () => [...strapiQueryKeys.articles.all, 'detail'] as const,
    detail: (id: string | number) =>
      [...strapiQueryKeys.articles.details(), id] as const,
    bySlug: (slug: string) =>
      [...strapiQueryKeys.articles.details(), 'slug', slug] as const,
    byDestination: (destinationId: string) =>
      [...strapiQueryKeys.articles.lists(), 'destination', destinationId] as const,
    byTag: (tag: string) =>
      [...strapiQueryKeys.articles.lists(), 'tag', tag] as const,
    latest: (limit?: number) =>
      [...strapiQueryKeys.articles.lists(), 'latest', limit] as const,
  },
} as const

/**
 * Hook to fetch all destinations
 */
export function useDestinations(
  options?: Omit<
    UseQueryOptions<Destination[], Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: strapiQueryKeys.destinations.lists(),
    queryFn: () => fetchDestinations(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  })
}

/**
 * Hook to fetch destination by slug
 */
export function useDestinationBySlug(
  slug: string,
  options?: Omit<
    UseQueryOptions<Destination | null, Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: strapiQueryKeys.destinations.bySlug(slug),
    queryFn: () => fetchDestinationBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  })
}

/**
 * Hook to fetch destination by ID
 */
export function useDestinationById(
  id: string | number,
  options?: Omit<
    UseQueryOptions<Destination | null, Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: strapiQueryKeys.destinations.detail(id),
    queryFn: () => fetchDestinationById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  })
}

/**
 * Hook to fetch destinations by continent
 */
export function useDestinationsByContinent(
  continent: string,
  options?: Omit<
    UseQueryOptions<Destination[], Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: strapiQueryKeys.destinations.byContinent(continent),
    queryFn: () => fetchDestinationsByContinent(continent),
    enabled: !!continent,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  })
}

/**
 * Hook to fetch all articles
 */
export function useArticles(
  options?: Omit<UseQueryOptions<Article[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: strapiQueryKeys.articles.lists(),
    queryFn: () => fetchArticles(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  })
}

/**
 * Hook to fetch article by slug
 */
export function useArticleBySlug(
  slug: string,
  options?: Omit<
    UseQueryOptions<Article | null, Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: strapiQueryKeys.articles.bySlug(slug),
    queryFn: () => fetchArticleBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  })
}

/**
 * Hook to fetch article by ID
 */
export function useArticleById(
  id: string | number,
  options?: Omit<
    UseQueryOptions<Article | null, Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: strapiQueryKeys.articles.detail(id),
    queryFn: () => fetchArticleById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  })
}

/**
 * Hook to fetch articles by destination
 */
export function useArticlesByDestination(
  destinationId: string,
  options?: Omit<UseQueryOptions<Article[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: strapiQueryKeys.articles.byDestination(destinationId),
    queryFn: () => fetchArticlesByDestination(destinationId),
    enabled: !!destinationId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  })
}

/**
 * Hook to fetch articles by tag
 */
export function useArticlesByTag(
  tag: string,
  options?: Omit<UseQueryOptions<Article[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: strapiQueryKeys.articles.byTag(tag),
    queryFn: () => fetchArticlesByTag(tag),
    enabled: !!tag,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  })
}

/**
 * Hook to fetch latest articles
 */
export function useLatestArticles(
  limit = 6,
  options?: Omit<UseQueryOptions<Article[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: strapiQueryKeys.articles.latest(limit),
    queryFn: () => fetchLatestArticles(limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  })
}
