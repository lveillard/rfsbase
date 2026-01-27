'use client'

import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'
import { Button, SkeletonCard } from '@/components/ui'
import { ideasApi } from '@/lib/api'
import type { IdeaCard as IdeaCardType, VoteType } from '@/types'
import { IdeaCard, IdeaFilters } from './_components'
import { useIdeas } from './_hooks'

type SortOption = 'hot' | 'new' | 'top' | 'discussed'
type TimeRange = 'day' | 'week' | 'month' | 'year' | 'all'

export default function IdeasPage() {
	const [sortBy, setSortBy] = useState<SortOption>('hot')
	const [timeRange, setTimeRange] = useState<TimeRange>('week')
	const [selectedCategory, setSelectedCategory] = useState<string>()
	const [selectedTags, setSelectedTags] = useState<string[]>([])

	// Build API params from filter state
	// Note: timeRange is managed for UI state but not yet used by API
	const apiParams = useMemo(
		() => ({
			sortBy,
			category: selectedCategory,
			tags: selectedTags.length > 0 ? selectedTags : undefined,
		}),
		[sortBy, selectedCategory, selectedTags],
	)

	const { ideas, isLoading, error, loadMore, pagination, refetch } = useIdeas(apiParams)

	const handleVote = useCallback(
		async (ideaId: string, type: VoteType) => {
			const response = await ideasApi.vote(ideaId, type)
			if (response.success) {
				await refetch()
			}
		},
		[refetch],
	)

	const hasIdeas = ideas.length > 0

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Ideas</h1>
					<p className="text-text-secondary mt-1">
						Discover problems worth solving and solutions worth building
					</p>
				</div>
				<Link href="/ideas/new">
					<Button leftIcon={<Plus className="h-4 w-4" />}>New Idea</Button>
				</Link>
			</div>

			<IdeaFilters
				sortBy={sortBy}
				onSortChange={setSortBy}
				timeRange={timeRange}
				onTimeRangeChange={setTimeRange}
				selectedCategory={selectedCategory}
				onCategoryChange={setSelectedCategory}
				selectedTags={selectedTags}
				onTagsChange={setSelectedTags}
			/>

			<div className="space-y-4">
				{isLoading && ideas.length === 0 ? (
					Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
				) : error ? (
					<div className="text-center py-12">
						<p className="text-error mb-4">{error}</p>
						<Button onClick={refetch}>Try Again</Button>
					</div>
				) : !hasIdeas ? (
					<div className="text-center py-12">
						<p className="text-text-secondary mb-4">No ideas found</p>
						<Link href="/ideas/new">
							<Button>Share the first idea</Button>
						</Link>
					</div>
				) : (
					ideas.map((idea) => (
						<IdeaCard key={idea.id} idea={idea as unknown as IdeaCardType} onVote={handleVote} />
					))
				)}
			</div>

			{hasIdeas && pagination?.hasNext && (
				<div className="text-center pt-4">
					<Button variant="outline" onClick={loadMore} isLoading={isLoading}>
						Load More
					</Button>
				</div>
			)}
		</div>
	)
}
