import Link from 'next/link'
import { Card } from '@/components/ui'
import { AuthOptions } from '../../_components/AuthOptions'

export function LoginForm() {
	return (
		<Card padding="lg">
			<h1 className="text-2xl font-bold mb-1">Log in</h1>
			<p className="text-text-secondary mb-6">Welcome back</p>

			<AuthOptions />

			<p className="text-center text-sm text-text-secondary mt-6">
				New here?{' '}
				<Link href="/signup" className="text-primary hover:underline">
					Create an account
				</Link>
			</p>
		</Card>
	)
}
