import type { SiteConfig, SupportedLocale } from "@/types";
import {
	findShippingMethod,
	itemsTotalMinor,
	czkToMinor,
	normalizeCartLines,
	requiresPickupPoint,
	requiresPostalAddress,
	shippingMinorFor,
	type CartLineInput,
	type PricedLine,
} from "./cart";
import { fetchVariantsBySku } from "./sanity/products";

export type PricingFailure =
	| "empty_cart"
	| "unknown_sku"
	| "sold_out"
	| "unknown_shipping_method"
	| "pickup_point_required"
	| "address_required";

export interface PricedOrder {
	lines: PricedLine[];
	itemsMinor: number;
	shippingMinor: number;
	totalMinor: number;
	shippingLabel: string;
}

export type PricingResult =
	| { ok: true; order: PricedOrder }
	| { ok: false; reason: PricingFailure; sku?: string };

export interface DeliveryInput {
	shippingMethod: string;
	pickupPointId?: string;
	street?: string;
	city?: string;
	zip?: string;
}

/**
 * Turns what the browser claims into what the order will actually cost.
 *
 * The request carries SKUs, quantities and a delivery choice. Every price here
 * comes from the catalogue, never from the request, so editing the page or the
 * POST body cannot change what is charged. A SKU that has since sold out or
 * disappeared fails the whole order rather than quietly dropping a line: the
 * customer should see what changed before paying.
 */
export async function priceOrder(
	rawLines: unknown,
	delivery: DeliveryInput,
	siteConfig: SiteConfig | null | undefined,
	locale: SupportedLocale = "cs",
): Promise<PricingResult> {
	const wanted: CartLineInput[] = normalizeCartLines(rawLines);
	if (wanted.length === 0) return { ok: false, reason: "empty_cart" };

	const method = findShippingMethod(siteConfig, delivery.shippingMethod);
	if (!method) return { ok: false, reason: "unknown_shipping_method" };

	if (requiresPickupPoint(method.code) && !delivery.pickupPointId?.trim()) {
		return { ok: false, reason: "pickup_point_required" };
	}
	if (
		requiresPostalAddress(method.code) &&
		!(delivery.street?.trim() && delivery.city?.trim() && delivery.zip?.trim())
	) {
		return { ok: false, reason: "address_required" };
	}

	const catalogue = await fetchVariantsBySku(
		wanted.map((line) => line.sku),
		locale,
	);

	const lines: PricedLine[] = [];
	for (const line of wanted) {
		const match = catalogue.get(line.sku);
		if (!match) return { ok: false, reason: "unknown_sku", sku: line.sku };

		const { product, variant } = match;
		if (product.available === false || variant.available === false) {
			return { ok: false, reason: "sold_out", sku: line.sku };
		}

		const unitMinor = czkToMinor(variant.priceCzk);
		lines.push({
			sku: variant.sku,
			productSlug: product.slug,
			title: product.title,
			variantLabel: variant.label,
			unitMinor,
			quantity: line.quantity,
			lineMinor: unitMinor * line.quantity,
		});
	}

	const itemsMinor = itemsTotalMinor(lines);
	const shippingMinor = shippingMinorFor(method, itemsMinor, siteConfig);

	return {
		ok: true,
		order: {
			lines,
			itemsMinor,
			shippingMinor,
			totalMinor: itemsMinor + shippingMinor,
			shippingLabel: method.label,
		},
	};
}
