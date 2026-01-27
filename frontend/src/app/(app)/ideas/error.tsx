'use client'

import { AlertTriangle, RefreshCw } from 'lucide-react'
import { useEffect } from 'react'
import { Button, Card } from '@/components/ui'

interface ErrorProps {
	error: Error & { digest?: string }
	reset: () => void
}

export default function IdeasError({ error, reset }: ErrorProps) {
	useEffect(() => {
		console.error('Ideas error:', error)
	}, [error])

	return (
		<div className="flex items-center justify-center min-h-[400px]">
			<Card padding="lg" className="text-center max-w-md">
				<div className="flex items-center justify-center h-12 w-12 rounded-full bg-error-muted text-error mx-auto mb-4">
					<AlertTriangle className="h-6 w-6" />
				</div>
				<h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
				<p className="text-text-secondary mb-6">
					We couldn&apos;t load the ideas. Please try again.
				</p>
				<Button onClick={reset} leftIcon={<RefreshCw className="h-4 w-4" />}>
					Try Again
				</Button>
			</Card>
		</div>
	)
}
