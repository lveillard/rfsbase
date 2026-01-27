'use client'

import { CheckCircle, Loader2, XCircle } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { Button, Card } from '@/components/ui'
import { useAuth } from '@/lib/auth'

function VerifyContent() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const { verifyMagicLink } = useAuth()

	const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const token = searchParams.get('token')

		if (!token) {
			setStatus('error')
			setError('Invalid verification link')
			return
		}

		const verify = async () => {
			const result = await verifyMagicLink(token)

			if (result.success) {
				setStatus('success')
				// Redirect to app after short delay
				setTimeout(() => {
					router.push('/ideas')
				}, 2000)
			} else {
				setStatus('error')
				setError(result.error || 'Verification failed')
			}
		}

		verify()
	}, [searchParams, verifyMagicLink, router])

	return (
		<Card className="w-full max-w-md text-center">
			{status === 'loading' && (
				<div className="py-8">
					<Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
					<h1 className="text-xl font-semibold mb-2">Verifying your email...</h1>
					<p className="text-text-secondary">Please wait while we verify your login.</p>
				</div>
			)}

			{status === 'success' && (
				<div className="py-8">
					<CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
					<h1 className="text-xl font-semibold mb-2">Email verified!</h1>
					<p className="text-text-secondary mb-4">
						You've been successfully logged in. Redirecting you now...
					</p>
					<Loader2 className="h-4 w-4 animate-spin text-text-muted mx-auto" />
				</div>
			)}

			{status === 'error' && (
				<div className="py-8">
					<XCircle className="h-12 w-12 text-error mx-auto mb-4" />
					<h1 className="text-xl font-semibold mb-2">Verification failed</h1>
					<p className="text-text-secondary mb-6">{error}</p>
					<div className="flex gap-3 justify-center">
						<Button variant="outline" onClick={() => router.push('/login')}>
							Back to login
						</Button>
						<Button onClick={() => router.push('/')}>Go home</Button>
					</div>
				</div>
			)}
		</Card>
	)
}

function LoadingFallback() {
	return (
		<Card className="w-full max-w-md text-center">
			<div className="py-8">
				<Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
				<h1 className="text-xl font-semibold mb-2">Loading...</h1>
				<p className="text-text-secondary">Please wait...</p>
			</div>
		</Card>
	)
}

export default function VerifyPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-background p-4">
			<Suspense fallback={<LoadingFallback />}>
				<VerifyContent />
			</Suspense>
		</div>
	)
}
