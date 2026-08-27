import type { APIRoute } from "astro";
import { z } from "zod";
import { createComgatePayment } from "@/lib/comgate";
import { db, isDbConfigured, logPaymentEvent, type OrderRow } from "@/lib/db";
import { isMailConfigured, sendBankInstructionsEmail } from "@/lib/mail";
import {
	isBankTransferLive,
	isComgateLive,
	priceMinor,
	SHOP,
} from "@/lib/shopConfig";
import { isHoneypotTripped, isRateLimited } from "@/lib/spamGuard";

export const prerender = false;

const orderSchema = z.object({
	email: z.email(),
	fullName: z.string().min(2).max(120),
	productCode: z.string().min(2).max(80).default("ebook-paid-v1"),
	paymentMethod: z.enum(["bank_transfer", "comgate"]).default("bank_transfer"),
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

/** Ten digits, the maximum a Czech variable symbol allows. */
function randomVariableSymbol(): string {
	return String(Math.floor(Math.random() * 9_000_000_000) + 1_000_000_000);
}

/**
 * variable_symbol is UNIQUE, and it is what the bank statement is matched on,
 * so a collision must not silently reuse another customer's symbol. Retry a few
 * times before giving up.
 */
async function insertOrder(data: {
	email: string;
	fullName: string;
	productCode: string;
	paymentMethod: string;
	amountMinor: number;
}): Promise<OrderRow> {
	const sql = db();
	let lastError: unknown;

	for (let attempt = 0; attempt < 5; attempt++) {
		const variableSymbol = randomVariableSymbol();
		try {
			const rows = (await sql`
				INSERT INTO shop_orders (
					email, full_name, product_code, amount_minor, currency,
					variable_symbol, payment_method, status, locale
				) VALUES (
					${data.email}, ${data.fullName}, ${data.productCode},
					${data.amountMinor}, 'CZK', ${variableSymbol},
					${data.paymentMethod}, 'pending', 'cs'
				)
				RETURNING *
			`) as unknown as OrderRow[];
			return rows[0];
		} catch (error) {
			lastError = error;
			const message = error instanceof Error ? error.message : String(error);
			if (!message.includes("variable_symbol")) throw error;
		}
	}

	throw lastError instanceof Error
		? lastError
		: new Error("Could not allocate a variable symbol");
}

export const POST: APIRoute = async ({ request, redirect }) => {
	const body = await parseBody(request);

	if (isHoneypotTripped(body)) {
		// Fake success: the bot must not learn it was detected.
		if (wantsJson(request)) return Response.json({ status: "accepted" });
		return redirect("/book/success", 303);
	}

	if (isRateLimited(request, "orders")) {
		return new Response(JSON.stringify({ error: "rate_limited" }), {
			status: 429,
		});
	}

	const result = orderSchema.safeParse(body);
	if (!result.success) {
		return new Response(JSON.stringify({ error: "invalid_order" }), {
			status: 400,
		});
	}

	const { email, fullName, productCode, paymentMethod } = result.data;
	const useGateway = paymentMethod === "comgate";

	if (useGateway && !isComgateLive()) {
		return new Response(JSON.stringify({ error: "gateway_not_configured" }), {
			status: 503,
		});
	}
	if (!useGateway && !isBankTransferLive()) {
		return new Response(
			JSON.stringify({ error: "bank_transfer_not_configured" }),
			{ status: 503 },
		);
	}
	if (!isDbConfigured()) {
		console.error("[orders] DATABASE_URL is not set — refusing to take payment");
		return new Response(JSON.stringify({ error: "storage_unavailable" }), {
			status: 503,
		});
	}

	let order: OrderRow;
	try {
		order = await insertOrder({
			email,
			fullName,
			productCode,
			paymentMethod,
			amountMinor: priceMinor(),
		});
	} catch (error) {
		console.error("[orders] insert failed:", error);
		return new Response(JSON.stringify({ error: "order_persistence_failed" }), {
			status: 502,
		});
	}

	if (useGateway) {
		try {
			const payment = await createComgatePayment({
				email,
				fullName,
				productCode,
				variableSymbol: order.variable_symbol,
				amountMinor: order.amount_minor,
				currency: order.currency,
				locale: order.locale,
			});

			await db()`
				UPDATE shop_orders SET comgate_trans_id = ${payment.transId} WHERE id = ${order.id}
			`;
			await logPaymentEvent(order.id, "comgate", "created", {
				transId: payment.transId,
			});

			if (wantsJson(request)) {
				return Response.json({
					status: "gateway_redirect",
					variableSymbol: order.variable_symbol,
					paymentUrl: payment.redirectUrl,
				});
			}
			return redirect(payment.redirectUrl, 303);
		} catch (error) {
			console.error("[orders] Comgate create failed:", error);
			await logPaymentEvent(order.id, "comgate", "create_failed", {
				message: error instanceof Error ? error.message : String(error),
			});
			return new Response(JSON.stringify({ error: "gateway_unavailable" }), {
				status: 502,
			});
		}
	}

	if (isMailConfigured()) {
		await sendBankInstructionsEmail(order);
	}

	if (wantsJson(request)) {
		return Response.json({
			status: "pending_bank_transfer",
			variableSymbol: order.variable_symbol,
			amount: order.amount_minor / 100,
			currency: order.currency,
			account: SHOP.bankAccountDisplay || SHOP.bankIban,
		});
	}

	return redirect(
		`/book/success?vs=${encodeURIComponent(order.variable_symbol)}&email=${encodeURIComponent(email)}`,
		303,
	);
};
