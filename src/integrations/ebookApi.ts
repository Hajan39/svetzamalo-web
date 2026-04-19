/**
 * T030 [US2/US3] Frontend helper for ebook-related API calls.
 * Used by the /ebook/download page and resend form.
 */

const API_BASE =
	(import.meta.env.VITE_STRAPI_URL as string | undefined)?.replace(/\/$/, "") ??
	"http://localhost:1337";

export interface ResendEbookRequest {
	email: string;
	ebookCode?: string;
}

export interface ResendEbookResponse {
	status: "accepted";
}

/**
 * Request a new ebook delivery email.
 * Always returns { status: 'accepted' } (anti-enumeration — server never reveals if the user exists).
 */
export async function resendEbookEmail(
	body: ResendEbookRequest,
): Promise<ResendEbookResponse> {
	const res = await fetch(`${API_BASE}/api/ebook/resend`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
	if (!res.ok) {
		throw new Error(`Resend request failed with status ${res.status}`);
	}
	return res.json() as Promise<ResendEbookResponse>;
}

export interface DownloadEbookResponse {
	url: string;
	expiresInSeconds: number;
}

/**
 * Exchange a one-time token for a short-lived presigned download URL.
 */
export async function downloadEbook(
	token: string,
): Promise<DownloadEbookResponse> {
	const url = `${API_BASE}/api/ebook/download?token=${encodeURIComponent(token)}`;
	const res = await fetch(url);
	if (res.status === 401) {
		throw new Error("invalid_token");
	}
	if (!res.ok) {
		throw new Error(`Download request failed with status ${res.status}`);
	}
	return res.json() as Promise<DownloadEbookResponse>;
}
