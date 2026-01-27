import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import type { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
	try {
		const { text, type } = await req.json()

		if (!text || typeof text !== 'string') {
			return new Response(JSON.stringify({ error: 'Text is required' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			})
		}

		if (!process.env.OPENAI_API_KEY) {
			return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
				status: 503,
				headers: { 'Content-Type': 'application/json' },
			})
		}

		const systemPrompt = `You are an expert startup advisor helping founders refine their ideas.
Be concise, actionable, and specific. Focus on clarity and practical improvements.
Keep responses under 200 words.`

		let userPrompt: string

		switch (type) {
			case 'improve':
				userPrompt = `Improve this startup problem statement for clarity and specificity.
Make it more compelling while keeping the core idea:

"${text}"

Provide the improved version directly without explanations.`
				break

			case 'suggest-tags':
				userPrompt = `Suggest 3-5 relevant tags for this startup idea. Return only the tags as a comma-separated list:

"${text}"`
				break

			case 'target-audience':
				userPrompt = `Suggest a clear target audience description for this startup idea in one sentence:

"${text}"`
				break

			case 'solution':
				userPrompt = `Suggest a brief, actionable solution approach for this problem in 2-3 sentences:

"${text}"`
				break

			default:
				userPrompt = `Provide brief feedback on this startup idea:

"${text}"`
		}

		const result = streamText({
			model: openai('gpt-4o-mini'),
			system: systemPrompt,
			prompt: userPrompt,
			maxOutputTokens: 500,
		})

		return result.toTextStreamResponse()
	} catch (error) {
		console.error('AI refinement error:', error)
		return new Response(JSON.stringify({ error: 'Failed to process request' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		})
	}
}
