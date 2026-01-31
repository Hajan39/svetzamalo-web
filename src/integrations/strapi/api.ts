/**
 * Strapi API Methods
 * 
 * High-level API methods for fetching content from Strapi
 */

import { strapiClient, type StrapiQueryParams } from './client'
import {
  transformStrapiDestination,
  transformStrapiArticle,
  type StrapiDestination,
  type StrapiArticle,
} from './types'
import type { Destination, Article } from '@/types'

/**
 * Fetch all destinations
 */
export async function fetchDestinations(
  params?: StrapiQueryParams
): Promise<Destination[]> {
  const response = await strapiClient.get<StrapiDestination[]>(
    '/destinations',
    {
      populate: '*',
      sort: ['name:asc'],
      ...params,
    }
  )

  const destinations = Array.isArray(response.data) ? response.data : [response.data]
  return destinations.map(transformStrapiDestination)
}

/**
 * Fetch destination by slug
 */
export async function fetchDestinationBySlug(
  slug: string
): Promise<Destination | null> {
  try {
    const response = await strapiClient.get<StrapiDestination>(
      `/destinations`,
      {
        filters: { slug: { $eq: slug } },
        populate: '*',
      }
    )

    const destinations = Array.isArray(response.data) ? response.data : [response.data]
    if (destinations.length === 0) {
      return null
    }

    return transformStrapiDestination(destinations[0])
  } catch (error) {
    console.error('Error fetching destination:', error)
    return null
  }
}

/**
 * Fetch destination by ID
 */
export async function fetchDestinationById(
  id: string | number
): Promise<Destination | null> {
  try {
    const response = await strapiClient.get<StrapiDestination>(
      `/destinations/${id}`,
      {
        populate: '*',
      }
    )

    return transformStrapiDestination(response.data)
  } catch (error) {
    console.error('Error fetching destination:', error)
    return null
  }
}

/**
 * Fetch destinations by continent
 */
export async function fetchDestinationsByContinent(
  continent: string
): Promise<Destination[]> {
  const response = await strapiClient.get<StrapiDestination[]>(
    '/destinations',
    {
      filters: { continent: { $eq: continent } },
      populate: '*',
      sort: ['name:asc'],
    }
  )

  const destinations = Array.isArray(response.data) ? response.data : [response.data]
  return destinations.map(transformStrapiDestination)
}

/**
 * Fetch all articles
 */
export async function fetchArticles(
  params?: StrapiQueryParams
): Promise<Article[]> {
  const response = await strapiClient.get<StrapiArticle[]>('/articles', {
    populate: {
      destination: {
        populate: '*',
      },
      featuredImage: '*',
    },
    sort: ['publishedAt:desc'],
    ...params,
  })

  const articles = Array.isArray(response.data) ? response.data : [response.data]
  return articles.map(transformStrapiArticle)
}

/**
 * Fetch article by slug
 */
export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const response = await strapiClient.get<StrapiArticle>('/articles', {
      filters: { slug: { $eq: slug } },
      populate: {
        destination: {
          populate: '*',
        },
        featuredImage: '*',
      },
    })

    const articles = Array.isArray(response.data) ? response.data : [response.data]
    if (articles.length === 0) {
      return null
    }

    return transformStrapiArticle(articles[0])
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
}

/**
 * Fetch article by ID
 */
export async function fetchArticleById(
  id: string | number
): Promise<Article | null> {
  try {
    const response = await strapiClient.get<StrapiArticle>(`/articles/${id}`, {
      populate: {
        destination: {
          populate: '*',
        },
        featuredImage: '*',
      },
    })

    return transformStrapiArticle(response.data)
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
}

/**
 * Fetch articles by destination
 */
export async function fetchArticlesByDestination(
  destinationId: string
): Promise<Article[]> {
  const response = await strapiClient.get<StrapiArticle[]>('/articles', {
    filters: {
      $or: [
        {
          destination: {
            documentId: { $eq: destinationId },
          },
        },
        {
          destinationId: { $eq: destinationId },
        },
      ],
    },
    populate: {
      destination: {
        populate: '*',
      },
      featuredImage: '*',
    },
    sort: ['publishedAt:desc'],
  })

  const articles = Array.isArray(response.data) ? response.data : [response.data]
  return articles.map(transformStrapiArticle)
}

/**
 * Fetch articles by tag
 */
export async function fetchArticlesByTag(tag: string): Promise<Article[]> {
  const response = await strapiClient.get<StrapiArticle[]>('/articles', {
    filters: {
      tags: {
        $contains: tag,
      },
    },
    populate: {
      destination: {
        populate: '*',
      },
      featuredImage: '*',
    },
    sort: ['publishedAt:desc'],
  })

  const articles = Array.isArray(response.data) ? response.data : [response.data]
  return articles.map(transformStrapiArticle)
}

/**
 * Fetch latest articles
 */
export async function fetchLatestArticles(limit = 6): Promise<Article[]> {
  const response = await strapiClient.get<StrapiArticle[]>('/articles', {
    populate: {
      destination: {
        populate: '*',
      },
      featuredImage: '*',
    },
    sort: ['publishedAt:desc'],
    pagination: {
      limit,
    },
  })

  const articles = Array.isArray(response.data) ? response.data : [response.data]
  return articles.map(transformStrapiArticle)
}
