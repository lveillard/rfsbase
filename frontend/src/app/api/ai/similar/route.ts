import { openai } from '@ai-sdk/openai'
import { embed } from 'ai'
import { type NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.API_URL || 'http://localhost:3001'

export async function POST(req: NextRequest) {
	try {
		const { text, threshold = 0.75, limit = 5, excludeId } = await req.json()

		if (!text || typeof text !== 'string' || text.length < 20) {
			return NextResponse.json({ error: 'Text must be at least 20 characters' }, { status: 400 })
		}

		// Check if OpenAI API key is configured
		if (!process.env.OPENAI_API_KEY) {
			// Return empty results if AI is not configured (development mode)
			return NextResponse.json({ ideas: [] })
		}

		// Generate embedding for the text
		const { embedding } = await embed({
			model: openai.embedding('text-embedding-3-small'),
			value: text,
		})

		// Search for similar ideas via backend API
		const searchParams = new URLSearchParams({
			embedding: JSON.stringify(embedding),
			threshold: String(threshold),
			limit: String(limit),
		})

		if (excludeId) {
			searchParams.set('exclude_id', excludeId)
		}

		const response = await fetch(`${API_URL}/api/ideas/similar-by-embedding?${searchParams}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		})

		if (!response.ok) {
			// If backend search fails, return empty results
			return NextResponse.json({ ideas: [] })
		}

		const data = await response.json()
		return NextResponse.json({ ideas: data.data || [] })
	} catch (error) {
		console.error('Similar ideas search error:', error)
		// Return empty results on error to not block idea creation
		return NextResponse.json({ ideas: [] })
	}
}
