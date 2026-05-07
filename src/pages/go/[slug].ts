import type { APIRoute } from "astro";
import { fetchAffiliateLinkBySlug } from "@/lib/content/api";
import { getLocaleFromAstro } from "@/lib/i18n";

export const prerender = false;

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
		return redirectResponse(destination.toString());
	} catch {
		return new Response("Invalid affiliate destination", { status: 502 });
	}
};
