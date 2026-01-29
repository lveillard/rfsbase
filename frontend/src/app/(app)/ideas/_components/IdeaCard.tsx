'use client'

import { ArrowBigUp, Clock, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { Avatar, Badge, Button, Card } from '@/components/ui'
import {
	cn,
	formatNumber,
	formatRelativeTime,
	getCategoryById,
	parseId,
	truncate,
} from '@/lib/utils'
import type { IdeaCard as IdeaCardType } from '@/types'

interface IdeaCardProps {
	readonly idea: IdeaCardType
	readonly onVote?: (ideaId: string, type: 'problem' | 'solution') => void
}

function CategoryBadge({ categoryId }: { readonly categoryId: string }) {
	const category = getCategoryById(categoryId)
	if (!category) return null

	return (
		<>
			<span>·</span>
			<span className="flex items-center gap-1" style={{ color: category.color }}>
				<span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: category.color }} />
				{category.label}
			</span>
		</>
	)
}

function TagList({ tags }: { readonly tags: readonly string[] }) {
	if (tags.length === 0) return null

	const visibleTags = tags.slice(0, 3)
	const remainingCount = tags.length - 3

	return (
		<div className="flex flex-wrap gap-1.5 mb-4">
			{visibleTags.map((tag) => (
				<Badge key={tag} variant="secondary" size="sm">
					{tag}
				</Badge>
			))}
			{remainingCount > 0 && (
				<Badge variant="outline" size="sm">
					+{remainingCount}
				</Badge>
			)}
		</div>
	)
}

export function IdeaCard({ idea, onVote }: IdeaCardProps) {
	const ideaUrl = `/ideas/${parseId(idea.id)}`
	const isVoted = idea.userVote === 'problem'

	const handleVote = (e: React.MouseEvent) => {
		e.preventDefault()
		onVote?.(idea.id, 'problem')
	}

	return (
		<Card padding="none" hoverable className="group" data-testid="idea-card">
			<Link href={ideaUrl} className="block p-4 sm:p-6">
				<header className="flex items-start gap-3 mb-3">
					<Avatar
						src={idea.author.avatar}
						name={idea.author.name}
						size="md"
						verified={idea.author.verified}
						ycType={idea.author.ycType}
					/>
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2">
							<span className="font-medium text-sm truncate">{idea.author.name}</span>
							{idea.author.ycType && (
								<Badge variant="warning" size="sm">
									{idea.author.ycType === 'partner' ? 'YC Partner' : 'YC'}
								</Badge>
							)}
						</div>
						<div className="flex items-center gap-2 text-xs text-text-muted">
							<Clock className="h-3 w-3" />
							<span>{formatRelativeTime(idea.createdAt)}</span>
							<CategoryBadge categoryId={idea.category} />
						</div>
					</div>
				</header>

				<h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
					{idea.title}
				</h3>
				<p className="text-text-secondary text-sm mb-3 line-clamp-2">
					{truncate(idea.problem, 200)}
				</p>
				<TagList tags={idea.tags} />
			</Link>

			<footer className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-border bg-surface-alt/50">
				<div className="flex items-center gap-2">
					<Button
						variant={isVoted ? 'primary' : 'ghost'}
						size="sm"
						onClick={handleVote}
						leftIcon={<ArrowBigUp className={cn('h-4 w-4', isVoted && 'fill-current')} />}
					>
						{formatNumber(idea.votes.total)}
					</Button>
					<Link
						href={`${ideaUrl}#comments`}
						className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-text-secondary hover:text-text hover:bg-surface-alt transition-colors"
					>
						<MessageSquare className="h-4 w-4" />
						<span>{formatNumber(idea.commentCount)}</span>
					</Link>
				</div>
				<Link href={ideaUrl}>
					<Button variant="ghost" size="sm">
						View
					</Button>
				</Link>
			</footer>
		</Card>
	)
}
