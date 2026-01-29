'use client'

import { BadgeCheck, Github, Mail } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Button, Card, Input } from '@/components/ui'
import { authClient } from '@/lib/auth-client'
import { useDebouncedCallback } from '@/lib/hooks/useDebouncedCallback'
import { verifyYcUrl, type YCVerification } from '@/lib/server/yc-verify'

type YcStatus = 'pending' | 'verified' | 'not_yc'
type View = 'main' | 'email' | 'sent'

const YC_VERIFY_PREFIX = 'https://www.ycombinator.com/verify/'

const cleanYcToken = (token: string): string => {
	let clean = token.trim()
	if (clean.includes('ycombinator.com/verify/')) {
		clean = clean.split('ycombinator.com/verify/')[1] ?? ''
	}
	return clean.replace(/\.json$/, '').replace(/\/$/, '')
}

export function SignupForm() {
	const [ycStatus, setYcStatus] = useState<YcStatus>('pending')
	const [ycToken, setYcToken] = useState('')
	const [ycData, setYcData] = useState<YCVerification | null>(null)
	const [ycLoading, setYcLoading] = useState(false)
	const [ycError, setYcError] = useState('')

	const [view, setView] = useState<View>('main')
	const [email, setEmail] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')

	const debouncedVerify = useDebouncedCallback(async (token: unknown) => {
		const cleanToken = cleanYcToken(String(token))
		if (!cleanToken) {
			setYcData(null)
			setYcError('')
			setYcLoading(false)
			return
		}

		try {
			const data = await verifyYcUrl(YC_VERIFY_PREFIX + cleanToken)
			if (!data.verified) {
				setYcError('Invalid or expired verification')
				setYcData(null)
				return
			}
			setYcData(data)
			setYcStatus('verified')
		} catch (err) {
			setYcError(err instanceof Error ? err.message : 'Verification failed')
			setYcData(null)
		} finally {
			setYcLoading(false)
		}
	}, 800)

	const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setYcToken(e.target.value)
		setYcError('')
		setYcLoading(true)
		debouncedVerify(e.target.value)
	}

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

	const showAuthOptions = ycStatus === 'not_yc' || (ycStatus === 'verified' && ycData)

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

	if (view === 'email' && showAuthOptions) {
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
						{isLoading ? 'Sending...' : 'Get started'}
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
			<h1 className="text-2xl font-bold mb-1">Get started</h1>
			<p className="text-text-secondary mb-6">Share ideas. Get feedback. Build.</p>

			{/* YC Verification */}
			<div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 mb-6">
				<div className="flex items-center gap-2 mb-3">
					<BadgeCheck className="h-5 w-5 text-orange-500" />
					<span className="font-medium">YC founder?</span>
				</div>

				<div className="flex gap-3 mb-3">
					<Button
						type="button"
						variant={ycStatus !== 'not_yc' ? 'primary' : 'outline'}
						size="sm"
						onClick={() => setYcStatus('pending')}
						className="flex-1"
					>
						Yes
					</Button>
					<Button
						type="button"
						variant={ycStatus === 'not_yc' ? 'primary' : 'outline'}
						size="sm"
						onClick={() => {
							setYcStatus('not_yc')
							setYcToken('')
							setYcData(null)
							setYcError('')
						}}
						className="flex-1"
					>
						No
					</Button>
				</div>

				{ycStatus !== 'not_yc' && (
					<div className="space-y-3">
						<p className="text-xs text-text-muted">
							Paste your link from{' '}
							<Link
								href="https://www.ycombinator.com/verify"
								target="_blank"
								className="text-primary hover:underline"
							>
								ycombinator.com/verify
							</Link>
						</p>
						<div className="relative">
							<div className="absolute left-0 top-0 bottom-0 flex items-center pl-3 pr-2 bg-surface-alt border border-r-border rounded-l-lg text-xs text-text-muted truncate max-w-[180px]">
								ycombinator.com/verify/
							</div>
							<Input
								type="text"
								placeholder="your-code"
								value={ycToken}
								onChange={handleTokenChange}
								disabled={isLoading || ycLoading}
								error={ycError}
								className="pl-[185px]"
							/>
						</div>
						{ycLoading && <p className="text-xs text-text-muted">Checking...</p>}
						{ycData && ycStatus === 'verified' && (
							<div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg p-3">
								<div className="flex items-center gap-2">
									<BadgeCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
									<span className="text-sm font-medium text-green-800 dark:text-green-300">
										{ycData.name} · {ycData.batches[0]?.name}
									</span>
								</div>
							</div>
						)}
					</div>
				)}
			</div>

			{showAuthOptions ? (
				<>
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
					<p className="text-center text-xs text-text-muted mt-4">
						By continuing, you agree to our{' '}
						<Link href="/legal/conditions" className="underline hover:text-text">
							Terms
						</Link>{' '}
						and{' '}
						<Link href="/legal/policy" className="underline hover:text-text">
							Privacy Policy
						</Link>
					</p>
				</>
			) : (
				<p className="text-center text-sm text-text-muted">
					Enter your YC verification above to continue
				</p>
			)}

			<p className="text-center text-sm text-text-secondary mt-6">
				Already have an account?{' '}
				<Link href="/login" className="text-primary hover:underline">
					Log in
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
