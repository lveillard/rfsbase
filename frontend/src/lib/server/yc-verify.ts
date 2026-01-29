'use server'

import { Type } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'

const YC_VERIFY_BASE = 'https://www.ycombinator.com/verify/'

// Schema for YC verification JSON response
const YCVerifyResponseSchema = Type.Object({
	name: Type.String(),
	email: Type.String({ format: 'email' }),
	batches: Type.Array(Type.Object({ name: Type.String() })),
	companies: Type.Array(
		Type.Object({
			name: Type.String(),
			batch: Type.String(),
		}),
	),
})

export interface YCVerification {
	verified: true
	name: string
	email: string
	batch: string
	company: string
}

// Extract code from various URL/input formats
const extractCode = (input: string): string => {
	const trimmed = input.trim()

	// Handle full URLs
	if (trimmed.includes('ycombinator.com/verify/')) {
		const parts = trimmed.split('ycombinator.com/verify/')
		return (parts[1] ?? '')
			.replace(/\.json$/, '')
			.replace(/\/$/, '')
			.trim()
	}

	// Handle just the code (with or without .json)
	return trimmed
		.replace(/\.json$/, '')
		.replace(/\/$/, '')
		.trim()
}

import { getSurrealDB } from '@/lib/db/surreal'
import { requireAuth } from '@/lib/server/auth'

export async function verifyYcFounder(input: string): Promise<YCVerification> {
	const code = extractCode(input)

	if (!code || code.length < 10) {
		throw new Error('Invalid verification code')
	}

	const jsonUrl = `${YC_VERIFY_BASE}${code}.json`

	const response = await fetch(jsonUrl, {
		headers: { Accept: 'application/json' },
		next: { revalidate: 60 }, // Cache for 1 minute
	})

	if (!response.ok) {
		if (response.status === 404) {
			throw new Error('Verification not found. Check your code.')
		}
		throw new Error('Failed to verify. Try again.')
	}

	const data = await response.json()

	// Validate response shape
	const parsed = Value.Parse(YCVerifyResponseSchema, data)

	const batch = parsed.batches[0]?.name ?? 'Unknown'
	const company = parsed.companies[0]?.name ?? 'Unknown'

	return {
		verified: true,
		name: parsed.name,
		email: parsed.email,
		batch,
		company,
	}
}

// Apply YC badge to current user (called after successful auth)
export async function applyYcBadge(expectedEmail: string, _batch: string): Promise<boolean> {
	return requireAuth(async (userId) => {
		const db = await getSurrealDB()

		// Get user's email to verify it matches
		const result = await db.query<[{ email: string }[]]>(
			`SELECT email FROM type::thing('user', $userId)`,
			{ userId },
		)

		const user = result[0]?.[0]
		if (!user?.email) {
			throw new Error('User not found')
		}

		// Security: email must match the YC verification
		if (user.email.toLowerCase() !== expectedEmail.toLowerCase()) {
			throw new Error('Email mismatch - YC badge cannot be applied')
		}

		// Apply the badge
		await db.query(
			`UPDATE type::thing('user', $userId) SET yc_type = 'alumni', updated_at = time::now()`,
			{ userId },
		)

		return true
	})
}
