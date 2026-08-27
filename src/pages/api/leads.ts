import type { APIRoute } from "astro";
import { z } from "zod";
import { db, isDbConfigured } from "@/lib/db";
import { isEcomailConfigured, subscribeToEcomail } from "@/lib/ecomail";
import { isMailConfigured, sendFreeEbookEmail } from "@/lib/mail";
import { isFreeEbookLive } from "@/lib/shopConfig";
import { isHoneypotTripped, isRateLimited } from "@/lib/spamGuard";

export const prerender = false;

const leadSchema = z.object({
	email: z.email(),
	leadType: z.enum(["ebook", "newsletter", "book_notify"]).default("ebook"),
	source: z.string().max(80).optional(),
});

async function parseBody(request: Request) {
	const contentType = request.headers.get("content-type") || "";
	if (contentType.includes("application/json")) return request.json();
	const form = await request.formData();
	return Object.fromEntries(form.entries());
}

function wantsJson(request: Request) {
	return (request.headers.get("content-type") || "").includes(
		"application/json",
	);
}

export const POST: APIRoute = async ({ request, redirect }) => {
	const body = await parseBody(request);

	if (isHoneypotTripped(body)) {
		// Fake success: the bot must not learn it was detected.
		if (wantsJson(request)) return Response.json({ status: "accepted" });
		return redirect("/book/success?lead=ebook", 303);
	}

	if (isRateLimited(request, "leads")) {
		return new Response(JSON.stringify({ error: "rate_limited" }), {
			status: 429,
		});
	}

	const result = leadSchema.safeParse(body);
	if (!result.success) {
		return new Response(JSON.stringify({ error: "invalid_lead" }), {
			status: 400,
		});
	}

	const { email, leadType, source } = result.data;
	const wantsEbook = leadType === "ebook";

	if (wantsEbook && !isFreeEbookLive()) {
		return new Response(
			JSON.stringify({ error: "free_ebook_not_configured" }),
			{ status: 503 },
		);
	}

	// Postgres is the record of truth for the mailing list. Without it we would
	// hand out the ebook and lose the address, which is the whole point.
	if (!isDbConfigured()) {
		console.error("[leads] DATABASE_URL is not set — cannot store lead");
		return new Response(JSON.stringify({ error: "storage_unavailable" }), {
			status: 503,
		});
	}

	try {
		await db()`
			INSERT INTO shop_leads (email, lead_type, source, locale)
			VALUES (${email}, ${leadType}, ${source ?? null}, 'cs')
			ON CONFLICT (lower(email), lead_type) DO NOTHING
		`;
	} catch (error) {
		console.error("[leads] insert failed:", error);
		return new Response(JSON.stringify({ error: "lead_persistence_failed" }), {
			status: 502,
		});
	}

	// Newsletter tooling is optional; a failure there must not cost us the lead
	// we already stored, so it is fire-and-forget.
	if (isEcomailConfigured()) {
		subscribeToEcomail({ email, leadType, source }).catch((error) =>
			console.warn("[leads] Ecomail subscribe failed:", error),
		);
	}

	// With Ecomail connected its automation sends the ebook, so sending here too
	// would deliver the same e-mail twice.
	if (wantsEbook && !isEcomailConfigured() && isMailConfigured()) {
		await sendFreeEbookEmail(email);
	}

	if (wantsJson(request)) return Response.json({ status: "accepted" });

	return redirect(`/book/success?lead=${encodeURIComponent(leadType)}`, 303);
};
