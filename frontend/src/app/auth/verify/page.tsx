'use client'

import { BadgeCheck } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { Button, Card } from '@/components/ui'
import { useSession } from '@/lib/auth-client'
import { applyYcBadge } from '@/lib/server/yc-verify'

type Status = 'verifying' | 'applying_yc' | 'success' | 'success_yc' | 'error'

function VerifyContent() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const token = searchParams.get('token')
	const { data: session, isPending } = useSession()
	const [status, setStatus] = useState<Status>('verifying')
	const [errorMessage, setErrorMessage] = useState('')

	useEffect(() => {
		if (!token) {
			setStatus('error')
			setErrorMessage('Invalid verification link')
			return
		}

		const handleYcBadge = async () => {
			// Check for pending YC verification in sessionStorage
			const ycPendingStr = sessionStorage.getItem('yc_pending')
			if (!ycPendingStr) return false

			try {
				const ycPending = JSON.parse(ycPendingStr) as {
					email: string
					batch: string
					company: string
				}

				// Verify email matches
				if (session?.user?.email?.toLowerCase() !== ycPending.email.toLowerCase()) {
					setStatus('error')
					setErrorMessage(
						`Email mismatch. You signed in with ${session?.user?.email} but YC verification requires ${ycPending.email}`,
					)
					sessionStorage.removeItem('yc_pending')
					return true
				}

				setStatus('applying_yc')
				await applyYcBadge(ycPending.email, ycPending.batch)
				sessionStorage.removeItem('yc_pending')
				setStatus('success_yc')
				return true
			} catch (err) {
				console.error('Failed to apply YC badge:', err)
				sessionStorage.removeItem('yc_pending')
				// Continue with normal success even if badge fails
				return false
			}
		}

		if (session?.user) {
			handleYcBadge().then((hadYc) => {
				if (!hadYc && status !== 'error') {
					setStatus('success')
				}
				setTimeout(() => router.push('/ideas'), 2000)
			})
		}
	}, [token, session, router, status])

	if (isPending || status === 'verifying') {
		return (
			<>
				<div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
				<h1 className="text-xl font-bold">Verifying...</h1>
				<p className="text-text-secondary">Please wait while we verify your link</p>
			</>
		)
	}

	if (status === 'applying_yc') {
		return (
			<>
				<div className="animate-spin h-8 w-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-4" />
				<h1 className="text-xl font-bold">Applying YC badge...</h1>
				<p className="text-text-secondary">Setting up your founder profile</p>
			</>
		)
	}

	if (status === 'error') {
		return (
			<>
				<h1 className="text-xl font-bold text-error mb-2">Error</h1>
				<p className="text-text-secondary mb-4">
					{errorMessage || 'This verification link is invalid or has expired.'}
				</p>
				<Button onClick={() => router.push('/login')}>Back to Login</Button>
			</>
		)
	}

	if (status === 'success_yc') {
		return (
			<>
				<div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
					<BadgeCheck className="h-6 w-6 text-orange-500" />
				</div>
				<h1 className="text-xl font-bold text-orange-600 dark:text-orange-400 mb-2">
					Welcome, YC Founder!
				</h1>
				<p className="text-text-secondary">Your YC badge has been applied. Redirecting...</p>
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
