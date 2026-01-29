'use client'

import { ArrowBigUp, Clock, Lightbulb, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Card, Skeleton } from '@/components/ui'
import { getUserIdeas } from '@/lib/actions'
import { formatNumber, formatRelativeTime, getCategoryById, parseId } from '@/lib/utils'
import type { IdeaSummary } from '../../_types'

interface UserIdeasProps {
	readonly userId: string
}

function IdeaListItem({ idea }: { idea: IdeaSummary }) {
	const category = getCategoryById(idea.category)

	return (
		<Link
			href={`/ideas/${parseId(idea.id)}`}
			className="block p-4 hover:bg-surface-alt/50 transition-colors"
		>
			<div className="flex items-start justify-between gap-4">
				<div className="flex-1 min-w-0">
					<h3 className="font-medium text-base mb-1 hover:text-primary transition-colors line-clamp-1">
						{idea.title}
					</h3>
					<p className="text-sm text-text-secondary line-clamp-2 mb-2">{idea.problem}</p>
					<div className="flex items-center gap-3 text-xs text-text-muted">
						<span className="flex items-center gap-1">
							<Clock className="h-3 w-3" /> {formatRelativeTime(idea.createdAt)}
						</span>
						{category && (
							<span className="flex items-center gap-1" style={{ color: category.color }}>
								<span
									className="h-1.5 w-1.5 rounded-full"
									style={{ backgroundColor: category.color }}
								/>
								{category.label}
							</span>
						)}
					</div>
				</div>

				<div className="flex flex-col items-end gap-2 shrink-0">
					<div className="flex items-center gap-3 text-sm text-text-secondary">
						<span className="flex items-center gap-1">
							<ArrowBigUp className="h-4 w-4" /> {formatNumber(idea.votesTotal)}
						</span>
						<span className="flex items-center gap-1">
							<MessageSquare className="h-4 w-4" /> {formatNumber(idea.commentCount)}
						</span>
					</div>
				</div>
			</div>
		</Link>
	)
}

function IdeaListSkeleton() {
	return (
		<div className="p-4">
			<Skeleton className="h-5 w-3/4 mb-2" />
			<Skeleton className="h-4 w-full mb-1" />
			<Skeleton className="h-4 w-2/3 mb-3" />
			<div className="flex gap-3">
				<Skeleton className="h-3 w-20" />
				<Skeleton className="h-3 w-16" />
			</div>
		</div>
	)
}

export function UserIdeas({ userId }: UserIdeasProps) {
	const [ideas, setIdeas] = useState<IdeaSummary[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchIdeas = async () => {
			try {
				const userIdeas = await getUserIdeas(userId)
				setIdeas(userIdeas as IdeaSummary[])
			} catch (err) {
				setError('Failed to load ideas')
				console.error('Failed to fetch user ideas:', err)
			} finally {
				setIsLoading(false)
			}
		}
		fetchIdeas()
	}, [userId])

	return (
		<Card padding="none">
			<div className="px-4 py-3 border-b border-border">
				<h2 className="font-semibold flex items-center gap-2">
					<Lightbulb className="h-5 w-5 text-primary" /> Ideas
				</h2>
			</div>

			{isLoading && (
				<div className="divide-y divide-border">
					<IdeaListSkeleton />
					<IdeaListSkeleton />
					<IdeaListSkeleton />
				</div>
			)}

			{error && <div className="p-8 text-center text-text-muted">{error}</div>}

			{!isLoading && !error && ideas.length === 0 && (
				<div className="p-8 text-center text-text-muted">
					<Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-50" />
					<p>No ideas yet</p>
				</div>
			)}

			{!isLoading && !error && ideas.length > 0 && (
				<div className="divide-y divide-border">
					{ideas.map((idea) => (
						<IdeaListItem key={idea.id} idea={idea} />
					))}
				</div>
			)}
		</Card>
	)
}
