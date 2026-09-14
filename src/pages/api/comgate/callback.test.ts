import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * The callback is the one public URL that can mark an order paid, so these
 * exercise its decisions against a fake database rather than its plumbing.
 */
const state = vi.hoisted(() => ({
	order: null as Record<string, unknown> | null,
	updates: [] as string[],
	events: [] as { event: string; payload: Record<string, string> }[],
	delivered: [] as string[],
	validSecret: "good",
}));

vi.mock("@/lib/db", () => ({
	isDbConfigured: () => true,
	db: () => (strings: TemplateStringsArray, ...values: unknown[]) => {
		const text = strings.join("?");
		if (text.includes("SELECT")) return Promise.resolve(state.order ? [state.order] : []);
		state.updates.push(text.replace(/\s+/g, " ").trim());
		if (text.includes("RETURNING download_token")) {
			if (state.order?.status === "paid") return Promise.resolve([]);
			const token = (state.order?.download_token as string) || (values.at(-1) as string);
			return Promise.resolve([{ download_token: token }]);
		}
		return Promise.resolve([]);
	},
	logPaymentEvent: async (_id: unknown, _p: string, event: string, payload: Record<string, string>) => {
		state.events.push({ event, payload });
	},
}));

vi.mock("@/lib/mail", () => ({
	isMailConfigured: () => true,
	sendPaidBookEmail: async (_email: string, token: string) => {
		state.delivered.push(token);
		return true;
	},
}));

vi.mock("@/lib/comgate", () => ({
	isValidComgateSecret: (s?: string) => s === state.validSecret,
	orderStatusFromComgate: (s?: string) => (s === "PAID" ? "paid" : "pending"),
	fetchComgateStatus: async () => ({ status: "PAID", price: "49000", curr: "CZK" }),
}));

import { POST } from "./callback";

function post(body: Record<string, string>) {
	return POST({
		request: new Request("https://svetzamalo.cz/api/comgate/callback", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams(body).toString(),
		}),
	} as never);
}

beforeEach(() => {
	state.order = {
		id: 7,
		email: "a@b.cz",
		status: "pending",
		amount_minor: 49000,
		currency: "CZK",
		variable_symbol: "1234567890",
		comgate_trans_id: "T1",
		download_token: null,
	};
	state.updates = [];
	state.events = [];
	state.delivered = [];
});

describe("comgate callback", () => {
	it("marks the order paid and delivers once for an authenticated PAID callback", async () => {
		const res = await post({ transId: "T1", status: "PAID", price: "49000", curr: "CZK", secret: "good" });
		expect(res.status).toBe(200);
		expect(state.updates.some((u) => u.includes("status = 'paid'") && u.includes("status <> 'paid'"))).toBe(true);
		expect(state.delivered).toHaveLength(1);
	});

	it("never stores the shop secret in the events table", async () => {
		await post({ transId: "T1", status: "PAID", price: "49000", curr: "CZK", secret: "good" });
		state.order = null;
		await post({ transId: "nope", status: "PAID", secret: "good" });
		for (const { payload } of state.events) {
			expect(payload.secret ?? "[redacted]").toBe("[redacted]");
		}
	});

	it("refuses to unlock the book when the paid amount differs", async () => {
		const res = await post({ transId: "T1", status: "PAID", price: "100", curr: "CZK", secret: "good" });
		expect(res.status).toBe(200);
		expect(state.updates.some((u) => u.includes("status = 'paid'"))).toBe(false);
		expect(state.events.map((e) => e.event)).toContain("amount_mismatch");
		expect(state.delivered).toHaveLength(0);
	});

	it("does not re-deliver or re-token an order that is already paid", async () => {
		state.order = { ...state.order!, status: "paid", download_token: "existing" };
		await post({ transId: "T1", status: "PAID", price: "49000", curr: "CZK", secret: "good" });
		expect(state.events.map((e) => e.event)).toContain("callback_duplicate");
		expect(state.delivered).toHaveLength(0);
	});

	it("keeps the token that was already issued", async () => {
		state.order = { ...state.order!, download_token: "first" };
		await post({ transId: "T1", status: "PAID", price: "49000", curr: "CZK", secret: "good" });
		expect(state.delivered).toEqual(["first"]);
		expect(state.updates[0]).toContain("COALESCE(download_token,");
	});

	it("falls back to asking the gateway when the secret is wrong", async () => {
		await post({ transId: "T1", status: "PAID", price: "49000", curr: "CZK", secret: "bad" });
		expect(state.events.map((e) => e.event)).toContain("status");
		expect(state.delivered).toHaveLength(1);
	});
});
