/**
 * Server Action utilities
 */

import { checkRateLimit, type RateLimitConfig, RateLimitError } from '@/lib/server/rate-limit'

/**
 * Check rate limit and throw structured error if exceeded
 */
export function checkRateLimitOrThrow(identifier: string, config: RateLimitConfig): void {
	const result = checkRateLimit(identifier, config)
	if (!result.allowed) {
		throw new RateLimitError(result.resetAt - Date.now())
	}
}
