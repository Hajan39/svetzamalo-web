import { describe, expect, it } from "vitest";
import {
	LEAD_SEQUENCE,
	daysUntilFollowing,
	nextStepFor,
	unsubscribeFooter,
	unsubscribeUrl,
} from "./leadSequence";

const lead = { email: "a@b.cz", sequence_step: 0, unsubscribe_token: "tok-1" };

describe("lead sequence", () => {
	it("walks the steps in order and stops after the last one", () => {
		expect(nextStepFor({ sequence_step: 0 })).toBe(LEAD_SEQUENCE[0]);
		expect(nextStepFor({ sequence_step: LEAD_SEQUENCE.length - 1 })).toBe(
			LEAD_SEQUENCE.at(-1),
		);
		expect(nextStepFor({ sequence_step: LEAD_SEQUENCE.length })).toBeUndefined();
		expect(nextStepFor({ sequence_step: 99 })).toBeUndefined();
	});

	it("schedules the following mail from the next step's offset, and nothing after the last", () => {
		expect(daysUntilFollowing(0)).toBe(LEAD_SEQUENCE[1].daysAfterPrevious);
		expect(daysUntilFollowing(LEAD_SEQUENCE.length - 1)).toBeNull();
	});

	it("spans about two weeks in total", () => {
		const total = LEAD_SEQUENCE.reduce((sum, step) => sum + step.daysAfterPrevious, 0);
		expect(total).toBeGreaterThanOrEqual(12);
		expect(total).toBeLessThanOrEqual(16);
	});

	it("every mail links to the book and carries an unsubscribe link", () => {
		// A marketing mail without a working opt-out is illegal, not just rude.
		for (const step of LEAD_SEQUENCE) {
			expect(step.html(lead)).toContain("/book/kompletni-pruvodce");
			expect(step.text(lead)).toContain("/book/kompletni-pruvodce");
		}
		const footer = unsubscribeFooter(lead);
		expect(footer.html).toContain(unsubscribeUrl(lead));
		expect(footer.text).toContain("token=tok-1");
	});

	it("URL-encodes the unsubscribe token", () => {
		expect(unsubscribeUrl({ unsubscribe_token: "a b&c" })).toMatch(/token=a%20b%26c$/);
	});
});
