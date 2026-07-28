export interface StrapiResponse<T> {
	data: T;
	meta?: {
		pagination?: {
			page: number;
			pageSize: number;
			pageCount: number;
			total: number;
		};
	};
}

export interface StrapiQueryParams {
	populate?: string | string[] | Record<string, unknown>;
	filters?: Record<string, unknown>;
	sort?: string | string[];
	pagination?: {
		page?: number;
		pageSize?: number;
		start?: number;
		limit?: number;
	};
	fields?: string[];
	locale?: string;
	publicationState?: "live" | "preview";
}

const STRAPI_URL = (
	import.meta.env.STRAPI_URL ||
	import.meta.env.PUBLIC_STRAPI_URL ||
	""
).replace(/\/$/, "");
const STRAPI_API_TOKEN = import.meta.env.STRAPI_API_TOKEN;
const STRAPI_GET_CACHE_TTL_SECONDS = Number.parseInt(
	import.meta.env.STRAPI_GET_CACHE_TTL_SECONDS || "21600",
	10,
);
const STRAPI_GET_CACHE_MAX_ENTRIES = Number.parseInt(
	import.meta.env.STRAPI_GET_CACHE_MAX_ENTRIES || "100",
	10,
);
// How long a failed GET is remembered. Without this every page render retries a
// broken/suspended Strapi, which burns request quota and stalls the response.
const STRAPI_GET_ERROR_CACHE_TTL_SECONDS = Number.parseInt(
	import.meta.env.STRAPI_GET_ERROR_CACHE_TTL_SECONDS || "120",
	10,
);
const STRAPI_TIMEOUT_MS = Number.parseInt(
	import.meta.env.STRAPI_TIMEOUT_MS || "5000",
	10,
);

const getCache = new Map<
	string,
	{
		expiresAt: number;
		value: StrapiResponse<unknown>;
	}
>();

const errorCache = new Map<string, { expiresAt: number; message: string }>();

// Requests in flight, keyed by URL. Concurrent renders asking for the same
// resource share a single upstream fetch instead of issuing one each.
const inFlight = new Map<string, Promise<StrapiResponse<unknown>>>();

if (!STRAPI_URL) {
	console.error(
		"[strapi] STRAPI_URL is not set -- all Strapi requests will be skipped. Set it in Vercel environment variables.",
	);
}
if (import.meta.env.PROD && !STRAPI_API_TOKEN) {
	console.warn(
		"[strapi] STRAPI_API_TOKEN is not set -- write endpoints (orders, leads) are unauthenticated.",
	);
}

function appendFlattened(
	params: URLSearchParams,
	prefix: string,
	value: Record<string, unknown>,
): void {
	for (const [key, nestedValue] of Object.entries(value)) {
		const paramKey = `${prefix}[${key}]`;

		if (Array.isArray(nestedValue)) {
			nestedValue.forEach((item, index) => {
				const itemKey = `${paramKey}[${index}]`;
				if (item !== null && typeof item === "object") {
					appendFlattened(params, itemKey, item as Record<string, unknown>);
				} else if (item !== undefined) {
					params.append(itemKey, String(item));
				}
			});
			continue;
		}

		if (nestedValue !== null && typeof nestedValue === "object") {
			appendFlattened(params, paramKey, nestedValue as Record<string, unknown>);
			continue;
		}

		if (nestedValue !== undefined) {
			params.append(paramKey, String(nestedValue));
		}
	}
}

function buildQueryString(query?: StrapiQueryParams): string {
	if (!query) return "";
	const params = new URLSearchParams();

	if (query.populate) {
		if (typeof query.populate === "string") {
			params.append("populate", query.populate);
		} else if (Array.isArray(query.populate)) {
			for (const [index, item] of query.populate.entries()) {
				params.append(`populate[${index}]`, item);
			}
		} else {
			appendFlattened(params, "populate", query.populate);
		}
	}

	if (query.filters) appendFlattened(params, "filters", query.filters);

	if (query.sort) {
		if (Array.isArray(query.sort)) params.append("sort", query.sort.join(","));
		else params.append("sort", query.sort);
	}

	if (query.pagination) {
		for (const [key, value] of Object.entries(query.pagination)) {
			if (value !== undefined)
				params.append(`pagination[${key}]`, String(value));
		}
	}

	if (query.fields?.length) params.append("fields", query.fields.join(","));
	if (query.locale) params.append("locale", query.locale);
	if (query.publicationState)
		params.append("publicationState", query.publicationState);

	return params.toString();
}

