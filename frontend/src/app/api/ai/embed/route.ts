import { openai } from '@ai-sdk/openai'
import { embed } from 'ai'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	try {
		const { text } = await req.json()

		if (!text || typeof text !== 'string') {
			return NextResponse.json({ error: 'Text is required' }, { status: 400 })
		}

		if (!process.env.OPENAI_API_KEY) {
			return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 503 })
		}

		const { embedding } = await embed({
			model: openai.embedding('text-embedding-3-small'),
			value: text,
		})

		return NextResponse.json({ embedding })
	} catch (error) {
		console.error('Embedding generation error:', error)
		return NextResponse.json({ error: 'Failed to generate embedding' }, { status: 500 })
	}
}
