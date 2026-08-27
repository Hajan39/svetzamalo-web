import { SHOP } from "./shopConfig";

export const ADMIN_COOKIE = "szm_admin";

export function isAdminConfigured(): boolean {
	return SHOP.adminPassword.length > 0;
}

/** Length-independent comparison so a wrong guess reveals nothing by timing. */
function timingSafeEqual(a: string, b: string): boolean {
	const encoder = new TextEncoder();
	const left = encoder.encode(a);
	const right = encoder.encode(b);
	let diff = left.length ^ right.length;
	for (let i = 0; i < Math.max(left.length, right.length); i++) {
		diff |= (left[i] ?? 0) ^ (right[i] ?? 0);
	}
	return diff === 0;
}

/**
 * Session value derived from the password itself, so a valid cookie cannot be
 * produced without knowing ADMIN_PASSWORD and no server-side session store is
 * needed. Rotating the password invalidates every existing session.
 */
export async function sessionToken(): Promise<string> {
	const data = new TextEncoder().encode(
		`svetzamalo-admin-v1:${SHOP.adminPassword}`,
	);
	const digest = await crypto.subtle.digest("SHA-256", data);
	return Array.from(new Uint8Array(digest))
		.map((byte) => byte.toString(16).padStart(2, "0"))
		.join("");
}

export async function verifyPassword(input: string): Promise<boolean> {
	if (!isAdminConfigured()) return false;
	return timingSafeEqual(input, SHOP.adminPassword);
}

export async function isAuthenticated(
	cookieValue: string | undefined,
): Promise<boolean> {
	if (!isAdminConfigured() || !cookieValue) return false;
	return timingSafeEqual(cookieValue, await sessionToken());
}
