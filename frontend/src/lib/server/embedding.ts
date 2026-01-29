/**
 * Embedding generation with Bedrock (production) and OpenAI (fallback)
 * Auto-detects available provider based on environment
 */

import { openai } from '@ai-sdk/openai'
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import { embed } from 'ai'

// Bedrock client - uses IAM role on EC2, no credentials needed
const bedrock = new BedrockRuntimeClient({
	region: process.env.AWS_REGION || 'us-east-1',
	// In EC2 with IAM role, this will automatically use the instance credentials
})

interface EmbeddingConfig {
	readonly provider: 'bedrock' | 'openai'
	readonly model: string
	readonly dimensions: number
}

// Model configurations
const BEDROCK_MODELS = {
	titan: {
		id: 'amazon.titan-embed-text-v2:0',
		dimensions: 1024,
		batch: true, // 50% cheaper
	},
	cohere: {
		id: 'cohere.embed-english-v3',
		dimensions: 1024,
		batch: false,
	},
	nova: {
		id: 'amazon.nova-embed-multimodal-v1:0',
		dimensions: 1024, // configurable: 256, 384, 1024, 3072
		batch: true,
	},
} as const

const OPENAI_MODELS = {
	small: {
		id: 'text-embedding-3-small',
		dimensions: 1536,
	},
	large: {
		id: 'text-embedding-3-large',
		dimensions: 3072,
	},
} as const

/**
 * Detect which provider to use based on environment
 */
function detectProvider(): EmbeddingConfig {
	// Priority: Bedrock if explicitly enabled or on EC2
	if (process.env.AWS_BEDROCK_ENABLED === 'true') {
		return {
			provider: 'bedrock',
			model: process.env.BEDROCK_MODEL || BEDROCK_MODELS.titan.id,
			dimensions: Number(process.env.EMBEDDING_DIMENSIONS) || 1024,
		}
	}

	// Fallback to OpenAI
	if (process.env.OPENAI_API_KEY) {
		return {
			provider: 'openai',
			model: process.env.OPENAI_MODEL || OPENAI_MODELS.small.id,
			dimensions: Number(process.env.EMBEDDING_DIMENSIONS) || 1536,
		}
	}

	// Default: Bedrock (will fail gracefully if not configured)
	return {
		provider: 'bedrock',
		model: BEDROCK_MODELS.titan.id,
		dimensions: 1024,
	}
}

/**
 * Generate embedding using Bedrock
 */
async function generateBedrockEmbedding(text: string, modelId: string): Promise<number[]> {
	// Prepare request body based on model type
	const body = modelId.includes('cohere')
		? JSON.stringify({ texts: [text], input_type: 'search_document' })
		: modelId.includes('nova')
			? JSON.stringify({
					inputText: text,
					dimensions: 1024, // Can be 256, 384, 1024, or 3072
				})
			: JSON.stringify({ inputText: text }) // Titan

	const command = new InvokeModelCommand({
		modelId,
		body,
		contentType: 'application/json',
		accept: 'application/json',
	})

	const response = await bedrock.send(command)
	const result = JSON.parse(new TextDecoder().decode(response.body))

	// Extract embedding based on model response format
	if (modelId.includes('cohere')) {
		return result.embeddings[0]
	}
	// Titan and Nova have same response format
	return result.embedding
}

/**
 * Generate embedding using OpenAI
 */
async function generateOpenAIEmbedding(text: string, modelId: string): Promise<number[]> {
	const { embedding } = await embed({
		model: openai.embedding(modelId as 'text-embedding-3-small' | 'text-embedding-3-large'),
		value: text,
	})
	return embedding
}

/**
 * Main embedding function - auto-detects provider
 */
export async function generateEmbedding(text: string): Promise<number[]> {
	if (!text || text.trim().length === 0) {
		throw new Error('Cannot generate embedding for empty text')
	}

	const config = detectProvider()

	try {
		if (config.provider === 'bedrock') {
			return await generateBedrockEmbedding(text, config.model)
		}
		return await generateOpenAIEmbedding(text, config.model)
	} catch (error) {
		// If Bedrock fails (e.g., no permissions), try OpenAI fallback
		if (config.provider === 'bedrock' && process.env.OPENAI_API_KEY) {
			console.warn('Bedrock failed, falling back to OpenAI:', error)
			return generateOpenAIEmbedding(text, OPENAI_MODELS.small.id)
		}
		throw error
	}
}

/**
 * Generate embeddings in batch (more efficient)
 * Note: Bedrock batch has 50% discount but is async
 * This uses parallel processing for real-time batch
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
	const config = detectProvider()

	// Filter empty texts
	const validTexts = texts.filter((t) => t.trim().length > 0)

	if (config.provider === 'bedrock' && config.model.includes('cohere')) {
		// Cohere supports multiple texts in one request
		const body = JSON.stringify({
			texts: validTexts,
			input_type: 'search_document',
		})

		const command = new InvokeModelCommand({
			modelId: config.model,
			body,
			contentType: 'application/json',
			accept: 'application/json',
		})

		const response = await bedrock.send(command)
		const result = JSON.parse(new TextDecoder().decode(response.body))
		return result.embeddings
	}

	// For other models, parallel individual requests
	const embeddings = await Promise.all(validTexts.map((text) => generateEmbedding(text)))
	return embeddings
}

/**
 * Health check for embedding service
 */
export async function checkEmbeddingHealth(): Promise<{
	status: 'healthy' | 'unhealthy'
	provider: string
	error?: string
}> {
	try {
		const config = detectProvider()
		await generateEmbedding('health check')
		return {
			status: 'healthy',
			provider: config.provider,
		}
	} catch (error) {
		return {
			status: 'unhealthy',
			provider: 'unknown',
			error: error instanceof Error ? error.message : 'Unknown error',
		}
	}
}

// Export configuration for monitoring
export { detectProvider, BEDROCK_MODELS, OPENAI_MODELS }
