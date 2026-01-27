const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// HTTP method literals for type safety
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface ApiError {
	readonly code: string
	readonly message: string
	readonly details?: unknown
}

export interface PaginationInfo {
	readonly page: number
	readonly pageSize: number
	readonly total: number
	readonly totalPages: number
	readonly hasNext: boolean
	readonly hasPrev: boolean
}

// Discriminated union for type-safe response handling
export type ApiResponse<T> =
	| {
			readonly success: true
			readonly data: T
			readonly pagination?: PaginationInfo
	  }
	| { readonly success: false; readonly error: ApiError }

export type QueryParams = Record<string, string | number | boolean | undefined>

export interface RequestOptions extends Omit<RequestInit, 'method' | 'body'> {
	readonly params?: QueryParams
}

// Pure function to build URL with query params
const buildUrl = (baseUrl: string, path: string, params?: QueryParams): string => {
	const url = new URL(`${baseUrl}${path}`)

	if (params) {
		Object.entries(params)
			.filter((entry): entry is [string, string | number | boolean] => entry[1] !== undefined)
			.forEach(([key, value]) => {
				url.searchParams.set(key, String(value))
			})
	}

	return url.toString()
}

// Pure function to build headers
const buildHeaders = (
	token: string | null,
	customHeaders?: HeadersInit,
): Record<string, string> => {
	const baseHeaders: Record<string, string> = {
		'Content-Type': 'application/json',
		Accept: 'application/json',
		...(customHeaders as Record<string, string> | undefined),
	}

	return token ? { ...baseHeaders, Authorization: `Bearer ${token}` } : baseHeaders
}

// Pure function to create error response
const createErrorResponse = <T>(code: string, message: string): ApiResponse<T> => ({
	success: false,
	error: { code, message },
})

class ApiClient {
	private readonly baseUrl: string
	private token: string | null = null

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl
	}

	setToken(token: string | null): void {
		this.token = token
	}

	getToken(): string | null {
		return this.token
	}

	private async request<T>(
		method: HttpMethod,
		path: string,
		body?: unknown,
		options: RequestOptions = {},
	): Promise<ApiResponse<T>> {
		const { params, headers: customHeaders, ...restOptions } = options
		const url = buildUrl(this.baseUrl, path, params)
		const headers = buildHeaders(this.token, customHeaders)

		try {
			const response = await fetch(url, {
				method,
				headers,
				body: body !== undefined ? JSON.stringify(body) : undefined,
				...restOptions,
			})

			const data = await response.json()

			if (!response.ok) {
				return createErrorResponse(
					data.error?.code ?? 'HTTP_ERROR',
					data.error?.message ?? `Request failed with status ${response.status}`,
				)
			}

			return data as ApiResponse<T>
		} catch (error) {
			return createErrorResponse(
				'NETWORK_ERROR',
				error instanceof Error ? error.message : 'Network request failed',
			)
		}
	}

	get<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
		return this.request<T>('GET', path, undefined, options)
	}

	post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
		return this.request<T>('POST', path, body, options)
	}

	put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
		return this.request<T>('PUT', path, body, options)
	}

	patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
		return this.request<T>('PATCH', path, body, options)
	}

	delete<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
		return this.request<T>('DELETE', path, undefined, options)
	}
}

export const api = new ApiClient(API_BASE_URL)

export const createApiClient = (baseUrl: string): ApiClient => new ApiClient(baseUrl)
