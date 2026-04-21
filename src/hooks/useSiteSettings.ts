import { useSiteConfig } from "@/integrations/strapi/hooks";
import { FEATURE_FLAGS, SITE_CONFIG } from "@/lib/constants";

/**
 * Site settings merged from Strapi + env.
 * Book settings are source-of-truth in Strapi site-config.
 */
export function useSiteSettings() {
	const { data: remote } = useSiteConfig();

	return {
		book: {
			available: remote?.bookAvailable ?? false,
			buyUrl: remote?.bookBuyUrl || "",
			price: remote?.bookPrice || "",
			ebookPdfUrl: remote?.ebookPdfUrl || "",
			bankTransfer: {
				enabled: remote?.bookBankTransferEnabled ?? false,
				accountName: remote?.bookBankAccountName || "",
				accountNumber: remote?.bookBankAccountNumber || "",
				bankCode: remote?.bookBankCode || "",
				iban: remote?.bookBankIban || "",
				bic: remote?.bookBankBic || "",
				amount: remote?.bookBankAmount || remote?.bookPrice || "",
				currency: remote?.bookBankCurrency || "CZK",
				message: remote?.bookBankMessage || "Kniha Svet za malo",
				contactEmail:
					remote?.bookBankContactEmail || remote?.siteEmail || SITE_CONFIG.email,
			},
		},
		features: {
			enableAds: remote?.enableAds ?? FEATURE_FLAGS.enableAds,
			enableAnalytics: remote?.enableAnalytics ?? FEATURE_FLAGS.enableAnalytics,
		},
		site: {
			name: remote?.siteName || SITE_CONFIG.name,
			description: remote?.siteDescription || SITE_CONFIG.description,
			email: remote?.siteEmail || SITE_CONFIG.email,
		},
	} as const;
}
