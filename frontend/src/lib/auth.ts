import { betterAuth } from 'better-auth'
import { magicLink } from 'better-auth/plugins'
import { surrealdbAdapter } from 'surreal-better-auth'
import { db } from '@/lib/db/surreal'

const baseURL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// In dev, trust common local ports (Next.js may auto-assign alternative port)
const trustedOrigins =
	process.env.NODE_ENV === 'production'
		? [baseURL]
		: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002']

// Lazy-loaded, cached Resend instance
let resendInstance: InstanceType<typeof import('resend').Resend> | null = null

async function getResend() {
	if (resendInstance) return resendInstance
	const { Resend } = await import('resend')
	resendInstance = new Resend(process.env.RESEND_API_KEY)
	return resendInstance
}

async function sendEmail(to: string, subject: string, html: string) {
	if (!process.env.RESEND_API_KEY) {
		console.log('[DEV] Email to', to, ':', subject)
		return
	}
	const resend = await getResend()
	await resend.emails.send({ from: 'RFSbase <auth@rfsbase.com>', to, subject, html })
}

export const auth = betterAuth({
	baseURL,
	trustedOrigins,
	secret: process.env.BETTER_AUTH_SECRET!,
	database: surrealdbAdapter(db, {
		idGenerator: 'surreal.UUIDv7',
	}),
	emailAndPassword: { enabled: false },
	plugins: [
		magicLink({
			sendMagicLink: async ({ email, url }) => {
				await sendEmail(
					email,
					'Sign in to RFSbase',
					`<div style="font-family: sans-serif; max-width: 400px; margin: 0 auto;">
						<h2 style="color: #1a1a1a;">Sign in to RFSbase</h2>
						<p style="color: #666;">Click the button below to sign in. This link expires in 10 minutes.</p>
						<a href="${url}" style="display: inline-block; background: #FF6600; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">Sign in</a>
						<p style="color: #999; font-size: 12px;">If you didn't request this, you can ignore this email.</p>
					</div>`,
				)
			},
			expiresIn: 60 * 10, // 10 minutes
		}),
	],
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
