import type { APIRoute } from "astro";
import { isDbConfigured, recordDownload } from "@/lib/db";
import { SHOP } from "@/lib/shopConfig";
import { isLikelyBot } from "@/lib/spamGuard";

/**
 * Counts a free ebook download, then hands the visitor on to the file itself.
 *
 * The file stays wherever it lives (public/ or external storage); this only
 * adds a hop so the download can be counted. Counting must never be a reason
 * the reader does not get the book, so a failed insert is logged and ignored.
 */
export const GET: APIRoute = async ({ redirect, request }) => {
	if (!SHOP.freeEbookUrl) {
		return new Response("Free ebook is not configured", { status: 503 });
	}

	// Not awaited and skipped for crawlers: counting must not delay the reader
	// or wake the database for a link scanner.
	if (isDbConfigured() && !isLikelyBot(request)) {
		recordDownload("free").catch(() => {});
	}

	return redirect(SHOP.freeEbookUrl, 302);
};
