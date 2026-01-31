import { Link } from '@tanstack/react-router'
import type { Article } from '@/types'

interface ArticleCardProps {
  article: Article
  variant?: 'default' | 'featured' | 'compact'
  className?: string
}

export function ArticleCard({ article, variant = 'default', className = '' }: ArticleCardProps) {
  const baseClasses = "group block border border-border rounded-xl p-6 bg-background hover:border-primary transition-colors"

  if (variant === 'featured') {
    return (
      <Link
        to={`/articles/${article.slug}`}
        className={`${baseClasses} md:col-span-2 ${className}`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="inline-block text-xs font-medium text-primary bg-primary-light px-2 py-1 rounded">
            {article.articleType.replace('-', ' ')}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
          {article.title}
        </h3>
        <p className="text-foreground-secondary line-clamp-2 mb-4">
          {article.intro}
        </p>
        <div className="flex items-center text-primary font-medium">
          <span>Read guide</span>
          <span aria-hidden="true" className="ml-1">→</span>
        </div>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link
        to={`/articles/${article.slug}`}
        className={`group block border border-border rounded-lg p-4 bg-background hover:border-primary transition-colors ${className}`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="inline-block text-xs font-medium text-primary bg-primary-light px-2 py-1 rounded">
            {article.articleType.replace('-', ' ')}
          </span>
        </div>
        <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
          {article.title}
        </h4>
        <div className="flex items-center text-primary font-medium text-xs">
          <span>Read article</span>
          <span aria-hidden="true" className="ml-1">→</span>
        </div>
      </Link>
    )
  }

  // Default variant
  return (
    <Link
      to={`/articles/${article.slug}`}
      className={`${baseClasses} ${className}`}
    >
      <span className="inline-block text-xs font-medium text-primary bg-primary-light px-2 py-1 rounded mb-3">
        {article.articleType.replace('-', ' ')}
      </span>
      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
        {article.title}
      </h3>
      <p className="text-foreground-secondary line-clamp-2 mb-4">
        {article.intro}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-primary font-medium inline-flex items-center gap-1">
          Read guide <span aria-hidden="true">→</span>
        </span>
        <time className="text-sm text-foreground-muted">
          {new Date(article.publishedAt).toLocaleDateString()}
        </time>
      </div>
    </Link>
  )
}