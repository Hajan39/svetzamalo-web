import type { APIRoute } from "astro";
import { fetchAllArticles } from "@/lib/content/api";
import { SHOP } from "@/lib/shopConfig";

const escape = (value: string) =>
	value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Latest articles for feed readers and for automations that post new articles to social media. */
export const GET: APIRoute = async () => {
	const articles = (await fetchAllArticles("cs"))
		.filter((article) => article.publishedAt || article.updatedAt)
		.sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
		.slice(0, 50);

	const items = articles
		.map((article) => {
			const url = `${SHOP.siteUrl}/articles/${article.slug}`;
			const date = new Date(article.publishedAt ?? article.updatedAt ?? Date.now()).toUTCString();
			const image = article.coverImage?.src
				? `\n      <enclosure url="${escape(article.coverImage.src)}" type="image/jpeg" length="0" />`
				: "";
			return `    <item>
      <title>${escape(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${date}</pubDate>
      <description>${escape(article.intro || article.seo.metaDescription || "")}</description>${image}
    </item>`;
		})
		.join("\n");

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Svět za málo</title>
    <link>${SHOP.siteUrl}</link>
    <description>Praktické průvodce, rozpočty a tipy pro cestování, které dává smysl i bez velkého rozpočtu.</description>
    <language>cs</language>
    <atom:link href="${SHOP.siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

	return new Response(xml, {
		headers: {
			"Content-Type": "application/rss+xml; charset=utf-8",
			"Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
		},
	});
};
