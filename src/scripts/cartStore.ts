/**
 * The cart as the browser keeps it: SKUs and counts in localStorage, nothing
 * about money. Prices shown on the cart page are rendered from the catalogue
 * the server embedded, and the order endpoint prices the SKUs again, so a
 * tampered localStorage buys nothing at a discount.
 */
import { CART_STORAGE_KEY, MAX_LINE_QUANTITY, normalizeCartLines, type CartLineInput } from "@/lib/cart";

export const CART_CHANGED_EVENT = "svetzamalo:cart-changed";

export function readCart(): CartLineInput[] {
	try {
		const raw = window.localStorage.getItem(CART_STORAGE_KEY);
		return raw ? normalizeCartLines(JSON.parse(raw)) : [];
	} catch {
		// Private windows and cleared site data both land here. An empty cart is
		// the right answer; throwing would take the whole shop page down.
		return [];
	}
}

export function writeCart(lines: CartLineInput[]): void {
	try {
		window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
	} catch {
		// Nothing to do: the page still works for this visit, it just will not
		// be remembered after a reload.
	}
	window.dispatchEvent(
		new CustomEvent(CART_CHANGED_EVENT, { detail: { lines } }),
	);
}

export function cartCount(lines = readCart()): number {
	return lines.reduce((sum, line) => sum + line.quantity, 0);
}

export function addToCart(sku: string, quantity = 1): CartLineInput[] {
	const lines = readCart();
	const existing = lines.find((line) => line.sku === sku);

	if (existing) {
		existing.quantity = Math.min(
			existing.quantity + quantity,
			MAX_LINE_QUANTITY,
		);
	} else {
		lines.push({ sku, quantity: Math.min(quantity, MAX_LINE_QUANTITY) });
	}

	const next = normalizeCartLines(lines);
	writeCart(next);
	return next;
}

export function setQuantity(sku: string, quantity: number): CartLineInput[] {
	const next = normalizeCartLines(
		readCart().map((line) =>
			line.sku === sku ? { ...line, quantity } : line,
		),
	);
	writeCart(next);
	return next;
}

export function removeFromCart(sku: string): CartLineInput[] {
	const next = readCart().filter((line) => line.sku !== sku);
	writeCart(next);
	return next;
}

export function clearCart(): void {
	writeCart([]);
}
