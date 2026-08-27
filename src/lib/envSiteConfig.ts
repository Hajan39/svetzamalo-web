import type { SiteConfig } from "@/types";
import {
	isBankTransferLive,
	isComgateLive,
	isFreeEbookLive,
	SHOP,
} from "./shopConfig";

/**
 * Presents the env-based shop settings in the shape the pages already consume.
 *
 * Site config used to come from Strapi, which is gone. Rather than making every
 * page aware of the new config module, this adapter keeps the existing
 * SiteConfig contract so availability helpers in bookConfig.ts and
 * paymentGateway.ts keep working unchanged.
 */
export function envSiteConfig(): SiteConfig {
	return {
		siteName: "Svět za málo",
		siteEmail: SHOP.contactEmail,

		freeEbookAvailable: isFreeEbookLive(),
		freeEbookTitle: SHOP.freeEbookTitle,
		ebookPdfUrl: SHOP.freeEbookPath,

		bookAvailable: true,
		bookTitle: SHOP.paidBookTitle,
		bookPrice: `${SHOP.priceCzk} Kč`,
		paidEbookPdfUrl: SHOP.paidBookFileUrl || undefined,

		bookBankTransferEnabled: isBankTransferLive(),
		bookBankAccountName: SHOP.bankAccountName,
		bookBankAccountNumber: SHOP.bankAccount || undefined,
		bookBankCode: SHOP.bankCode || undefined,
		bookBankIban: SHOP.bankIban || undefined,
		bookBankBic: SHOP.bankBic || undefined,
		bookBankAmount: String(SHOP.priceCzk),
		bookBankCurrency: "CZK",
		bookBankContactEmail: SHOP.contactEmail,

		bookGatewayEnabled: isComgateLive(),
		bookGatewayProvider: "comgate",
		bookGatewayTestMode: SHOP.comgateTest,

		enableAnalytics: true,
		enableAds: false,
	};
}
