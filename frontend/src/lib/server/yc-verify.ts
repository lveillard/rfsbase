'use server'

import type { Static } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'

const YC_VERIFY_PREFIX = 'https://www.ycombinator.com/verify/'
const YC_BATCHES = ['W24', 'S23', 'W23', 'S22', 'W22', 'S21'] as const

// TypeBox schema for validation
const YCVerifySchema = Type.Object({
	url: Type.String({ format: 'uri' }),
})

const YCVerificationResultSchema = Type.Object({
	verified: Type.Literal(true),
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

export type YCVerification = Static<typeof YCVerificationResultSchema>

// Pure functions
const extractCode = (url: string): string =>
	url
		.replace(YC_VERIFY_PREFIX, '')
		.replace(/\/$/, '')
		.replace(/\.json$/, '')

const generateBatch = (code: string): string => {
	const hash = code.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
	return YC_BATCHES[hash % YC_BATCHES.length]!
}

export async function verifyYcUrl(url: string): Promise<YCVerification> {
	// Validate URL format
	const parsed = Value.Parse(YCVerifySchema, { url })

	if (!parsed.url.startsWith(YC_VERIFY_PREFIX)) {
		throw new Error('Invalid YC verification URL')
	}

	const code = extractCode(parsed.url)
	if (!code) throw new Error('Invalid verification code')

	// TODO: In production, call actual YC API
	const batch = generateBatch(code)
	const codePrefix = code.slice(0, 8) || 'unknown'

	return Value.Parse(YCVerificationResultSchema, {
		verified: true,
		name: `Founder ${codePrefix}`,
		email: `founder@${codePrefix}.com`,
		batches: [{ name: batch }],
		companies: [{ name: 'Stealth Startup', batch }],
	})
}

export async function linkYcAccount(userId: string, verificationUrl: string): Promise<void> {
	await verifyYcUrl(verificationUrl)
	// TODO: Update user record
	console.log('Linked YC verification for user', userId)
}
