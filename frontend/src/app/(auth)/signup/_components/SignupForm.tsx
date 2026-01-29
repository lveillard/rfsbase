'use client'

import { BadgeCheck, Github } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Button, Card, Input } from '@/components/ui'
import { authClient } from '@/lib/auth-client'
import { useDebouncedCallback } from '@/lib/hooks/useDebouncedCallback'
import { verifyYcUrl, type YCVerification } from '@/lib/server/yc-verify'

type YcStatus = 'pending' | 'verified' | 'not_yc'

const YC_VERIFY_PREFIX = 'https://www.ycombinator.com/verify/'

// Clean YC token from various input formats
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
				setYcError('This verification is not active')
				setYcData(null)
				return
			}
			setYcData(data)
			setYcStatus('verified')
		} catch (err) {
			setYcError(err instanceof Error ? err.message : 'Failed to verify token')
			setYcData(null)
		} finally {
			setYcLoading(false)
		}
	}, 800)

	const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setYcToken(value)
		setYcError('')
		setYcLoading(true)
		debouncedVerify(value)
	}

	const handleYcNo = () => {
		setYcStatus('not_yc')
		setYcToken('')
		setYcData(null)
		setYcError('')
	}
	const handleYcYes = () => {
		setYcStatus('pending')
	}

	const handleOAuth = async (provider: 'google' | 'github') => {
		setIsLoading(true)
		try {
			await authClient.signIn.social({ provider, callbackURL: '/ideas' })
		} catch {
			setError(`Failed to sign in with ${provider}`)
			setIsLoading(false)
		}
	}

	const showMainForm = ycStatus === 'not_yc' || (ycStatus === 'verified' && ycData)

	return (
		<Card padding="lg">
			<div className="text-center mb-6">
				<h1 className="text-2xl font-bold mb-2">Create your account</h1>
				<p className="text-text-secondary">Join the community of founders and innovators</p>
			</div>

			<div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 mb-6">
				<div className="flex items-center gap-2 mb-3">
					<BadgeCheck className="h-5 w-5 text-orange-500" />
					<span className="font-semibold">Are you a YC founder?</span>
				</div>

				<div className="flex gap-3 mb-3">
					<Button
						type="button"
						variant={ycStatus !== 'not_yc' ? 'primary' : 'outline'}
						size="sm"
						onClick={handleYcYes}
						className="flex-1"
					>
						Yes
					</Button>
					<Button
						type="button"
						variant={ycStatus === 'not_yc' ? 'primary' : 'outline'}
						size="sm"
						onClick={handleYcNo}
						className="flex-1"
					>
						No
					</Button>
				</div>

				{ycStatus !== 'not_yc' && (
					<div className="space-y-3">
						<p className="text-xs text-text-muted">
							Enter your verification code from{' '}
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
						{ycLoading && <p className="text-xs text-text-muted">Verifying...</p>}
						{ycData && ycStatus === 'verified' && (
							<div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg p-3">
								<div className="flex items-center gap-2 mb-1">
									<BadgeCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
									<span className="text-sm font-medium text-green-800 dark:text-green-300">
										Verified YC {ycData.batches[0]?.name}
									</span>
								</div>
								<p className="text-xs text-green-700 dark:text-green-400">
									{ycData.name} • {ycData.companies[0]?.name || 'Stealth'}
								</p>
							</div>
						)}
					</div>
				)}
			</div>

			{showMainForm && (
				<>
					{error && <p className="text-error text-sm mb-4 text-center">{error}</p>}
					<div className="space-y-3">
						<Button
							type="button"
							variant="outline"
							onClick={() => handleOAuth('google')}
							disabled={isLoading}
							className="w-full justify-center gap-2"
						>
							<svg className="h-5 w-5" viewBox="0 0 24 24" role="img" aria-label="Google">
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
							Continue with Google
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => handleOAuth('github')}
							disabled={isLoading}
							className="w-full justify-center gap-2"
						>
							<Github className="h-5 w-5" />
							Continue with GitHub
						</Button>
					</div>
					<p className="text-center text-xs text-text-muted mt-4">
						By signing up, you agree to our{' '}
						<Link href="/legal/conditions" className="underline hover:text-text">
							Terms & Conditions
						</Link>{' '}
						and{' '}
						<Link href="/legal/policy" className="underline hover:text-text">
							Privacy Policy
						</Link>
					</p>
				</>
			)}

			{ycStatus === 'pending' && !ycData && (
				<p className="text-center text-sm text-text-muted mt-4">
					Please enter your YC verification code above to continue
				</p>
			)}

			<p className="text-center text-sm text-text-secondary mt-6">
				Already have an account?{' '}
				<Link href="/login" className="text-primary hover:underline font-medium">
					Log in
				</Link>
			</p>
		</Card>
	)
}
