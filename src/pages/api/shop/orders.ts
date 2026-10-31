import type { APIRoute } from "astro";
import { z } from "zod";
import { createComgatePayment } from "@/lib/comgate";
import {
	db,
	isDbConfigured,
	logPaymentEvent,
	type OrderRow,
} from "@/lib/db";
import { isMailConfigured, sendShopOrderEmail } from "@/lib/mail";
import { fetchSiteConfig } from "@/lib/content/api";
import { isShopOpen } from "@/lib/cart";
import { priceOrder, type PricedOrder } from "@/lib/shopOrder";
import { isBankTransferLive, isComgateLive } from "@/lib/shopConfig";
import { isHoneypotTripped, isRateLimited } from "@/lib/spamGuard";

export const prerender = false;

const bodySchema = z.object({
	email: z.email(),
	fullName: z.string().trim().min(2).max(120),
	phone: z.string().trim().max(40).default(""),
	shippingMethod: z.string().trim().min(2).max(40),
	pickupPointId: z.string().trim().max(60).default(""),
	pickupPointName: z.string().trim().max(200).default(""),
	street: z.string().trim().max(160).default(""),
	city: z.string().trim().max(120).default(""),
	zip: z.string().trim().max(20).default(""),
	country: z.string().trim().length(2).toUpperCase().default("CZ"),
	note: z.string().trim().max(500).default(""),
	paymentMethod: z.enum(["bank_transfer", "comgate"]).default("comgate"),
	locale: z.enum(["cs", "en"]).default("cs"),
	items: z.array(
		z.object({
			sku: z.string().trim().min(2).max(50),
			quantity: z.number().int().min(1).max(20),
		}),
	),
});

function randomVariableSymbol(): string {
	return String(Math.floor(Math.random() * 9_000_000_000) + 1_000_000_000);
}

/**
 * The order and its lines go in together: a paid order whose items failed to
 * insert is unfulfillable, and worse, invisible. Neon over HTTP has no
 * interactive transaction, so the rollback is explicit.
 */
async function insertOrder(
	input: z.infer<typeof bodySchema>,
	priced: PricedOrder,
): Promise<OrderRow> {
	const sql = db();
	let lastError: unknown;

	for (let attempt = 0; attempt < 5; attempt++) {
		const variableSymbol = randomVariableSymbol();
		let order: OrderRow | undefined;

		try {
			const rows = (await sql`
				INSERT INTO shop_orders (
					email, full_name, product_code, amount_minor, currency,
					variable_symbol, payment_method, status, locale,
					order_kind, shipping_minor, shipping_method,
					shipping_point_id, shipping_point_name,
					address_street, address_city, address_zip, address_country,
					phone, note
				) VALUES (
					${input.email}, ${input.fullName}, 'shop', ${priced.totalMinor}, 'CZK',
					${variableSymbol}, ${input.paymentMethod}, 'pending', ${input.locale},
					'physical', ${priced.shippingMinor}, ${input.shippingMethod},
					${input.pickupPointId || null}, ${input.pickupPointName || null},
					${input.street || null}, ${input.city || null}, ${input.zip || null},
					${input.country}, ${input.phone || null}, ${input.note || null}
				)
				RETURNING *
			`) as unknown as OrderRow[];
			order = rows[0];
		} catch (error) {
			lastError = error;
			// 23505 = unique_violation, which on a fresh insert can only be the
			// variable symbol.
			if ((error as { code?: string })?.code !== "23505") throw error;
			continue;
		}

		try {
			for (const line of priced.lines) {
				await sql`
					INSERT INTO shop_order_items (
						order_id, product_slug, variant_sku, title,
						variant_label, unit_minor, quantity
					) VALUES (
						${order.id}, ${line.productSlug}, ${line.sku}, ${line.title},
						${line.variantLabel}, ${line.unitMinor}, ${line.quantity}
					)
				`;
			}
		} catch (error) {
			await sql`DELETE FROM shop_orders WHERE id = ${order.id}`.catch(() => {});
			throw error;
		}

		return order;
	}

	throw lastError instanceof Error
		? lastError
		: new Error("Could not allocate a variable symbol");
}

