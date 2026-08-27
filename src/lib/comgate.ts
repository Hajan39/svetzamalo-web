// Comgate REST API v1.0. Ported from the previous Strapi implementation, which
// was live against the real gateway, so the parameter names and the
// form-urlencoded (not JSON) request/response shape are as Comgate expects.
import { SHOP, isComgateLive } from "./shopConfig";

const API_BASE_URL = "https://payments.comgate.cz/v1.0";

export type ComgateStatus = "PENDING" | "PAID" | "CANCELLED" | "AUTHORIZED";

function parseFormResponse(text: string): Record<string, string> {
	return Object.fromEntries(new URLSearchParams(text));
}

async function post(
	path: "/create" | "/status",
	params: Record<string, string>,
): Promise<Record<string, string>> {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Accept: "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams(params).toString(),
		signal: AbortSignal.timeout(15000),
	});
	const text = await response.text();
	const payload = parseFormResponse(text);

	if (!response.ok) {
		throw new Error(`Comgate ${path} failed: ${response.status} ${text}`);
	}
	if (payload.code && payload.code !== "0") {
		throw new Error(
			`Comgate ${path} rejected: ${payload.code} ${payload.message || ""}`.trim(),
		);
	}
	return payload;
}

export interface CreatePaymentInput {
	email: string;
	fullName: string;
	productCode: string;
	variableSymbol: string;
	amountMinor: number;
	currency: string;
	locale: string;
}

export async function createComgatePayment(input: CreatePaymentInput): Promise<{
	transId: string;
	redirectUrl: string;
}> {
	if (!isComgateLive()) {
		throw new Error("Comgate is not configured");
	}

	// Each outcome gets its own page. Sending a cancelled payer to the success
	// page with a status parameter reads as "thanks for your purchase" for a
	// purchase that did not happen.
	const vs = encodeURIComponent(input.variableSymbol);
	const paidUrl = `${SHOP.siteUrl}/book/success?payment=comgate&status=paid&vs=${vs}`;
	const cancelledUrl = `${SHOP.siteUrl}/book/cancelled?vs=${vs}`;
	const pendingUrl = `${SHOP.siteUrl}/book/pending?vs=${vs}`;

	const payload = await post("/create", {
		merchant: SHOP.comgateMerchant,
		secret: SHOP.comgateSecret,
		test: SHOP.comgateTest ? "true" : "false",
		price: String(input.amountMinor),
		curr: input.currency || "CZK",
		// Comgate caps label at 16 characters.
		label: "Ebook",
		refId: input.variableSymbol,
		method: "ALL",
		email: input.email,
		fullName: input.fullName,
		delivery: "ELECTRONIC_DELIVERY",
		category: "OTHER",
		name: input.productCode,
		lang: input.locale === "en" ? "en" : "cs",
		prepareOnly: "true",
		url_paid: paidUrl,
		url_cancelled: cancelledUrl,
		url_pending: pendingUrl,
		url_push: `${SHOP.siteUrl}/api/comgate/callback`,
	});

	if (!payload.transId || !payload.redirect) {
		throw new Error("Comgate create response is missing transId or redirect");
	}

	return { transId: payload.transId, redirectUrl: payload.redirect };
}

/**
 * Ask Comgate what really happened. The push callback body is never trusted on
 * its own -- anyone can POST to a public URL -- so the callback handler calls
 * this and acts only on the gateway's own answer.
 */
export async function fetchComgateStatus(
	transId: string,
	amountMinor: number,
): Promise<Record<string, string> & { status?: ComgateStatus }> {
	if (!isComgateLive()) {
		throw new Error("Comgate is not configured");
	}
	return post("/status", {
		merchant: SHOP.comgateMerchant,
		secret: SHOP.comgateSecret,
		transId,
		price: String(amountMinor),
	});
}

export function orderStatusFromComgate(status?: string): string {
	switch ((status || "").toUpperCase()) {
		case "PAID":
		case "AUTHORIZED":
			return "paid";
		case "CANCELLED":
			return "cancelled";
		default:
			return "pending";
	}
}
