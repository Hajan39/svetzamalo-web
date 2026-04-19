import { useSiteConfig } from "@/integrations/strapi/hooks";
import { EXTERNAL_SERVICES, FEATURE_FLAGS, SITE_CONFIG } from "@/lib/constants";

/**
 * Merged site settings: Strapi values take priority, env vars are fallback.
 * Safe to call anywhere in the React tree — returns env defaults while
 * the Strapi request is still in flight or if Strapi is unreachable.
 */
export function useSiteSettings() {
	const { data: remote } = useSiteConfig();

	return {
		book: {
			available: remote?.bookAvailable ?? EXTERNAL_SERVICES.book.available,
			buyUrl: remote?.bookBuyUrl || EXTERNAL_SERVICES.book.buyUrl,
			price: remote?.bookPrice || EXTERNAL_SERVICES.book.price,
			ebookPdfUrl: remote?.ebookPdfUrl || EXTERNAL_SERVICES.book.ebookPdfUrl,
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
