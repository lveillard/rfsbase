/**
 * Structured error handling for RFSbase
 */

export type ErrorCode =
	| 'UNAUTHORIZED'
	| 'FORBIDDEN'
	| 'NOT_FOUND'
	| 'VALIDATION_ERROR'
	| 'RATE_LIMITED'
	| 'INTERNAL_ERROR'

interface ErrorMetadata {
	readonly code: ErrorCode
	readonly message: string
	readonly status: number
	readonly isPublic: boolean
}

const errorMetadata: Record<ErrorCode, ErrorMetadata> = {
	UNAUTHORIZED: {
		code: 'UNAUTHORIZED',
		message: 'You must be logged in',
		status: 401,
		isPublic: true,
	},
	FORBIDDEN: {
		code: 'FORBIDDEN',
		message: 'Permission denied',
		status: 403,
		isPublic: true,
	},
	NOT_FOUND: {
		code: 'NOT_FOUND',
		message: 'Resource not found',
		status: 404,
		isPublic: true,
	},
	VALIDATION_ERROR: {
		code: 'VALIDATION_ERROR',
		message: 'Invalid data',
		status: 400,
		isPublic: true,
	},
	RATE_LIMITED: {
		code: 'RATE_LIMITED',
		message: 'Too many requests',
		status: 429,
		isPublic: true,
	},
	INTERNAL_ERROR: {
		code: 'INTERNAL_ERROR',
		message: 'Server error',
		status: 500,
		isPublic: false,
	},
}

export class AppError extends Error {
	readonly code: ErrorCode
	readonly status: number
	readonly isPublic: boolean
	readonly retryAfter?: number

	constructor(code: ErrorCode, options?: { message?: string; retryAfter?: number }) {
		const metadata = errorMetadata[code]
		super(options?.message ?? metadata.message)
		this.code = code
		this.status = metadata.status
		this.isPublic = metadata.isPublic
		this.retryAfter = options?.retryAfter
	}

	toJSON() {
		return {
			code: this.code,
			message: this.isPublic ? this.message : 'An error occurred',
			...(this.retryAfter && { retryAfter: this.retryAfter }),
		}
	}
}

export const Errors = {
	unauthorized: () => new AppError('UNAUTHORIZED'),
	notFound: (resource?: string) =>
		new AppError('NOT_FOUND', { message: resource ? `${resource} not found` : undefined }),
	validation: () => new AppError('VALIDATION_ERROR'),
	rateLimited: (retryAfter: number) => new AppError('RATE_LIMITED', { retryAfter }),
	conflict: (message?: string) => new AppError('VALIDATION_ERROR', { message }),
	internal: (message?: string) => new AppError('INTERNAL_ERROR', { message }),
} as const
