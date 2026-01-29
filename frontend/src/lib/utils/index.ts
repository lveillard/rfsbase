export { cn } from './cn'

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

export const formatRelativeTime = (date: Date | string, now: Date = new Date()): string => {
	const diff = now.getTime() - new Date(date).getTime()
	if (diff < 60 * 1000) return 'just now'
	const unit = TIME_UNITS.find(({ divisor }) => diff >= divisor)
	if (!unit) return 'just now'
	const value = Math.floor(diff / unit.divisor)
	return `${value}${unit.suffix} ago`
}

export const formatDate = (date: Date | string): string =>
	new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

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

export const formatNumber = (num: number): string => {
	const format = NUMBER_FORMATS.find(({ threshold }) => num >= threshold)
	if (!format) return num.toString()
	const value = (num / format.divisor).toFixed(1).replace(/\.0$/, '')
	return `${value}${format.suffix}`
}

// ============================================================================
// String Utilities
// ============================================================================

export const truncate = (text: string, maxLength: number): string =>
	text.length <= maxLength ? text : `${text.slice(0, maxLength).trim()}...`

export const capitalize = (text: string): string =>
	text.length === 0 ? text : text.charAt(0).toUpperCase() + text.slice(1)

export const getInitials = (name: string): string =>
	name
		.split(' ')
		.filter(Boolean)
		.map((part) => part[0])
		.join('')
		.toUpperCase()
		.slice(0, 2)

// ============================================================================
// SurrealDB ID Utilities
// ============================================================================

// Parse and extract record ID from SurrealDB format (table:id -> id)
export const parseId = (id: unknown): string => {
	const str = String(id)
	const colonIndex = str.indexOf(':')
	return colonIndex === -1 ? str : str.slice(colonIndex + 1)
}

// ============================================================================
// Category Utilities
// ============================================================================

import categoriesConfig from '@config/categories.config.json'

export type Category = (typeof categoriesConfig.categories)[number]

const categoryMap = new Map<string, Category>(categoriesConfig.categories.map((c) => [c.id, c]))

export const getCategoryById = (id: string): Category | undefined => categoryMap.get(id)
