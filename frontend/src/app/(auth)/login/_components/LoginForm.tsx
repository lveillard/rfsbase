'use client'

import { ArrowRight, Mail } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { AuthDivider, EmailSentCard, OAuthButtons } from '@/components/auth'
import { Button, Card, Input } from '@/components/ui'
import { useAuthStore } from '@/lib/auth/store'
import { buildOAuthUrl, type OAuthProvider } from '@/lib/utils'

type AuthMethod = 'magic-link' | OAuthProvider

export function LoginForm() {
	const [email, setEmail] = useState('')
	const [loadingMethod, setLoadingMethod] = useState<AuthMethod | null>(null)
	const [emailSent, setEmailSent] = useState(false)
	const [error, setError] = useState('')
	const login = useAuthStore((state) => state.login)

	const handleMagicLink = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!email) return

		setLoadingMethod('magic-link')
		setError('')

		try {
			const result = await login(email)
			if (result.success) {
				setEmailSent(true)
			} else {
				setError(result.error)
			}
		} catch {
			setError('Failed to send magic link. Please try again.')
		} finally {
			setLoadingMethod(null)
		}
	}

	const handleOAuth = (provider: OAuthProvider) => {
		setLoadingMethod(provider)
		setError('')
		window.location.href = buildOAuthUrl(provider)
	}

	const resetForm = () => {
		setEmailSent(false)
		setEmail('')
	}

	if (emailSent) {
		return <EmailSentCard email={email} variant="magic-link" onReset={resetForm} />
	}

	return (
		<Card padding="lg">
			<div className="text-center mb-6">
				<h1 className="text-2xl font-bold mb-2">Welcome back</h1>
				<p className="text-text-secondary">Sign in to your account to continue</p>
			</div>

			<OAuthButtons
				onOAuth={handleOAuth}
				loadingProvider={
					loadingMethod === 'google' || loadingMethod === 'github' ? loadingMethod : null
				}
				disabled={loadingMethod !== null}
				variant="login"
			/>

			<AuthDivider />

			<form onSubmit={handleMagicLink} className="space-y-4">
				<Input
					type="email"
					name="email"
					label="Email address"
					placeholder="Enter your email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={loadingMethod !== null}
					leftIcon={<Mail className="h-4 w-4" />}
					error={error}
				/>

				<Button
					type="submit"
					className="w-full"
					disabled={!email || loadingMethod !== null}
					isLoading={loadingMethod === 'magic-link'}
					rightIcon={<ArrowRight className="h-4 w-4" />}
				>
					Send Magic Link
				</Button>
			</form>

			<p className="text-center text-sm text-text-secondary mt-6">
				Don&apos;t have an account?{' '}
				<Link href="/signup" className="text-primary hover:underline font-medium">
					Sign up
				</Link>
			</p>
		</Card>
	)
}
