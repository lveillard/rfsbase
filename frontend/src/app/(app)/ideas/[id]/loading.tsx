import { Card } from '@/components/ui'

export default function IdeaDetailLoading() {
	return (
		<div className="max-w-4xl mx-auto">
			<div className="h-4 w-32 bg-surface-alt rounded animate-pulse mb-6" />

			<div className="grid lg:grid-cols-[1fr,280px] gap-6">
				<div className="space-y-6">
					<Card padding="lg">
						<div className="flex items-center gap-3 mb-4">
							<div className="h-12 w-12 rounded-full bg-surface-alt animate-pulse" />
							<div className="space-y-2">
								<div className="h-4 w-32 bg-surface-alt rounded animate-pulse" />
								<div className="h-3 w-48 bg-surface-alt rounded animate-pulse" />
							</div>
						</div>
						<div className="h-8 w-3/4 bg-surface-alt rounded animate-pulse mb-4" />
						<div className="flex gap-2 mb-4">
							{[1, 2, 3].map((i) => (
								<div key={i} className="h-6 w-16 bg-surface-alt rounded-full animate-pulse" />
							))}
						</div>
					</Card>

					<Card padding="lg">
						<div className="h-6 w-32 bg-surface-alt rounded animate-pulse mb-4" />
						<div className="space-y-3">
							{[1, 2, 3, 4].map((i) => (
								<div
									key={i}
									className="h-4 bg-surface-alt rounded animate-pulse"
									style={{ width: `${90 - i * 5}%` }}
								/>
							))}
						</div>
					</Card>
				</div>

				<div className="space-y-6">
					<Card padding="md">
						<div className="h-5 w-24 bg-surface-alt rounded animate-pulse mb-4" />
						<div className="space-y-3">
							{[1, 2].map((i) => (
								<div key={i} className="h-16 bg-surface-alt rounded-xl animate-pulse" />
							))}
						</div>
						<div className="mt-4 pt-4 border-t border-border text-center">
							<div className="h-8 w-16 bg-surface-alt rounded animate-pulse mx-auto mb-1" />
							<div className="h-3 w-20 bg-surface-alt rounded animate-pulse mx-auto" />
						</div>
					</Card>
				</div>
			</div>
		</div>
	)
}
