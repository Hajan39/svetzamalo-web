import type { ImageAsset, SiteConfig, SupportedLocale } from "@/types";
import { stegaClean } from "@sanity/client/stega";
import { loadQuery } from "./loadQuery";

interface SanityImage {
	asset?: {
		url?: string;
		metadata?: {
			dimensions?: {
				width?: number;
				height?: number;
			};
		};
	};
	alt?: string;
}

type SanitySiteConfig = Omit<SiteConfig, "bookCover" | "freeEbookCover"> & {
	bookCover?: SanityImage | null;
	freeEbookCover?: SanityImage | null;
};

const imageProjection = `asset->{url, metadata{dimensions}}, alt`;

const siteConfigProjection = `
  locale,
  siteName,
  siteDescription,
  siteEmail,
  enableAnalytics,
  enableAds,
  freeEbookAvailable,
  freeEbookTitle,
  freeEbookDescription,
  freeEbookCover{${imageProjection}},
  ebookPdfUrl,
  bookAvailable,
  bookTitle,
  bookDescription,
  bookCover{${imageProjection}},
  bookPrice,
  bookBuyUrl,
  paidEbookPdfUrl,
  paidEbookEpubUrl,
  bookBankTransferEnabled,
  bookBankAccountName,
  bookBankAccountNumber,
  bookBankCode,
  bookBankIban,
  bookBankBic,
  bookBankAmount,
  bookBankCurrency,
  bookBankMessage,
  bookBankContactEmail,
  bookGatewayEnabled,
  bookGatewayProvider,
  bookGatewayTestMode,
  bookGatewayMerchantId,
  bookGatewayApiBaseUrl,
  bookGatewayReturnPath,
  bookGatewayCancelPath,
  bookGatewayCallbackPath,
  bookGatewayButtonLabel
`;

function cleanString(value?: string): string | undefined {
	return value ? stegaClean(value) : value;
}

function normalizeMedia(
	image: SanityImage | null | undefined,
	fallbackAlt?: string,
): ImageAsset | undefined {
	const url = image?.asset?.url;
	if (!url) return undefined;

	return {
		src: url,
		alt: cleanString(image?.alt) || fallbackAlt || "",
		width: image?.asset?.metadata?.dimensions?.width,
		height: image?.asset?.metadata?.dimensions?.height,
	};
}

function transformSiteConfig(config: SanitySiteConfig): SiteConfig {
	const bookTitle = cleanString(config.bookTitle);
	const freeEbookTitle = cleanString(config.freeEbookTitle);

	return {
		siteName: cleanString(config.siteName),
		siteDescription: cleanString(config.siteDescription),
		siteEmail: cleanString(config.siteEmail),
		enableAnalytics: config.enableAnalytics,
		enableAds: config.enableAds,

		freeEbookAvailable: config.freeEbookAvailable,
		freeEbookTitle,
		freeEbookDescription: cleanString(config.freeEbookDescription),
		freeEbookCover: normalizeMedia(config.freeEbookCover, freeEbookTitle),
		ebookPdfUrl: cleanString(config.ebookPdfUrl),

		bookAvailable: config.bookAvailable,
		bookTitle,
		bookDescription: cleanString(config.bookDescription),
		bookCover: normalizeMedia(config.bookCover, bookTitle),
		bookPrice: cleanString(config.bookPrice),
		bookBuyUrl: cleanString(config.bookBuyUrl),
		paidEbookPdfUrl: cleanString(config.paidEbookPdfUrl),
		paidEbookEpubUrl: cleanString(config.paidEbookEpubUrl),

		bookBankTransferEnabled: config.bookBankTransferEnabled,
		bookBankAccountName: cleanString(config.bookBankAccountName),
		bookBankAccountNumber: cleanString(config.bookBankAccountNumber),
		bookBankCode: cleanString(config.bookBankCode),
		bookBankIban: cleanString(config.bookBankIban),
		bookBankBic: cleanString(config.bookBankBic),
		bookBankAmount: cleanString(config.bookBankAmount),
		bookBankCurrency: cleanString(config.bookBankCurrency),
		bookBankMessage: cleanString(config.bookBankMessage),
		bookBankContactEmail: cleanString(config.bookBankContactEmail),

		bookGatewayEnabled: config.bookGatewayEnabled,
		bookGatewayProvider: cleanString(config.bookGatewayProvider) as
			| SiteConfig["bookGatewayProvider"]
			| undefined,
		bookGatewayTestMode: config.bookGatewayTestMode,
		bookGatewayMerchantId: cleanString(config.bookGatewayMerchantId),
		bookGatewayApiBaseUrl: cleanString(config.bookGatewayApiBaseUrl),
		bookGatewayReturnPath: cleanString(config.bookGatewayReturnPath),
		bookGatewayCancelPath: cleanString(config.bookGatewayCancelPath),
		bookGatewayCallbackPath: cleanString(config.bookGatewayCallbackPath),
		bookGatewayButtonLabel: cleanString(config.bookGatewayButtonLabel),
	};
}

// Returns null when no siteConfig document exists yet, so callers can fall back
// to the previous source while the content is being filled in.
export async function fetchSiteConfig(
	locale: SupportedLocale = "cs",
	options: { perspectiveCookie?: string } = {},
): Promise<SiteConfig | null> {
	try {
		const { data } = await loadQuery<SanitySiteConfig | null>({
			query: `*[_type == "siteConfig" && locale in [$locale, "cs"]]{
        ${siteConfigProjection},
        "priority": select(locale == $locale => 0, 1)
      } | order(priority asc)[0]`,
			params: { locale },
			...options,
		});
		return data ? transformSiteConfig(data) : null;
	} catch (error) {
		console.warn("Sanity fetch site config failed:", error);
		return null;
	}
}
