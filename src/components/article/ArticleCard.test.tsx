import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ArticleCard } from './ArticleCard'

const mockArticle = {
  id: '1',
  title: 'Test Article',
  slug: 'test-article',
  intro: 'This is a test article introduction',
  articleType: 'destination-guide' as const,
  publishedAt: '2024-01-01',
  updatedAt: '2024-01-01',
  author: 'Test Author',
  coverImage: {
    src: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
    alt: 'Test article cover',
  },
  seo: {
    metaTitle: 'Test Article',
    metaDescription: 'Test description',
    keywords: ['test'],
    ogImage: null,
  },
  places: [],
}

describe('ArticleCard', () => {
  it('renders article title and intro', () => {
    render(<ArticleCard article={mockArticle} />)

    expect(screen.getByText('Test Article')).toBeInTheDocument()
    expect(screen.getByText('This is a test article introduction')).toBeInTheDocument()
  })

  it('renders article type badge', () => {
    render(<ArticleCard article={mockArticle} />)

    expect(screen.getByText('destination guide')).toBeInTheDocument()
  })

  it('renders publish date', () => {
    render(<ArticleCard article={mockArticle} />)

    expect(screen.getByText('1/1/2024')).toBeInTheDocument()
  })

  it('links to correct article URL', () => {
    render(<ArticleCard article={mockArticle} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/articles/test-article')
  })

  it('renders featured variant with different styling', () => {
    render(<ArticleCard article={mockArticle} variant="featured" />)

    const link = screen.getByRole('link')
    expect(link).toHaveClass('md:col-span-2')
  })

  it('renders compact variant', () => {
    render(<ArticleCard article={mockArticle} variant="compact" />)

    expect(screen.getByText('Read article')).toBeInTheDocument()
  })
})