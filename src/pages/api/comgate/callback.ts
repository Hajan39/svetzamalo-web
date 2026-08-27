import type { APIRoute } from "astro";
import { fetchComgateStatus, orderStatusFromComgate } from "@/lib/comgate";
import { db, isDbConfigured, logPaymentEvent, type OrderRow } from "@/lib/db";
import { isMailConfigured, sendPaidBookEmail } from "@/lib/mail";

export const prerender = false;

/** Comgate expects exactly this body, otherwise it keeps retrying. */
function ok() {
	return new Response("code=0&message=OK", {
		status: 200,
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
	});
}

export const POST: APIRoute = async ({ request }) => {
	if (!isDbConfigured()) {
		console.error("[comgate] callback arrived but DATABASE_URL is not set");
		return ok();
	}

	let transId = "";
	try {
		const form = await request.formData();
		transId = String(form.get("transId") || "").trim();
	} catch {
		const text = await request.text().catch(() => "");
		transId = new URLSearchParams(text).get("transId")?.trim() || "";
	}

	if (!transId) {
		console.warn("[comgate] callback without transId");
		return ok();
	}

	const sql = db();
	const rows = (await sql`
		SELECT * FROM orders WHERE comgate_trans_id = ${transId} LIMIT 1
	`) as unknown as OrderRow[];
	const order = rows[0];

	if (!order) {
		console.warn(`[comgate] callback for unknown transId ${transId}`);
		await logPaymentEvent(null, "comgate", "unmatched_callback", { transId });
		return ok();
	}

	// The callback body is public and unauthenticated, so it is treated purely as
	// a nudge: the gateway itself is asked what the real status is.
	let status: Record<string, string>;
	try {
		status = await fetchComgateStatus(transId, order.amount_minor);
	} catch (error) {
		console.error("[comgate] status verification failed:", error);
		await logPaymentEvent(order.id, "comgate", "status_failed", {
			transId,
			message: error instanceof Error ? error.message : String(error),
		});
		// Returning OK would make Comgate stop retrying a payment we could not
		// verify, so let it come back.
		return new Response("code=1&message=verification failed", { status: 500 });
	}

	await logPaymentEvent(order.id, "comgate", "status", status);

	const nextStatus = orderStatusFromComgate(status.status);

	// Comgate may deliver the same callback more than once; only the first
	// transition to paid issues a token and sends the book.
	if (nextStatus === "paid" && order.status !== "paid") {
		const token = crypto.randomUUID();
		await sql`
			UPDATE orders
			SET status = 'paid', paid_at = now(), download_token = ${token}
			WHERE id = ${order.id}
		`;
		if (isMailConfigured()) {
			await sendPaidBookEmail(order.email, token);
		} else {
			console.warn(
				`[comgate] order ${order.id} paid but RESEND_API_KEY is not set — send the link from /admin`,
			);
		}
		return ok();
	}

	if (nextStatus !== order.status && order.status !== "paid") {
		await sql`UPDATE orders SET status = ${nextStatus} WHERE id = ${order.id}`;
	}

	return ok();
};
