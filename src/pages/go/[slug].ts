import type { APIRoute } from "astro";
import { track } from "@vercel/analytics/server";
import { fetchAffiliateLinkBySlug } from "@/lib/content/api";
import { db, isDbConfigured } from "@/lib/db";
import { getLocaleFromAstro } from "@/lib/i18n";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function redirectResponse(destinationUrl: string) {
	return new Response(null, {
		status: 302,
		headers: {
			Location: destinationUrl,
			"Cache-Control": "no-store, max-age=0",
			"Referrer-Policy": "strict-origin-when-cross-origin",
		},
	});
}

export const GET: APIRoute = async (context) => {
	const slug = context.params.slug?.trim().toLowerCase();
	if (!slug || !SLUG_PATTERN.test(slug)) {
		return new Response("Affiliate link not found", { status: 404 });
	}

	const locale = getLocaleFromAstro(context);
	const affiliateLink = await fetchAffiliateLinkBySlug(slug, locale);
	if (!affiliateLink?.destinationUrl) {
		return new Response("Affiliate link not found", { status: 404 });
	}

	try {
		const destination = new URL(affiliateLink.destinationUrl);
		if (!["http:", "https:"].includes(destination.protocol)) {
			return new Response("Invalid affiliate destination", { status: 502 });
		}
		// fire-and-forget — neblokuje redirect
		track("affiliate_click", {
			slug,
			locale,
			title: affiliateLink.title,
		}).catch(() => {});
		if (isDbConfigured()) {
			// Only the path of the referring page on this site — no visitor data.
			const referer = context.request.headers.get("referer");
			const path = referer ? new URL(referer).pathname.slice(0, 200) : null;
			db()`INSERT INTO shop_affiliate_clicks (slug, locale, referer) VALUES (${slug}, ${locale}, ${path})`.catch(
				(error: unknown) => console.warn("[go] click not recorded:", error),
			);
		}
		return redirectResponse(destination.toString());
	} catch {
		return new Response("Invalid affiliate destination", { status: 502 });
	}
};
