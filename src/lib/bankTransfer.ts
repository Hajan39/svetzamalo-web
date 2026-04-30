export interface BankTransferConfig {
	accountNumber?: string;
	bankCode?: string;
	iban?: string;
	bic?: string;
	accountName?: string;
	amount?: string;
	currency?: string;
	message?: string;
	contactEmail?: string;
}

export interface BankTransferDetails {
	accountDisplay: string;
	iban: string;
	bic: string;
	accountName: string;
	amount: string;
	currency: string;
	message: string;
	variableSymbol: string;
	contactEmail: string;
	spaydPayload: string;
}

function sanitizeValue(value = "") {
	return value.replace(/\*/g, " ").trim();
}

export function formatBankAccount(accountNumber = "", bankCode = "") {
	const normalizedAccountNumber = accountNumber.trim();
	const normalizedBankCode = bankCode.trim();
	if (!normalizedAccountNumber && !normalizedBankCode) return "";
	if (!normalizedBankCode) return normalizedAccountNumber;
	return `${normalizedAccountNumber}/${normalizedBankCode}`;
}

export function normalizePaymentAmount(amount = "") {
	const normalized = amount.replace(/,/g, ".").match(/\d+(?:\.\d{1,2})?/);
	if (!normalized) return "";
	return Number(normalized[0]).toFixed(2);
}

export function createVariableSymbol(seed: string) {
	const normalizedSeed = seed.trim().toLowerCase();
	if (!normalizedSeed) return "";

	let hash = 0;
	for (const char of normalizedSeed) {
		hash = (hash * 31 + char.charCodeAt(0)) % 10000000000;
	}

	return String(hash).padStart(10, "0");
}

export function buildBankTransferDetails(
	config: BankTransferConfig,
	variableSymbol: string,
): BankTransferDetails | null {
	const accountDisplay = formatBankAccount(
		config.accountNumber,
		config.bankCode,
	);
	const iban = (config.iban || "").replace(/\s+/g, "").toUpperCase();
	const amount = normalizePaymentAmount(config.amount || "");
	const currency = sanitizeValue(config.currency || "CZK").toUpperCase();
	const message = sanitizeValue(config.message || "Kompletni lowcost pruvodce");

	if (!accountDisplay && !iban) return null;

	const spaydParts = ["SPD*1.0"];
	if (iban) spaydParts.push(`ACC:${iban}`);
	if (amount) spaydParts.push(`AM:${amount}`);
	if (currency) spaydParts.push(`CC:${currency}`);
	if (message) spaydParts.push(`MSG:${message}`);
	if (variableSymbol) spaydParts.push(`X-VS:${variableSymbol}`);

	return {
		accountDisplay,
		iban,
		bic: (config.bic || "").trim().toUpperCase(),
		accountName: (config.accountName || "").trim(),
		amount,
		currency,
		message,
		variableSymbol,
		contactEmail: (config.contactEmail || "").trim(),
		spaydPayload: iban ? spaydParts.join("*") : "",
	};
}
