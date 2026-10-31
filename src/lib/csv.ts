/**
 * CSV for the admin exports.
 *
 * Quoting alone is not enough. Excel, LibreOffice and Sheets all treat a cell
 * beginning with =, +, -, @ or a control character as a formula, so a customer
 * who types "=HYPERLINK(...)" into their name or order note gets that formula
 * executed on the machine of whoever opens the export. The order fields are
 * free text filled in by the public, which is exactly the case this guards.
 *
 * The leading apostrophe is the conventional fix: spreadsheets read it as
 * "treat the rest as text" and do not show it in the cell.
 */
const FORMULA_START = /^[=+\-@\t\r]/;

export function csvCell(value: unknown): string {
	const text = value === null || value === undefined ? "" : String(value);
	const safe = FORMULA_START.test(text) ? `'${text}` : text;
	// Excel and Sheets both need the quote-doubling form for embedded quotes.
	return `"${safe.replace(/"/g, '""')}"`;
}

export function toCsv(
	rows: Record<string, unknown>[],
	columns: string[],
): string {
	const header = columns.map(csvCell).join(";");
	const body = rows
		.map((row) => columns.map((column) => csvCell(row[column])).join(";"))
		.join("\n");
	// BOM so Excel opens the Czech characters in UTF-8 rather than as mojibake.
	return `﻿${header}\n${body}`;
}
