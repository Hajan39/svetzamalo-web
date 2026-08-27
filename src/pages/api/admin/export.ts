import type { APIRoute } from "astro";
import { ADMIN_COOKIE, isAuthenticated } from "@/lib/adminAuth";
import { db, isDbConfigured, type LeadRow, type OrderRow } from "@/lib/db";

export const prerender = false;

function csvCell(value: unknown): string {
	const text = value === null || value === undefined ? "" : String(value);
	// Excel and Sheets both need the quote-doubling form for embedded quotes.
	return `"${text.replace(/"/g, '""')}"`;
}

function toCsv(rows: Record<string, unknown>[], columns: string[]): string {
	const header = columns.map(csvCell).join(";");
	const body = rows
		.map((row) => columns.map((column) => csvCell(row[column])).join(";"))
		.join("\n");
	// BOM so Excel opens the Czech characters in UTF-8 rather than as mojibake.
	return `﻿${header}\n${body}`;
}

export const GET: APIRoute = async ({ url, cookies }) => {
	if (!(await isAuthenticated(cookies.get(ADMIN_COOKIE)?.value))) {
		return new Response("Unauthorized", { status: 401 });
	}
	if (!isDbConfigured()) {
		return new Response("Database not configured", { status: 503 });
	}

	const type = url.searchParams.get("type") === "leads" ? "leads" : "orders";

	let csv: string;
	if (type === "leads") {
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
