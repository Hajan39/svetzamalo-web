import type { SiteConfig } from "@/types";

export type BookPaymentMethod = "bank_transfer" | "comgate";

export function isBookGatewayEnabled(
	siteConfig: SiteConfig | null | undefined,
) {
	return Boolean(
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

export function buildGatewayTestUrl(variableSymbol: string) {
	const params = new URLSearchParams({
		vs: variableSymbol,
		provider: "comgate",
		test: "1",
	});

	return `/book/payment-test?${params.toString()}`;
}
