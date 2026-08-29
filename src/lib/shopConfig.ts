// Single source of truth for shop settings, read from environment variables.
//
// This used to live in Strapi, which was billed per API request and was hit on
// every page render. These values change a few times a year, so an env var is
// both cheaper and one less service that can take the shop down. Secrets
// (COMGATE_SECRET, RESEND_API_KEY, ADMIN_PASSWORD) are env-only and never
// leave the server.

function env(key: string, fallback = ""): string {
	return (import.meta.env[key] as string | undefined)?.trim() || fallback;
}

const FREE_EBOOK_PATH = env(
	"FREE_EBOOK_PATH",
	"/downloads/10-nejdrazsich-cestovatelskych-chyb.pdf",
);

const bankAccount = env("BANK_ACCOUNT");
const bankCode = env("BANK_CODE");

const SITE_URL = env(
	"SITE_URL",
	env("PUBLIC_SITE_URL", "https://svetzamalo.cz"),
).replace(/\/$/, "");

/**
 * The free ebook may be served from this site (public/) or from external file
 * storage. Accept either, so moving the file does not need a code change.
 */
function absoluteFileUrl(value: string): string {
	if (!value) return "";
	if (/^https?:\/\//i.test(value)) return value;
	return `${SITE_URL}${value.startsWith("/") ? "" : "/"}${value}`;
}

export const SHOP = {
	siteUrl: SITE_URL,

	sellerName: env("SELLER_NAME", "Jan Hanč"),
	sellerIco: env("SELLER_ICO", "06328229"),
	contactEmail: env("CONTACT_EMAIL", "info@svetzamalo.cz"),

	freeEbookTitle: env("FREE_EBOOK_TITLE", "10 nejdražších cestovatelských chyb"),
	freeEbookPath: FREE_EBOOK_PATH,
	/** The file itself, wherever it lives. */
	freeEbookUrl: absoluteFileUrl(FREE_EBOOK_PATH),
	/** What e-mails and pages link to, so downloads can be counted. */
	freeEbookDownloadUrl: `${SITE_URL}/api/ebook/free`,

	paidBookTitle: env("PAID_BOOK_TITLE", "Kompletní cestovatelský průvodce"),
	/** Where the paid PDF lives. Never exposed to the browser. */
	paidBookFileUrl: env("PAID_BOOK_FILE_URL"),
	priceCzk: Number.parseInt(env("BOOK_PRICE_CZK", "490"), 10),

	bankAccount,
	bankCode,
	bankAccountDisplay: [bankAccount, bankCode].filter(Boolean).join("/"),
	bankIban: env("BANK_IBAN"),
	bankBic: env("BANK_BIC"),
	bankAccountName: env("BANK_ACCOUNT_NAME", env("SELLER_NAME", "Jan Hanč")),

	comgateMerchant: env("COMGATE_MERCHANT"),
	comgateSecret: env("COMGATE_SECRET"),
	/** Comgate stays in test mode until explicitly switched off. */
	comgateTest: env("COMGATE_TEST", "true").toLowerCase() !== "false",

	adminPassword: env("ADMIN_PASSWORD"),
} as const;

export function priceMinor(): number {
	return Math.round(SHOP.priceCzk * 100);
}

/** The free ebook only needs a file to hand over. */
export function isFreeEbookLive(): boolean {
	return Boolean(SHOP.freeEbookPath);
}

/** Bank transfer needs somewhere to send the money and something to deliver. */
export function isBankTransferLive(): boolean {
	return Boolean(
		SHOP.paidBookFileUrl &&
			(SHOP.bankAccount || SHOP.bankIban) &&
			priceMinor() > 0,
	);
}

export function isComgateLive(): boolean {
	return Boolean(
		SHOP.paidBookFileUrl &&
			SHOP.comgateMerchant &&
			SHOP.comgateSecret &&
			priceMinor() > 0,
	);
}

export function isPaidBookLive(): boolean {
	return isBankTransferLive() || isComgateLive();
}

/**
 * True when the paid book appears to be served from somewhere the public can
 * reach directly, which would let anyone download it without paying.
 *
 * The delivery endpoint only ever hands out PAID_BOOK_FILE_URL through a
 * per-order token, so that URL must live somewhere unlisted (Vercel Blob, S3,
 * ...) -- never under this site's own public/ directory next to the free ebook.
 */
export function isPaidBookFileExposed(): boolean {
	const url = SHOP.paidBookFileUrl;
	if (!url) return false;

	const path = url.startsWith("http")
		? (() => {
				try {
					const parsed = new URL(url);
					const sameHost = parsed.origin === new URL(SHOP.siteUrl).origin;
					return sameHost ? parsed.pathname : "";
				} catch {
					return "";
				}
			})()
		: url;

	return path.startsWith("/downloads") || path.startsWith("/images");
}
