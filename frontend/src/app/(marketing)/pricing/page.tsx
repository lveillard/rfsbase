import appConfig from '@config/app.config.json'
import { Check, Sparkles } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Badge, Button, Card } from '@/components/ui'

export const metadata: Metadata = {
	title: `Pricing | ${appConfig.name}`,
	description: `${appConfig.name} pricing plans - Free for founders`,
}

const FREE_FEATURES = [
	'Unlimited idea submissions',
	'Vote on ideas',
	'Comment and discuss',
	'AI-powered similar idea detection',
	'Follow other founders',
	'Email notifications',
	'Full search and filtering',
	'Profile customization',
] as const

const PRO_FEATURES = [
	'Everything in Free',
	'YC Founder verification badge',
	'Priority in search results',
	'Advanced analytics',
	'Export data',
	'API access',
	'Priority support',
	'Early access to new features',
] as const

export default function PricingPage() {
	return (
		<div className="py-16 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl sm:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
					<p className="text-xl text-text-secondary max-w-2xl mx-auto">
						Start free and stay free. We believe great startup ideas shouldn&apos;t be gated by
						pricing tiers.
					</p>
				</div>

				{/* Pricing Cards */}
				<div className="grid md:grid-cols-2 gap-8 mb-16">
					{/* Free Plan */}
					<Card padding="lg" className="relative">
						<div className="mb-6">
							<h2 className="text-xl font-bold mb-2">Free</h2>
							<p className="text-text-secondary">Perfect for founders exploring ideas</p>
						</div>

						<div className="mb-6">
							<span className="text-4xl font-bold">$0</span>
							<span className="text-text-muted">/month</span>
						</div>

						<Link
							href="/signup"
							className="flex items-center justify-center w-full h-10 px-4 mb-6 rounded-lg border border-border bg-transparent text-text font-medium hover:bg-surface-alt transition-colors"
						>
							Get Started Free
						</Link>

						<ul className="space-y-3">
							{FREE_FEATURES.map((feature) => (
								<li key={feature} className="flex items-start gap-3">
									<Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
									<span className="text-text-secondary">{feature}</span>
								</li>
							))}
						</ul>
					</Card>

					{/* Pro Plan */}
					<Card padding="lg" className="relative border-primary bg-primary-muted/10">
						<Badge variant="primary" className="absolute -top-3 left-1/2 -translate-x-1/2">
							<Sparkles className="h-3 w-3 mr-1" />
							Coming Soon
						</Badge>

						<div className="mb-6">
							<h2 className="text-xl font-bold mb-2">Pro</h2>
							<p className="text-text-secondary">For verified YC founders and power users</p>
						</div>

						<div className="mb-6">
							<span className="text-4xl font-bold">$19</span>
							<span className="text-text-muted">/month</span>
						</div>

						<Button variant="primary" className="w-full mb-6" disabled>
							Join Waitlist
						</Button>

						<ul className="space-y-3">
							{PRO_FEATURES.map((feature) => (
								<li key={feature} className="flex items-start gap-3">
									<Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
									<span className="text-text-secondary">{feature}</span>
								</li>
							))}
						</ul>
					</Card>
				</div>

				{/* FAQ */}
				<section>
					<h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>

					<div className="space-y-6">
						<Card padding="md">
							<h3 className="font-semibold mb-2">Will the Free plan always be free?</h3>
							<p className="text-text-secondary">
								Yes! We&apos;re committed to keeping our core features free forever. We believe in
								democratizing access to startup ideation.
							</p>
						</Card>

						<Card padding="md">
							<h3 className="font-semibold mb-2">What&apos;s the YC verification badge?</h3>
							<p className="text-text-secondary">
								If you&apos;re a current or former Y Combinator founder, you can verify your status
								to get a special badge that adds credibility to your ideas and comments.
							</p>
						</Card>

						<Card padding="md">
							<h3 className="font-semibold mb-2">Can I export my data?</h3>
							<p className="text-text-secondary">
								Your ideas and data belong to you. Currently, you can view all your content on your
								profile. Full export functionality is coming with the Pro plan.
							</p>
						</Card>

						<Card padding="md">
							<h3 className="font-semibold mb-2">Do you offer team plans?</h3>
							<p className="text-text-secondary">
								Not yet, but we&apos;re exploring team features for startups that want to
								collaborate on idea validation. Let us know if you&apos;re interested!
							</p>
						</Card>
					</div>
				</section>
			</div>
		</div>
	)
}
