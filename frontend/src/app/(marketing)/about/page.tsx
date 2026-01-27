import appConfig from '@config/app.config.json'
import { Heart, Lightbulb, Rocket, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Card } from '@/components/ui'

export const metadata: Metadata = {
	title: `About | ${appConfig.name}`,
	description: `Learn about ${appConfig.name} - ${appConfig.description}`,
}

const VALUES = [
	{
		icon: Lightbulb,
		title: 'Innovation First',
		description:
			'We believe the best startup ideas come from identifying real problems. Our platform helps surface the challenges that matter most.',
	},
	{
		icon: Users,
		title: 'Community Driven',
		description:
			'Great ideas emerge from collaboration. We bring together founders, builders, and domain experts to validate and refine concepts.',
	},
	{
		icon: Rocket,
		title: 'Action Oriented',
		description:
			"We're not just about talking - we're about building. Our goal is to help you move from idea to execution as quickly as possible.",
	},
	{
		icon: Heart,
		title: 'Founder Friendly',
		description:
			'Built by founders, for founders. We understand the challenges you face and design our platform with your success in mind.',
	},
] as const

function ValueCard({ icon: Icon, title, description }: (typeof VALUES)[number]) {
	return (
		<Card padding="lg" className="text-center">
			<div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary-muted text-primary mb-4">
				<Icon className="h-6 w-6" />
			</div>
			<h3 className="font-semibold text-lg mb-2">{title}</h3>
			<p className="text-text-secondary">{description}</p>
		</Card>
	)
}

export default function AboutPage() {
	return (
		<div className="py-16 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				{/* Hero */}
				<div className="text-center mb-16">
					<h1 className="text-4xl sm:text-5xl font-bold mb-6">About {appConfig.name}</h1>
					<p className="text-xl text-text-secondary max-w-2xl mx-auto">
						{appConfig.description}. Inspired by Y Combinator&apos;s Request for Startups, we help
						founders discover problems worth solving.
					</p>
				</div>

				{/* Mission */}
				<section className="mb-16">
					<Card padding="lg" className="bg-primary-muted/30 border-primary/20">
						<h2 className="text-2xl font-bold mb-4 text-center">Our Mission</h2>
						<p className="text-lg text-text-secondary text-center max-w-2xl mx-auto">
							To democratize startup ideation by creating a living platform where real problems meet
							innovative solutions. We believe that the next billion-dollar company could be born
							from a problem shared on our platform today.
						</p>
					</Card>
				</section>

				{/* Values */}
				<section className="mb-16">
					<h2 className="text-2xl font-bold mb-8 text-center">Our Values</h2>
					<div className="grid sm:grid-cols-2 gap-6">
						{VALUES.map((value) => (
							<ValueCard key={value.title} {...value} />
						))}
					</div>
				</section>

				{/* How It Works */}
				<section className="mb-16">
					<h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
					<div className="space-y-6">
						<div className="flex gap-4">
							<div className="shrink-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
								1
							</div>
							<div>
								<h3 className="font-semibold mb-1">Share Your Problem</h3>
								<p className="text-text-secondary">
									Describe a real problem you&apos;ve encountered. Be specific about who experiences
									it and why it matters.
								</p>
							</div>
						</div>
						<div className="flex gap-4">
							<div className="shrink-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
								2
							</div>
							<div>
								<h3 className="font-semibold mb-1">Get Community Feedback</h3>
								<p className="text-text-secondary">
									Other founders vote and comment on your idea. This helps validate the problem and
									refine potential solutions.
								</p>
							</div>
						</div>
						<div className="flex gap-4">
							<div className="shrink-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
								3
							</div>
							<div>
								<h3 className="font-semibold mb-1">Build What Matters</h3>
								<p className="text-text-secondary">
									Use the validation and feedback to decide what to build next. Connect with others
									who share your vision.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* CTA */}
				<section className="text-center">
					<h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
					<p className="text-text-secondary mb-6">
						Join thousands of founders sharing and validating startup ideas.
					</p>
					<div className="flex gap-4 justify-center">
						<Link
							href="/signup"
							className="inline-flex items-center justify-center h-12 px-6 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors"
						>
							Create Account
						</Link>
						<Link
							href="/ideas"
							className="inline-flex items-center justify-center h-12 px-6 rounded-lg border border-border bg-transparent text-text font-medium hover:bg-surface-alt transition-colors"
						>
							Browse Ideas
						</Link>
					</div>
				</section>
			</div>
		</div>
	)
}
