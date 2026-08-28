import { describe, expect, it } from "vitest";
import {
	buildBankTransferDetails,
	createVariableSymbol,
	formatBankAccount,
	normalizePaymentAmount,
} from "./bankTransfer";

describe("normalizePaymentAmount", () => {
	it("reads an amount out of a human-written price", () => {
		expect(normalizePaymentAmount("490 Kč")).toBe("490.00");
		expect(normalizePaymentAmount("490")).toBe("490.00");
	});

	it("accepts a decimal comma, as Czech input uses", () => {
		expect(normalizePaymentAmount("490,50")).toBe("490.50");
	});

	it("returns empty for input with no number, rather than NaN", () => {
		expect(normalizePaymentAmount("zdarma")).toBe("");
		expect(normalizePaymentAmount("")).toBe("");
	});
});

describe("formatBankAccount", () => {
	it("joins account and bank code", () => {
		expect(formatBankAccount("123456789", "0800")).toBe("123456789/0800");
	});

	it("omits the separator when the bank code is missing", () => {
		expect(formatBankAccount("123456789", "")).toBe("123456789");
	});

	it("returns empty when nothing is configured", () => {
		expect(formatBankAccount("", "")).toBe("");
	});
});

describe("createVariableSymbol", () => {
	it("produces ten digits, the maximum a Czech VS allows", () => {
		expect(createVariableSymbol("a@b.cz:Jan:490")).toMatch(/^\d{10}$/);
	});

	it("is stable for the same seed", () => {
		expect(createVariableSymbol("seed")).toBe(createVariableSymbol("seed"));
	});
});

describe("buildBankTransferDetails", () => {
	const config = {
		accountNumber: "123456789",
		bankCode: "0800",
		iban: "CZ65 0800 0000 1920 0014 5399",
		amount: "490 Kč",
		currency: "czk",
		message: "Kniha*test",
	};

	it("refuses to build details with nowhere to send the money", () => {
		expect(buildBankTransferDetails({ amount: "490" }, "123")).toBeNull();
	});

	it("normalises the IBAN and currency", () => {
		const details = buildBankTransferDetails(config, "1234567890");
		expect(details?.iban).toBe("CZ6508000000192000145399");
		expect(details?.currency).toBe("CZK");
	});

	it("builds a SPAYD payload a banking app can scan", () => {
		const details = buildBankTransferDetails(config, "1234567890");
		expect(details?.spaydPayload).toContain("SPD*1.0");
		expect(details?.spaydPayload).toContain("ACC:CZ6508000000192000145399");
		expect(details?.spaydPayload).toContain("AM:490.00");
		expect(details?.spaydPayload).toContain("X-VS:1234567890");
	});

	it("strips asterisks from the message, which would break SPAYD fields", () => {
		const details = buildBankTransferDetails(config, "1234567890");
		expect(details?.message).not.toContain("*");
	});

	it("omits the QR payload when there is no IBAN to pay to", () => {
		const details = buildBankTransferDetails(
			{ accountNumber: "123456789", bankCode: "0800", amount: "490" },
			"1234567890",
		);
		expect(details?.spaydPayload).toBe("");
	});
});
