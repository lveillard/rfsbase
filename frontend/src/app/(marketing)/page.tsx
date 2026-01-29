import appConfig from '@config/app.config.json'
import categoriesConfig from '@config/categories.config.json'
import {
	ArrowRight,
	Globe,
	MessageSquare,
	Search,
	Shield,
	Sparkles,
	ThumbsUp,
	Zap,
} from 'lucide-react'
import Link from 'next/link'
import { Badge, Button, Card } from '@/components/ui'

const features = [
	{
		icon: Sparkles,
		title: 'AI-Powered Similarity',
		description:
			'Our AI detects similar ideas as you type, preventing duplicates and encouraging collaboration.',
	},
	{
		icon: ThumbsUp,
		title: 'Community Voting',
		description:
			"Vote on problems you face and solutions you'd use. Surface the most impactful ideas.",
	},
	{
		icon: MessageSquare,
		title: 'Threaded Discussions',
		description:
			'Engage in meaningful conversations. Refine ideas together with comments and replies.',
	},
	{
		icon: Search,
		title: 'Semantic Search',
		description: 'Find ideas by meaning, not just keywords. Natural language search powered by AI.',
	},
	{
		icon: Shield,
		title: 'YC Verification',
		description: 'Verified badges for YC founders and partners. Trust the source of each idea.',
	},
	{
		icon: Globe,
		title: 'Open Platform',
		description: 'Anyone can contribute. The best ideas come from unexpected places.',
	},
]

const stats = [
	{ value: '1,000+', label: 'Ideas Shared' },
	{ value: '5,000+', label: 'Founders' },
	{ value: '50,000+', label: 'Votes Cast' },
]

export default function HomePage() {
	return (
		<div className="flex flex-col">
			{/* Hero Section */}
			<section className="relative overflow-hidden">
				{/* Background gradient */}
				<div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

				<div className="container-wide py-20 md:py-32">
					<div className="max-w-3xl mx-auto text-center">
						<Badge variant="default" className="mb-4">
							<Sparkles className="h-3 w-3 mr-1" />
							Now in Public Beta
						</Badge>

						<h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance mb-6">
							Where Startup Ideas <span className="text-accent">Come to Life</span>
						</h1>

						<p className="text-lg md:text-xl text-text-secondary mb-8 text-balance">
							{appConfig.description} Join thousands of founders sharing problems worth solving.
						</p>

						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link href="/signup">
								<Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
									Get Started Free
								</Button>
							</Link>
							<Link href="/ideas">
								<Button variant="outline" size="lg">
									Browse Ideas
								</Button>
							</Link>
						</div>

						{/* Stats */}
						<div className="flex justify-center gap-8 md:gap-16 mt-12 pt-8 border-t border-border">
							{stats.map((stat) => (
								<div key={stat.label} className="text-center">
									<div className="text-2xl md:text-3xl font-bold text-text">{stat.value}</div>
									<div className="text-sm text-text-muted">{stat.label}</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* How It Works */}
			<section className="py-20 bg-surface-alt">
				<div className="container-wide">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
						<p className="text-text-secondary max-w-2xl mx-auto">
							RFSbase is your launchpad for startup ideas. Share problems, propose solutions, and
							let the community validate your thinking.
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						<div className="text-center">
							<div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-accent text-white text-xl font-bold mb-4">
								1
							</div>
							<h3 className="text-lg font-semibold mb-2">Share a Problem</h3>
							<p className="text-text-secondary">
								Describe a problem you or others face. Be specific about who has it and why it
								matters.
							</p>
						</div>

						<div className="text-center">
							<div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-accent text-white text-xl font-bold mb-4">
								2
							</div>
							<h3 className="text-lg font-semibold mb-2">Community Validates</h3>
							<p className="text-text-secondary">
								Others vote if they face the same problem. Comments refine the idea and suggest
								solutions.
							</p>
						</div>

						<div className="text-center">
							<div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-accent text-white text-xl font-bold mb-4">
								3
							</div>
							<h3 className="text-lg font-semibold mb-2">Build What Matters</h3>
							<p className="text-text-secondary">
								Top-voted ideas surface. Find co-founders, get feedback, and build products people
								actually want.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Features Grid */}
			<section className="py-20">
				<div className="container-wide">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
						<p className="text-text-secondary max-w-2xl mx-auto">
							Built for founders, by founders. Every feature designed to help you find and validate
							startup ideas faster.
						</p>
					</div>

					<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{features.map((feature) => (
							<Card key={feature.title} padding="lg" hoverable>
								<div className="flex items-center gap-3 mb-3">
									<div className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent-muted text-accent">
										<feature.icon className="h-5 w-5" />
									</div>
									<h3 className="font-semibold">{feature.title}</h3>
								</div>
								<p className="text-text-secondary text-sm">{feature.description}</p>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Categories */}
			<section className="py-20 bg-surface-alt">
				<div className="container-wide">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">Explore by Category</h2>
						<p className="text-text-secondary max-w-2xl mx-auto">
							Find ideas in your area of expertise or discover opportunities in new markets.
						</p>
					</div>

					<div className="flex flex-wrap justify-center gap-3">
						{categoriesConfig.categories.map((category) => (
							<Link
								key={category.id}
								href={`/ideas?category=${category.id}`}
								className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border hover:border-border-hover hover:shadow-sm transition-all"
							>
								<span
									className="h-2 w-2 rounded-full"
									style={{ backgroundColor: category.color }}
								/>
								<span className="text-sm font-medium">{category.label}</span>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20">
				<div className="container-wide">
					<Card
						variant="elevated"
						padding="lg"
						className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20"
					>
						<div className="text-center max-w-2xl mx-auto">
							<div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-accent text-white mb-4">
								<Zap className="h-6 w-6" />
							</div>
							<h2 className="text-2xl md:text-3xl font-bold mb-4">
								Ready to Find Your Next Big Idea?
							</h2>
							<p className="text-text-secondary mb-6">
								Join thousands of founders already using RFSbase to discover and validate startup
								ideas. It&apos;s free to get started.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Link href="/signup">
									<Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
										Create Free Account
									</Button>
								</Link>
								<Link href="/about">
									<Button variant="outline" size="lg">
										Learn More
									</Button>
								</Link>
							</div>
						</div>
					</Card>
				</div>
			</section>
		</div>
	)
}
