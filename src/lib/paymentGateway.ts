import type { SiteConfig } from "@/types";
import { hasPaidEbookDownload } from "@/lib/bookConfig";

export type BookPaymentMethod = "bank_transfer" | "comgate";

export function isBookGatewayEnabled(
	siteConfig: SiteConfig | null | undefined,
) {
	return Boolean(
		hasPaidEbookDownload(siteConfig) &&
			siteConfig?.bookGatewayEnabled &&
			siteConfig.bookGatewayProvider === "comgate",
	);
}

export function getGatewayButtonLabel(
	siteConfig: SiteConfig | null | undefined,
	fallback: string,
) {
	return siteConfig?.bookGatewayButtonLabel?.trim() || fallback;
}

export function getGatewayReturnPath(
	siteConfig: SiteConfig | null | undefined,
) {
	return siteConfig?.bookGatewayReturnPath?.trim() || "/book/success";
}

