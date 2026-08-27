import { db, isDbConfigured } from "./db";
import { SHOP } from "./shopConfig";

export const ADMIN_COOKIE = "szm_admin";

const LOGIN_TOKEN_TTL_MINUTES = 15;
const SESSION_TTL_HOURS = 12;

/** Addresses allowed to request a login link. */
function adminEmails(): string[] {
	return (import.meta.env.ADMIN_EMAILS || "")
		.split(",")
		.map((value: string) => value.trim().toLowerCase())
		.filter(Boolean);
}

export function isEmailLoginAvailable(): boolean {
	return adminEmails().length > 0 && isDbConfigured();
}

export function isPasswordLoginAvailable(): boolean {
	return SHOP.adminPassword.length > 0;
}

export function isAdminConfigured(): boolean {
	return isEmailLoginAvailable() || isPasswordLoginAvailable();
}

export function isAllowedAdminEmail(email: string): boolean {
	return adminEmails().includes(email.trim().toLowerCase());
}

/** Length-independent comparison, so a wrong guess reveals nothing by timing. */
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

async function sha256Hex(value: string): Promise<string> {
	const digest = await crypto.subtle.digest(
		"SHA-256",
		new TextEncoder().encode(value),
	);
	return Array.from(new Uint8Array(digest))
		.map((byte) => byte.toString(16).padStart(2, "0"))
		.join("");
}

/**
 * Expiry is computed here rather than as `$1 || ' minutes'` in SQL: a bind
 * parameter beside the concatenation operator leaves Postgres unable to infer
 * its type, and the insert fails at runtime.
 */
function expiryIso(milliseconds: number): string {
	return new Date(Date.now() + milliseconds).toISOString();
}

function randomToken(): string {
	const bytes = new Uint8Array(32);
	crypto.getRandomValues(bytes);
	return Array.from(bytes)
		.map((byte) => byte.toString(16).padStart(2, "0"))
		.join("");
}

// ---------------------------------------------------------------- password

/**
 * Kept as a fallback so a missing ADMIN_EMAILS or an unreachable database
 * cannot lock the owner out of the only page that would explain why. Its
 * session is stateless -- derived from the password itself -- for the same
 * reason: it has to work when the database does not.
 */
export async function passwordSessionValue(): Promise<string> {
	return `pw.${await sha256Hex(`svetzamalo-admin-v1:${SHOP.adminPassword}`)}`;
}

export async function verifyPassword(input: string): Promise<boolean> {
	if (!isPasswordLoginAvailable()) return false;
	return timingSafeEqual(input, SHOP.adminPassword);
}

// -------------------------------------------------------------- magic link

/**
 * Issues a single-use login token. Only its hash is stored, so a leaked
 * database row cannot be replayed as a login.
 */
export async function createLoginToken(email: string): Promise<string> {
	const token = randomToken();
	const hash = await sha256Hex(token);
	await db()`
		INSERT INTO shop_admin_tokens (token_hash, email, kind, expires_at)
		VALUES (${hash}, ${email.trim().toLowerCase()}, 'login',
			${expiryIso(LOGIN_TOKEN_TTL_MINUTES * 60_000)})
	`;
	return token;
}

/**
 * Consumes a login token and returns a fresh session token. The login row is
 * deleted in the same statement that reads it, so a link cannot be used twice
 * even if it is opened concurrently.
 */
export async function consumeLoginToken(
	token: string,
): Promise<string | null> {
	if (!isDbConfigured()) return null;

	const hash = await sha256Hex(token);
	const rows = (await db()`
		DELETE FROM shop_admin_tokens
		WHERE token_hash = ${hash} AND kind = 'login' AND expires_at > now()
		RETURNING email
	`) as unknown as { email: string }[];

	const email = rows[0]?.email;
	// Re-checked on redemption: removing an address from the allowlist must
	// invalidate a link that was already sent.
	if (!email || !isAllowedAdminEmail(email)) return null;

	const sessionToken = randomToken();
	await db()`
		INSERT INTO shop_admin_tokens (token_hash, email, kind, expires_at)
		VALUES (${await sha256Hex(sessionToken)}, ${email}, 'session',
			${expiryIso(SESSION_TTL_HOURS * 60 * 60_000)})
	`;

	// Opportunistic cleanup; expired rows are useless and this is the only
	// moment the table is reliably written to.
	await db()`DELETE FROM shop_admin_tokens WHERE expires_at < now()`;

	return sessionToken;
}

export async function isAuthenticated(
	cookieValue: string | undefined,
): Promise<boolean> {
	if (!cookieValue) return false;

	if (cookieValue.startsWith("pw.")) {
		if (!isPasswordLoginAvailable()) return false;
		return timingSafeEqual(cookieValue, await passwordSessionValue());
	}

	if (!isDbConfigured()) return false;
	const rows = (await db()`
		SELECT 1 FROM shop_admin_tokens
		WHERE token_hash = ${await sha256Hex(cookieValue)}
			AND kind = 'session' AND expires_at > now()
		LIMIT 1
	`) as unknown as unknown[];
	return rows.length > 0;
}

export async function revokeSession(cookieValue: string | undefined) {
	if (!cookieValue || cookieValue.startsWith("pw.") || !isDbConfigured()) return;
	await db()`
		DELETE FROM shop_admin_tokens WHERE token_hash = ${await sha256Hex(cookieValue)}
	`;
}
