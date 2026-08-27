import { defineMiddleware } from "astro:middleware";
import { perspectiveCookieName } from "@sanity/preview-url-secret/constants";

const PUBLIC_PAGE_CACHE_CONTROL =
	"public, max-age=0, s-maxage=3600, stale-while-revalidate=86400";
const NO_STORE = "no-store, max-age=0";

// Server-to-server callers legitimately have no Origin header, so these paths
// opt out of the cross-site POST check. Each one authenticates its caller by
// other means instead -- the Comgate callback verifies the shop secret and
// re-checks the payment against the gateway.
const ORIGIN_CHECK_EXEMPT = ["/api/comgate/callback"];

/**
 * Stands in for Astro's security.checkOrigin, which had to be switched off
 * because it cannot exempt a webhook route. Same rule: a browser form POST
 * carries an Origin (or at least a Referer) matching the host it was served
 * from, and anything else is treated as cross-site.
 */
function isCrossSitePost(request: Request, url: URL): boolean {
	if (request.method !== "POST") return false;
	if (ORIGIN_CHECK_EXEMPT.some((path) => url.pathname.startsWith(path))) {
		return false;
	}

	const contentType = request.headers.get("content-type") || "";
	const isFormPost =
		contentType.includes("application/x-www-form-urlencoded") ||
		contentType.includes("multipart/form-data") ||
		contentType.includes("text/plain");
	if (!isFormPost) return false;

	// Compared against the request's own host rather than a configured URL, so
	// apex and www hostnames both work without extra configuration.
	const source =
		request.headers.get("origin") || request.headers.get("referer");
	if (!source) return true;
	try {
		return new URL(source).host !== url.host;
	} catch {
		return true;
	}
}

// Params that carry a unique id per visitor (ad clicks, campaign tracking).
// The CDN keys its cache on the full URL, so these produce a fresh cache key
// for every single visit -- caching them is pointless and only wastes storage.
// Anything else (search queries, pagination) has bounded cardinality and does
// benefit from being cached.
const UNCACHEABLE_PARAM_PREFIXES = ["utm_", "mc_", "_ga", "pk_", "mtm_"];
const UNCACHEABLE_PARAMS = new Set([
	"fbclid",
	"gclid",
	"gbraid",
	"wbraid",
	"msclkid",
	"ttclid",
	"twclid",
	"igshid",
	"srsltid",
	"gad_source",
]);

function hasUncacheableParams(url: URL) {
	for (const key of url.searchParams.keys()) {
		const normalized = key.toLowerCase();
		if (UNCACHEABLE_PARAMS.has(normalized)) return true;
		if (UNCACHEABLE_PARAM_PREFIXES.some((p) => normalized.startsWith(p)))
			return true;
	}
	return false;
}

function shouldSkipPublicCache(request: Request, url: URL) {
	if (request.method !== "GET" && request.method !== "HEAD") return true;
	if (hasUncacheableParams(url)) return true;

	const pathname = url.pathname.replace(/\/$/, "") || "/";
	if (pathname.startsWith("/api/")) return true;
	if (pathname.startsWith("/go/")) return true;
	if (pathname.startsWith("/admin")) return true;
	if (pathname === "/ebook/download" || pathname === "/en/ebook/download")
		return true;
	if (pathname === "/book/success" || pathname === "/en/book/success")
		return true;

	const cookie = request.headers.get("cookie") || "";
	return cookie.includes(perspectiveCookieName);
}

export const onRequest = defineMiddleware(async (context, next) => {
	if (isCrossSitePost(context.request, context.url)) {
		return new Response("Cross-site POST form submissions are forbidden", {
			status: 403,
			headers: { "Cache-Control": NO_STORE },
		});
	}

	const response = await next();

	if (response.headers.has("Cache-Control")) return response;

	const cacheControl = shouldSkipPublicCache(context.request, context.url)
		? NO_STORE
		: PUBLIC_PAGE_CACHE_CONTROL;
	response.headers.set("Cache-Control", cacheControl);

	return response;
});
