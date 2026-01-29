import { getSurrealDB } from '@/lib/db/surreal'
import { checkEmbeddingHealth } from '@/lib/server/embedding'

export async function GET() {
	const [dbHealth, embeddingHealth] = await Promise.all([
		checkDatabaseHealth(),
		checkEmbeddingHealth(),
	])

	const allHealthy = dbHealth.status === 'healthy' && embeddingHealth.status === 'healthy'

	return Response.json(
		{
			status: allHealthy ? 'healthy' : 'unhealthy',
			timestamp: new Date().toISOString(),
			services: {
				database: dbHealth,
				embedding: embeddingHealth,
			},
		},
		{ status: allHealthy ? 200 : 503 },
	)
}

async function checkDatabaseHealth() {
	try {
		const db = await getSurrealDB()
		await db.query('SELECT 1')
		return { status: 'healthy' as const, provider: 'surrealdb' }
	} catch (error) {
		return {
			status: 'unhealthy' as const,
			provider: 'surrealdb',
			error: error instanceof Error ? error.message : 'Unknown error',
		}
	}
}
