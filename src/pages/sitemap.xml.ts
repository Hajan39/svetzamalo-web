import type { APIRoute } from 'astro';
import { fetchAllArticles, fetchDestinations } from '@/lib/content/api';
import { translations } from '@/i18n/translations';

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

const day = (iso?: string) => iso?.split('T')[0];

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
    // The money pages. They were missing here while every article was listed.
    urlEntry(`${siteUrl}/book/kompletni-pruvodce`, undefined, '0.9', 'monthly'),
    urlEntry(`${siteUrl}/book`, undefined, '0.8', 'monthly'),
    urlEntry(`${siteUrl}/about`, undefined, '0.5', 'monthly'),
    ...['privacy', 'terms', 'reklamace', 'dodaci-podminky'].map((slug) =>
      urlEntry(`${siteUrl}/${slug}`, undefined, '0.2', 'yearly'),
    ),
  ];

  // Only continents that actually have a destination, so no empty listing is advertised.
  const continents = [...new Set(destinations.map((dest) => dest.continent))].filter(
    (continent) => continent in translations.cs.shared.continents,
  );
  const continentEntries = continents.map((continent) =>
    urlEntry(`${siteUrl}/destinations/${continent}`, undefined, '0.7', 'monthly'),
  );

  // Paginated listing pages are self-canonical (see articles/index.astro), so
  // they belong here too.
  const pageCount = Math.max(1, Math.ceil(articles.length / 12));
  const pageEntries = Array.from({ length: pageCount - 1 }, (_, i) =>
    urlEntry(`${siteUrl}/articles?page=${i + 2}`, undefined, '0.4', 'weekly'),
  );

  const articleEntries = articles.map((article) =>
    urlEntry(
      `${siteUrl}/articles/${article.slug}`,
      day(article.updatedAt) ?? day(article.publishedAt),
      '0.8',
      'monthly',
    ),
  );

  const destinationEntries = destinations.map((dest) =>
    urlEntry(`${siteUrl}/destinations/guide/${dest.slug}`, day(dest.updatedAt), '0.8', 'monthly'),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticEntries, ...continentEntries, ...destinationEntries, ...articleEntries, ...pageEntries].join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
};
