import {
	isEmailLoginAvailable,
	isPasswordLoginAvailable,
} from "./adminAuth";
import { db, isDbConfigured } from "./db";
import { isMailConfigured } from "./mail";
import {
	isBankTransferLive,
	isComgateLive,
	isFreeEbookLive,
	isPaidBookFileExposed,
	SHOP,
} from "./shopConfig";

export type CheckState = "ok" | "warn" | "fail";

export interface Check {
	label: string;
	state: CheckState;
	detail: string;
}

const REQUIRED_TABLES = ["shop_orders", "shop_leads", "shop_payment_events"];

async function checkDatabase(): Promise<Check> {
	if (!isDbConfigured()) {
		return {
			label: "Databáze (Neon)",
			state: "fail",
			detail: "DATABASE_URL není nastavená — objednávky ani kontakty se neuloží.",
		};
	}
	try {
		const rows = (await db()`
			SELECT table_name FROM information_schema.tables
			WHERE table_schema = 'public' AND table_name = ANY(${REQUIRED_TABLES})
		`) as unknown as { table_name: string }[];
		const present = rows.map((row) => row.table_name);
		const missing = REQUIRED_TABLES.filter((name) => !present.includes(name));

		if (missing.length > 0) {
			return {
				label: "Databáze (Neon)",
				state: "fail",
				detail: `Připojeno, ale chybí tabulky: ${missing.join(", ")}. Spusť v Neonu db/schema.sql.`,
			};
		}
		return {
			label: "Databáze (Neon)",
			state: "ok",
			detail: "Připojeno, všechny tabulky existují.",
		};
	} catch (error) {
		return {
			label: "Databáze (Neon)",
			state: "fail",
			detail: `Připojení selhalo: ${error instanceof Error ? error.message : String(error)}`,
		};
	}
}

/**
 * Actually reads the paid book, because every other check can pass while the
 * one file a customer pays for is unreachable. HEAD first; some stores answer
 * it with 405, so a one-byte ranged GET is the fallback.
 */
async function checkPaidBookFile(): Promise<Check> {
	const label = "Soubor placené knihy";

	if (!SHOP.paidBookFileUrl) {
		return {
			label,
			state: "warn",
			detail: "PAID_BOOK_FILE_URL není nastavená — kniha se neprodává.",
		};
	}
	if (isPaidBookFileExposed()) {
		return {
			label,
			state: "fail",
			detail: "Soubor leží ve veřejné části webu — stáhne ho kdokoli bez zaplacení.",
		};
	}

	try {
		let response = await fetch(SHOP.paidBookFileUrl, {
			method: "HEAD",
			signal: AbortSignal.timeout(8000),
		});
		if (!response.ok) {
			response = await fetch(SHOP.paidBookFileUrl, {
				headers: { Range: "bytes=0-0" },
				signal: AbortSignal.timeout(8000),
			});
		}
		if (!response.ok) {
			const auth = response.status === 401 || response.status === 403;
			return {
				label,
				state: "fail",
				detail: auth
					? `Úložiště vrátilo ${response.status} — vyžaduje token, který server neposílá. Nastav soubor jako veřejně čitelný.`
					: `Úložiště vrátilo ${response.status} — soubor není dostupný.`,
			};
		}
		const size = Number(response.headers.get("content-range")?.split("/")[1] || response.headers.get("content-length") || 0);
		return {
			label,
			state: "ok",
			detail: size > 0 ? `Čitelný (${(size / 1048576).toFixed(1)} MB).` : "Čitelný.",
		};
	} catch (error) {
		return {
			label,
			state: "fail",
			detail: `Nelze načíst: ${error instanceof Error ? error.message : String(error)}`,
		};
	}
}

