/**
 * Lambda function for generating embeddings using AWS Bedrock
 * Uses IAM role - no credentials needed
 */

import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'

const client = new BedrockRuntimeClient({ region: process.env.BEDROCK_REGION || process.env.AWS_REGION || 'us-east-1' })
const MODEL_ID = process.env.BEDROCK_MODEL || 'amazon.titan-embed-text-v2:0'

// SurrealDB connection
const SURREAL_URL = process.env.SURREAL_URL
const SURREAL_NS = process.env.SURREAL_NS || 'rfsbase'
const SURREAL_DB = process.env.SURREAL_DB || 'main'
const SURREAL_USER = process.env.SURREAL_USER || 'root'
const SURREAL_PASS = process.env.SURREAL_PASS

/**
 * Generate embedding for text using Bedrock Titan v2
 */
async function generateEmbedding(text) {
	const payload = {
		inputText: text,
		dimensions: 1024,
		normalize: true,
	}

	const command = new InvokeModelCommand({
		modelId: MODEL_ID,
		contentType: 'application/json',
		accept: 'application/json',
		body: JSON.stringify(payload),
	})

	const response = await client.send(command)
	const result = JSON.parse(new TextDecoder().decode(response.body))
	return result.embedding
}

/**
 * Execute SurrealDB query
 */
async function surrealQuery(query, params = {}) {
	const auth = Buffer.from(`${SURREAL_USER}:${SURREAL_PASS}`).toString('base64')

	const response = await fetch(`${SURREAL_URL}/sql`, {
		method: 'POST',
		headers: {
			'Authorization': `Basic ${auth}`,
			'NS': SURREAL_NS,
			'DB': SURREAL_DB,
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		},
		body: JSON.stringify({ query, params }),
	})

	if (!response.ok) {
		throw new Error(`SurrealDB error: ${response.status} ${await response.text()}`)
	}

	return response.json()
}

/**
 * Lambda handler
 */
export async function handler(event) {
	const headers = {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
	}

	try {
		// Parse body
		const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body || {}
		const { action, text, ideaId } = body

		// Health check
		if (action === 'health' || event.rawPath === '/health') {
			return {
				statusCode: 200,
				headers,
				body: JSON.stringify({ status: 'ok', model: MODEL_ID }),
			}
		}

		// Generate embedding only
		if (action === 'embed') {
			if (!text) {
				return {
					statusCode: 400,
					headers,
					body: JSON.stringify({ error: 'Missing text parameter' }),
				}
			}

			const embedding = await generateEmbedding(text)
			return {
				statusCode: 200,
				headers,
				body: JSON.stringify({ embedding, dimensions: embedding.length }),
			}
		}

		// Generate and store embedding for an idea
		if (action === 'embed-idea') {
			if (!ideaId || !text) {
				return {
					statusCode: 400,
					headers,
					body: JSON.stringify({ error: 'Missing ideaId or text parameter' }),
				}
			}

			const embedding = await generateEmbedding(text)

			// Store in SurrealDB - use raw array to avoid serialization issues
			const embeddingStr = `[${embedding.join(',')}]`
			await surrealQuery(`UPDATE type::thing('idea', '${ideaId}') SET embedding = ${embeddingStr}`)

			return {
				statusCode: 200,
				headers,
				body: JSON.stringify({
					success: true,
					ideaId,
					dimensions: embedding.length,
				}),
			}
		}

		// Backfill all ideas without embeddings
		if (action === 'backfill') {
			const result = await surrealQuery(`
				SELECT id, title, problem
				FROM idea
				WHERE embedding IS NONE OR embedding IS NULL
			`)

			const ideas = result[0]?.result || []

			if (ideas.length === 0) {
				return {
					statusCode: 200,
					headers,
					body: JSON.stringify({ message: 'All ideas have embeddings', processed: 0 }),
				}
			}

			const results = []
			for (const idea of ideas) {
				const id = typeof idea.id === 'object' ? idea.id.id : String(idea.id)
				try {
					const text = `${idea.title} ${idea.problem}`
					const embedding = await generateEmbedding(text)
					const embeddingStr = `[${embedding.join(',')}]`
					await surrealQuery(`UPDATE type::thing('idea', '${id}') SET embedding = ${embeddingStr}`)
					results.push({ id, status: 'success' })
				} catch (err) {
					results.push({ id, status: 'error', error: err.message })
				}
			}

			return {
				statusCode: 200,
				headers,
				body: JSON.stringify({
					message: `Processed ${ideas.length} ideas`,
					successful: results.filter(r => r.status === 'success').length,
					failed: results.filter(r => r.status === 'error').length,
					results,
				}),
			}
		}

		return {
			statusCode: 400,
			headers,
			body: JSON.stringify({
				error: 'Invalid action',
				validActions: ['health', 'embed', 'embed-idea', 'backfill'],
			}),
		}

	} catch (error) {
		console.error('Lambda error:', error)
		return {
			statusCode: 500,
			headers,
			body: JSON.stringify({ error: error.message }),
		}
	}
}
