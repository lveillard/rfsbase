export { cn } from './cn'

// ============================================================================
// Functional Composition Utilities
// ============================================================================

type UnaryFn<A, B> = (a: A) => B

/**
 * Left-to-right function composition (pipe)
 * pipe(f, g, h)(x) === h(g(f(x)))
 */
export function pipe<A, B>(ab: UnaryFn<A, B>): UnaryFn<A, B>
export function pipe<A, B, C>(ab: UnaryFn<A, B>, bc: UnaryFn<B, C>): UnaryFn<A, C>
export function pipe<A, B, C, D>(
	ab: UnaryFn<A, B>,
	bc: UnaryFn<B, C>,
	cd: UnaryFn<C, D>,
): UnaryFn<A, D>
export function pipe<A, B, C, D, E>(
	ab: UnaryFn<A, B>,
	bc: UnaryFn<B, C>,
	cd: UnaryFn<C, D>,
	de: UnaryFn<D, E>,
): UnaryFn<A, E>
export function pipe(...fns: UnaryFn<unknown, unknown>[]): UnaryFn<unknown, unknown> {
	return (x) => fns.reduce((acc, fn) => fn(acc), x)
}

/**
 * Identity function - returns input unchanged
 */
export const identity = <T>(x: T): T => x

// ============================================================================
// Immutable Object Utilities
// ============================================================================

/**
 * Immutably update a property in an object
 */
export const setProp = <T extends object, K extends keyof T>(obj: T, key: K, value: T[K]): T => ({
	...obj,
	[key]: value,
})

/**
 * Immutably remove a property from an object
 */
export const omitProp = <T extends object, K extends keyof T>(obj: T, key: K): Omit<T, K> => {
	const { [key]: _, ...rest } = obj
	return rest as Omit<T, K>
}

/**
 * Pick specific keys from an object (immutable)
 */
export const pickProps = <T extends object, K extends keyof T>(
	obj: T,
	keys: readonly K[],
): Pick<T, K> =>
	keys.reduce((acc, key) => (key in obj ? { ...acc, [key]: obj[key] } : acc), {} as Pick<T, K>)

// ============================================================================
// Date Formatting
// ============================================================================

type TimeUnit = { readonly divisor: number; readonly suffix: string }

const TIME_UNITS: readonly TimeUnit[] = [
	{ divisor: 365 * 24 * 60 * 60 * 1000, suffix: 'y' },
	{ divisor: 30 * 24 * 60 * 60 * 1000, suffix: 'mo' },
	{ divisor: 24 * 60 * 60 * 1000, suffix: 'd' },
	{ divisor: 60 * 60 * 1000, suffix: 'h' },
	{ divisor: 60 * 1000, suffix: 'm' },
] as const

/**
 * Format a date relative to now (pure function)
 */
export const formatRelativeTime = (date: Date | string, now: Date = new Date()): string => {
	const diff = now.getTime() - new Date(date).getTime()

	if (diff < 60 * 1000) return 'just now'

	const unit = TIME_UNITS.find(({ divisor }) => diff >= divisor)
	if (!unit) return 'just now'

	const value = Math.floor(diff / unit.divisor)
	return `${value}${unit.suffix} ago`
}

/**
 * Format a date in a human-readable format (e.g., "January 2025")
 */
export const formatDate = (date: Date | string): string => {
	const d = new Date(date)
	return d.toLocaleDateString('en-US', {
		month: 'long',
		year: 'numeric',
	})
}

// ============================================================================
// Number Formatting
// ============================================================================

type NumberFormat = {
	readonly threshold: number
	readonly divisor: number
	readonly suffix: string
}

const NUMBER_FORMATS: readonly NumberFormat[] = [
	{ threshold: 1_000_000, divisor: 1_000_000, suffix: 'M' },
	{ threshold: 1_000, divisor: 1_000, suffix: 'k' },
] as const

/**
 * Format a number with abbreviation (pure function)
 */
export const formatNumber = (num: number): string => {
	const format = NUMBER_FORMATS.find(({ threshold }) => num >= threshold)
	if (!format) return num.toString()

	const value = (num / format.divisor).toFixed(1).replace(/\.0$/, '')
	return `${value}${format.suffix}`
}

// ============================================================================
// String Utilities
// ============================================================================

/**
 * Truncate text to maximum length with ellipsis
 */
export const truncate = (text: string, maxLength: number): string =>
	text.length <= maxLength ? text : `${text.slice(0, maxLength).trim()}...`

/**
 * Capitalize first letter
 */
export const capitalize = (text: string): string =>
	text.length === 0 ? text : text.charAt(0).toUpperCase() + text.slice(1)

/**
 * Generate initials from a name (max 2 characters)
 */
export const getInitials = (name: string): string =>
	name
		.split(' ')
		.filter(Boolean)
		.map((part) => part[0])
		.join('')
		.toUpperCase()
		.slice(0, 2)

// ============================================================================
// Async Utilities
// ============================================================================

/**
 * Debounce a function (returns cleanup function for cancellation)
 */
export const debounce = <T extends readonly unknown[], R>(
	fn: (...args: T) => R,
	delay: number,
): { readonly call: (...args: T) => void; readonly cancel: () => void } => {
	let timeoutId: ReturnType<typeof setTimeout> | null = null

	return {
		call: (...args: T) => {
			if (timeoutId !== null) clearTimeout(timeoutId)
			timeoutId = setTimeout(() => fn(...args), delay)
		},
		cancel: () => {
			if (timeoutId !== null) {
				clearTimeout(timeoutId)
				timeoutId = null
			}
		},
	}
}

/**
 * Sleep for specified milliseconds
 */
export const sleep = (ms: number): Promise<void> =>
	new Promise((resolve) => setTimeout(resolve, ms))

// ============================================================================
// Environment Detection
// ============================================================================

export const isServer: boolean = typeof window === 'undefined'
export const isClient: boolean = !isServer

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if value is non-null and non-undefined
 */
export const isDefined = <T>(value: T | null | undefined): value is T =>
	value !== null && value !== undefined

/**
 * Check if value is a non-empty string
 */
export const isNonEmptyString = (value: unknown): value is string =>
	typeof value === 'string' && value.length > 0

/**
 * Check if value is a non-empty array
 */
export const isNonEmptyArray = <T>(
	value: readonly T[] | null | undefined,
): value is readonly T[] & { 0: T } => Array.isArray(value) && value.length > 0

// ============================================================================
// OAuth Utilities
// ============================================================================

export type OAuthProvider = 'google' | 'github'

/**
 * Build OAuth redirect URL for a provider
 */
export const buildOAuthUrl = (provider: OAuthProvider): string => {
	if (isServer) return ''
	const callbackUrl = encodeURIComponent(`${window.location.origin}/auth/callback/${provider}`)
	return `/api/auth/${provider}?callbackUrl=${callbackUrl}`
}

// ============================================================================
// Category Utilities
// ============================================================================

import categoriesConfig from '@config/categories.config.json'

export type Category = (typeof categoriesConfig.categories)[number]

/**
 * Find category by ID (memoized lookup map)
 */
const categoryMap = new Map<string, Category>(categoriesConfig.categories.map((c) => [c.id, c]))

export const getCategoryById = (id: string): Category | undefined => categoryMap.get(id)
