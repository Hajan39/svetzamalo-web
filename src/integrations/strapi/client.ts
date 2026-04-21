/**
 * Strapi API Client
 *
 * Centralized client for making requests to Strapi CMS API
 */

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

export interface StrapiError {
	error: {
		status: number;
		name: string;
		message: string;
		details?: unknown;
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

class StrapiClient {
	private baseUrl: string;
	private apiToken?: string;

	constructor() {
		const strapiUrl =
			(typeof import.meta !== "undefined" &&
				import.meta.env?.VITE_STRAPI_URL) ||
			process.env.VITE_STRAPI_URL ||
			"http://localhost:1337";
		this.baseUrl = `${strapiUrl}/api`;
		this.apiToken =
			(typeof import.meta !== "undefined" &&
				import.meta.env?.VITE_STRAPI_API_TOKEN) ||
			process.env.VITE_STRAPI_API_TOKEN;
	}

	/**
	 * Flatten nested object for Strapi qs format: { slug: { $eq: 'x' } } -> filters[slug][$eq]=x
	 */
	private appendFlattened(
		params: URLSearchParams,
		prefix: string,
		obj: Record<string, unknown>,
	): void {
		for (const [key, value] of Object.entries(obj)) {
			const paramKey = `${prefix}[${key}]`;
			if (Array.isArray(value)) {
				// Handle arrays: filters[$or][0][field][$eq]=val
				for (let i = 0; i < value.length; i++) {
					const itemKey = `${paramKey}[${i}]`;
					if (value[i] !== null && typeof value[i] === "object") {
						this.appendFlattened(
							params,
							itemKey,
							value[i] as Record<string, unknown>,
						);
					} else {
						params.append(itemKey, String(value[i]));
					}
				}
			} else if (value !== null && typeof value === "object") {
				this.appendFlattened(
					params,
					paramKey,
					value as Record<string, unknown>,
				);
			} else {
				params.append(paramKey, String(value));
			}
		}
	}

	/**
	 * Build query string from parameters
	 */
	private buildQueryString(params: StrapiQueryParams): string {
		const queryParams = new URLSearchParams();

		// Populate
		if (params.populate) {
			if (typeof params.populate === "string") {
				queryParams.append("populate", params.populate);
			} else if (Array.isArray(params.populate)) {
				for (let i = 0; i < params.populate.length; i++) {
					queryParams.append(`populate[${i}]`, params.populate[i]);
				}
			} else {
				queryParams.append("populate", JSON.stringify(params.populate));
			}
		}

		// Filters - Strapi v5 expects flattened format (filters[slug][$eq]=x), not JSON
		if (params.filters) {
			this.appendFlattened(
				queryParams,
				"filters",
				params.filters as Record<string, unknown>,
			);
		}

		// Sort
		if (params.sort) {
			if (typeof params.sort === "string") {
				queryParams.append("sort", params.sort);
			} else {
				queryParams.append("sort", params.sort.join(","));
			}
		}

		// Pagination
		if (params.pagination) {
			if (params.pagination.page !== undefined) {
				queryParams.append(
					"pagination[page]",
					params.pagination.page.toString(),
				);
			}
			if (params.pagination.pageSize !== undefined) {
				queryParams.append(
					"pagination[pageSize]",
					params.pagination.pageSize.toString(),
				);
			}
			if (params.pagination.start !== undefined) {
				queryParams.append(
					"pagination[start]",
					params.pagination.start.toString(),
				);
			}
			if (params.pagination.limit !== undefined) {
				queryParams.append(
					"pagination[limit]",
					params.pagination.limit.toString(),
				);
			}
		}

		// Fields
		if (params.fields && params.fields.length > 0) {
			queryParams.append("fields", params.fields.join(","));
		}

		// Locale
		if (params.locale) {
			queryParams.append("locale", params.locale);
		}

		// Publication state
		if (params.publicationState) {
			queryParams.append("publicationState", params.publicationState);
		}

		return queryParams.toString();
	}

	/**
	 * Get headers for API requests
	 */
	private getHeaders(): HeadersInit {
		const headers: HeadersInit = {
			"Content-Type": "application/json",
		};

		if (this.apiToken) {
			(headers as Record<string, string>).Authorization =
				`Bearer ${this.apiToken}`;
		}

		return headers;
	}

	/**
	 * Make a GET request to Strapi API
	 */
	async get<T>(
		endpoint: string,
		params?: StrapiQueryParams,
	): Promise<StrapiResponse<T>> {
		const queryString = params ? this.buildQueryString(params) : "";
		const url = `${this.baseUrl}${endpoint}${queryString ? `?${queryString}` : ""}`;

		try {
			const response = await fetch(url, {
				method: "GET",
				headers: this.getHeaders(),
			});

			if (!response.ok) {
				const error: StrapiError = await response.json().catch(() => ({
					error: {
						status: response.status,
						name: "Error",
						message: `HTTP ${response.status}: ${response.statusText}`,
					},
				}));
				throw new Error(error.error.message || `HTTP ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			}
			throw new Error("Failed to fetch data from Strapi");
		}
	}

	/**
	 * Make a POST request to Strapi API
	 */
	async post<T>(endpoint: string, data: unknown): Promise<StrapiResponse<T>> {
		const url = `${this.baseUrl}${endpoint}`;

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: this.getHeaders(),
				body: JSON.stringify({ data }),
			});

			if (!response.ok) {
				const error: StrapiError = await response.json().catch(() => ({
					error: {
						status: response.status,
						name: "Error",
						message: `HTTP ${response.status}: ${response.statusText}`,
					},
				}));
				throw new Error(error.error.message || `HTTP ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			}
			throw new Error("Failed to post data to Strapi");
		}
	}

	/**
	 * Make a PUT request to Strapi API
	 */
	async put<T>(endpoint: string, data: unknown): Promise<StrapiResponse<T>> {
		const url = `${this.baseUrl}${endpoint}`;

		try {
			const response = await fetch(url, {
				method: "PUT",
				headers: this.getHeaders(),
				body: JSON.stringify({ data }),
			});

			if (!response.ok) {
				const error: StrapiError = await response.json().catch(() => ({
					error: {
						status: response.status,
						name: "Error",
						message: `HTTP ${response.status}: ${response.statusText}`,
					},
				}));
				throw new Error(error.error.message || `HTTP ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			}
			throw new Error("Failed to update data in Strapi");
		}
	}

	/**
	 * Make a DELETE request to Strapi API
	 */
	async delete<T>(endpoint: string): Promise<StrapiResponse<T>> {
		const url = `${this.baseUrl}${endpoint}`;

		try {
			const response = await fetch(url, {
				method: "DELETE",
				headers: this.getHeaders(),
			});

			if (!response.ok) {
				const error: StrapiError = await response.json().catch(() => ({
					error: {
						status: response.status,
						name: "Error",
						message: `HTTP ${response.status}: ${response.statusText}`,
					},
				}));
				throw new Error(error.error.message || `HTTP ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			}
			throw new Error("Failed to delete data from Strapi");
		}
	}
}

// Export singleton instance
export const strapiClient = new StrapiClient();
