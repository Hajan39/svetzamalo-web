/**
 * Strapi API Client
 * 
 * Centralized client for making requests to Strapi CMS API
 */

import { EXTERNAL_SERVICES } from '@/lib/constants'

export interface StrapiResponse<T> {
  data: T
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface StrapiError {
  error: {
    status: number
    name: string
    message: string
    details?: unknown
  }
}

export interface StrapiQueryParams {
  populate?: string | string[] | Record<string, unknown>
  filters?: Record<string, unknown>
  sort?: string | string[]
  pagination?: {
    page?: number
    pageSize?: number
    start?: number
    limit?: number
  }
  fields?: string[]
  locale?: string
  publicationState?: 'live' | 'preview'
}

class StrapiClient {
  private baseUrl: string
  private apiToken?: string

  constructor() {
    const strapiUrl = process.env.VITE_STRAPI_URL || 'http://localhost:1337'
    this.baseUrl = `${strapiUrl}/api`
    this.apiToken = process.env.VITE_STRAPI_API_TOKEN
  }

  /**
   * Build query string from parameters
   */
  private buildQueryString(params: StrapiQueryParams): string {
    const queryParams = new URLSearchParams()

    // Populate
    if (params.populate) {
      if (typeof params.populate === 'string') {
        queryParams.append('populate', params.populate)
      } else if (Array.isArray(params.populate)) {
        queryParams.append('populate', params.populate.join(','))
      } else {
        queryParams.append('populate', JSON.stringify(params.populate))
      }
    }

    // Filters
    if (params.filters) {
      queryParams.append('filters', JSON.stringify(params.filters))
    }

    // Sort
    if (params.sort) {
      if (typeof params.sort === 'string') {
        queryParams.append('sort', params.sort)
      } else {
        queryParams.append('sort', params.sort.join(','))
      }
    }

    // Pagination
    if (params.pagination) {
      if (params.pagination.page !== undefined) {
        queryParams.append('pagination[page]', params.pagination.page.toString())
      }
      if (params.pagination.pageSize !== undefined) {
        queryParams.append('pagination[pageSize]', params.pagination.pageSize.toString())
      }
      if (params.pagination.start !== undefined) {
        queryParams.append('pagination[start]', params.pagination.start.toString())
      }
      if (params.pagination.limit !== undefined) {
        queryParams.append('pagination[limit]', params.pagination.limit.toString())
      }
    }

    // Fields
    if (params.fields && params.fields.length > 0) {
      queryParams.append('fields', params.fields.join(','))
    }

    // Locale
    if (params.locale) {
      queryParams.append('locale', params.locale)
    }

    // Publication state
    if (params.publicationState) {
      queryParams.append('publicationState', params.publicationState)
    }

    return queryParams.toString()
  }

  /**
   * Get headers for API requests
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (this.apiToken) {
      headers['Authorization'] = `Bearer ${this.apiToken}`
    }

    return headers
  }

  /**
   * Make a GET request to Strapi API
   */
  async get<T>(
    endpoint: string,
    params?: StrapiQueryParams
  ): Promise<StrapiResponse<T>> {
    const queryString = params ? this.buildQueryString(params) : ''
    const url = `${this.baseUrl}${endpoint}${queryString ? `?${queryString}` : ''}`

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        const error: StrapiError = await response.json().catch(() => ({
          error: {
            status: response.status,
            name: 'Error',
            message: `HTTP ${response.status}: ${response.statusText}`,
          },
        }))
        throw new Error(error.error.message || `HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to fetch data from Strapi')
    }
  }

  /**
   * Make a POST request to Strapi API
   */
  async post<T>(
    endpoint: string,
    data: unknown
  ): Promise<StrapiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ data }),
      })

      if (!response.ok) {
        const error: StrapiError = await response.json().catch(() => ({
          error: {
            status: response.status,
            name: 'Error',
            message: `HTTP ${response.status}: ${response.statusText}`,
          },
        }))
        throw new Error(error.error.message || `HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to post data to Strapi')
    }
  }

  /**
   * Make a PUT request to Strapi API
   */
  async put<T>(
    endpoint: string,
    data: unknown
  ): Promise<StrapiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({ data }),
      })

      if (!response.ok) {
        const error: StrapiError = await response.json().catch(() => ({
          error: {
            status: response.status,
            name: 'Error',
            message: `HTTP ${response.status}: ${response.statusText}`,
          },
        }))
        throw new Error(error.error.message || `HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to update data in Strapi')
    }
  }

  /**
   * Make a DELETE request to Strapi API
   */
  async delete<T>(endpoint: string): Promise<StrapiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        const error: StrapiError = await response.json().catch(() => ({
          error: {
            status: response.status,
            name: 'Error',
            message: `HTTP ${response.status}: ${response.statusText}`,
          },
        }))
        throw new Error(error.error.message || `HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to delete data from Strapi')
    }
  }
}

// Export singleton instance
export const strapiClient = new StrapiClient()
