import { betterAuth } from 'better-auth'
import { Resend } from 'resend'
import { surrealdbAdapter } from 'surreal-better-auth'
import { getSurrealDB } from '@/lib/db/surreal'

const resend = new Resend(process.env.RESEND_API_KEY)

// Auth instance that shares DB connection with rest of the app
let authInstance: ReturnType<typeof betterAuth> | null = null

async function ensureAuth(): Promise<ReturnType<typeof betterAuth>> {
	if (authInstance) return authInstance

	const db = await getSurrealDB()

	authInstance = betterAuth({
		secret: process.env.BETTER_AUTH_SECRET!,
		database: surrealdbAdapter(db, {
			idGenerator: 'surreal.UUIDv7',
		}),

		emailAndPassword: { enabled: false },

		magicLink: {
			enabled: true,
			async sendMagicLink({ email, url }: { email: string; url: string }) {
				if (!process.env.RESEND_API_KEY) {
					console.log('[DEV] Magic link for', email, ':', url)
					return
				}

				await resend.emails.send({
					from: 'RFSbase <auth@rfsbase.com>',
					to: email,
					subject: 'Sign in to RFSbase',
					html: `
						<div style="font-family: sans-serif; max-width: 400px; margin: 0 auto;">
							<h2 style="color: #1a1a1a;">Sign in to RFSbase</h2>
							<p style="color: #666;">Click the button below to sign in. This link expires in 10 minutes.</p>
							<a href="${url}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
								Sign in
							</a>
							<p style="color: #999; font-size: 12px;">If you didn't request this, you can ignore this email.</p>
						</div>
					`,
				})
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

// Proxy for lazy auth initialization
// biome-ignore lint/suspicious/noExplicitAny: better-auth types
export const auth: any = new Proxy({} as ReturnType<typeof betterAuth>, {
	get(_, prop: string) {
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
