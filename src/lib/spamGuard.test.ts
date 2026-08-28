import { describe, expect, it } from "vitest";
import { isHoneypotTripped, isRateLimited } from "./spamGuard";

function requestFrom(ip: string) {
	return new Request("https://svetzamalo.cz/api/leads", {
		method: "POST",
		headers: { "x-forwarded-for": ip },
	});
}

describe("isHoneypotTripped", () => {
	it("is not tripped by a normal submission", () => {
		expect(isHoneypotTripped({ email: "a@b.cz" })).toBe(false);
	});

	it("is tripped when the hidden field is filled", () => {
		expect(isHoneypotTripped({ email: "a@b.cz", website: "http://spam" })).toBe(
			true,
		);
	});

	it("ignores an empty or whitespace-only value", () => {
		// Some browsers submit the field as an empty string; that is a human.
		expect(isHoneypotTripped({ website: "" })).toBe(false);
		expect(isHoneypotTripped({ website: "   " })).toBe(false);
	});

	it("tolerates a missing or non-object body", () => {
		expect(isHoneypotTripped(null)).toBe(false);
		expect(isHoneypotTripped("nonsense")).toBe(false);
	});
});

describe("isRateLimited", () => {
	it("allows a normal number of submissions then blocks", () => {
		const ip = "203.0.113.10";
		const results = Array.from({ length: 10 }, () =>
			isRateLimited(requestFrom(ip), "test-allow-then-block"),
		);
		expect(results.slice(0, 8)).toEqual(Array(8).fill(false));
		expect(results[8]).toBe(true);
	});

	it("keeps buckets independent, so one endpoint cannot exhaust another", () => {
		const ip = "203.0.113.11";
		for (let i = 0; i < 9; i++) isRateLimited(requestFrom(ip), "bucket-a");
		expect(isRateLimited(requestFrom(ip), "bucket-b")).toBe(false);
	});

	it("keeps callers independent", () => {
		for (let i = 0; i < 9; i++)
			isRateLimited(requestFrom("203.0.113.12"), "per-ip");
		expect(isRateLimited(requestFrom("203.0.113.13"), "per-ip")).toBe(false);
	});
});
