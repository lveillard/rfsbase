import { betterAuth } from 'better-auth'
import { surrealdbAdapter } from 'surreal-better-auth'
import { getSurrealDB } from '@/lib/db/surreal'

// Auth instance that shares DB connection with rest of the app
// Uses lazy initialization - DB is only connected when auth is first used
let authInstance: ReturnType<typeof betterAuth> | null = null

async function ensureAuth(): Promise<ReturnType<typeof betterAuth>> {
	if (authInstance) return authInstance

	// Ensure DB is connected before creating auth
	const db = await getSurrealDB()

	authInstance = betterAuth({
		secret: process.env.BETTER_AUTH_SECRET!,
		database: surrealdbAdapter(db, {
			idGenerator: 'surreal.UUIDv7',
		}),

		emailAndPassword: { enabled: false },

		magicLink: {
			enabled: true,
			async sendMagicLink(data: { email: string; url: string }) {
				console.log('Magic link for', data.email, ':', data.url)
			},
		},

		socialProviders: {
			google: {
				clientId: process.env.GOOGLE_CLIENT_ID || '',
				clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
			},
			github: {
				clientId: process.env.GITHUB_CLIENT_ID || '',
				clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
			},
		},
	})

	return authInstance
}

// Synchronous auth for route handlers (requires async handler wrapper)
// biome-ignore lint/suspicious/noExplicitAny: better-auth types
export const auth: any = new Proxy({} as ReturnType<typeof betterAuth>, {
	get(_, prop: string) {
		// Return a function that ensures auth is initialized before calling the actual method
		return async (...args: unknown[]) => {
			const instance = await ensureAuth()
			const method = instance[prop as keyof typeof instance]
			if (typeof method === 'function') {
				// biome-ignore lint/suspicious/noExplicitAny: dynamic method call
				return (method as any).apply(instance, args)
			}
			return method
		}
	},
})