function headers(): HeadersInit {
	const requestHeaders: HeadersInit = { "Content-Type": "application/json" };
	if (STRAPI_API_TOKEN) {
		requestHeaders.Authorization = `Bearer ${STRAPI_API_TOKEN}`;
	}
	return requestHeaders;
}

function getCachedResponse<T>(url: string): StrapiResponse<T> | null {
	if (STRAPI_GET_CACHE_TTL_SECONDS <= 0) return null;

	const cached = getCache.get(url);
	if (!cached) return null;

	if (cached.expiresAt <= Date.now()) {
		getCache.delete(url);
		return null;
	}

	return cached.value as StrapiResponse<T>;
}

function setCachedResponse<T>(url: string, value: StrapiResponse<T>) {
	if (STRAPI_GET_CACHE_TTL_SECONDS <= 0) return;

	if (getCache.size >= STRAPI_GET_CACHE_MAX_ENTRIES) {
		const oldestKey = getCache.keys().next().value;
		if (oldestKey) getCache.delete(oldestKey);
	}

	getCache.set(url, {
		expiresAt: Date.now() + STRAPI_GET_CACHE_TTL_SECONDS * 1000,
		value: value as StrapiResponse<unknown>,
	});
}

function getCachedError(url: string): string | null {
	if (STRAPI_GET_ERROR_CACHE_TTL_SECONDS <= 0) return null;

	const cached = errorCache.get(url);
	if (!cached) return null;

	if (cached.expiresAt <= Date.now()) {
		errorCache.delete(url);
		return null;
	}

	return cached.message;
}

function setCachedError(url: string, message: string) {
	if (STRAPI_GET_ERROR_CACHE_TTL_SECONDS <= 0) return;

	if (errorCache.size >= STRAPI_GET_CACHE_MAX_ENTRIES) {
		const oldestKey = errorCache.keys().next().value;
		if (oldestKey) errorCache.delete(oldestKey);
	}

	errorCache.set(url, {
		expiresAt: Date.now() + STRAPI_GET_ERROR_CACHE_TTL_SECONDS * 1000,
		message,
	});
}

export async function strapiGet<T>(
	endpoint: string,
	query?: StrapiQueryParams,
): Promise<StrapiResponse<T>> {
	if (!STRAPI_URL)
		throw new Error(`Strapi GET ${endpoint} skipped: STRAPI_URL not set`);
	const queryString = buildQueryString(query);
	const url = `${STRAPI_URL}/api${endpoint}${queryString ? `?${queryString}` : ""}`;

	const cached = getCachedResponse<T>(url);
	if (cached) return cached;

	const cachedError = getCachedError(url);
	if (cachedError)
		throw new Error(`Strapi GET ${endpoint} failed (cached): ${cachedError}`);

	const pending = inFlight.get(url);
	if (pending) return pending as Promise<StrapiResponse<T>>;

	const request = (async () => {
		try {
			const response = await fetch(url, {
				headers: headers(),
				signal: AbortSignal.timeout(STRAPI_TIMEOUT_MS),
			});

			if (!response.ok) {
				const message = await response.text().catch(() => response.statusText);
				throw new Error(`${response.status} ${message}`);
			}

			const payload = (await response.json()) as StrapiResponse<T>;
			setCachedResponse(url, payload);
			return payload as StrapiResponse<unknown>;
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			setCachedError(url, message);
			throw new Error(`Strapi GET ${endpoint} failed: ${message}`);
		} finally {
			inFlight.delete(url);
		}
	})();

	inFlight.set(url, request);
	return request as Promise<StrapiResponse<T>>;
}

export async function strapiPost<T>(
	endpoint: string,
	body: unknown,
): Promise<StrapiResponse<T> | T> {
	if (!STRAPI_URL)
		throw new Error(`Strapi POST ${endpoint} skipped: STRAPI_URL not set`);
	const response = await fetch(`${STRAPI_URL}/api${endpoint}`, {
		method: "POST",
		headers: headers(),
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		const message = await response.text().catch(() => response.statusText);
		throw new Error(
			`Strapi POST ${endpoint} failed: ${response.status} ${message}`,
		);
	}

	return response.json() as Promise<StrapiResponse<T> | T>;
}
