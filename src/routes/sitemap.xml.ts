import { createAPIFileRoute } from '@tanstack/react-start/api'
import { getArticles } from '@/content'

const SITE_URL = 'https://lowcosttraveling.com'

export const APIRoute = createAPIFileRoute('/sitemap.xml')({
  GET: async () => {
    const articles = getArticles()

    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'weekly' },
      { url: '/destinations', priority: '0.9', changefreq: 'weekly' },
      { url: '/about', priority: '0.5', changefreq: 'monthly' },
    ]

    const articlePages = articles.map((article) => ({
      url: `/articles/${article.slug}`,
      priority: '0.8',
      changefreq: 'monthly',
      lastmod: article.updatedAt || article.publishedAt,
    }))

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
        .map(
          (page) => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
        )
        .join('\n')}
${articlePages
        .map(
          (page) => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${page.lastmod ? `\n    <lastmod>${page.lastmod}</lastmod>` : ''}
  </url>`
        )
        .join('\n')}
</urlset>`

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  },
})
