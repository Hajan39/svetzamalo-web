import type { APIRoute } from "astro";
import { z } from "zod";
import { isFreeEbookEnabled } from "@/lib/bookConfig";
import { createLead, fetchSiteConfig } from "@/lib/content/api";
import { isEcomailConfigured, subscribeToEcomail } from "@/lib/ecomail";
import { isOrderTestEmail } from "@/lib/orderTestMode";
import { isHoneypotTripped, isRateLimited } from "@/lib/spamGuard";

export const prerender = false;

const leadSchema = z.object({
	email: z.email(),
	leadType: z.enum(["ebook", "newsletter", "book_notify"]).default("ebook"),
	source: z.string().max(80).optional(),
	testMode: z.string().optional(),
});

async function parseBody(request: Request) {
	const contentType = request.headers.get("content-type") || "";
	if (contentType.includes("application/json")) return request.json();
	const form = await request.formData();
	return Object.fromEntries(form.entries());
}

export const POST: APIRoute = async ({ request, redirect }) => {
	const body = await parseBody(request);

	if (isHoneypotTripped(body)) {
		// Fake success: the bot must not learn it was detected.
		if (
			(request.headers.get("content-type") || "").includes("application/json")
		) {
			return Response.json({ status: "accepted" });
		}
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

	if (result.data.leadType === "ebook") {
		const isTestLead =
			result.data.testMode && isOrderTestEmail(result.data.email);

		if (isTestLead) {
			if (
				(request.headers.get("content-type") || "").includes("application/json")
			) {
				return Response.json({ status: "test_accepted", testMode: true });
			}

			const params = new URLSearchParams({
				lead: result.data.leadType,
				test: "1",
			});
			return redirect(`/book/success?${params.toString()}`, 303);
		}

		// With Ecomail configured, ebook delivery is handled by its automation
		// and does not depend on site config; the availability gate only
		// protects the legacy Strapi flow.
		if (!isEcomailConfigured()) {
			const siteConfig = await fetchSiteConfig("cs");
			if (!isFreeEbookEnabled(siteConfig)) {
				return new Response(
					JSON.stringify({ error: "free_ebook_not_configured" }),
					{ status: 503 },
				);
			}
		}
	}

	try {
		if (isEcomailConfigured()) {
			await subscribeToEcomail(result.data);
		} else {
			await createLead({ ...result.data, locale: "cs" });
		}
	} catch (error) {
		console.warn(
			"Lead persistence failed. Check Strapi lead/book-interest endpoint.",
			error,
		);
		return new Response(JSON.stringify({ error: "lead_persistence_failed" }), {
			status: 502,
		});
	}

	if (
		(request.headers.get("content-type") || "").includes("application/json")
	) {
		return Response.json({ status: "accepted" });
	}

	const params = new URLSearchParams({ lead: result.data.leadType });
	return redirect(`/book/success?${params.toString()}`, 303);
};
