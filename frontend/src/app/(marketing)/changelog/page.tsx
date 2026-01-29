import appConfig from '@config/app.config.json'
import { Bug, Rocket, Sparkles, Wrench } from 'lucide-react'
import type { Metadata } from 'next'
import { Badge, Card } from '@/components/ui'

export const metadata: Metadata = {
	title: `Changelog | ${appConfig.name}`,
	description: `See what's new in ${appConfig.name}`,
}

type ChangeType = 'feature' | 'improvement' | 'fix' | 'breaking'

interface Change {
	type: ChangeType
	description: string
}

interface Release {
	version: string
	date: string
	title: string
	changes: Change[]
}

const CHANGE_ICONS: Record<ChangeType, React.ReactNode> = {
	feature: <Sparkles className="h-4 w-4" />,
	improvement: <Rocket className="h-4 w-4" />,
	fix: <Bug className="h-4 w-4" />,
	breaking: <Wrench className="h-4 w-4" />,
}

const CHANGE_BADGES: Record<
	ChangeType,
	{ variant: 'primary' | 'success' | 'warning' | 'error'; label: string }
> = {
	feature: { variant: 'primary', label: 'New' },
	improvement: { variant: 'success', label: 'Improved' },
	fix: { variant: 'warning', label: 'Fixed' },
	breaking: { variant: 'error', label: 'Breaking' },
}

const RELEASES: Release[] = [
	{
		version: '1.0.0',
		date: 'January 2025',
		title: 'Initial Launch',
		changes: [
			{ type: 'feature', description: 'Share and discover startup ideas' },
			{ type: 'feature', description: 'Vote on problems and solutions' },
			{
				type: 'feature',
				description: 'Comment and discuss ideas with the community',
			},
			{ type: 'feature', description: 'AI-powered similar idea detection' },
			{ type: 'feature', description: 'User profiles and follow system' },
			{ type: 'feature', description: 'Dark and light theme support' },
			{ type: 'feature', description: 'Magic link authentication' },
			{ type: 'feature', description: 'Google and GitHub OAuth' },
			{ type: 'feature', description: 'Category and tag filtering' },
			{ type: 'feature', description: 'Vector search for semantic similarity' },
		],
	},
]

function ChangeItem({ change }: { change: Change }) {
	const badge = CHANGE_BADGES[change.type]

	return (
		<li className="flex items-start gap-3 py-2">
			<Badge variant={badge.variant} size="sm" className="shrink-0 mt-0.5">
				{CHANGE_ICONS[change.type]}
				<span className="ml-1">{badge.label}</span>
			</Badge>
			<span className="text-text-secondary">{change.description}</span>
		</li>
	)
}

function ReleaseCard({ release }: { release: Release }) {
	return (
		<Card padding="lg" className="mb-8">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 pb-4 border-b border-border">
				<div>
					<h2 className="text-xl font-bold">{release.title}</h2>
					<p className="text-text-muted text-sm">Version {release.version}</p>
				</div>
				<Badge variant="outline" size="md">
					{release.date}
				</Badge>
			</div>

			<ul className="space-y-1">
				{release.changes.map((change, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: changelog order is static
					<ChangeItem key={`change-${index}`} change={change} />
				))}
			</ul>
		</Card>
	)
}

export default function ChangelogPage() {
	return (
		<div className="py-16 px-4 sm:px-6 lg:px-8">
			<div className="max-w-3xl mx-auto">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl sm:text-5xl font-bold mb-4">Changelog</h1>
					<p className="text-xl text-text-secondary">
						Stay up to date with the latest features and improvements
					</p>
				</div>

				{/* Subscribe Banner */}
				<Card padding="md" className="mb-8 bg-primary-muted/30 border-primary/20">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<h3 className="font-semibold">Stay in the loop</h3>
							<p className="text-sm text-text-secondary">Get notified when we ship new features</p>
						</div>
						<a
							href={`https://twitter.com/${appConfig.social.twitter.replace('@', '')}`}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
						>
							Follow on X
						</a>
					</div>
				</Card>

				{/* Releases */}
				{RELEASES.map((release) => (
					<ReleaseCard key={release.version} release={release} />
				))}

				{/* Footer */}
				<div className="text-center text-text-muted">
					<p>
						Have a feature request?{' '}
						<a
							href={`https://github.com/${appConfig.social.github}`}
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary hover:underline"
						>
							Let us know on GitHub
						</a>
					</p>
				</div>
			</div>
		</div>
	)
}
