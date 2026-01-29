'use server'

import { Type } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'
import { getSurrealDB } from '@/lib/db/surreal'
import { requireAuth } from '@/lib/server/auth'

const YC_VERIFY_BASE = 'https://www.ycombinator.com/verify/'

// Schema for YC verification JSON response
const YCVerifyResponseSchema = Type.Object({
	name: Type.String(),
	email: Type.String({ format: 'email' }),
	batches: Type.Array(Type.Object({ name: Type.String() })),
	companies: Type.Array(Type.Object({ name: Type.String(), batch: Type.String() })),
})

export interface YCVerification {
	verified: true
	name: string
	email: string
	batch: string
	company: string
}

// Extract code from various URL/input formats - pure function
const extractCode = (input: string): string => {
	const trimmed = input.trim()
	if (trimmed.includes('ycombinator.com/verify/')) {
		return (trimmed.split('ycombinator.com/verify/')[1] ?? '')
			.replace(/\.json$/, '')
			.replace(/\/$/, '')
	}
	return trimmed.replace(/\.json$/, '').replace(/\/$/, '')
}

export async function verifyYcFounder(input: string): Promise<YCVerification> {
	const code = extractCode(input)
	if (!code || code.length < 10) {
		throw new Error('Invalid verification code')
	}

	const response = await fetch(`${YC_VERIFY_BASE}${code}.json`, {
		headers: { Accept: 'application/json' },
		next: { revalidate: 60 },
	})

	if (!response.ok) {
		throw new Error(response.status === 404 ? 'Verification not found' : 'Failed to verify')
	}

	const parsed = Value.Parse(YCVerifyResponseSchema, await response.json())

	return {
		verified: true,
		name: parsed.name,
		email: parsed.email,
		batch: parsed.batches[0]?.name ?? 'Unknown',
		company: parsed.companies[0]?.name ?? 'Unknown',
	}
}

// Apply YC badge to current user after successful auth
export async function applyYcBadge(expectedEmail: string): Promise<boolean> {
	return requireAuth(async (userId) => {
		const db = await getSurrealDB()

		const result = await db.query<[{ email: string }[]]>(
			`SELECT email FROM type::thing('user', $userId)`,
			{ userId },
		)

		const userEmail = result[0]?.[0]?.email
		if (!userEmail) throw new Error('User not found')

		// Security: email must match YC verification
		if (userEmail.toLowerCase() !== expectedEmail.toLowerCase()) {
			throw new Error('Email mismatch')
		}

		await db.query(
			`UPDATE type::thing('user', $userId) SET yc_type = 'alumni', updated_at = time::now()`,
			{ userId },
		)

		return true
	})
}
