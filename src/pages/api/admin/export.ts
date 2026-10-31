import type { APIRoute } from "astro";
import { ADMIN_COOKIE, isAuthenticated } from "@/lib/adminAuth";
import { db, isDbConfigured, type LeadRow, type OrderRow } from "@/lib/db";
import { toCsv } from "@/lib/csv";

export const GET: APIRoute = async ({ url, cookies }) => {
	if (!(await isAuthenticated(cookies.get(ADMIN_COOKIE)?.value))) {
		return new Response("Unauthorized", { status: 401 });
	}
	if (!isDbConfigured()) {
		return new Response("Database not configured", { status: 503 });
	}

	const requested = url.searchParams.get("type");
	const type =
		requested === "leads" || requested === "shipping" ? requested : "orders";

	let csv: string;
	if (type === "shipping") {
		// One row per order, with the items flattened into a single cell: this is
		// the sheet you print from when packing, not an accounting export.
		const rows = (await db()`
			SELECT o.variable_symbol, o.created_at, o.paid_at, o.full_name, o.email,
			       o.phone, o.shipping_method, o.shipping_point_id,
			       o.shipping_point_name, o.address_street, o.address_city,
			       o.address_zip, o.address_country, o.amount_minor,
			       o.shipping_minor, o.note, o.shipped_at, o.tracking_number,
			       string_agg(i.quantity || 'x ' || i.title || ' (' || i.variant_label || ')', '; ' ORDER BY i.id) AS items
			FROM shop_orders o
			LEFT JOIN shop_order_items i ON i.order_id = o.id
			WHERE o.order_kind = 'physical' AND o.status = 'paid'
			GROUP BY o.id
			ORDER BY o.paid_at DESC NULLS LAST
		`) as unknown as Record<string, unknown>[];
		csv = toCsv(rows, [
			"variable_symbol",
			"created_at",
			"paid_at",
			"full_name",
			"email",
			"phone",
			"items",
			"shipping_method",
			"shipping_point_id",
			"shipping_point_name",
			"address_street",
			"address_city",
			"address_zip",
			"address_country",
			"amount_minor",
			"shipping_minor",
			"note",
			"shipped_at",
			"tracking_number",
		]);
	} else if (type === "leads") {
		const rows = (await db()`
			SELECT id, email, lead_type, source, locale, created_at
			FROM shop_leads ORDER BY created_at DESC
		`) as unknown as LeadRow[];
		csv = toCsv(rows as unknown as Record<string, unknown>[], [
			"id",
			"email",
			"lead_type",
			"source",
			"locale",
			"created_at",
		]);
	} else {
		const rows = (await db()`
			SELECT id, created_at, paid_at, email, full_name, product_code,
			       amount_minor, currency, variable_symbol, payment_method,
			       status, comgate_trans_id
			FROM shop_orders ORDER BY created_at DESC
		`) as unknown as OrderRow[];
		csv = toCsv(rows as unknown as Record<string, unknown>[], [
			"id",
			"created_at",
			"paid_at",
			"email",
			"full_name",
			"product_code",
			"amount_minor",
			"currency",
			"variable_symbol",
			"payment_method",
			"status",
			"comgate_trans_id",
		]);
	}

	return new Response(csv, {
		status: 200,
		headers: {
			"Content-Type": "text/csv; charset=utf-8",
			"Content-Disposition": `attachment; filename="svetzamalo-${type}.csv"`,
			"Cache-Control": "no-store",
		},
	});
};
