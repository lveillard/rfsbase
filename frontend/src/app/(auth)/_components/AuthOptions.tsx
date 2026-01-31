'use client'

import { AlertCircle, Github, Lock, Mail } from 'lucide-react'
import posthog from 'posthog-js'
import { useEffect, useState } from 'react'
import { Button, Card, Input } from '@/components/ui'
import { authClient } from '@/lib/auth-client'

interface YcData {
	batch: string
	company: string
	linkedin?: string
}

interface AuthOptionsProps {
	requiredEmail?: string
	ycData?: YcData
}

export function AuthOptions({ requiredEmail, ycData }: AuthOptionsProps) {
	const [email, setEmail] = useState(requiredEmail ?? '')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const [sent, setSent] = useState(false)

	// Store YC data in sessionStorage for post-auth verification
	useEffect(() => {
		if (ycData && requiredEmail) {
			sessionStorage.setItem('yc_pending', JSON.stringify({ email: requiredEmail, ...ycData }))
		}
	}, [ycData, requiredEmail])

	const handleOAuth = async (provider: 'google' | 'github') => {
		setIsLoading(true)
		setError('')

		posthog.capture('auth_method_clicked', {
			method: provider,
			has_yc_data: !!ycData,
		})

		// Reset loading state if user closes popup without completing auth
		const resetOnFocus = () => {
			// Wait a bit to check if auth actually completed
			setTimeout(() => {
				setIsLoading(false)
			}, 500)
		}

		// Listen for window focus (user closed popup and returned)
		window.addEventListener('focus', resetOnFocus, { once: true })

		// Fallback timeout in case focus event doesn't fire
		const timeout = setTimeout(() => {
			window.removeEventListener('focus', resetOnFocus)
			setIsLoading(false)
		}, 60000) // 60 seconds

		try {
			await authClient.signIn.social({ provider, callbackURL: '/ideas' })
			// If successful, auth will redirect - cleanup not needed
		} catch (err) {
			clearTimeout(timeout)
			window.removeEventListener('focus', resetOnFocus)
			setError('Something went wrong. Try again.')
			setIsLoading(false)
			posthog.captureException(err)
		}
	}

	const handleMagicLink = async (e: React.FormEvent) => {
		e.preventDefault()
		const targetEmail = requiredEmail ?? email
		if (!targetEmail) return

		// Security: if YC verification, email must match
		if (requiredEmail && email !== requiredEmail) {
			setError(`You must use ${requiredEmail} to get your YC badge`)
			return
		}

		posthog.capture('auth_method_clicked', {
			method: 'magic_link',
			has_yc_data: !!ycData,
		})

		setIsLoading(true)
		setError('')
		try {
			await authClient.signIn.magicLink({ email: targetEmail, callbackURL: '/ideas' })
			setSent(true)
			posthog.capture('magic_link_sent', {
				has_yc_data: !!ycData,
			})
		} catch (err) {
			setError('Could not send link. Try again.')
			posthog.captureException(err)
		} finally {
			setIsLoading(false)
		}
	}

	if (sent) {
		return (
			<Card padding="lg">
				<div className="text-center">
					<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
						<Mail className="h-6 w-6 text-primary" />
					</div>
					<h1 className="text-2xl font-bold mb-2">Check your inbox</h1>
					<p className="text-text-secondary">
						We sent a link to <strong>{requiredEmail ?? email}</strong>
					</p>
					{ycData && (
						<p className="text-sm text-accent mt-2">Your YC badge will be applied after login</p>
					)}
					<p className="text-sm text-text-muted mt-4">Expires in 10 minutes</p>
					<button
						type="button"
						onClick={() => setSent(false)}
						className="text-sm text-primary hover:underline mt-6"
					>
						Try another way
					</button>
				</div>
			</Card>
		)
	}

	return (
		<>
			{error && (
				<div className="flex items-center gap-2 text-error text-sm mb-4 p-3 bg-error/10 rounded-lg">
					<AlertCircle className="h-4 w-4 shrink-0" />
					{error}
				</div>
			)}

			{requiredEmail && (
				<div className="flex items-center gap-2 text-sm text-text-secondary mb-4 p-3 bg-surface-alt rounded-lg border border-border">
					<Lock className="h-4 w-4 shrink-0 text-accent" />
					<span>
						Use <strong className="text-accent">{requiredEmail}</strong> to get your YC badge
					</span>
				</div>
			)}

			<div className="space-y-3">
				<Button
					variant="outline"
					onClick={() => handleOAuth('google')}
					disabled={isLoading}
					className="w-full justify-center gap-2"
				>
					<GoogleIcon />
					Google
				</Button>
				<Button
					variant="outline"
					onClick={() => handleOAuth('github')}
					disabled={isLoading}
					className="w-full justify-center gap-2"
				>
					<Github className="h-5 w-5" />
					GitHub
				</Button>
			</div>

			<div className="relative my-6">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-t border-border" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-surface px-2 text-text-muted">or</span>
				</div>
			</div>

			<form onSubmit={handleMagicLink} className="space-y-3">
				<Input
					type="email"
					placeholder="you@example.com"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={isLoading || !!requiredEmail}
					required
				/>
				<Button
					type="submit"
					variant="outline"
					disabled={isLoading || (!email && !requiredEmail)}
					className="w-full"
				>
					{isLoading ? 'Sending...' : 'Send magic link'}
				</Button>
			</form>
		</>
	)
}

function GoogleIcon() {
	return (
		<svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
			<path
				fill="currentColor"
				d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
			/>
			<path
				fill="currentColor"
				d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
			/>
			<path
				fill="currentColor"
				d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
			/>
			<path
				fill="currentColor"
				d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
			/>
		</svg>
	)
}