export const POST: APIRoute = async ({ request }) => {
	let raw: unknown;
	try {
		raw = await request.json();
	} catch {
		return Response.json({ error: "invalid_body" }, { status: 400 });
	}

	if (isHoneypotTripped(raw)) {
		// Looks like it worked, so the bot learns nothing. No order is created.
		return Response.json({ status: "accepted" });
	}
	if (isRateLimited(request, "shop-orders")) {
		return Response.json({ error: "rate_limited" }, { status: 429 });
	}

	const parsed = bodySchema.safeParse(raw);
	if (!parsed.success) {
		return Response.json({ error: "invalid_order" }, { status: 400 });
	}
	const input = parsed.data;

	let siteConfig = await fetchSiteConfig(input.locale);
	if (input.locale === "en" && !siteConfig) siteConfig = await fetchSiteConfig("cs");

	if (!isShopOpen(siteConfig)) {
		return Response.json({ error: "shop_closed" }, { status: 503 });
	}
	if (!isDbConfigured()) {
		console.error("[shop] DATABASE_URL is not set, refusing to take payment");
		return Response.json({ error: "storage_unavailable" }, { status: 503 });
	}

	const useGateway = input.paymentMethod === "comgate";
	if (useGateway && !isComgateLive()) {
		return Response.json({ error: "gateway_not_configured" }, { status: 503 });
	}
	if (!useGateway && !isBankTransferLive()) {
		return Response.json(
			{ error: "bank_transfer_not_configured" },
			{ status: 503 },
		);
	}

	const pricing = await priceOrder(input.items, input, siteConfig, input.locale);
	if (!pricing.ok) {
		// 409, not 400: the request was well formed, the catalogue moved under it.
		const stale =
			pricing.reason === "unknown_sku" || pricing.reason === "sold_out";
		return Response.json(
			{ error: pricing.reason, sku: pricing.sku },
			{ status: stale ? 409 : 400 },
		);
	}
	const priced = pricing.order;

	let order: OrderRow;
	try {
		order = await insertOrder(input, priced);
	} catch (error) {
		console.error("[shop] insert failed:", error);
		return Response.json({ error: "order_persistence_failed" }, { status: 502 });
	}

	if (useGateway) {
		try {
			const payment = await createComgatePayment({
				email: input.email,
				fullName: input.fullName,
				productCode: "Zbozi",
				variableSymbol: order.variable_symbol,
				amountMinor: order.amount_minor,
				currency: order.currency,
				locale: order.locale,
				delivery: "PHYSICAL_DELIVERY",
				returnPathBase: "/obchod/objednavka",
			});

			await db()`
				UPDATE shop_orders SET comgate_trans_id = ${payment.transId} WHERE id = ${order.id}
			`;
			await logPaymentEvent(order.id, "comgate", "created", {
				transId: payment.transId,
			});

			return Response.json({
				status: "gateway_redirect",
				variableSymbol: order.variable_symbol,
				paymentUrl: payment.redirectUrl,
			});
		} catch (error) {
			console.error("[shop] Comgate create failed:", error);
			await logPaymentEvent(order.id, "comgate", "create_failed", {
				message: error instanceof Error ? error.message : String(error),
			});
			return Response.json({ error: "gateway_unavailable" }, { status: 502 });
		}
	}

	if (isMailConfigured()) {
		await sendShopOrderEmail(order, priced.lines);
	}

	return Response.json({
		status: "pending_bank_transfer",
		variableSymbol: order.variable_symbol,
		redirectUrl: `/obchod/objednavka?vs=${encodeURIComponent(order.variable_symbol)}`,
	});
};
