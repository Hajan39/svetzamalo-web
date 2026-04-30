import type { APIRoute } from "astro";
import { z } from "zod";
import { isFreeEbookEnabled } from "@/lib/bookConfig";
import { createLead, fetchSiteConfig } from "@/lib/strapi/api";

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

export const POST: APIRoute = async ({ request, redirect }) => {
	const result = leadSchema.safeParse(await parseBody(request));
	if (!result.success) {
		return new Response(JSON.stringify({ error: "invalid_lead" }), {
			status: 400,
		});
	}

	if (result.data.leadType === "ebook") {
		const siteConfig = await fetchSiteConfig("cs");
		if (!isFreeEbookEnabled(siteConfig)) {
			return new Response(
				JSON.stringify({ error: "free_ebook_not_configured" }),
				{ status: 503 },
			);
		}
	}

	try {
		await createLead({ ...result.data, locale: "cs" });
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
