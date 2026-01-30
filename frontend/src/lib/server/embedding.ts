/**
 * Embedding generation using AWS Bedrock (Cohere v4)
 * Uses cross-region inference profile for automatic load balancing
 * Uses IAM role on EC2 - no credentials needed
 */

import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock'
import { fromInstanceMetadata } from '@smithy/credential-provider-imds'
import { embed } from 'ai'

// Model configurable via env, default to Cohere v4 via cross-region inference profile
const BEDROCK_MODEL = process.env.BEDROCK_EMBEDDING_MODEL || 'us.cohere.embed-v4:0'

// Create bedrock provider with EC2 instance credentials
const bedrock = createAmazonBedrock({
	region: process.env.AWS_REGION || 'us-east-1',
	// Use EC2 instance metadata credentials when available
	credentialProvider: process.env.AWS_ACCESS_KEY_ID
		? undefined // Use env vars if provided
		: fromInstanceMetadata({ maxRetries: 3, timeout: 1000 }),
})

// Cohere v4 with 1024 dimensions
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

	// Note: inputType parameter for Cohere is passed but may not be supported by all SDK versions
	const { embedding } = await embed({
		model: bedrock.textEmbeddingModel(BEDROCK_MODEL),
		value: text,
	})
	return embedding
}

// Same embedding for documents and queries (Cohere v4 handles this internally)
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
