/**
 * Embedding generation using Fastembed API
 * Self-hosted on surrealdb-others EC2 with bge-large-en-v1.5 model
 */

const EMBED_URL = process.env.EMBED_URL
const EMBED_API_KEY = process.env.EMBED_API_KEY

// bge-large-en-v1.5 uses 1024 dimensions (same as Titan)
export const EMBEDDING_DIMENSIONS = 1024

/**
 * Check if embedding is available
 */
export function isEmbeddingAvailable(): boolean {
	return !!EMBED_URL
}

/**
 * Generate embedding for text using Fastembed API
 * Returns null if not configured
 */
export async function generateEmbedding(text: string): Promise<number[] | null> {
	if (!text || text.trim().length === 0) {
		return null
	}

	if (!EMBED_URL) {
		console.warn('[embedding] Skipped - EMBED_URL not set')
		return null
	}

	try {
		const response = await fetch(EMBED_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(EMBED_API_KEY && { 'X-API-Key': EMBED_API_KEY }),
			},
			body: JSON.stringify({ texts: [text] }),
		})

		if (!response.ok) {
			throw new Error(`Fastembed API error: ${response.status} ${response.statusText}`)
		}

		const data = (await response.json()) as { embeddings: number[][] }
		return data.embeddings[0] ?? null
	} catch (error) {
		console.error('[embedding] Error:', error)
		throw error
	}
}

// Same embedding for documents and queries
export const generateQueryEmbedding = generateEmbedding

/**
 * Generate embeddings in batch (more efficient)
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
	const validTexts = texts.filter((t) => t.trim().length > 0)

	if (validTexts.length === 0 || !EMBED_URL) {
		return []
	}

	try {
		const response = await fetch(EMBED_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(EMBED_API_KEY && { 'X-API-Key': EMBED_API_KEY }),
			},
			body: JSON.stringify({ texts: validTexts }),
		})

		if (!response.ok) {
			throw new Error(`Fastembed API error: ${response.status} ${response.statusText}`)
		}

		const data = (await response.json()) as { embeddings: number[][] }
		return data.embeddings
	} catch (error) {
		console.error('[embedding] Batch error:', error)
		throw error
	}
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
	if (!EMBED_URL) {
		return { status: 'disabled', provider: 'none' }
	}

	try {
		const result = await generateEmbedding('health check')
		return result
			? { status: 'healthy', provider: 'fastembed', model: 'bge-large-en-v1.5' }
			: { status: 'unhealthy', provider: 'fastembed', model: 'bge-large-en-v1.5' }
	} catch (error) {
		return {
			status: 'unhealthy',
			provider: 'fastembed',
			model: 'bge-large-en-v1.5',
			error: error instanceof Error ? error.message : 'Unknown error',
		}
	}
}
