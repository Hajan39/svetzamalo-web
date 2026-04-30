import type { SiteConfig } from "@/types";
import { normalizePaymentAmount } from "@/lib/bankTransfer";

export const DEFAULT_FREE_EBOOK_TITLE = "Lowcost startovní balíček";
export const DEFAULT_FREE_EBOOK_DESCRIPTION =
	"Krátké PDF pro první plánování: rozpočet, chytré šetření, doprava, ubytování a chyby, které cestu zbytečně prodraží.";
export const DEFAULT_PAID_BOOK_TITLE = "Kompletní lowcost průvodce";
export const DEFAULT_PAID_BOOK_DESCRIPTION =
	"Podrobnější systém pro plánování lowcost cest, rozpočet a rozhodování.";

function cleanValue(value: string | null | undefined, fallback: string) {
	return value?.trim() || fallback;
}

export function isFreeEbookEnabled(siteConfig: SiteConfig | null | undefined) {
	if (typeof siteConfig?.freeEbookAvailable === "boolean") {
		return siteConfig.freeEbookAvailable;
	}

	return Boolean(siteConfig?.ebookPdfUrl?.trim());
}

export function isPaidEbookEnabled(siteConfig: SiteConfig | null | undefined) {
	if (siteConfig?.bookAvailable === false) return false;

	const hasBankAccount = Boolean(
		siteConfig?.bookBankAccountNumber?.trim() || siteConfig?.bookBankIban?.trim(),
	);
	const hasAmount = Boolean(
		normalizePaymentAmount(siteConfig?.bookBankAmount || siteConfig?.bookPrice || ""),
	);

	return Boolean(
		siteConfig?.bookBankTransferEnabled && hasBankAccount && hasAmount,
	);
}

export function isBookPageEnabled(siteConfig: SiteConfig | null | undefined) {
	return isFreeEbookEnabled(siteConfig) || isPaidEbookEnabled(siteConfig);
}

export function getFreeEbookTitle(siteConfig: SiteConfig | null | undefined) {
	return cleanValue(siteConfig?.freeEbookTitle, DEFAULT_FREE_EBOOK_TITLE);
}

export function getFreeEbookDescription(
	siteConfig: SiteConfig | null | undefined,
) {
	return cleanValue(
		siteConfig?.freeEbookDescription,
		DEFAULT_FREE_EBOOK_DESCRIPTION,
	);
}

export function getPaidBookTitle(siteConfig: SiteConfig | null | undefined) {
	return cleanValue(siteConfig?.bookTitle, DEFAULT_PAID_BOOK_TITLE);
}

export function getPaidBookDescription(
	siteConfig: SiteConfig | null | undefined,
) {
	return cleanValue(siteConfig?.bookDescription, DEFAULT_PAID_BOOK_DESCRIPTION);
}

export function getBookPaymentMessage(
	siteConfig: SiteConfig | null | undefined,
) {
	return cleanValue(siteConfig?.bookBankMessage, getPaidBookTitle(siteConfig));
}
