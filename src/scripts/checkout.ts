/**
 * The cart page: renders the lines, keeps the totals in step with the
 * quantity and delivery choices, and posts the order.
 *
 * What it sends is deliberately thin: SKUs, quantities and a delivery choice.
 * Every price shown here is a display of the catalogue the server embedded, and
 * /api/shop/orders prices the SKUs again from Sanity before charging anything,
 * so nothing on this page can decide what the customer pays.
 */
import { formatCzk } from "@/lib/cart";
import {
	CART_CHANGED_EVENT,
	clearCart,
	readCart,
	removeFromCart,
	setQuantity,
} from "@/scripts/cartStore";

interface CatalogueEntry {
	sku: string;
	title: string;
	slug: string;
	variantLabel: string;
	unitMinor: number;
	available: boolean;
	image: string;
}

interface ShippingEntry {
	code: string;
	priceMinor: number;
	needsPoint: boolean;
	needsAddress: boolean;
}

interface Copy {
	locale: string;
	numberLocale: string;
	shopOpen: boolean;
	remove: string;
	quantity: string;
	free: string;
	pointMissing: string;
	errorGeneric: string;
	errorStale: string;
	submitting: string;
	closed: string;
}

function readJson<T>(selector: string, fallback: T): T {
	const node = document.querySelector(selector);
	try {
		return node?.textContent ? (JSON.parse(node.textContent) as T) : fallback;
	} catch {
		return fallback;
	}
}

const catalogue = new Map(
	readJson<CatalogueEntry[]>("[data-catalogue]", []).map((entry) => [
		entry.sku,
		entry,
	]),
);
const shipping = readJson<ShippingEntry[]>("[data-shipping]", []);
const copy = readJson<Copy>("[data-cart-copy]", {
	locale: "cs",
	numberLocale: "cs-CZ",
	shopOpen: false,
	remove: "Odebrat",
	quantity: "Počet",
	free: "zdarma",
	pointMissing: "Vyber výdejní místo.",
	errorGeneric: "Objednávku se nepodařilo odeslat.",
	errorStale: "Zkontroluj košík a zkus to znovu.",
	submitting: "Odesílám...",
	closed: "Objednávky jsou pozastavené.",
});

const form = document.querySelector<HTMLFormElement>("[data-checkout-form]");
const empty = document.querySelector<HTMLElement>("[data-cart-empty]");
const linesHost = document.querySelector<HTMLElement>("[data-cart-lines]");
const itemsTotalEl = document.querySelector<HTMLElement>("[data-items-total]");
const shippingTotalEl = document.querySelector<HTMLElement>("[data-shipping-total]");
const grandTotalEl = document.querySelector<HTMLElement>("[data-grand-total]");
const errorEl = document.querySelector<HTMLElement>("[data-checkout-error]");
const pickupBlock = document.querySelector<HTMLElement>("[data-pickup-block]");
const addressBlock = document.querySelector<HTMLElement>("[data-address-block]");
const pickupId = document.querySelector<HTMLInputElement>("[data-pickup-id]");
const pickupName = document.querySelector<HTMLInputElement>("[data-pickup-name]");

const money = (minor: number) => formatCzk(minor, copy.numberLocale);

function selectedMethod(): ShippingEntry | undefined {
	const code = new FormData(form ?? undefined).get("shippingMethod");
	return shipping.find((entry) => entry.code === String(code ?? ""));
}

function showError(message: string | null) {
	if (!errorEl) return;
	errorEl.textContent = message ?? "";
	errorEl.hidden = !message;
}

function renderLines() {
	if (!linesHost) return 0;

	const lines = readCart();
	linesHost.replaceChildren();
	let itemsMinor = 0;

	for (const line of lines) {
		const entry = catalogue.get(line.sku);
		// A SKU that vanished from the catalogue is dropped from the view and
		// from storage: better than rendering a row with no price that the
		// server would refuse at checkout anyway.
		if (!entry || !entry.available) {
			removeFromCart(line.sku);
			continue;
		}

		const lineMinor = entry.unitMinor * line.quantity;
		itemsMinor += lineMinor;

		const row = document.createElement("div");
		row.className = "cart-line";

		if (entry.image) {
			const img = document.createElement("img");
			img.className = "cart-line-media";
			img.src = `${entry.image}?w=144&h=144&fit=crop&auto=format`;
			img.alt = entry.title;
			img.loading = "lazy";
			row.append(img);
		}

		const body = document.createElement("div");
		body.className = "cart-line-body";
		const title = document.createElement("p");
		title.className = "cart-line-title";
		title.textContent = entry.title;
		const variant = document.createElement("p");
		variant.className = "cart-line-variant";
		variant.textContent = entry.variantLabel;
		body.append(title, variant);

		const qty = document.createElement("input");
		qty.type = "number";
		qty.className = "cart-line-qty";
		qty.min = "1";
		qty.max = "20";
		qty.value = String(line.quantity);
		qty.inputMode = "numeric";
		qty.setAttribute("aria-label", copy.quantity);
		qty.addEventListener("change", () => {
			const next = Number(qty.value);
			setQuantity(line.sku, Number.isFinite(next) && next > 0 ? next : 1);
		});

		const price = document.createElement("span");
		price.className = "cart-line-price";
		price.textContent = money(lineMinor);

		const remove = document.createElement("button");
		remove.type = "button";
		remove.className = "cart-line-remove";
		remove.textContent = copy.remove;
		remove.addEventListener("click", () => removeFromCart(line.sku));

		row.append(body, qty, price, remove);
		linesHost.append(row);
	}

	return itemsMinor;
}

