'use client'

import { Check, ThumbsUp } from 'lucide-react'
import { useState } from 'react'
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
	variant: 'primary' | 'success'
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
	const borderColor = variant === 'primary' ? 'border-primary' : 'border-success'
	const bgColor = variant === 'primary' ? 'bg-primary-muted' : 'bg-success-muted'
	const iconBgActive = variant === 'primary' ? 'bg-primary' : 'bg-success'

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
	const [localVotes, setLocalVotes] = useState(votes)
	const [localUserVote, setLocalUserVote] = useState(userVote)

	const { vote, removeVote, isVoting } = useVote(ideaId, setLocalVotes)

	const handleVote = async (type: VoteType) => {
		if (isVoting) return

		const wasVoted = localUserVote === type
		const previousVote = localUserVote

		// Optimistic update
		setLocalUserVote(wasVoted ? null : type)
		setLocalVotes((prev) => {
			const newVotes = { ...prev }

			if (wasVoted) {
				newVotes[type] = prev[type] - 1
				newVotes.total = prev.total - 1
			} else {
				newVotes[type] = prev[type] + 1
				newVotes.total = previousVote ? prev.total : prev.total + 1

				if (previousVote && previousVote !== type) {
					newVotes[previousVote] = prev[previousVote] - 1
				}
			}

			return newVotes
		})

		try {
			if (wasVoted) {
				await removeVote()
			} else {
				await vote(type)
			}
		} catch {
			// Rollback on error
			setLocalUserVote(userVote)
			setLocalVotes(votes)
		}
	}

	return (
		<Card padding="md">
			<h3 className="font-semibold mb-4">Cast Your Vote</h3>

			<div className="space-y-3">
				<VoteOption
					isSelected={localUserVote === 'problem'}
					count={localVotes.problem}
					label="I have this problem"
					subLabel="people agree"
					variant="primary"
					onClick={() => handleVote('problem')}
					disabled={isVoting}
				/>

				<VoteOption
					isSelected={localUserVote === 'solution'}
					count={localVotes.solution}
					label="I'd use this solution"
					subLabel="would use it"
					variant="success"
					onClick={() => handleVote('solution')}
					disabled={isVoting}
				/>
			</div>

			<div className="mt-4 pt-4 border-t border-border text-center">
				<p className="text-2xl font-bold text-primary">{formatNumber(localVotes.total)}</p>
				<p className="text-sm text-text-muted">total votes</p>
			</div>
		</Card>
	)
}
