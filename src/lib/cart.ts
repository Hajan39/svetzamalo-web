import type { ShippingMethod, SiteConfig } from "@/types";

/**
 * Cart maths, shared by the checkout page and the order endpoint.
 *
 * Everything here works in minor units (haléře) as integers, the same
 * convention the orders table uses, so no total is ever assembled from floats.
 */

export const CART_STORAGE_KEY = "svetzamalo.cart.v1";

/** What the browser is allowed to send: what and how many, never the price. */
export interface CartLineInput {
	sku: string;
	quantity: number;
}

/** A line once the catalogue has priced it. */
export interface PricedLine {
	sku: string;
	productSlug: string;
	title: string;
	variantLabel: string;
	unitMinor: number;
	quantity: number;
	lineMinor: number;
}

export const MAX_LINE_QUANTITY = 20;
export const MAX_CART_LINES = 20;

export function czkToMinor(czk: number): number {
	return Math.round(czk * 100);
}

export function minorToCzk(minor: number): number {
	return minor / 100;
}

export function formatCzk(minor: number, locale = "cs-CZ"): string {
	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency: "CZK",
		maximumFractionDigits: 0,
	}).format(minorToCzk(minor));
}

/**
 * Collapses repeats, drops anything unusable and caps the quantity.
 *
 * The cap is not fraud prevention, it is a sanity bound: a typo or a stuck
 * key should not produce an order for 900 prints that nobody can fulfil.
 */
export function normalizeCartLines(input: unknown): CartLineInput[] {
	if (!Array.isArray(input)) return [];

	const merged = new Map<string, number>();
	for (const raw of input) {
		const sku = String((raw as CartLineInput)?.sku ?? "").trim();
		if (!sku || !/^[a-z0-9][a-z0-9-]{1,48}$/.test(sku)) continue;

		const quantity = Math.floor(Number((raw as CartLineInput)?.quantity));
		if (!Number.isFinite(quantity) || quantity < 1) continue;

		merged.set(sku, (merged.get(sku) ?? 0) + quantity);
	}

	return [...merged.entries()]
		.slice(0, MAX_CART_LINES)
		.map(([sku, quantity]) => ({
			sku,
			quantity: Math.min(quantity, MAX_LINE_QUANTITY),
		}));
}

export function itemsTotalMinor(lines: PricedLine[]): number {
	return lines.reduce((sum, line) => sum + line.lineMinor, 0);
}

export function enabledShippingMethods(
	siteConfig: SiteConfig | null | undefined,
): ShippingMethod[] {
	return (siteConfig?.shippingMethods ?? []).filter(
		(method) => method.enabled !== false,
	);
}

export function findShippingMethod(
	siteConfig: SiteConfig | null | undefined,
	code: string,
): ShippingMethod | undefined {
	return enabledShippingMethods(siteConfig).find(
		(method) => method.code === code,
	);
}

/**
 * Postage for one order.
 *
 * The free-shipping threshold is compared against the goods alone, never
 * against a total that already includes postage, which would let a dear
 * delivery method pay for itself.
 */
export function shippingMinorFor(
	method: ShippingMethod | undefined,
	itemsMinor: number,
	siteConfig: SiteConfig | null | undefined,
): number {
	if (!method) return 0;

	const base = czkToMinor(Math.max(0, method.priceCzk || 0));
	if (base === 0) return 0;

	const threshold = siteConfig?.shippingFreeOverCzk;
	if (typeof threshold === "number" && threshold > 0) {
		if (itemsMinor >= czkToMinor(threshold)) return 0;
	}

	return base;
}

/** A pickup method needs a chosen point; the others need a postal address. */
export function requiresPickupPoint(code: string): boolean {
	return code === "packeta_pickup";
}

export function requiresPostalAddress(code: string): boolean {
	return code === "packeta_address" || code === "cpost_address";
}

export function isShopOpen(siteConfig: SiteConfig | null | undefined): boolean {
	if (siteConfig?.shopEnabled !== true) return false;
	return enabledShippingMethods(siteConfig).length > 0;
}
