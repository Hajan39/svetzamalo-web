import { afterEach, describe, expect, it, vi } from "vitest";
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

describe("isValidComgateSecret", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
		vi.resetModules();
	});

	async function loadWith(secret: string | undefined) {
		vi.resetModules();
		if (secret !== undefined) vi.stubEnv("COMGATE_SECRET", secret);
		return import("./comgate");
	}

	it("accepts only the exact configured secret", async () => {
		const { isValidComgateSecret } = await loadWith("s3cret");
		expect(isValidComgateSecret("s3cret")).toBe(true);
		expect(isValidComgateSecret("s3cret ")).toBe(false);
		expect(isValidComgateSecret("S3CRET")).toBe(false);
		expect(isValidComgateSecret("")).toBe(false);
		expect(isValidComgateSecret(undefined)).toBe(false);
	});

	it("rejects everything when no secret is configured", async () => {
		// Otherwise an unconfigured shop would accept an empty secret as valid.
		const { isValidComgateSecret } = await loadWith("");
		expect(isValidComgateSecret("")).toBe(false);
		expect(isValidComgateSecret("anything")).toBe(false);
	});
});
