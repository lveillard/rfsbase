// Next.js 16 instrumentation - runs once on server startup
// https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

export async function register() {
	// Only run on Node.js runtime (not edge)
	if (process.env.NEXT_RUNTIME === 'nodejs') {
		// Pre-warm the database connection
		const { getSurrealDB } = await import('@/lib/db/surreal')
		try {
			await getSurrealDB()
			console.log('[instrumentation] SurrealDB connected')
		} catch (error) {
			console.error('[instrumentation] SurrealDB connection failed:', error)
		}
	}
}
