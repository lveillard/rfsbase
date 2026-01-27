import { Check, Mail } from 'lucide-react'
import { Button, Card } from '@/components/ui'

interface EmailSentCardProps {
	email: string
	variant: 'magic-link' | 'verification'
	onReset: () => void
}

const config = {
	'magic-link': {
		icon: Mail,
		title: 'Check your email',
		description: 'We sent a magic link to',
		hint: 'Click the link in the email to sign in. The link expires in 15 minutes.',
		buttonText: 'Use a different email',
	},
	verification: {
		icon: Check,
		title: 'Account created!',
		description: 'We sent a verification link to',
		hint: 'Click the link in the email to verify your account and get started.',
		buttonText: 'Use a different email',
	},
} as const

export function EmailSentCard({ email, variant, onReset }: EmailSentCardProps) {
	const { icon: Icon, title, description, hint, buttonText } = config[variant]

	return (
		<Card padding="lg" className="text-center">
			<div className="flex items-center justify-center h-12 w-12 rounded-full bg-success-muted text-success mx-auto mb-4">
				<Icon className="h-6 w-6" />
			</div>
			<h1 className="text-xl font-semibold mb-2">{title}</h1>
			<p className="text-text-secondary mb-4">
				{description} <strong>{email}</strong>
			</p>
			<p className="text-sm text-text-muted mb-6">{hint}</p>
			<Button variant="ghost" onClick={onReset}>
				{buttonText}
			</Button>
		</Card>
	)
}
