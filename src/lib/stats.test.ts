import { describe, expect, it } from "vitest";
import { conversionRate, type ShopStats } from "./stats";

function stats(ebookLeads: number, paidOrders: number): ShopStats {
	return {
		leads: {
			total: ebookLeads,
			last7: 0,
			last30: 0,
			ebook: ebookLeads,
			newsletter: 0,
			topSources: [],
		},
		orders: {
			total: paidOrders,
			paid: paidOrders,
			pending: 0,
			revenueMinor: 0,
			paidLast30: 0,
			revenueLast30Minor: 0,
		},
		downloads: { free: 0, freeLast7: 0, paid: 0, paidLast7: 0 },
	};
}

describe("conversionRate", () => {
	it("reports the share of ebook signups that bought", () => {
		expect(conversionRate(stats(200, 10))).toBeCloseTo(5);
	});

	it("returns null with nothing to divide by, rather than 0 or NaN", () => {
		// A confident "0 %" on an empty shop reads as a problem that is not there.
		expect(conversionRate(stats(0, 0))).toBeNull();
	});

	it("still reports zero once there are signups but no sales", () => {
		expect(conversionRate(stats(50, 0))).toBe(0);
	});
});
