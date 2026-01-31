'use client'

import { Check, ThumbsUp } from 'lucide-react'
import posthog from 'posthog-js'
import { Card } from '@/components/ui'
import { cn, formatNumber } from '@/lib/utils'
import type { VoteCounts, VoteType } from '@/types'
import { useVote } from '../../_hooks'

interface VoteButtonsProps {
	ideaId: string
	votes: VoteCounts
	userVote?: VoteType | null
}

interface VoteOptionProps {
	isSelected: boolean
	count: number
	label: string
	subLabel: string
	variant: 'accent' | 'success'
	onClick: () => void
	disabled: boolean
}

function VoteOption({
	isSelected,
	count,
	label,
	subLabel,
	variant,
	onClick,
	disabled,
}: VoteOptionProps) {
	const borderColor = variant === 'accent' ? 'border-accent' : 'border-success'
	const bgColor = variant === 'accent' ? 'bg-accent-muted' : 'bg-success-muted'
	const iconBgActive = variant === 'accent' ? 'bg-accent' : 'bg-success'

	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={cn(
				'w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all',
				isSelected ? `${borderColor} ${bgColor}` : 'border-border hover:border-border-hover',
			)}
		>
			<div
				className={cn(
					'flex items-center justify-center h-10 w-10 rounded-full',
					isSelected ? `${iconBgActive} text-white` : 'bg-surface-alt text-text-muted',
				)}
			>
				{isSelected ? <Check className="h-5 w-5" /> : <ThumbsUp className="h-5 w-5" />}
			</div>
			<div className="flex-1 text-left">
				<p className="font-medium">{label}</p>
				<p className="text-sm text-text-secondary">
					{formatNumber(count)} {subLabel}
				</p>
			</div>
		</button>
	)
}

export function VoteButtons({ ideaId, votes, userVote }: VoteButtonsProps) {
	// useVote handles optimistic updates via React Query's onMutate/onError
	const { vote, isPending } = useVote(ideaId)

	const handleVote = (type: VoteType) => {
		if (isPending || userVote === type) return
		posthog.capture('vote_clicked', {
			idea_id: ideaId,
			vote_type: type,
			previous_vote: userVote,
		})
		vote(type)
	}

	return (
		<Card padding="md">
			<h3 className="font-semibold mb-4">Cast Your Vote</h3>
			<div className="space-y-3">
				<VoteOption
					isSelected={userVote === 'problem'}
					count={votes.problem}
					label="I have this problem"
					subLabel="people agree"
					variant="accent"
					onClick={() => handleVote('problem')}
					disabled={isPending}
				/>
				<VoteOption
					isSelected={userVote === 'solution'}
					count={votes.solution}
					label="I'd use this solution"
					subLabel="would use it"
					variant="success"
					onClick={() => handleVote('solution')}
					disabled={isPending}
				/>
			</div>
			<div className="mt-4 pt-4 border-t border-border text-center">
				<p className="text-2xl font-bold text-accent">{formatNumber(votes.total)}</p>
				<p className="text-sm text-text-muted">total votes</p>
			</div>
		</Card>
	)
}
