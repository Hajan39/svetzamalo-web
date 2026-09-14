import type { APIRoute } from "astro";
import { db, isDbConfigured } from "@/lib/db";

function page(title: string, body: string, status = 200) {
	return new Response(
		`<!doctype html><html lang="cs"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>${title}</title></head>
<body style="font-family:system-ui,sans-serif;max-width:32rem;margin:4rem auto;padding:0 1rem;color:#1b2733;line-height:1.5;">
<h1 style="font-size:1.5rem;">${title}</h1><p>${body}</p><p><a href="/" style="color:#0f6cbd;">Zpět na Svět za málo</a></p></body></html>`,
		{ status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } },
	);
}

/**
 * One-click opt-out from the e-mail sequence. The token identifies one lead
 * row, but the whole address is unsubscribed so a person who signed up twice
 * is not still mailed through the other row.
 */
export const GET: APIRoute = async ({ url }) => {
	const token = url.searchParams.get("token")?.trim();
	if (!token) return page("Chybí odkaz", "Tento odkaz na odhlášení není úplný. Napiš nám a odhlásíme tě ručně.", 400);
	if (!isDbConfigured()) return page("Zkus to později", "Odhlášení se teď nepovedlo uložit. Zkus odkaz za chvíli znovu.", 503);

	try {
		const rows = (await db()`
			UPDATE shop_leads
			SET unsubscribed_at = COALESCE(unsubscribed_at, now()), next_send_at = NULL
			WHERE lower(email) = (SELECT lower(email) FROM shop_leads WHERE unsubscribe_token = ${token})
			RETURNING id
		`) as unknown as { id: number }[];
		if (rows.length === 0) return page("Odkaz neplatí", "Tento odkaz na odhlášení neznáme. Napiš nám a odhlásíme tě ručně.", 404);
		return page("Odhlášeno", "Další e-maily už nepřijdou. Díky, že jsi u nás byl/a.");
	} catch (error) {
		console.error("[unsubscribe] failed:", error);
		return page("Zkus to později", "Odhlášení se teď nepovedlo uložit. Zkus odkaz za chvíli znovu.", 503);
	}
};

// The List-Unsubscribe-Post header makes mail clients POST here for one-click
// unsubscribe; same effect as the GET.
export const POST: APIRoute = (context) => GET(context);
