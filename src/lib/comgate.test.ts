import { describe, expect, it } from "vitest";
import { orderStatusFromComgate } from "./comgate";

describe("orderStatusFromComgate", () => {
	it("treats PAID and AUTHORIZED as money received", () => {
		expect(orderStatusFromComgate("PAID")).toBe("paid");
		expect(orderStatusFromComgate("AUTHORIZED")).toBe("paid");
	});

	it("is case-insensitive, since the gateway's casing is not a contract", () => {
		expect(orderStatusFromComgate("paid")).toBe("paid");
	});

	it("records a cancellation", () => {
		expect(orderStatusFromComgate("CANCELLED")).toBe("cancelled");
	});

	it("defaults to pending for anything unrecognised", () => {
		// Never guess "paid" from an unknown status: that would hand over the
		// book without payment.
		expect(orderStatusFromComgate("PENDING")).toBe("pending");
		expect(orderStatusFromComgate("SOMETHING_NEW")).toBe("pending");
		expect(orderStatusFromComgate(undefined)).toBe("pending");
		expect(orderStatusFromComgate("")).toBe("pending");
	});
});
