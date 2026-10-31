import { describe, expect, it } from "vitest";
import type { SiteConfig } from "@/types";
import {
	czkToMinor,
	enabledShippingMethods,
	findShippingMethod,
	isShopOpen,
	itemsTotalMinor,
	MAX_LINE_QUANTITY,
	normalizeCartLines,
	type PricedLine,
	requiresPickupPoint,
	requiresPostalAddress,
	shippingMinorFor,
} from "./cart";

const config: SiteConfig = {
	shopEnabled: true,
	shippingFreeOverCzk: 2000,
	shippingMethods: [
		{ code: "packeta_pickup", label: "Zásilkovna", priceCzk: 79 },
		{ code: "cpost_address", label: "Česká pošta", priceCzk: 119 },
		{ code: "personal", label: "Osobní odběr", priceCzk: 0 },
		{ code: "packeta_address", label: "Na adresu", priceCzk: 129, enabled: false },
	],
};

function line(sku: string, unitMinor: number, quantity: number): PricedLine {
	return {
		sku,
		productSlug: "p",
		title: "Obraz",
		variantLabel: "30 x 40",
		unitMinor,
		quantity,
		lineMinor: unitMinor * quantity,
	};
}

describe("normalizeCartLines", () => {
	it("merges repeated SKUs into one line", () => {
		expect(
			normalizeCartLines([
				{ sku: "obraz-30x40", quantity: 1 },
				{ sku: "obraz-30x40", quantity: 2 },
			]),
		).toEqual([{ sku: "obraz-30x40", quantity: 3 }]);
	});

	it("caps the quantity rather than refusing the line", () => {
		expect(
			normalizeCartLines([{ sku: "hrnek", quantity: 9999 }]),
		).toEqual([{ sku: "hrnek", quantity: MAX_LINE_QUANTITY }]);
	});

	it("drops zero, negative and fractional quantities", () => {
		expect(
			normalizeCartLines([
				{ sku: "a-1", quantity: 0 },
				{ sku: "b-1", quantity: -3 },
				{ sku: "c-1", quantity: Number.NaN },
			]),
		).toEqual([]);
	});

	it("rounds a fractional quantity down to a whole item", () => {
		expect(normalizeCartLines([{ sku: "a-1", quantity: 2.7 }])).toEqual([
			{ sku: "a-1", quantity: 2 },
		]);
	});

	it("rejects SKUs that are not catalogue codes", () => {
		expect(
			normalizeCartLines([
				{ sku: "../../etc/passwd", quantity: 1 },
				{ sku: "UPPER", quantity: 1 },
				{ sku: "", quantity: 1 },
			]),
		).toEqual([]);
	});

	it("survives junk input", () => {
		expect(normalizeCartLines(null)).toEqual([]);
		expect(normalizeCartLines("obraz")).toEqual([]);
		expect(normalizeCartLines([null, 42])).toEqual([]);
	});
});

describe("itemsTotalMinor", () => {
	it("sums the lines", () => {
		expect(itemsTotalMinor([line("a-1", 89000, 2), line("b-1", 24900, 1)])).toBe(
			202900,
		);
	});

	it("is zero for an empty cart", () => {
		expect(itemsTotalMinor([])).toBe(0);
	});
});

describe("shipping methods", () => {
	it("hides a method that is switched off", () => {
		expect(enabledShippingMethods(config).map((m) => m.code)).toEqual([
			"packeta_pickup",
			"cpost_address",
			"personal",
		]);
	});

	it("will not find a disabled method by code", () => {
		expect(findShippingMethod(config, "packeta_address")).toBeUndefined();
	});

	it("knows which methods need a point and which need an address", () => {
		expect(requiresPickupPoint("packeta_pickup")).toBe(true);
		expect(requiresPickupPoint("cpost_address")).toBe(false);
		expect(requiresPostalAddress("cpost_address")).toBe(true);
		expect(requiresPostalAddress("personal")).toBe(false);
	});
});

describe("shippingMinorFor", () => {
	const pickup = config.shippingMethods?.[0];

	it("charges the method's price below the threshold", () => {
		expect(shippingMinorFor(pickup, czkToMinor(500), config)).toBe(7900);
	});

	it("is free once the goods reach the threshold", () => {
		expect(shippingMinorFor(pickup, czkToMinor(2000), config)).toBe(0);
	});

	it("compares the threshold against the goods, not a total with postage in it", () => {
		// 1950 of goods plus 79 postage passes 2000, but postage is still due.
		expect(shippingMinorFor(pickup, czkToMinor(1950), config)).toBe(7900);
	});

	it("charges nothing for a free method", () => {
		expect(
			shippingMinorFor(config.shippingMethods?.[2], czkToMinor(100), config),
		).toBe(0);
	});

	it("charges nothing when no method was chosen", () => {
		expect(shippingMinorFor(undefined, czkToMinor(100), config)).toBe(0);
	});

	it("always charges when no threshold is configured", () => {
		const noThreshold = { ...config, shippingFreeOverCzk: undefined };
		expect(shippingMinorFor(pickup, czkToMinor(99999), noThreshold)).toBe(7900);
	});
});

describe("isShopOpen", () => {
	it("is open with the switch on and a method offered", () => {
		expect(isShopOpen(config)).toBe(true);
	});

	it("is closed while the switch is off", () => {
		expect(isShopOpen({ ...config, shopEnabled: false })).toBe(false);
	});

	it("is closed when no method is offered, whatever the switch says", () => {
		expect(isShopOpen({ ...config, shippingMethods: [] })).toBe(false);
	});

	it("is closed with no config at all", () => {
		expect(isShopOpen(null)).toBe(false);
	});
});
