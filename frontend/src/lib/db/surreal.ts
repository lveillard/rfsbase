import { Surreal } from 'surrealdb'

// Create a singleton SurrealDB instance for Better Auth adapter
let dbInstance: Surreal | null = null
let connectionPromise: Promise<Surreal> | null = null

async function connectDB(): Promise<Surreal> {
	const db = new Surreal()

	await db.connect(process.env.SURREAL_URL!, {
		auth: {
			username: process.env.SURREAL_USER!,
			password: process.env.SURREAL_PASS!,
		},
	})

	await db.use({
		namespace: process.env.SURREAL_NS!,
		database: process.env.SURREAL_DB!,
	})

	return db
}

// Singleton pattern with promise caching to avoid multiple connections
export async function getSurrealDB(): Promise<Surreal> {
	if (dbInstance) {
		try {
			await dbInstance.query('SELECT 1')
			return dbInstance
		} catch {
			dbInstance = null
			connectionPromise = null
		}
	}

	if (!connectionPromise) {
		connectionPromise = connectDB().then((db) => {
			dbInstance = db
			return db
		})
	}

	return connectionPromise
}

// Export the getter for Better Auth adapter
export { getSurrealDB as default }

// Type helper
export type QueryResult<T = unknown> = T[][]

// Helper to close connection
export async function closeSurrealDB(): Promise<void> {
	if (dbInstance) {
		await dbInstance.close()
		dbInstance = null
		connectionPromise = null
	}
}
