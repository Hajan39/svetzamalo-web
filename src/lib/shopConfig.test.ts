import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * shopConfig reads the environment once at module load, so each case stubs the
 * variables and re-imports it rather than mutating a cached object.
 */
async function loadWith(env: Record<string, string>) {
	vi.resetModules();
	for (const [key, value] of Object.entries(env)) vi.stubEnv(key, value);
	return import("./shopConfig");
}

afterEach(() => {
	vi.unstubAllEnvs();
	vi.resetModules();
});

describe("isPaidBookFileExposed", () => {
	it("flags a paid book sitting in the site's public directory", async () => {
		// The failure this guards: dropping the paid PDF next to the free one
		// makes it downloadable without paying, and nothing else looks wrong.
		const { isPaidBookFileExposed } = await loadWith({
			PAID_BOOK_FILE_URL: "/downloads/kniha.pdf",
		});
		expect(isPaidBookFileExposed()).toBe(true);
	});

	it("flags it via an absolute URL on the same host too", async () => {
		const { isPaidBookFileExposed } = await loadWith({
			SITE_URL: "https://svetzamalo.cz",
			PAID_BOOK_FILE_URL: "https://svetzamalo.cz/downloads/kniha.pdf",
		});
		expect(isPaidBookFileExposed()).toBe(true);
	});

	it("accepts external file storage", async () => {
		const { isPaidBookFileExposed } = await loadWith({
			SITE_URL: "https://svetzamalo.cz",
			PAID_BOOK_FILE_URL:
				"https://abc123.public.blob.vercel-storage.com/kniha-9f2c.pdf",
		});
		expect(isPaidBookFileExposed()).toBe(false);
	});

	it("does not complain when no paid book is configured", async () => {
		const { isPaidBookFileExposed } = await loadWith({
			PAID_BOOK_FILE_URL: "",
		});
		expect(isPaidBookFileExposed()).toBe(false);
	});
});

describe("payment availability", () => {
	it("keeps the paid book hidden until it can actually be delivered", async () => {
		// Bank details without a file would take money for nothing.
		const { isBankTransferLive, isPaidBookLive } = await loadWith({
			PAID_BOOK_FILE_URL: "",
			BANK_ACCOUNT: "123456789",
			BOOK_PRICE_CZK: "490",
		});
		expect(isBankTransferLive()).toBe(false);
		expect(isPaidBookLive()).toBe(false);
	});

	it("enables bank transfer once a file and an account exist", async () => {
		const { isBankTransferLive } = await loadWith({
			PAID_BOOK_FILE_URL: "https://files.example.com/kniha.pdf",
			BANK_ACCOUNT: "123456789",
			BOOK_PRICE_CZK: "490",
		});
		expect(isBankTransferLive()).toBe(true);
	});

	it("requires both Comgate credentials, not just one", async () => {
		const { isComgateLive } = await loadWith({
			PAID_BOOK_FILE_URL: "https://files.example.com/kniha.pdf",
			COMGATE_MERCHANT: "512014",
			COMGATE_SECRET: "",
			BOOK_PRICE_CZK: "490",
		});
		expect(isComgateLive()).toBe(false);
	});

	it("stays in test mode unless the flag is exactly false", async () => {
		const risky = await loadWith({ COMGATE_TEST: "" });
		expect(risky.SHOP.comgateTest).toBe(true);
		const off = await loadWith({ COMGATE_TEST: "false" });
		expect(off.SHOP.comgateTest).toBe(false);
	});
});

describe("free ebook location", () => {
	it("turns a site path into a link an e-mail can use", async () => {
		const { SHOP } = await loadWith({
			SITE_URL: "https://svetzamalo.cz",
			FREE_EBOOK_PATH: "/downloads/ebook.pdf",
		});
		expect(SHOP.freeEbookUrl).toBe("https://svetzamalo.cz/downloads/ebook.pdf");
	});

	it("leaves an external URL as it is", async () => {
		const { SHOP } = await loadWith({
			SITE_URL: "https://svetzamalo.cz",
			FREE_EBOOK_PATH: "https://files.example.com/ebook.pdf",
		});
		expect(SHOP.freeEbookUrl).toBe("https://files.example.com/ebook.pdf");
	});
});
