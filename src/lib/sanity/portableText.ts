import {toHTML} from '@portabletext/to-html'

interface SanityImageValue {
  asset?: {
    url?: string
    metadata?: {
      dimensions?: {
        width?: number
        height?: number
      }
    }
  }
  alt?: string
  caption?: string
}

interface InternalArticleLinkValue {
  slug?: string
  articleSlug?: string
}

interface ExternalLinkValue {
  href?: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/'/g, '&#39;')
}

export function sanityPortableTextToHtml(value: unknown): string {
  if (!Array.isArray(value) || value.length === 0) return ''

  return toHTML(value, {
    components: {
      types: {
        articleImage: ({value: imageValue}) => {
          const image = imageValue as SanityImageValue
          const url = image.asset?.url
          if (!url) return ''

          const width = image.asset?.metadata?.dimensions?.width
          const height = image.asset?.metadata?.dimensions?.height
          const widthAttr = width ? ` width="${width}"` : ''
          const heightAttr = height ? ` height="${height}"` : ''
          const caption = image.caption?.trim()
          const optimizedUrl = `${url}?w=900&auto=format&q=80`

          return `<figure class="article-figure"><img src="${escapeAttr(optimizedUrl)}" alt="${escapeAttr(image.alt || '')}"${widthAttr}${heightAttr} loading="lazy" style="max-width:100%;height:auto" />${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ''}</figure>`
        },
      },
      marks: {
        link: ({children, value}) => {
          const link = value as ExternalLinkValue
          if (!link.href) return children
          return `<a href="${escapeAttr(link.href)}">${children}</a>`
        },
        internalArticleLink: ({children, value}) => {
          const link = value as InternalArticleLinkValue
          const slug = link.articleSlug || link.slug
          if (!slug) return children
          return `<a href="/articles/${escapeAttr(slug)}">${children}</a>`
        },
      },
    },
  })
}
