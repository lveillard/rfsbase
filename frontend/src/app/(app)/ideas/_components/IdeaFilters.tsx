'use client'

import categoriesConfig from '@config/categories.config.json'
import { ChevronDown, Filter, X } from 'lucide-react'
import posthog from 'posthog-js'
import { useState } from 'react'
import { Badge, Button } from '@/components/ui'
import { cn } from '@/lib/utils'

type SortOption = 'hot' | 'new' | 'top' | 'discussed'
type TimeRange = 'day' | 'week' | 'month' | 'year' | 'all'

interface IdeaFiltersProps {
	sortBy: SortOption
	onSortChange: (sort: SortOption) => void
	timeRange: TimeRange
	onTimeRangeChange: (range: TimeRange) => void
	selectedCategory?: string
	onCategoryChange: (category: string | undefined) => void
	selectedTags: string[]
	onTagsChange: (tags: string[]) => void
}

const SORT_OPTIONS: ReadonlyArray<{ value: SortOption; label: string }> = [
	{ value: 'hot', label: 'Hot' },
	{ value: 'new', label: 'New' },
	{ value: 'top', label: 'Top' },
	{ value: 'discussed', label: 'Most Discussed' },
]

const TIME_RANGE_OPTIONS: ReadonlyArray<{ value: TimeRange; label: string }> = [
	{ value: 'day', label: 'Today' },
	{ value: 'week', label: 'This Week' },
	{ value: 'month', label: 'This Month' },
	{ value: 'year', label: 'This Year' },
	{ value: 'all', label: 'All Time' },
]

const pillButtonClass = (isActive: boolean) =>
	cn(
		'px-3 py-1.5 rounded-full text-sm transition-colors',
		isActive ? 'bg-primary text-white' : 'bg-surface-alt text-text-secondary hover:text-text',
	)

function SortTabs({
	sortBy,
	onSortChange,
}: {
	sortBy: SortOption
	onSortChange: (sort: SortOption) => void
}) {
	return (
		<div className="flex items-center gap-1 p-1 bg-surface-alt rounded-lg">
			{SORT_OPTIONS.map(({ value, label }) => (
				<button
					type="button"
					key={value}
					onClick={() => onSortChange(value)}
					className={cn(
						'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
						sortBy === value
							? 'bg-surface text-text shadow-sm'
							: 'text-text-secondary hover:text-text',
					)}
				>
					{label}
				</button>
			))}
		</div>
	)
}

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div>
			<span className="block text-sm font-medium mb-2">{label}</span>
			<div className="flex flex-wrap gap-2">{children}</div>
		</div>
	)
}

export function IdeaFilters({
	sortBy,
	onSortChange,
	timeRange,
	onTimeRangeChange,
	selectedCategory,
	onCategoryChange,
	selectedTags,
	onTagsChange,
}: IdeaFiltersProps) {
	const [showFilters, setShowFilters] = useState(false)

	const activeFiltersCount = (selectedCategory ? 1 : 0) + selectedTags.length

	const toggleFilters = () => setShowFilters((prev) => !prev)

	const clearFilters = () => {
		onCategoryChange(undefined)
		onTagsChange([])
	}

	const handleCategoryClick = (categoryId: string) => {
		const newCategory = selectedCategory === categoryId ? undefined : categoryId
		onCategoryChange(newCategory)
		posthog.capture('ideas_filtered', {
			filter_type: 'category',
			category: newCategory,
			sort_by: sortBy,
		})
	}

	const handleTagClick = (tag: string) => {
		const newTags = selectedTags.includes(tag)
			? selectedTags.filter((t) => t !== tag)
			: [...selectedTags, tag]
		onTagsChange(newTags)
		posthog.capture('ideas_filtered', {
			filter_type: 'tag',
			tag,
			tags_count: newTags.length,
			sort_by: sortBy,
		})
	}

	const handleSortChange = (sort: SortOption) => {
		onSortChange(sort)
		posthog.capture('ideas_filtered', {
			filter_type: 'sort',
			sort_by: sort,
			category: selectedCategory,
			tags_count: selectedTags.length,
		})
	}

	const handleTimeRangeChange = (range: TimeRange) => {
		onTimeRangeChange(range)
		posthog.capture('ideas_filtered', {
			filter_type: 'time_range',
			time_range: range,
			sort_by: sortBy,
		})
	}

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<SortTabs sortBy={sortBy} onSortChange={handleSortChange} />

				<Button
					variant={showFilters ? 'secondary' : 'outline'}
					size="sm"
					onClick={toggleFilters}
					leftIcon={<Filter className="h-4 w-4" />}
					rightIcon={
						activeFiltersCount > 0 ? (
							<Badge variant="primary" size="sm">
								{activeFiltersCount}
							</Badge>
						) : (
							<ChevronDown
								className={cn('h-4 w-4 transition-transform', showFilters && 'rotate-180')}
							/>
						)
					}
				>
					Filters
				</Button>
			</div>

			{showFilters && (
				<div className="p-4 bg-surface border border-border rounded-xl space-y-4 animate-in">
					{sortBy === 'top' && (
						<FilterSection label="Time Range">
							{TIME_RANGE_OPTIONS.map(({ value, label }) => (
								<button
									type="button"
									key={value}
									onClick={() => handleTimeRangeChange(value)}
									className={pillButtonClass(timeRange === value)}
								>
									{label}
								</button>
							))}
						</FilterSection>
					)}

					<FilterSection label="Category">
						{categoriesConfig.categories.map((category) => (
							<button
								type="button"
								key={category.id}
								onClick={() => handleCategoryClick(category.id)}
								className={cn(
									'inline-flex items-center gap-1.5',
									pillButtonClass(selectedCategory === category.id),
								)}
							>
								<span
									className="h-2 w-2 rounded-full"
									style={{ backgroundColor: category.color }}
								/>
								{category.label}
							</button>
						))}
					</FilterSection>

					<FilterSection label="Popular Tags">
						{categoriesConfig.popularTags.map((tag) => (
							<button
								type="button"
								key={tag}
								onClick={() => handleTagClick(tag)}
								className={pillButtonClass(selectedTags.includes(tag))}
							>
								{tag}
							</button>
						))}
					</FilterSection>

					{activeFiltersCount > 0 && (
						<div className="pt-2 border-t border-border">
							<Button variant="ghost" size="sm" onClick={clearFilters}>
								<X className="h-4 w-4 mr-1" />
								Clear all filters
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	)
}
