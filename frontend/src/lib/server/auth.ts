'use server'

import { headers } from 'next/headers'
import { cache } from 'react'
import { auth } from '@/lib/auth'
import { Errors } from '@/lib/errors'

export const getSession = cache(async () => {
	return auth.api.getSession({ headers: await headers() })
})

export async function requireAuth<T>(fn: (userId: string) => Promise<T>): Promise<T> {
	const session = await getSession()
	if (!session?.user?.id) throw Errors.unauthorized()
	return fn(session.user.id)
}
