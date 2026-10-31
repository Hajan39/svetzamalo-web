import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SiteConfig } from "@/types";

const fetchVariantsBySku = vi.hoisted(() => vi.fn());
vi.mock("./sanity/products", () => ({ fetchVariantsBySku }));

const { priceOrder } = await import("./shopOrder");

const config: SiteConfig = {
	shopEnabled: true,
	shippingFreeOverCzk: 2000,
	shippingMethods: [
		{ code: "packeta_pickup", label: "Zásilkovna", priceCzk: 79 },
		{ code: "cpost_address", label: "Česká pošta", priceCzk: 119 },
		{ code: "personal", label: "Osobní odběr", priceCzk: 0 },
	],
};

function catalogue(
	entries: {
		sku: string;
		priceCzk: number;
		available?: boolean;
		productAvailable?: boolean;
	}[],
) {
	return new Map(
		entries.map((entry) => [
			entry.sku,
			{
				product: {
					slug: "obraz-mauritius",
					title: "Mauritius při východu slunce",
					available: entry.productAvailable,
				},
				variant: {
					sku: entry.sku,
					label: "30 x 40 cm",
					priceCzk: entry.priceCzk,
					available: entry.available,
				},
			},
		]),
	);
}

const pickup = { shippingMethod: "packeta_pickup", pickupPointId: "Z1234" };

beforeEach(() => {
	fetchVariantsBySku.mockReset();
});

describe("priceOrder", () => {
	it("prices from the catalogue, not from the request", async () => {
		fetchVariantsBySku.mockResolvedValue(
			catalogue([{ sku: "obraz-30x40", priceCzk: 890 }]),
		);

		// The browser claims 1 CZK; the catalogue says 890.
		const result = await priceOrder(
			[{ sku: "obraz-30x40", quantity: 2, unitMinor: 100, priceCzk: 1 }],
			pickup,
			config,
		);

		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.order.lines[0].unitMinor).toBe(89000);
		expect(result.order.itemsMinor).toBe(178000);
		expect(result.order.shippingMinor).toBe(7900);
		expect(result.order.totalMinor).toBe(185900);
	});

	it("waives postage once the goods pass the threshold", async () => {
		fetchVariantsBySku.mockResolvedValue(
			catalogue([{ sku: "obraz-50x70", priceCzk: 2400 }]),
		);

		const result = await priceOrder(
			[{ sku: "obraz-50x70", quantity: 1 }],
			pickup,
			config,
		);

		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.order.shippingMinor).toBe(0);
		expect(result.order.totalMinor).toBe(240000);
	});

	it("refuses the whole order when a SKU is gone", async () => {
		fetchVariantsBySku.mockResolvedValue(new Map());

		const result = await priceOrder(
			[{ sku: "obraz-30x40", quantity: 1 }],
			pickup,
			config,
		);

		expect(result).toEqual({
			ok: false,
			reason: "unknown_sku",
			sku: "obraz-30x40",
		});
	});

	it("refuses a sold-out variant rather than dropping the line", async () => {
		fetchVariantsBySku.mockResolvedValue(
			catalogue([
				{ sku: "obraz-30x40", priceCzk: 890 },
				{ sku: "hrnek", priceCzk: 290, available: false },
			]),
		);

		const result = await priceOrder(
			[
				{ sku: "obraz-30x40", quantity: 1 },
				{ sku: "hrnek", quantity: 1 },
			],
			pickup,
			config,
		);

		expect(result).toEqual({ ok: false, reason: "sold_out", sku: "hrnek" });
	});

	it("refuses a variant whose product was taken off sale", async () => {
		fetchVariantsBySku.mockResolvedValue(
			catalogue([
				{ sku: "obraz-30x40", priceCzk: 890, productAvailable: false },
			]),
		);

		const result = await priceOrder(
			[{ sku: "obraz-30x40", quantity: 1 }],
			pickup,
			config,
		);

		expect(result).toEqual({
			ok: false,
			reason: "sold_out",
			sku: "obraz-30x40",
		});
	});

	it("rejects an empty cart without asking the catalogue", async () => {
		const result = await priceOrder([], pickup, config);
		expect(result).toEqual({ ok: false, reason: "empty_cart" });
		expect(fetchVariantsBySku).not.toHaveBeenCalled();
	});

	it("rejects a shipping method that is not on offer", async () => {
		const result = await priceOrder(
			[{ sku: "obraz-30x40", quantity: 1 }],
			{ shippingMethod: "drone" },
			config,
		);
		expect(result).toEqual({ ok: false, reason: "unknown_shipping_method" });
		expect(fetchVariantsBySku).not.toHaveBeenCalled();
	});

	it("insists on a pickup point for a pickup method", async () => {
		const result = await priceOrder(
			[{ sku: "obraz-30x40", quantity: 1 }],
			{ shippingMethod: "packeta_pickup", pickupPointId: "  " },
			config,
		);
		expect(result).toEqual({ ok: false, reason: "pickup_point_required" });
	});

	it("insists on a full address for a delivery method", async () => {
		const result = await priceOrder(
			[{ sku: "obraz-30x40", quantity: 1 }],
			{ shippingMethod: "cpost_address", street: "Ústecká 94", city: "Povrly" },
			config,
		);
		expect(result).toEqual({ ok: false, reason: "address_required" });
	});

	it("needs neither a point nor an address for personal pickup", async () => {
		fetchVariantsBySku.mockResolvedValue(
			catalogue([{ sku: "hrnek", priceCzk: 290 }]),
		);

		const result = await priceOrder(
			[{ sku: "hrnek", quantity: 1 }],
			{ shippingMethod: "personal" },
			config,
		);

		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.order.shippingMinor).toBe(0);
		expect(result.order.totalMinor).toBe(29000);
	});

	it("merges a SKU sent twice into one priced line", async () => {
		fetchVariantsBySku.mockResolvedValue(
			catalogue([{ sku: "hrnek", priceCzk: 290 }]),
		);

		const result = await priceOrder(
			[
				{ sku: "hrnek", quantity: 1 },
				{ sku: "hrnek", quantity: 2 },
			],
			pickup,
			config,
		);

		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.order.lines).toHaveLength(1);
		expect(result.order.lines[0].quantity).toBe(3);
		expect(result.order.itemsMinor).toBe(87000);
	});
});
