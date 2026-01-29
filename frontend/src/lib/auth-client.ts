// Better Auth Client - Native hooks from better-auth/react
import { createAuthClient } from 'better-auth/react'

// Create the auth client
export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_APP_URL,
})

// Export the main client methods
export const { signIn, signOut, useSession } = authClient

// Types
export type Session = typeof authClient.$Infer.Session
