/**
 * Embedding generation using AWS Bedrock (Titan v2)
 * Uses IAM role on EC2 via instance metadata
 */

import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock'
import { fromInstanceMetadata } from '@smithy/credential-provider-imds'
import { embed } from 'ai'

// Model configurable via env, default to Titan v2
const BEDROCK_MODEL = process.env.BEDROCK_EMBEDDING_MODEL || 'amazon.titan-embed-text-v2:0'
const AWS_REGION = process.env.AWS_REGION || 'us-east-1'

// Credential provider for EC2 instance roles
const credentialsProvider = fromInstanceMetadata({
	maxRetries: 3,
	timeout: 1000,
})

// Cache for credentials and bedrock instance
let cachedCredentials: {
	accessKeyId: string
	secretAccessKey: string
	sessionToken?: string
	expiration?: Date
} | null = null

let bedrockInstance: ReturnType<typeof createAmazonBedrock> | null = null

/**
 * Get or refresh AWS credentials from instance metadata
 */
async function getCredentials() {
	// Check if cached credentials are still valid (with 5 min buffer)
	if (cachedCredentials?.expiration) {
		const expirationBuffer = 5 * 60 * 1000 // 5 minutes
		if (new Date().getTime() < cachedCredentials.expiration.getTime() - expirationBuffer) {
			return cachedCredentials
		}
	}

	const creds = await credentialsProvider()

	cachedCredentials = {
		accessKeyId: creds.accessKeyId,
		secretAccessKey: creds.secretAccessKey,
		sessionToken: creds.sessionToken,
		expiration: creds.expiration,
	}

	// Reset bedrock instance when credentials change
	bedrockInstance = null

	return cachedCredentials
}

/**
 * Get or create bedrock provider with current credentials
 */
async function getBedrock() {
	const creds = await getCredentials()

	if (!bedrockInstance) {
		bedrockInstance = createAmazonBedrock({
			region: AWS_REGION,
			accessKeyId: creds.accessKeyId,
			secretAccessKey: creds.secretAccessKey,
			sessionToken: creds.sessionToken,
		})
	}

	return bedrockInstance
}

// Titan v2 with 1024 dimensions
export const EMBEDDING_DIMENSIONS = 1024

/**
 * Check if embedding is available
 */
export function isEmbeddingAvailable(): boolean {
	return process.env.AWS_BEDROCK_ENABLED === 'true'
}

/**
 * Generate embedding for text using Bedrock
 * Returns null if Bedrock not enabled
 */
export async function generateEmbedding(text: string): Promise<number[] | null> {
	if (!text || text.trim().length === 0) {
		return null
	}

	if (process.env.AWS_BEDROCK_ENABLED !== 'true') {
		console.warn('[embedding] Skipped - AWS_BEDROCK_ENABLED not set')
		return null
	}

	try {
		const bedrock = await getBedrock()
		const result = await embed({
			model: bedrock.textEmbeddingModel(BEDROCK_MODEL),
			value: text,
		})
		return result.embedding
	} catch (error) {
		console.error('[embedding] Error:', error)
		throw error
	}
}

// Same embedding for documents and queries (Titan handles this internally)
export const generateQueryEmbedding = generateEmbedding

/**
 * Generate embeddings in batch
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
	const validTexts = texts.filter((t) => t.trim().length > 0)
	const results = await Promise.all(validTexts.map((t) => generateEmbedding(t)))
	return results.filter((r): r is number[] => r !== null)
}

/**
 * Health check for embedding service
 */
export async function checkEmbeddingHealth(): Promise<{
	status: 'healthy' | 'unhealthy' | 'disabled'
	provider: string
	model?: string
	error?: string
}> {
	if (process.env.AWS_BEDROCK_ENABLED !== 'true') {
		return { status: 'disabled', provider: 'none' }
	}

	try {
		const result = await generateEmbedding('health check')
		return result
			? { status: 'healthy', provider: 'bedrock', model: BEDROCK_MODEL }
			: { status: 'unhealthy', provider: 'bedrock', model: BEDROCK_MODEL }
	} catch (error) {
		return {
			status: 'unhealthy',
			provider: 'bedrock',
			model: BEDROCK_MODEL,
			error: error instanceof Error ? error.message : 'Unknown error',
		}
	}
}
