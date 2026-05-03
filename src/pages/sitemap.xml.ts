import type { APIRoute } from 'astro';
import { fetchAllArticles, fetchDestinations } from '@/lib/content/api';

export const prerender = false;

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function urlEntry(loc: string, lastmod?: string, priority = '0.8', changefreq = 'monthly'): string {
  return [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : '',
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].filter(Boolean).join('\n');
}

export const GET: APIRoute = async () => {
  const siteUrl = (import.meta.env.SITE_URL || import.meta.env.PUBLIC_SITE_URL || 'https://svetzamalo.cz').replace(/\/$/, '');

  const [articles, destinations] = await Promise.all([
    fetchAllArticles('cs'),
    fetchDestinations('cs'),
  ]);

  const staticEntries = [
    urlEntry(`${siteUrl}/`, undefined, '1.0', 'weekly'),
    urlEntry(`${siteUrl}/articles`, undefined, '0.9', 'daily'),
    urlEntry(`${siteUrl}/destinations`, undefined, '0.9', 'weekly'),
    urlEntry(`${siteUrl}/about`, undefined, '0.5', 'monthly'),
  ];

  const articleEntries = articles.map((article) =>
    urlEntry(
      `${siteUrl}/articles/${article.slug}`,
      article.updatedAt ? article.updatedAt.split('T')[0] : article.publishedAt?.split('T')[0],
      '0.8',
      'monthly',
    ),
  );

  const destinationEntries = destinations.map((dest) =>
    urlEntry(`${siteUrl}/destinations/guide/${dest.slug}`, undefined, '0.8', 'monthly'),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticEntries, ...articleEntries, ...destinationEntries].join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
};
