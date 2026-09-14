import { describe, expect, it } from "vitest";
import { cleanCmsCopy, normalizeDashes, stripDecorativeGlyphs } from "./typography";

describe("stripDecorativeGlyphs", () => {
	it("drops an emoji that opens a heading", () => {
		expect(stripDecorativeGlyphs("<h2>🗺️ Mapa Peru</h2>")).toBe("<h2>Mapa Peru</h2>");
	});

	it("drops an emoji that closes a line", () => {
		expect(stripDecorativeGlyphs("<p>Tip na cestu ✈️</p>")).toBe("<p>Tip na cestu</p>");
	});

	it("closes the gap around an emoji between words", () => {
		expect(stripDecorativeGlyphs("Mapa 🗺️ světa")).toBe("Mapa světa");
	});

	it("handles a multi-codepoint sequence as one glyph", () => {
		expect(stripDecorativeGlyphs("<li>✅ Hotovo</li>")).toBe("<li>Hotovo</li>");
		expect(stripDecorativeGlyphs("<li>👨‍👩‍👧 Rodina</li>")).toBe("<li>Rodina</li>");
	});

	it("keeps arrows, which carry meaning in body text", () => {
		expect(stripDecorativeGlyphs("Praha → Vídeň")).toBe("Praha → Vídeň");
	});

	it("keeps the tag characters Sanity visual editing hides in strings", () => {
		const stega = "Peru\u{E0001}\u{E0074}";
		expect(stripDecorativeGlyphs(stega)).toBe(stega);
	});

	it("leaves indentation inside a code block alone", () => {
		const html = "<pre><code>a\n    b</code></pre>";
		expect(stripDecorativeGlyphs(html)).toBe(html);
	});

	it("passes empty input straight through", () => {
		expect(stripDecorativeGlyphs("")).toBe("");
	});
});

describe("normalizeDashes", () => {
	it("turns a spaced em dash into a comma", () => {
		expect(normalizeDashes("Kniha řeší celou cestu — od dokumentů po peníze.")).toBe(
			"Kniha řeší celou cestu, od dokumentů po peníze.",
		);
	});

	it("drops the dash when the clause already ends in punctuation", () => {
		expect(normalizeDashes("Letenky, ubytování, — a jídlo.")).toBe(
			"Letenky, ubytování, a jídlo.",
		);
	});

	it("leaves an unspaced dash alone", () => {
		expect(normalizeDashes("10—12 dní")).toBe("10—12 dní");
	});

	it("does not join lines", () => {
		expect(normalizeDashes("první\ndruhý")).toBe("první\ndruhý");
	});
});

describe("cleanCmsCopy", () => {
	it("applies both passes", () => {
		expect(cleanCmsCopy("<p>🌍 Rozpočet — 500 Kč na den</p>")).toBe(
			"<p>Rozpočet, 500 Kč na den</p>",
		);
	});
});
