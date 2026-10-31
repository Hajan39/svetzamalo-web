import { describe, expect, it } from "vitest";
import { csvCell, toCsv } from "./csv";

describe("csvCell", () => {
	it("neutralises a formula a customer typed into a free-text field", () => {
		expect(csvCell('=HYPERLINK("https://evil.example","Faktura")')).toBe(
			`"'=HYPERLINK(""https://evil.example"",""Faktura"")"`,
		);
	});

	it("covers every character a spreadsheet treats as a formula start", () => {
		for (const prefix of ["=", "+", "-", "@", "\t", "\r"]) {
			expect(csvCell(`${prefix}cmd`).startsWith(`"'${prefix}`)).toBe(true);
		}
	});

	it("leaves ordinary values alone", () => {
		expect(csvCell("Jan Hanč")).toBe('"Jan Hanč"');
		expect(csvCell("Ústecká 94")).toBe('"Ústecká 94"');
	});

	it("does not mangle a negative number that is already a number", () => {
		// Numbers arrive as numbers from Postgres, so the guard sees "-500" only
		// when it really is text. Quoting keeps the cell intact either way.
		expect(csvCell(-500)).toBe(`"'-500"`);
	});

	it("doubles embedded quotes", () => {
		expect(csvCell('on "sale"')).toBe('"on ""sale"""');
	});

	it("renders null and undefined as empty", () => {
		expect(csvCell(null)).toBe('""');
		expect(csvCell(undefined)).toBe('""');
	});
});

describe("toCsv", () => {
	it("writes a BOM so Excel reads UTF-8", () => {
		expect(toCsv([{ a: "ř" }], ["a"]).charCodeAt(0)).toBe(0xfeff);
	});

	it("emits the requested columns in order", () => {
		const csv = toCsv([{ b: 2, a: 1 }], ["a", "b"]);
		expect(csv).toContain('"a";"b"');
		expect(csv).toContain('"1";"2"');
	});
});
