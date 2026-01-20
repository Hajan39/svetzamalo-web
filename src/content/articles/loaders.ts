import type { Article } from '@/types'
import { articles } from './data'

export function getArticles(): Article[] {
  return articles
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug)
}

export function getArticleById(id: string): Article | undefined {
  return articles.find((a) => a.id === id)
}

export function getArticlesByDestination(destinationId: string): Article[] {
  return articles.filter((a) => a.destinationId === destinationId)
}

export function getArticlesByTag(tag: string): Article[] {
  return articles.filter((a) => a.tags?.includes(tag))
}

export function getLatestArticles(limit: number = 10): Article[] {
  return [...articles]
    .sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
      return dateB - dateA
    })
    .slice(0, limit)
}
