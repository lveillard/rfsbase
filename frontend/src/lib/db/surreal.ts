import Surreal from 'surrealdb'

let dbInstance: Surreal | null = null
let connectionPromise: Promise<Surreal> | null = null

async function connectDB(): Promise<Surreal> {
	if (dbInstance) return dbInstance
	if (connectionPromise) return connectionPromise

	connectionPromise = (async () => {
		const db = new Surreal()
		// SDK translates username/password to user/pass for RPC
		await db.connect(process.env.SURREAL_URL!)
		await db.signin({
			username: process.env.SURREAL_USER!,
			password: process.env.SURREAL_PASS!,
		})
		await db.use({
			namespace: process.env.SURREAL_NS!,
			database: process.env.SURREAL_DB!,
		})
		console.log('[SurrealDB] Connected')
		dbInstance = db
		return db
	})()

	return connectionPromise
}

// Lazy proxy - waits for connection before any operation
export const db = new Proxy({} as Surreal, {
	get(_target, prop: string | symbol) {
		return async (...args: unknown[]) => {
			const instance = await connectDB()
			const method = instance[prop as keyof Surreal]
			if (typeof method === 'function') {
				return (method as (...args: unknown[]) => unknown).apply(instance, args)
			}
			return method
		}
	},
})

// Direct async getter for when you need the raw instance
export async function getSurrealDB(): Promise<Surreal> {
	return connectDB()
}
