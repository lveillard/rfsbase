'use client'

import { ArrowRight, BadgeCheck, Loader2 } from 'lucide-react'
import Link from 'next/link'
import posthog from 'posthog-js'
import { useState } from 'react'
import { Button, Card } from '@/components/ui'
import { verifyYcFounder, type YCVerification } from '@/lib/server/yc-verify'
import { AuthOptions } from '../../_components/AuthOptions'

type YcStatus = 'idle' | 'verified' | 'not_yc'

const YC_PREFIX = 'ycombinator.com/verify/'

function YCLogo({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect width="24" height="24" rx="4" fill="#FF6600" />
			<path
				d="M12 14.5V18M8 6L12 12M16 6L12 12"
				stroke="white"
				strokeWidth="2.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

export function SignupForm() {
	const [ycStatus, setYcStatus] = useState<YcStatus>('idle')
	const [ycInput, setYcInput] = useState('')
	const [ycData, setYcData] = useState<YCVerification | null>(null)
	const [isVerifying, setIsVerifying] = useState(false)
	const [ycError, setYcError] = useState('')

	const handleVerify = async () => {
		if (!ycInput.trim()) {
			setYcError('Enter your verification code')
			return
		}

		setIsVerifying(true)
		setYcError('')

		posthog.capture('yc_verification_attempted')

		try {
			const data = await verifyYcFounder(ycInput)
			setYcData(data)
			setYcStatus('verified')
			posthog.capture('yc_verification_succeeded', {
				batch: data.batch,
				company: data.company,
			})
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Verification failed'
			setYcError(errorMessage)
			setYcData(null)
			posthog.capture('yc_verification_failed', {
				error: errorMessage,
			})
		} finally {
			setIsVerifying(false)
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			handleVerify()
		}
	}

	const showAuthOptions = ycStatus === 'not_yc' || ycStatus === 'verified'

	return (
		<Card padding="lg">
			<h1 className="text-2xl font-bold mb-1">Get started</h1>
			<p className="text-text-secondary mb-6">Share ideas. Get feedback. Build.</p>

			{/* YC Verification */}
			<div className="bg-surface-alt border border-border rounded-xl p-4 mb-6">
				<div className="flex items-center gap-2 mb-3">
					<YCLogo className="h-6 w-6" />
					<span className="font-medium">YC Founder?</span>
				</div>

				{ycStatus !== 'verified' && (
					<div className="flex gap-3 mb-3">
						<Button
							type="button"
							variant={ycStatus !== 'not_yc' ? 'primary' : 'outline'}
							size="sm"
							onClick={() => {
								setYcStatus('idle')
								posthog.capture('signup_started', { is_yc_founder: true })
							}}
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
								setYcInput('')
								setYcData(null)
								setYcError('')
								posthog.capture('signup_started', { is_yc_founder: false })
							}}
							className="flex-1"
						>
							No
						</Button>
					</div>
				)}

				{ycStatus === 'idle' && (
					<div className="space-y-3">
						<p className="text-xs text-text-muted">
							Paste your link from{' '}
							<Link
								href="https://www.ycombinator.com/verify"
								target="_blank"
								className="text-accent hover:underline"
							>
								ycombinator.com/verify
							</Link>
						</p>

						<div className="flex rounded-lg overflow-hidden border border-border focus-within:ring-2 focus-within:ring-accent/50">
							<span className="flex items-center px-3 text-xs text-text-muted bg-surface-alt select-none border-r border-border">
								{YC_PREFIX}
							</span>
							<input
								type="text"
								placeholder="your-code"
								value={ycInput}
								onChange={(e) => {
									const value = e.target.value
									const match = value.match(/verify\/([a-zA-Z0-9]+)/)
									setYcInput(match?.[1] ?? value.replace('.json', ''))
									setYcError('')
								}}
								onKeyDown={handleKeyDown}
								disabled={isVerifying}
								className="flex-1 min-w-0 px-3 py-2.5 text-sm bg-surface text-text placeholder:text-text-muted outline-none disabled:opacity-50"
							/>
							<button
								type="button"
								onClick={handleVerify}
								disabled={isVerifying || !ycInput.trim()}
								className="flex items-center px-4 bg-accent text-white hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								aria-label="Verify"
							>
								{isVerifying ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<ArrowRight className="h-4 w-4" />
								)}
							</button>
						</div>

						{ycError && <p className="text-xs text-error">{ycError}</p>}
					</div>
				)}

				{ycStatus === 'verified' && ycData && (
					<div className="space-y-1">
						<div className="flex items-center gap-2">
							<BadgeCheck className="h-4 w-4 text-accent" />
							<span className="text-sm font-medium">Hey {ycData.name}!</span>
						</div>
						<p className="text-sm text-text-secondary">
							{ycData.title && `${ycData.title} @ `}
							{ycData.company} · {ycData.batch}
						</p>
						<p className="text-sm text-text-secondary mt-2">
							Continue with <strong className="text-accent">{ycData.email}</strong> to get your YC
							badge
						</p>
					</div>
				)}
			</div>

			{showAuthOptions ? (
				<>
					<AuthOptions
						requiredEmail={ycData?.email}
						ycData={
							ycData
								? { batch: ycData.batch, company: ycData.company, linkedin: ycData.linkedin }
								: undefined
						}
					/>

					<p className="text-center text-xs text-text-muted mt-6">
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
				<Link href="/login" className="text-accent hover:underline">
					Log in
				</Link>
			</p>
		</Card>
	)
}