function renderDeliveryFields() {
	const method = selectedMethod();
	if (pickupBlock) pickupBlock.hidden = !method?.needsPoint;
	if (addressBlock) addressBlock.hidden = !method?.needsAddress;

	// Required only while shown, so a hidden address block cannot block submit.
	addressBlock
		?.querySelectorAll<HTMLInputElement>("input")
		.forEach((input) => {
			input.required = Boolean(method?.needsAddress);
		});
}

function render() {
	const itemsMinor = renderLines();
	const hasItems = itemsMinor > 0 && readCart().length > 0;

	if (empty) empty.hidden = hasItems;
	if (form) form.hidden = !hasItems;
	if (!hasItems) return;

	renderDeliveryFields();

	const method = selectedMethod();
	const shippingMinor = method ? method.priceMinor : 0;

	if (itemsTotalEl) itemsTotalEl.textContent = money(itemsMinor);
	if (shippingTotalEl) {
		shippingTotalEl.textContent =
			shippingMinor === 0 ? copy.free : money(shippingMinor);
	}
	if (grandTotalEl) grandTotalEl.textContent = money(itemsMinor + shippingMinor);
}

form?.addEventListener("change", render);
window.addEventListener(CART_CHANGED_EVENT, render);
render();

// Packeta's widget is loaded only when the shop actually offers a pickup
// method and a key is configured; without it the field stays a plain input the
// customer can still be guided through by e-mail.
document
	.querySelector<HTMLButtonElement>("[data-pickup-open]")
	?.addEventListener("click", () => {
		const packeta = (window as unknown as { Packeta?: {
			Widget: { pick: (key: string, cb: (point: { id: string; name: string } | null) => void) => void };
		} }).Packeta;
		const apiKey = document.body.dataset.packetaKey;

		if (!packeta || !apiKey) {
			showError(copy.pointMissing);
			return;
		}

		packeta.Widget.pick(apiKey, (point) => {
			if (!point) return;
			if (pickupId) pickupId.value = point.id;
			if (pickupName) pickupName.value = point.name;
			showError(null);
		});
	});

form?.addEventListener("submit", async (event) => {
	event.preventDefault();
	if (!form) return;

	const submitter = (event as SubmitEvent).submitter as HTMLButtonElement | null;
	const paymentMethod = submitter?.dataset.pay === "bank_transfer"
		? "bank_transfer"
		: "comgate";

	const data = new FormData(form);
	const method = selectedMethod();

	if (method?.needsPoint && !String(data.get("pickupPointId") || "").trim()) {
		showError(copy.pointMissing);
		return;
	}

	showError(null);
	const buttons = form.querySelectorAll<HTMLButtonElement>("button[data-pay]");
	buttons.forEach((button) => {
		button.disabled = true;
	});
	const originalLabel = submitter?.textContent ?? "";
	if (submitter) submitter.textContent = copy.submitting;

	const restore = () => {
		buttons.forEach((button) => {
			button.disabled = false;
		});
		if (submitter) submitter.textContent = originalLabel;
	};

	try {
		const response = await fetch("/api/shop/orders", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email: data.get("email"),
				fullName: data.get("fullName"),
				phone: data.get("phone") || "",
				shippingMethod: data.get("shippingMethod"),
				pickupPointId: data.get("pickupPointId") || "",
				pickupPointName: data.get("pickupPointName") || "",
				street: data.get("street") || "",
				city: data.get("city") || "",
				zip: data.get("zip") || "",
				country: "CZ",
				note: data.get("note") || "",
				website: data.get("website") || "",
				paymentMethod,
				locale: copy.locale === "en" ? "en" : "cs",
				items: readCart(),
			}),
		});

		const payload = (await response.json().catch(() => ({}))) as {
			status?: string;
			paymentUrl?: string;
			redirectUrl?: string;
			error?: string;
		};

		if (!response.ok) {
			// 409 means the catalogue moved: re-render so the customer sees the
			// change before being asked to pay again.
			if (response.status === 409) {
				render();
				showError(copy.errorStale);
			} else if (payload.error === "shop_closed") {
				showError(copy.closed);
			} else {
				showError(copy.errorGeneric);
			}
			restore();
			return;
		}

		// The cart is cleared only once the order exists on the server.
		clearCart();

		if (payload.paymentUrl) {
			window.location.href = payload.paymentUrl;
			return;
		}
		window.location.href = payload.redirectUrl || "/obchod/objednavka";
	} catch {
		showError(copy.errorGeneric);
		restore();
	}
});
