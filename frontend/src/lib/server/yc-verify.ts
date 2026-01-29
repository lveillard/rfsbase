'use server'

import { Type } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'
import { getSurrealDB } from '@/lib/db/surreal'
import { requireAuth } from '@/lib/server/auth'

const YC_VERIFY_BASE = 'https://www.ycombinator.com/verify/'

// Schema for YC verification JSON response
const YCVerifyResponseSchema = Type.Object({
	verified: Type.Boolean(),
	name: Type.String(),
	email: Type.String(),
	batches: Type.Array(Type.Object({ name: Type.String() })),
	companies: Type.Array(
		Type.Object({
			name: Type.String(),
			batch: Type.String(),
			url: Type.Optional(Type.String()),
			directory_url: Type.Optional(Type.String()),
			title: Type.Optional(Type.String()),
		}),
	),
	linkedin: Type.Optional(Type.String()),
	message: Type.Optional(Type.String()),
})

export interface YCVerification {
	verified: true
	name: string
	email: string
	batch: string
	company: string
	companyUrl?: string
	linkedin?: string
	title?: string
}

// Parse YC batch to sortable number (e.g., S22 -> 2022.5, W23 -> 2023.0)
const parseBatch = (batch: string): number => {
	const match = batch.match(/^([SW])(\d{2})$/)
	if (!match) return 0
	const year = 2000 + Number.parseInt(match[2]!, 10)
	const season = match[1]! === 'W' ? 0 : 0.5 // Winter is start of year, Summer is mid-year
	return year + season
}

// Get most recent batch from list
const getMostRecentBatch = (batches: Array<{ name: string }>): string => {
	if (batches.length === 0) return 'Unknown'
	if (batches.length === 1) return batches[0]!.name
	return batches.sort((a, b) => parseBatch(b.name) - parseBatch(a.name))[0]!.name
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

	const data = await response.json()
	const parsed = Value.Parse(YCVerifyResponseSchema, data)

	if (!parsed.verified) {
		throw new Error('Verification failed')
	}

	const company = parsed.companies[0]

	// Find most recent batch (user might have multiple YC companies)
	const mostRecentBatch = getMostRecentBatch(parsed.batches)
	// Find company matching most recent batch, or fallback to first
	const mostRecentCompany = parsed.companies.find((c) => c.batch === mostRecentBatch) ?? company

	return {
		verified: true,
		name: parsed.name,
		email: parsed.email,
		batch: mostRecentBatch,
		company: mostRecentCompany?.name ?? 'Unknown',
		companyUrl: mostRecentCompany?.url,
		linkedin: parsed.linkedin,
		title: mostRecentCompany?.title,
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
