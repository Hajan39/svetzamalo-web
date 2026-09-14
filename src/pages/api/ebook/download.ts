import type { APIRoute } from "astro";
import { db, isDbConfigured, recordDownload, type OrderRow } from "@/lib/db";
import { SHOP } from "@/lib/shopConfig";
import { isRateLimited } from "@/lib/spamGuard";

function jsonResponse(body: unknown, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
	});
}

/**
 * Serves the paid book against a per-order download token. The file URL itself
 * is server-only, so the token is the only way to reach it and it exists only
 * for orders that are actually paid.
 */
export const GET: APIRoute = async ({ url, request }) => {
	const token = url.searchParams.get("token")?.trim();
	if (!token) return jsonResponse({ error: "missing_token" }, 400);
	// Tokens are unguessable UUIDs, but the limit keeps a leaked link from
	// becoming a public mirror of the book.
	if (isRateLimited(request, "download")) {
		return jsonResponse({ error: "rate_limited" }, 429);
	}
	if (!isDbConfigured()) return jsonResponse({ error: "unavailable" }, 503);
	if (!SHOP.paidBookFileUrl) {
		console.error("[download] PAID_BOOK_FILE_URL is not set");
		return jsonResponse({ error: "unavailable" }, 503);
	}

	let order: OrderRow | undefined;
	let upstream: Response;
	try {
		const rows = (await db()`
			SELECT * FROM shop_orders
			WHERE download_token = ${token} AND status = 'paid'
			LIMIT 1
		`) as unknown as OrderRow[];
		order = rows[0];
		if (!order) return jsonResponse({ error: "invalid_token" }, 404);

		upstream = await fetch(SHOP.paidBookFileUrl);
	} catch (error) {
		console.error("[download] lookup or file fetch failed:", error);
		return jsonResponse({ error: "file_unavailable" }, 502);
	}

	if (!upstream.ok || !upstream.body) {
		// 401/403 almost always means the file is in a private store that needs
		// an access token, which this plain fetch does not send. Say so, rather
		// than leaving a generic 502 to be guessed at.
		const hint =
			upstream.status === 401 || upstream.status === 403
				? ": the file store requires authentication; use a store this fetch can read without a token, or add token support here"
				: "";
		console.error(
			`[download] upstream file fetch failed: ${upstream.status} ${SHOP.paidBookFileUrl}${hint}`,
		);
		return jsonResponse({ error: "file_unavailable" }, 502);
	}

	// Counted only once the file is actually being served.
	await recordDownload("paid", order.id);

	const headers = new Headers({
		"Content-Type": upstream.headers.get("content-type") || "application/pdf",
		"Content-Disposition":
			'attachment; filename="kompletni-cestovatelsky-pruvodce.pdf"',
		"Cache-Control": "no-store",
	});
	const length = upstream.headers.get("content-length");
	if (length) headers.set("Content-Length", length);

	return new Response(upstream.body, { status: 200, headers });
};
