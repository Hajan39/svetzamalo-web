import { describe, expect, it } from "vitest";
import { isCrossSitePost } from "./crossSitePost";

function post(
	path: string,
	headers: Record<string, string> = {},
	method = "POST",
) {
	const url = new URL(`https://svetzamalo.cz${path}`);
	return {
		request: new Request(url, { method, headers }),
		url,
	};
}

const FORM = { "content-type": "application/x-www-form-urlencoded" };

describe("isCrossSitePost", () => {
	it("lets the Comgate callback through without an Origin", () => {
		// The regression this whole check exists around: Comgate posts
		// server-to-server with no Origin and was answered 403.
		const { request, url } = post("/api/comgate/callback", FORM);
		expect(isCrossSitePost(request, url)).toBe(false);
	});

	it("blocks a form POST from another origin", () => {
		const { request, url } = post("/api/leads", {
			...FORM,
			origin: "https://evil.example.com",
		});
		expect(isCrossSitePost(request, url)).toBe(true);
	});

	it("allows a form POST from the site itself", () => {
		const { request, url } = post("/api/leads", {
			...FORM,
			origin: "https://svetzamalo.cz",
		});
		expect(isCrossSitePost(request, url)).toBe(false);
	});

	it("blocks a form POST with no Origin or Referer", () => {
		const { request, url } = post("/api/leads", FORM);
		expect(isCrossSitePost(request, url)).toBe(true);
	});

	it("falls back to Referer when Origin is absent", () => {
		const { request, url } = post("/api/leads", {
			...FORM,
			referer: "https://svetzamalo.cz/book",
		});
		expect(isCrossSitePost(request, url)).toBe(false);
	});

	it("treats a malformed Origin as cross-site", () => {
		const { request, url } = post("/api/leads", { ...FORM, origin: "junk" });
		expect(isCrossSitePost(request, url)).toBe(true);
	});

	it("ignores GET requests", () => {
		const { request, url } = post("/api/leads", {}, "GET");
		expect(isCrossSitePost(request, url)).toBe(false);
	});

	it("ignores JSON POSTs, which a form cannot forge cross-site", () => {
		const { request, url } = post("/api/leads", {
			"content-type": "application/json",
		});
		expect(isCrossSitePost(request, url)).toBe(false);
	});
});
