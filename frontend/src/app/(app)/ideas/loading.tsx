import { SkeletonCard } from '@/components/ui'

export default function IdeasLoading() {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<div className="h-8 w-24 bg-surface-alt rounded animate-pulse" />
					<div className="h-4 w-64 bg-surface-alt rounded animate-pulse mt-2" />
				</div>
				<div className="h-10 w-28 bg-surface-alt rounded-lg animate-pulse" />
			</div>

			<div className="h-12 bg-surface-alt rounded-lg animate-pulse" />

			<div className="space-y-4">
				{Array.from({ length: 3 }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: skeleton order is static
					<SkeletonCard key={`skeleton-${i}`} />
				))}
			</div>
		</div>
	)
}
