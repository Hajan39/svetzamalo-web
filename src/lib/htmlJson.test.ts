import { describe, expect, it } from "vitest";
import { jsonForScript } from "./htmlJson";

const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);

describe("jsonForScript", () => {
	it("leaves nothing an HTML parser would act on", () => {
		const out = jsonForScript({ title: "</script><img src=x onerror=alert(1)>" });
		expect(out).not.toContain("</script>");
		expect(out).not.toContain("<");
		expect(out).not.toContain(">");
	});

	it("still parses back to the original value", () => {
		const value = {
			title: "</script> & <b>bold</b>",
			nested: ["a</script>b", { c: "<>&" }],
		};
		expect(JSON.parse(jsonForScript(value))).toEqual(value);
	});

	it("escapes the line separators that break a JS string literal", () => {
		const raw = `x${LINE_SEPARATOR}y${PARAGRAPH_SEPARATOR}z`;
		const out = jsonForScript({ a: raw });
		expect(out).not.toContain(LINE_SEPARATOR);
		expect(out).not.toContain(PARAGRAPH_SEPARATOR);
		expect(JSON.parse(out).a).toBe(raw);
	});

	it("handles the ordinary case unchanged", () => {
		expect(
			JSON.parse(jsonForScript({ sku: "obraz-30x40", priceMinor: 89000 })),
		).toEqual({ sku: "obraz-30x40", priceMinor: 89000 });
	});
});
