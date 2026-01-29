// Re-export from utils for server-side usage

export { getSurrealDB } from '@/lib/db/surreal'
export { parseId } from '@/lib/utils'

// Type-safe query helpers for SurrealDB results
export type SurrealRecord = Record<string, unknown>
export type SurrealResult<T = SurrealRecord> = T[][]

// Extract first result row safely
export const first = <T>(result: unknown): T | undefined =>
	((result as unknown[])?.[0] as unknown[] | undefined)?.[0] as T | undefined

// Extract all rows from first query
export const all = <T>(result: unknown): T[] =>
	(((result as unknown[])?.[0] as unknown[] | undefined) ?? []) as T[]

// Common field parsers for mapping
export const parsers = {
	string: (v: unknown) => String(v ?? ''),
	number: (v: unknown) => Number(v ?? 0),
	bool: (v: unknown) => Boolean(v),
	optionalString: (v: unknown) => (v ? String(v) : undefined),
	array: <T>(v: unknown, defaultValue: T[] = []): T[] => (v as T[] | undefined) ?? defaultValue,
}
