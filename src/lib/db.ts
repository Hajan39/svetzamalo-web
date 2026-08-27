// Neon Postgres over HTTP — works inside Vercel serverless functions without
// connection pooling, which a long-lived pg pool cannot do reliably there.
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

const DATABASE_URL =
	import.meta.env.DATABASE_URL || import.meta.env.POSTGRES_URL || "";

let client: NeonQueryFunction<false, false> | null = null;

export function isDbConfigured(): boolean {
	return Boolean(DATABASE_URL);
}

// Throws rather than returning null: every caller stores money or contact data,
// so failing loudly beats silently dropping a lead or an order.
export function db(): NeonQueryFunction<false, false> {
	if (!DATABASE_URL) {
		throw new Error(
			"DATABASE_URL is not set — configure the Neon connection string in Vercel.",
		);
	}
	if (!client) client = neon(DATABASE_URL);
	return client;
}

export interface OrderRow {
	id: number;
	email: string;
	full_name: string;
	product_code: string;
	amount_minor: number;
	currency: string;
	variable_symbol: string;
	payment_method: string;
	status: string;
	locale: string;
	comgate_trans_id: string | null;
	download_token: string | null;
	note: string | null;
	created_at: string;
	paid_at: string | null;
}

export interface LeadRow {
	id: number;
	email: string;
	lead_type: string;
	source: string | null;
	locale: string;
	created_at: string;
}

export async function logPaymentEvent(
	orderId: number | null,
	provider: string,
	event: string,
	payload: unknown,
): Promise<void> {
	try {
		await db()`
			INSERT INTO payment_events (order_id, provider, event, payload)
			VALUES (${orderId}, ${provider}, ${event}, ${JSON.stringify(payload ?? {})})
		`;
	} catch (error) {
		// The audit trail must never break the payment flow it is recording.
		console.warn("payment_events insert failed:", error);
	}
}
