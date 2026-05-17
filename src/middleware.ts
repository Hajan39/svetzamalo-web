import { defineMiddleware } from "astro:middleware";
import { perspectiveCookieName } from "@sanity/preview-url-secret/constants";

const PUBLIC_PAGE_CACHE_CONTROL =
	"public, max-age=0, s-maxage=3600, stale-while-revalidate=86400";
const NO_STORE = "no-store, max-age=0";

function shouldSkipPublicCache(request: Request, url: URL) {
	if (request.method !== "GET" && request.method !== "HEAD") return true;
	if (url.search) return true;

	const pathname = url.pathname.replace(/\/$/, "") || "/";
	if (pathname.startsWith("/api/")) return true;
	if (pathname.startsWith("/go/")) return true;
	if (pathname === "/ebook/download" || pathname === "/en/ebook/download")
		return true;
	if (pathname === "/book/success" || pathname === "/en/book/success")
		return true;

	const cookie = request.headers.get("cookie") || "";
	return cookie.includes(perspectiveCookieName);
}

export const onRequest = defineMiddleware(async (context, next) => {
	const response = await next();

	if (response.headers.has("Cache-Control")) return response;

	const cacheControl = shouldSkipPublicCache(context.request, context.url)
		? NO_STORE
		: PUBLIC_PAGE_CACHE_CONTROL;
	response.headers.set("Cache-Control", cacheControl);

	return response;
});
