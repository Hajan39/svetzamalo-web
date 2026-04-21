interface BankTransferConfig {
	accountNumber: string;
	bankCode: string;
	iban: string;
	bic: string;
	accountName: string;
	amount: string;
	currency: string;
	message: string;
	contactEmail: string;
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

function sanitizeValue(value: string) {
	return value.replace(/\*/g, " ").trim();
}

export function formatBankAccount(accountNumber: string, bankCode: string) {
	const normalizedAccountNumber = accountNumber.trim();
	const normalizedBankCode = bankCode.trim();

	if (!normalizedAccountNumber && !normalizedBankCode) {
		return "";
	}

	if (!normalizedBankCode) {
		return normalizedAccountNumber;
	}

	return `${normalizedAccountNumber}/${normalizedBankCode}`;
}

export function normalizePaymentAmount(amount: string) {
	const normalized = amount.replace(/,/g, ".").match(/\d+(?:\.\d{1,2})?/);

	if (!normalized) {
		return "";
	}

	return Number(normalized[0]).toFixed(2);
}

export function createVariableSymbol(seed: string) {
	const normalizedSeed = seed.trim().toLowerCase();

	if (!normalizedSeed) {
		return "";
	}

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
	const normalizedIban = config.iban.replace(/\s+/g, "").toUpperCase();
	const normalizedAmount = normalizePaymentAmount(config.amount);
	const normalizedMessage = sanitizeValue(config.message);
	const normalizedCurrency = sanitizeValue(
		config.currency || "CZK",
	).toUpperCase();

	if (!accountDisplay && !normalizedIban) {
		return null;
	}

	const spaydParts = ["SPD*1.0"];
	if (normalizedIban) {
		spaydParts.push(`ACC:${normalizedIban}`);
	}
	if (normalizedAmount) {
		spaydParts.push(`AM:${normalizedAmount}`);
	}
	if (normalizedCurrency) {
		spaydParts.push(`CC:${normalizedCurrency}`);
	}
	if (normalizedMessage) {
		spaydParts.push(`MSG:${normalizedMessage}`);
	}
	if (variableSymbol) {
		spaydParts.push(`X-VS:${variableSymbol}`);
	}

	return {
		accountDisplay,
		iban: normalizedIban,
		bic: config.bic.trim().toUpperCase(),
		accountName: config.accountName.trim(),
		amount: normalizedAmount,
		currency: normalizedCurrency,
		message: normalizedMessage,
		variableSymbol,
		contactEmail: config.contactEmail.trim(),
		spaydPayload: normalizedIban ? spaydParts.join("*") : "",
	};
}
