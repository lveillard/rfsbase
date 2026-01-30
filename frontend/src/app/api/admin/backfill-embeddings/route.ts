/**
 * Admin endpoint to backfill embeddings for existing ideas
 * Protected by SURREAL_PASS (only server knows it)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSurrealDB } from '@/lib/db/surreal'
import { generateEmbedding } from '@/lib/server/embedding'

interface IdeaRow {
	id: { id: string }
	title: string
	problem: string
}

export async function POST(request: NextRequest) {
	// Simple auth: require the DB password
	const authHeader = request.headers.get('authorization')
	const token = authHeader?.replace('Bearer ', '')

	if (token !== process.env.SURREAL_PASS) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const db = await getSurrealDB()

	// Find all ideas without embeddings
	const result = await db.query<IdeaRow[][]>(`
		SELECT id, title, problem
		FROM idea
		WHERE embedding = NONE OR embedding = NULL
	`)

	const ideas = result[0] ?? []

	if (ideas.length === 0) {
		return NextResponse.json({
			message: 'All ideas already have embeddings',
			processed: 0,
		})
	}

	const results: { id: string; status: 'success' | 'error'; error?: string }[] = []

	for (const idea of ideas) {
		const ideaId = typeof idea.id === 'object' ? idea.id.id : String(idea.id)

		try {
			const embedding = await generateEmbedding(`${idea.title} ${idea.problem}`)

			if (!embedding || embedding.length === 0) {
				results.push({
					id: ideaId,
					status: 'error',
					error: 'Embedding generation returned null - check AWS_BEDROCK_ENABLED and credentials',
				})
				continue
			}

			// Debug: Log embedding type and length
			console.log(`[backfill] Embedding for ${ideaId}: type=${typeof embedding}, isArray=${Array.isArray(embedding)}, length=${embedding.length}`)

			// Convert to regular array if needed (in case it's a Float32Array or similar)
			const embeddingArray = Array.isArray(embedding) ? embedding : Array.from(embedding as ArrayLike<number>)
			console.log(`[backfill] Converted array length: ${embeddingArray.length}, sample: [${embeddingArray.slice(0, 3).join(', ')}...]`)

			await db.query(`UPDATE type::thing('idea', $id) SET embedding = $embedding`, {
				id: ideaId,
				embedding: embeddingArray,
			})

			results.push({ id: ideaId, status: 'success' })
		} catch (error) {
			results.push({
				id: ideaId,
				status: 'error',
				error: error instanceof Error ? error.message : 'Unknown error',
			})
		}
	}

	const successful = results.filter((r) => r.status === 'success').length
	const failed = results.filter((r) => r.status === 'error').length

	return NextResponse.json({
		message: `Processed ${ideas.length} ideas`,
		successful,
		failed,
		results,
	})
}

// GET: check status
export async function GET(request: NextRequest) {
	const authHeader = request.headers.get('authorization')
	const token = authHeader?.replace('Bearer ', '')

	if (token !== process.env.SURREAL_PASS) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const db = await getSurrealDB()

	const [withEmbeddings, withoutEmbeddings] = await Promise.all([
		db.query<{ count: number }[][]>(`SELECT count() as count FROM idea WHERE embedding != NONE GROUP ALL`),
		db.query<{ count: number }[][]>(
			`SELECT count() as count FROM idea WHERE embedding = NONE OR embedding = NULL GROUP ALL`,
		),
	])

	return NextResponse.json({
		withEmbeddings: withEmbeddings[0]?.[0]?.count ?? 0,
		withoutEmbeddings: withoutEmbeddings[0]?.[0]?.count ?? 0,
	})
}