export async function runReadinessChecks(): Promise<Check[]> {
	const [database, paidBookFile] = await Promise.all([
		checkDatabase(),
		checkPaidBookFile(),
	]);

	const email: Check = isMailConfigured()
		? { label: "E-maily (Resend)", state: "ok", detail: `Odesílá se z ${SHOP.contactEmail}.` }
		: {
				label: "E-maily (Resend)",
				state: "fail",
				detail: "RESEND_API_KEY není nastavený — zákazníkům nic nepřijde, odkaz musíš posílat ručně.",
			};

	const freeEbook: Check = isFreeEbookLive()
		? { label: "Free ebook", state: "ok", detail: `Servíruje se z ${SHOP.freeEbookPath}.` }
		: { label: "Free ebook", state: "warn", detail: "FREE_EBOOK_PATH není nastavená." };

	const bank: Check = isBankTransferLive()
		? {
				label: "Platba převodem",
				state: "ok",
				detail: `Účet ${SHOP.bankAccountDisplay || SHOP.bankIban}, ${SHOP.priceCzk} Kč.`,
			}
		: {
				label: "Platba převodem",
				state: "warn",
				detail: "Chybí číslo účtu nebo IBAN, případně soubor knihy.",
			};

	const comgate: Check = isComgateLive()
		? {
				label: "Platba kartou (Comgate)",
				state: SHOP.comgateTest ? "warn" : "ok",
				detail: SHOP.comgateTest
					? "Zapnuto v TESTOVACÍM režimu — skutečné platby neprojdou. Po otestování nastav COMGATE_TEST=false."
					: "Aktivní v produkčním režimu.",
			}
		: {
				label: "Platba kartou (Comgate)",
				state: "warn",
				detail: "Chybí COMGATE_MERCHANT / COMGATE_SECRET, případně soubor knihy.",
			};

	const adminLogin: Check = isEmailLoginAvailable()
		? {
				label: "Přihlášení do administrace",
				state: "ok",
				detail: isPasswordLoginAvailable()
					? "Odkazem na e-mail. Heslo zůstává jako záloha — pokud ho nepotřebuješ, smaž ADMIN_PASSWORD."
					: "Odkazem na e-mail.",
			}
		: {
				label: "Přihlášení do administrace",
				state: isPasswordLoginAvailable() ? "warn" : "fail",
				detail: isPasswordLoginAvailable()
					? "Jen heslem. Doplň ADMIN_EMAILS a přihlašování se přepne na odkaz do e-mailu, který nejde uhodnout ani vynést."
					: "Není nastavené ani ADMIN_EMAILS, ani ADMIN_PASSWORD — administrace je nedostupná.",
			};

	const list = [
		adminLogin,
		checkPublicUrl(),
		database,
		email,
		freeEbook,
		paidBookFile,
		bank,
		comgate,
		checkComgateCredentials(),
	];


	return list;
}

/**
 * Shows the values the shop actually resolved, not just whether a variable is
 * non-empty. A wrong SITE_URL is invisible in every other check while quietly
 * breaking payments: the gateway is told to call back at
 * ${SITE_URL}/api/comgate/callback, which overrides whatever is configured in
 * the Comgate portal, so the notification goes to the wrong host.
 */
function checkPublicUrl(): Check {
	const label = "Veřejná adresa webu";
	const url = SHOP.siteUrl;
	const pushUrl = `${url}/api/comgate/callback`;

	if (!/^https:\/\//i.test(url)) {
		return {
			label,
			state: "fail",
			detail: `SITE_URL je "${url}" — musí to být https adresa webu, jinak brána posílá potvrzení platby na špatné místo.`,
		};
	}

	let host = "";
	try {
		host = new URL(url).hostname;
	} catch {
		return {
			label,
			state: "fail",
			detail: `SITE_URL "${url}" není platná adresa.`,
		};
	}

	if (host.endsWith(".vercel.app")) {
		return {
			label,
			state: "fail",
			detail: `SITE_URL míří na náhledovou domenu ${host}. Brána bude posílat potvrzení tam. Nastav produkční doménu.`,
		};
	}

	return {
		label,
		state: "ok",
		detail: `${url} · brána posílá potvrzení na ${pushUrl}`,
	};
}

function checkComgateCredentials(): Check {
	const label = "Comgate přihlašovací údaje";
	if (!SHOP.comgateMerchant || !SHOP.comgateSecret) {
		return {
			label,
			state: "warn",
			detail: "COMGATE_MERCHANT nebo COMGATE_SECRET chybí.",
		};
	}
	const merchant = SHOP.comgateMerchant;
	const masked =
		merchant.length > 4 ? `${"*".repeat(merchant.length - 4)}${merchant.slice(-4)}` : "****";
	return {
		label,
		state: "ok",
		detail: `Merchant ${masked}, secret ${SHOP.comgateSecret.length} znaků. Testovací i produkční prostředí mají v Comgate vlastní údaje — zkontroluj, že sedí k režimu níže.`,
	};
}
