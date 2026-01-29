import { Card, Skeleton } from '@/components/ui'

export default function ProfileLoading() {
	return (
		<div className="max-w-4xl mx-auto space-y-6">
			{/* Profile Header Skeleton */}
			<Card padding="lg">
				<div className="flex flex-col sm:flex-row gap-6">
					<Skeleton className="h-16 w-16 rounded-full shrink-0" />
					<div className="flex-1">
						<Skeleton className="h-8 w-48 mb-2" />
						<Skeleton className="h-4 w-64 mb-4" />
						<Skeleton className="h-4 w-32" />
					</div>
				</div>
			</Card>

			{/* Stats Skeleton */}
			<Card padding="none">
				<div className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-border">
					{[...Array(5)].map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: skeleton order is static
						<div key={`stat-${i}`} className="flex flex-col items-center gap-2 p-4">
							<Skeleton className="h-8 w-16" />
							<Skeleton className="h-4 w-20" />
						</div>
					))}
				</div>
			</Card>

			{/* Ideas Skeleton */}
			<Card padding="none">
				<div className="px-4 py-3 border-b border-border">
					<Skeleton className="h-5 w-20" />
				</div>
				<div className="divide-y divide-border">
					{[...Array(3)].map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: skeleton order is static
						<div key={`idea-${i}`} className="p-4">
							<Skeleton className="h-5 w-3/4 mb-2" />
							<Skeleton className="h-4 w-full mb-1" />
							<Skeleton className="h-4 w-2/3 mb-3" />
							<div className="flex gap-3">
								<Skeleton className="h-3 w-20" />
								<Skeleton className="h-3 w-16" />
							</div>
						</div>
					))}
				</div>
			</Card>
		</div>
	)
}
