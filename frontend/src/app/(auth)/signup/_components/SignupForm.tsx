'use client'

import { ArrowRight, Mail, User } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { AuthDivider, EmailSentCard, OAuthButtons } from '@/components/auth'
import { Button, Card, Input } from '@/components/ui'
import { useAuthStore } from '@/lib/auth/store'
import { buildOAuthUrl, type OAuthProvider } from '@/lib/utils'

type AuthMethod = 'email' | OAuthProvider

export function SignupForm() {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [loadingMethod, setLoadingMethod] = useState<AuthMethod | null>(null)
	const [emailSent, setEmailSent] = useState(false)
	const [error, setError] = useState('')
	const login = useAuthStore((state) => state.login)

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!name || !email) return

		setLoadingMethod('email')
		setError('')

		try {
			// Signup uses the same magic link flow as login
			// The backend creates a new user if one doesn't exist
			const result = await login(email)
			if (result.success) {
				setEmailSent(true)
			} else {
				setError(result.error)
			}
		} catch {
			setError('Failed to create account. Please try again.')
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
		setName('')
		setEmail('')
	}

	if (emailSent) {
		return <EmailSentCard email={email} variant="verification" onReset={resetForm} />
	}

	const isLoading = loadingMethod !== null
	const oauthLoadingProvider =
		loadingMethod === 'google' || loadingMethod === 'github' ? loadingMethod : null

	return (
		<Card padding="lg">
			<div className="text-center mb-6">
				<h1 className="text-2xl font-bold mb-2">Create your account</h1>
				<p className="text-text-secondary">Join the community of founders and innovators</p>
			</div>

			<OAuthButtons
				onOAuth={handleOAuth}
				loadingProvider={oauthLoadingProvider}
				disabled={isLoading}
				variant="signup"
			/>

			<AuthDivider />

			<form onSubmit={handleSignup} className="space-y-4">
				<Input
					type="text"
					name="name"
					label="Full name"
					placeholder="Your name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					disabled={isLoading}
					leftIcon={<User className="h-4 w-4" />}
				/>

				<Input
					type="email"
					name="email"
					label="Email address"
					placeholder="your@email.com"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={isLoading}
					leftIcon={<Mail className="h-4 w-4" />}
					error={error}
				/>

				<Button
					type="submit"
					className="w-full"
					disabled={!name || !email || isLoading}
					isLoading={loadingMethod === 'email'}
					rightIcon={<ArrowRight className="h-4 w-4" />}
				>
					Create Account
				</Button>
			</form>

			<p className="text-center text-xs text-text-muted mt-4">
				By signing up, you agree to our{' '}
				<Link href="/terms" className="underline hover:text-text">
					Terms of Service
				</Link>{' '}
				and{' '}
				<Link href="/privacy" className="underline hover:text-text">
					Privacy Policy
				</Link>
			</p>

			<p className="text-center text-sm text-text-secondary mt-6">
				Already have an account?{' '}
				<Link href="/login" className="text-primary hover:underline font-medium">
					Log in
				</Link>
			</p>
		</Card>
	)
}
