import type { APIRoute } from "astro";
import { fetchComgateStatus, orderStatusFromComgate } from "@/lib/comgate";
import { db, isDbConfigured, logPaymentEvent, type OrderRow } from "@/lib/db";
import { isMailConfigured, sendPaidBookEmail } from "@/lib/mail";

export const prerender = false;

/** Comgate treats anything else as "the shop did not process the payment". */
function ok() {
	return new Response("code=0&message=OK", {
		status: 200,
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
	});
}

/** Non-2xx makes Comgate redeliver, which is what we want for transient faults. */
function retryLater(reason: string) {
	return new Response(`code=1&message=${reason}`, {
		status: 503,
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
	});
}

async function readParams(request: Request): Promise<Record<string, string>> {
	const raw = await request.text();
	const params = Object.fromEntries(new URLSearchParams(raw)) as Record<
		string,
		string
	>;
	// Comgate posts form-urlencoded, but some setups append the same fields to
	// the query string instead, so both are accepted.
	for (const [key, value] of new URL(request.url).searchParams) {
		if (!params[key]) params[key] = value;
	}
	return params;
}

/**
 * Delivering the book must not hold up the acknowledgement. The payment is
 * already recorded by this point, so a slow or failing mail provider would
 * otherwise push the function past its timeout and make Comgate believe the
 * shop failed — for a payment that actually succeeded.
 */
async function deliverWithoutBlockingAck(
	orderId: number,
	email: string,
	token: string,
) {
	if (!isMailConfigured()) {
		console.warn(
			`[comgate] order ${orderId} paid but RESEND_API_KEY is not set — send the link from /admin`,
		);
		return;
	}
	try {
		const sent = await Promise.race([
			sendPaidBookEmail(email, token),
			new Promise<false>((resolve) => setTimeout(() => resolve(false), 8000)),
		]);
		if (!sent) {
			console.warn(
				`[comgate] order ${orderId} paid but the delivery e-mail did not go out — resend it from /admin`,
			);
		}
	} catch (error) {
		console.warn(`[comgate] delivery e-mail failed for order ${orderId}:`, error);
	}
}

export const POST: APIRoute = async ({ request }) => {
	let params: Record<string, string> = {};

	try {
		params = await readParams(request);
		const transId = (params.transId || params.id || "").trim();
		const refId = (params.refId || params.vs || "").trim();

		// Logged before any decision, so "did the callback even arrive?" is always
		// answerable from the Vercel logs.
		console.log(
			`[comgate] callback transId=${transId || "-"} refId=${refId || "-"} status=${params.status || "-"}`,
		);

		if (!isDbConfigured()) {
			console.error("[comgate] DATABASE_URL is not set");
			return retryLater("storage unavailable");
		}
		if (!transId && !refId) {
			console.warn("[comgate] callback carried neither transId nor refId");
			return ok();
		}

		const sql = db();

		// transId is the precise key; refId (our variable symbol) is the fallback
		// for a callback that arrives before the transId was stored.
		let order: OrderRow | undefined;
		if (transId) {
			const rows = (await sql`
				SELECT * FROM shop_orders WHERE comgate_trans_id = ${transId} LIMIT 1
			`) as unknown as OrderRow[];
			order = rows[0];
		}
		if (!order && refId) {
			const rows = (await sql`
				SELECT * FROM shop_orders WHERE variable_symbol = ${refId} LIMIT 1
			`) as unknown as OrderRow[];
			order = rows[0];
		}

		if (!order) {
			console.warn(
				`[comgate] no order matches transId=${transId} refId=${refId}`,
			);
			await logPaymentEvent(null, "comgate", "unmatched_callback", params);
			// Acknowledged on purpose: redelivering will not conjure up an order,
			// and the raw callback is now stored for manual reconciliation.
			return ok();
		}

		if (order.status === "paid") {
			await logPaymentEvent(order.id, "comgate", "callback_duplicate", params);
			return ok();
		}

		// The callback body is public and unauthenticated, so it only triggers the
		// check — the gateway itself is asked what the real status is.
		let verified: Record<string, string>;
		try {
			verified = await fetchComgateStatus(
				transId || order.comgate_trans_id || "",
				order.amount_minor,
			);
		} catch (error) {
			console.error("[comgate] status verification failed:", error);
			await logPaymentEvent(order.id, "comgate", "status_failed", {
				...params,
				message: error instanceof Error ? error.message : String(error),
			});
			return retryLater("verification failed");
		}

		await logPaymentEvent(order.id, "comgate", "status", verified);
		const nextStatus = orderStatusFromComgate(verified.status);

		if (nextStatus === "paid") {
			const token = order.download_token || crypto.randomUUID();
			await sql`
				UPDATE shop_orders
				SET status = 'paid', paid_at = now(), comgate_trans_id = COALESCE(comgate_trans_id, ${transId || null}), download_token = ${token}
				WHERE id = ${order.id}
			`;
			await deliverWithoutBlockingAck(order.id, order.email, token);
			return ok();
		}

		if (nextStatus !== order.status) {
			await sql`UPDATE shop_orders SET status = ${nextStatus} WHERE id = ${order.id}`;
		}
		return ok();
	} catch (error) {
		// Nothing may escape: an unhandled throw returns an opaque 500 that tells
		// Comgate the shop is broken and leaves no trace of why.
		console.error("[comgate] callback crashed:", error, params);
		return retryLater("internal error");
	}
};

/** Lets the configured URL be checked from a browser without sending a payment. */
export const GET: APIRoute = async () =>
	new Response("Comgate callback endpoint is reachable. Expects POST.", {
		status: 200,
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
