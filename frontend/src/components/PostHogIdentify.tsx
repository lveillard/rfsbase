'use client'

import posthog from 'posthog-js'
import { useEffect } from 'react'
import { useSession } from '@/lib/auth-client'

/**
 * Identifies the user with PostHog when the session is available.
 * This component should be placed in the root layout.
 */
export function PostHogIdentify() {
	const { data: session } = useSession()

	useEffect(() => {
		if (session?.user) {
			posthog.identify(session.user.id, {
				email: session.user.email,
				name: session.user.name,
				created_at: session.user.createdAt,
			})
		}
	}, [session])

	return null
}
