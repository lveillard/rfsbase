import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

// Better Auth handler for all auth routes
// Auth is lazily initialized on first request
export async function GET(request: NextRequest) {
	return await auth.handler(request)
}

export async function POST(request: NextRequest) {
	return await auth.handler(request)
}
