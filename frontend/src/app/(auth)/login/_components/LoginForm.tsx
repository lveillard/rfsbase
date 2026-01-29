'use client'

import { Github, Mail } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Button, Card, Input } from '@/components/ui'
import { authClient } from '@/lib/auth-client'

type View = 'main' | 'email' | 'sent'

export function LoginForm() {
	const [view, setView] = useState<View>('main')
	const [email, setEmail] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')

	const handleOAuth = async (provider: 'google' | 'github') => {
		setIsLoading(true)
		setError('')
		try {
			await authClient.signIn.social({ provider, callbackURL: '/ideas' })
		} catch {
			setError('Something went wrong. Try again.')
			setIsLoading(false)
		}
	}

	const handleMagicLink = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!email) return

		setIsLoading(true)
		setError('')
		try {
			await authClient.signIn.magicLink({ email, callbackURL: '/ideas' })
			setView('sent')
		} catch {
			setError('Could not send link. Check your email and try again.')
		} finally {
			setIsLoading(false)
		}
	}

	if (view === 'sent') {
		return (
			<Card padding="lg">
				<div className="text-center">
					<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
						<Mail className="h-6 w-6 text-primary" />
					</div>
					<h1 className="text-2xl font-bold mb-2">Check your inbox</h1>
					<p className="text-text-secondary">
						We sent a link to <strong>{email}</strong>
					</p>
					<p className="text-sm text-text-muted mt-4">Expires in 10 minutes</p>
					<button
						type="button"
						onClick={() => setView('main')}
						className="text-sm text-primary hover:underline mt-6"
					>
						Try another way
					</button>
				</div>
			</Card>
		)
	}

	if (view === 'email') {
		return (
			<Card padding="lg">
				<h1 className="text-2xl font-bold mb-6">Enter your email</h1>

				{error && <p className="text-error text-sm mb-4">{error}</p>}

				<form onSubmit={handleMagicLink} className="space-y-4">
					<Input
						type="email"
						placeholder="you@example.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						disabled={isLoading}
						autoFocus
						required
					/>
					<Button type="submit" disabled={isLoading || !email} className="w-full">
						{isLoading ? 'Sending...' : 'Send login link'}
					</Button>
				</form>

				<button
					type="button"
					onClick={() => setView('main')}
					className="text-sm text-text-secondary hover:text-text mt-4 w-full text-center"
				>
					Back
				</button>
			</Card>
		)
	}

	return (
		<Card padding="lg">
			<h1 className="text-2xl font-bold mb-1">Log in</h1>
			<p className="text-text-secondary mb-6">Welcome back</p>

			{error && <p className="text-error text-sm mb-4">{error}</p>}

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
				<Button
					variant="outline"
					onClick={() => setView('email')}
					disabled={isLoading}
					className="w-full justify-center gap-2"
				>
					<Mail className="h-5 w-5" />
					Email
				</Button>
			</div>

			<p className="text-center text-sm text-text-secondary mt-6">
				New here?{' '}
				<Link href="/signup" className="text-primary hover:underline">
					Create an account
				</Link>
			</p>
		</Card>
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
