'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { Button, Card } from '@/components/ui'
import { useSession } from '@/lib/auth-client'

function VerifyContent() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const token = searchParams.get('token')
	const { data: session, isPending } = useSession()
	const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')

	useEffect(() => {
		if (!token) {
			setStatus('error')
			return
		}

		if (session?.user) {
			setStatus('success')
			setTimeout(() => router.push('/ideas'), 1500)
		}
	}, [token, session, router])

	if (isPending || status === 'verifying') {
		return (
			<>
				<div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
				<h1 className="text-xl font-bold">Verifying...</h1>
				<p className="text-text-secondary">Please wait while we verify your link</p>
			</>
		)
	}

	if (status === 'error') {
		return (
			<>
				<h1 className="text-xl font-bold text-error mb-2">Invalid Link</h1>
				<p className="text-text-secondary mb-4">
					This verification link is invalid or has expired.
				</p>
				<Button onClick={() => router.push('/login')}>Back to Login</Button>
			</>
		)
	}

	return (
		<>
			<h1 className="text-xl font-bold text-success mb-2">Success!</h1>
			<p className="text-text-secondary">You&apos;re now signed in. Redirecting...</p>
		</>
	)
}

export default function VerifyPage() {
	return (
		<Card padding="lg" className="text-center max-w-md mx-auto mt-20">
			<Suspense
				fallback={
					<>
						<div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
						<h1 className="text-xl font-bold">Loading...</h1>
					</>
				}
			>
				<VerifyContent />
			</Suspense>
		</Card>
	)
}
