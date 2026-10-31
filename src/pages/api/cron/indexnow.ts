import type { APIRoute } from "astro";
import { fetchAllArticles, fetchDestinations } from "@/lib/content/api";
import { SHOP } from "@/lib/shopConfig";

// Not a secret: IndexNow only checks that the same key sits at keyLocation.
export const INDEXNOW_KEY = "9f4c2a7e1b6d48c3a5e0f7b2d9c1e8a4";

/**
 * Tells Seznam and Bing (both run IndexNow) which pages changed in the last
 * two days, so new articles show up in days instead of weeks. Google ignores
 * IndexNow; for Google the sitemap does the same job more slowly.
 */
export const GET: APIRoute = async ({ request }) => {
	const secret = import.meta.env.CRON_SECRET;
	if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
		return new Response("Unauthorized", { status: 401 });
	}

	const since = Date.now() - 2 * 24 * 60 * 60 * 1000;
	const recent = (date?: string) => Boolean(date && new Date(date).getTime() > since);

	const [articles, destinations] = await Promise.all([fetchAllArticles("cs"), fetchDestinations("cs")]);
	const urlList = [
		...articles.filter((a) => recent(a.updatedAt) || recent(a.publishedAt)).map((a) => `${SHOP.siteUrl}/articles/${a.slug}`),
		...destinations.filter((d) => recent(d.updatedAt)).map((d) => `${SHOP.siteUrl}/destinations/guide/${d.slug}`),
	].slice(0, 10000);

	if (urlList.length === 0) return Response.json({ submitted: 0 });

	const response = await fetch("https://api.indexnow.org/indexnow", {
		method: "POST",
		headers: { "Content-Type": "application/json; charset=utf-8" },
		body: JSON.stringify({
			host: new URL(SHOP.siteUrl).host,
			key: INDEXNOW_KEY,
			keyLocation: `${SHOP.siteUrl}/indexnow.txt`,
			urlList,
		}),
	});

	console.log(`[indexnow] submitted ${urlList.length} url(s), status ${response.status}`);
	return Response.json({ submitted: urlList.length, status: response.status });
};
