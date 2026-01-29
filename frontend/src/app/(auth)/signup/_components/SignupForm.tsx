'use client'

import { ArrowRight, BadgeCheck, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Button, Card, Input } from '@/components/ui'
import { verifyYcFounder, type YCVerification } from '@/lib/server/yc-verify'
import { AuthOptions } from '../../_components/AuthOptions'

type YcStatus = 'idle' | 'verified' | 'not_yc'

const YC_PREFIX = 'ycombinator.com/verify/'

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

		try {
			const data = await verifyYcFounder(ycInput)
			setYcData(data)
			setYcStatus('verified')
		} catch (err) {
			setYcError(err instanceof Error ? err.message : 'Verification failed')
			setYcData(null)
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
			<div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 mb-6">
				<div className="flex items-center gap-2 mb-3">
					<BadgeCheck className="h-5 w-5 text-orange-500" />
					<span className="font-medium">YC Founder?</span>
				</div>

				{ycStatus !== 'verified' && (
					<div className="flex gap-3 mb-3">
						<Button
							type="button"
							variant={ycStatus !== 'not_yc' ? 'primary' : 'outline'}
							size="sm"
							onClick={() => setYcStatus('idle')}
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
								className="text-primary hover:underline"
							>
								ycombinator.com/verify
							</Link>
						</p>

						<div className="flex gap-2">
							<div className="flex-1 relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-muted pointer-events-none">
									{YC_PREFIX}
								</span>
								<Input
									type="text"
									placeholder="your-code"
									value={ycInput}
									onChange={(e) => {
										setYcInput(e.target.value)
										setYcError('')
									}}
									onKeyDown={handleKeyDown}
									disabled={isVerifying}
									className="pl-[135px]"
								/>
							</div>
							<Button
								type="button"
								variant="primary"
								onClick={handleVerify}
								disabled={isVerifying || !ycInput.trim()}
								className="px-3 shrink-0"
								aria-label="Verify"
							>
								{isVerifying ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<ArrowRight className="h-4 w-4" />
								)}
							</Button>
						</div>

						{ycError && <p className="text-xs text-error">{ycError}</p>}
					</div>
				)}

				{ycStatus === 'verified' && ycData && (
					<div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg p-3">
						<div className="flex items-center gap-2 mb-1">
							<BadgeCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
							<span className="text-sm font-medium text-green-800 dark:text-green-300">
								Hola, {ycData.name}!
							</span>
						</div>
						<p className="text-xs text-green-700 dark:text-green-400">
							{ycData.company} · {ycData.batch}
						</p>
						<p className="text-xs text-green-600 dark:text-green-500 mt-2">
							Continue with <strong>{ycData.email}</strong> to get your YC badge
						</p>
					</div>
				)}
			</div>

			{showAuthOptions ? (
				<>
					<AuthOptions
						requiredEmail={ycData?.email}
						ycData={ycData ? { batch: ycData.batch, company: ycData.company } : undefined}
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
				<Link href="/login" className="text-primary hover:underline">
					Log in
				</Link>
			</p>
		</Card>
	)
}
