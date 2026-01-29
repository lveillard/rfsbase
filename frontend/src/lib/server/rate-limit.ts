/**
 * Rate limiting for Server Actions
 * Uses in-memory store with TTL cleanup
 * For production: Use Redis or similar distributed store
 */

interface RateLimitEntry {
	readonly count: number
	readonly resetAt: number
}

// In-memory store (use Redis in production for multi-instance)
const store = new Map<string, RateLimitEntry>()
let cleanupScheduled = false

// Lazy cleanup - only run when needed and on access
function cleanupExpired(): void {
	const now = Date.now()
	for (const [key, entry] of store.entries()) {
		if (entry.resetAt < now) {
			store.delete(key)
		}
	}
}

// Schedule periodic cleanup only once, lazily
function scheduleCleanup(): void {
	if (cleanupScheduled || typeof globalThis === 'undefined') return
	cleanupScheduled = true

	const runCleanup = () => {
		cleanupExpired()
		setTimeout(runCleanup, 5 * 60 * 1000)
	}
	setTimeout(runCleanup, 5 * 60 * 1000)
}

export interface RateLimitConfig {
	readonly maxRequests: number
	readonly windowMs: number
}

export class RateLimitError extends Error {
	readonly retryAfter: number

	constructor(retryAfter: number) {
		super(`Rate limit exceeded. Try again in ${Math.ceil(retryAfter / 1000)}s`)
		this.name = 'RateLimitError'
		this.retryAfter = retryAfter
	}
}

/**
 * Check if request is within rate limit
 * @param identifier - User ID or IP address
 * @param config - Rate limit configuration
 */
export function checkRateLimit(
	identifier: string,
	config: RateLimitConfig,
): { readonly allowed: boolean; readonly remaining: number; readonly resetAt: number } {
	scheduleCleanup()
	const key = `${identifier}:${config.maxRequests}:${config.windowMs}`
	const now = Date.now()
	const existing = store.get(key)

	if (!existing || existing.resetAt < now) {
		// New window
		store.set(key, {
			count: 1,
			resetAt: now + config.windowMs,
		})
		return {
			allowed: true,
			remaining: config.maxRequests - 1,
			resetAt: now + config.windowMs,
		}
	}

	if (existing.count >= config.maxRequests) {
		return {
			allowed: false,
			remaining: 0,
			resetAt: existing.resetAt,
		}
	}

	// Increment count
	store.set(key, {
		count: existing.count + 1,
		resetAt: existing.resetAt,
	})

	return {
		allowed: true,
		remaining: config.maxRequests - existing.count - 1,
		resetAt: existing.resetAt,
	}
}

/**
 * Rate limit presets for common use cases
 */
export const rateLimits = {
	// Strict: For actions that cost money or are sensitive
	strict: { maxRequests: 5, windowMs: 60 * 1000 }, // 5 per minute

	// Standard: For most mutations
	standard: { maxRequests: 30, windowMs: 60 * 1000 }, // 30 per minute

	// Generous: For frequent actions
	generous: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 per minute

	// Voting: Specific to vote actions
	vote: { maxRequests: 60, windowMs: 60 * 1000 }, // 60 votes per minute

	// Comment creation
	comment: { maxRequests: 20, windowMs: 60 * 1000 }, // 20 comments per minute

	// Idea creation (expensive due to embedding)
	idea: { maxRequests: 5, windowMs: 60 * 1000 }, // 5 ideas per minute
} as const

/**
 * Higher-order function to add rate limiting to server actions
 */
export function withRateLimit<T extends (...args: unknown[]) => Promise<unknown>>(
	fn: T,
	config: RateLimitConfig,
	getIdentifier: () => Promise<string> | string,
): T {
	return (async (...args: unknown[]) => {
		const identifier = await getIdentifier()
		const result = checkRateLimit(identifier, config)

		if (!result.allowed) {
			throw new RateLimitError(result.resetAt - Date.now())
		}

		return fn(...args)
	}) as T
}
