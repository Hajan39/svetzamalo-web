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
	"http://localhost:1337"
).replace(/\/$/, "");
const STRAPI_API_TOKEN = import.meta.env.STRAPI_API_TOKEN;

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

export async function strapiGet<T>(
	endpoint: string,
	query?: StrapiQueryParams,
): Promise<StrapiResponse<T>> {
	const queryString = buildQueryString(query);
	const url = `${STRAPI_URL}/api${endpoint}${queryString ? `?${queryString}` : ""}`;
	const response = await fetch(url, { headers: headers() });

	if (!response.ok) {
		const message = await response.text().catch(() => response.statusText);
		throw new Error(
			`Strapi GET ${endpoint} failed: ${response.status} ${message}`,
		);
	}

	return response.json() as Promise<StrapiResponse<T>>;
}

export async function strapiPost<T>(
	endpoint: string,
	body: unknown,
): Promise<StrapiResponse<T> | T> {
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
