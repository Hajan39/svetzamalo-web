// Stands in for Astro's security.checkOrigin, which had to be switched off
// because it cannot exempt a webhook route (Comgate's payment notification was
// being answered 403 before any handler ran).
//
// Lives here rather than in middleware.ts so it can be unit tested: importing
// the middleware pulls in astro:middleware, which only resolves inside a build.

// Server-to-server callers legitimately have no Origin header, so these paths
// opt out. Each authenticates its caller by other means -- the Comgate callback
// verifies the shop secret and re-checks the payment against the gateway.
export const ORIGIN_CHECK_EXEMPT = ["/api/comgate/callback"];

const FORM_CONTENT_TYPES = [
	"application/x-www-form-urlencoded",
	"multipart/form-data",
	"text/plain",
];

/**
 * True when a POST looks like it came from another site. A browser form POST
 * carries an Origin (or at least a Referer) matching the host it was served
 * from; anything else is treated as cross-site.
 */
export function isCrossSitePost(request: Request, url: URL): boolean {
	if (request.method !== "POST") return false;
	if (ORIGIN_CHECK_EXEMPT.some((path) => url.pathname.startsWith(path))) {
		return false;
	}

	const contentType = request.headers.get("content-type") || "";
	if (!FORM_CONTENT_TYPES.some((type) => contentType.includes(type))) {
		return false;
	}

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
