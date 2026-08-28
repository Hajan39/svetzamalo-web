import { describe, expect, it } from "vitest";
import { replaceAffiliateKeywords } from "./portableText";

const booking = [
	{ slug: "booking", keywords: ["booking"], relSponsored: true },
];

describe("replaceAffiliateKeywords", () => {
	it("replaces every occurrence, not just the first", () => {
		const html = "<p>Booking je fajn. Na booking hledám vždy.</p>";
		const out = replaceAffiliateKeywords(html, booking);
		expect(out.match(/<a href="\/go\/booking"/g)).toHaveLength(2);
	});

	it("matches case-insensitively but keeps the original casing", () => {
		const out = replaceAffiliateKeywords("<p>BOOKING a booking</p>", booking);
		expect(out).toContain(">BOOKING</a>");
		expect(out).toContain(">booking</a>");
	});

	it("does not nest a link inside an existing link", () => {
		const html = '<p><a href="/elsewhere">booking</a></p>';
		expect(replaceAffiliateKeywords(html, booking)).toBe(html);
	});

	it("leaves code and pre blocks alone", () => {
		const html = "<p><code>booking</code> and <pre>booking</pre></p>";
		expect(replaceAffiliateKeywords(html, booking)).toBe(html);
	});

	it("never rewrites anything inside a tag, such as an attribute value", () => {
		// A keyword occurring in a class name or href must not be turned into
		// markup, which would corrupt the document.
		const html = '<p class="booking-note"><a href="/booking-tips">odkaz</a></p>';
		expect(replaceAffiliateKeywords(html, booking)).toBe(html);
	});

	it("prefers the longest keyword when two overlap", () => {
		const links = [
			{ slug: "booking", keywords: ["booking"], relSponsored: true },
			{ slug: "booking-com", keywords: ["booking.com"], relSponsored: true },
		];
		const out = replaceAffiliateKeywords("<p>Booking.com</p>", links);
		expect(out).toContain('href="/go/booking-com"');
		expect(out).not.toContain('href="/go/booking"');
	});

	it("respects whole-word boundaries", () => {
		const out = replaceAffiliateKeywords("<p>bookingu rebooking</p>", booking);
		expect(out).not.toContain("<a");
	});

	it("omits the sponsored rel when the link opts out", () => {
		const out = replaceAffiliateKeywords("<p>booking</p>", [
			{ slug: "booking", keywords: ["booking"], relSponsored: false },
		]);
		expect(out).toContain('<a href="/go/booking">');
		expect(out).not.toContain("rel=");
	});

	it("returns the input untouched when there is nothing to do", () => {
		expect(replaceAffiliateKeywords("<p>ahoj</p>", [])).toBe("<p>ahoj</p>");
		expect(replaceAffiliateKeywords("", booking)).toBe("");
	});

	it("treats regex characters in a keyword as literal text", () => {
		const out = replaceAffiliateKeywords("<p>a+b</p>", [
			{ slug: "plus", keywords: ["a+b"], relSponsored: true },
		]);
		expect(out).toContain('href="/go/plus"');
	});
});
