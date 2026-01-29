'use client'

import { ArrowBigUp, MoreHorizontal, Reply } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Avatar, Badge, Button, Textarea } from '@/components/ui'
import { cn, formatRelativeTime } from '@/lib/utils'
import type { Comment } from '@/types'

interface CommentWithReplies extends Omit<Comment, 'replies'> {
	readonly replies: readonly CommentWithReplies[]
}

interface CommentSectionProps {
	readonly ideaId: string
	readonly comments: readonly Comment[]
	readonly onAddComment: (content: string, parentId?: string) => Promise<void>
	readonly onUpvote: (commentId: string) => Promise<void>
}

interface CommentItemProps {
	readonly comment: CommentWithReplies
	readonly onReply: (parentId: string) => void
	readonly onUpvote: (commentId: string) => void
	readonly depth?: number
}

function CommentItem({ comment, onReply, onUpvote, depth = 0 }: CommentItemProps) {
	const [showReplies, setShowReplies] = useState(true)
	const isVerified = comment.author.verified || comment.author.ycVerified
	const hasReplies = comment.replies.length > 0
	const canReply = depth === 0

	return (
		<div className={cn('group', depth > 0 && 'ml-8 mt-4')}>
			<div className="flex gap-3">
				<Avatar
					src={comment.author.avatar}
					name={comment.author.name}
					size="sm"
					verified={isVerified}
				/>
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2">
						<span className="font-medium text-sm">{comment.author.name}</span>
						{comment.author.ycVerified && (
							<Badge variant="warning" size="sm">
								YC
							</Badge>
						)}
						<span className="text-xs text-text-muted">{formatRelativeTime(comment.createdAt)}</span>
					</div>
					<p className="mt-1 text-sm text-text-secondary whitespace-pre-wrap">{comment.content}</p>
					<div className="flex items-center gap-2 mt-2">
						<button
							type="button"
							onClick={() => onUpvote(comment.id)}
							className={cn(
								'inline-flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors',
								comment.userUpvoted
									? 'bg-primary-muted text-primary'
									: 'text-text-muted hover:text-text hover:bg-surface-alt',
							)}
						>
							<ArrowBigUp className={cn('h-3.5 w-3.5', comment.userUpvoted && 'fill-current')} />
							{comment.upvotes}
						</button>
						{canReply && (
							<button
								type="button"
								onClick={() => onReply(comment.id)}
								className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-text-muted hover:text-text hover:bg-surface-alt transition-colors"
							>
								<Reply className="h-3.5 w-3.5" /> Reply
							</button>
						)}
						<button
							type="button"
							className="opacity-0 group-hover:opacity-100 p-1 rounded text-text-muted hover:text-text hover:bg-surface-alt transition-all"
						>
							<MoreHorizontal className="h-3.5 w-3.5" />
						</button>
					</div>
				</div>
			</div>

			{hasReplies && (
				<div className="mt-2">
					{!showReplies ? (
						<button
							type="button"
							onClick={() => setShowReplies(true)}
							className="ml-11 text-xs text-primary hover:underline"
						>
							Show {comment.replies.length} replies
						</button>
					) : (
						comment.replies.map((reply) => (
							<CommentItem
								key={reply.id}
								comment={reply}
								onReply={onReply}
								onUpvote={onUpvote}
								depth={depth + 1}
							/>
						))
					)}
				</div>
			)}
		</div>
	)
}

// Pure function: transforms flat comments into tree structure
const organizeComments = (flatComments: readonly Comment[]): readonly CommentWithReplies[] => {
	const byId = new Map(
		flatComments.map((c) => [c.id, { ...c, replies: [] as CommentWithReplies[] }]),
	)

	const roots: CommentWithReplies[] = []
	for (const comment of flatComments) {
		const node = byId.get(comment.id)!
		if (comment.parentId) {
			const parent = byId.get(comment.parentId)
			if (parent) parent.replies.push(node)
		} else {
			roots.push(node)
		}
	}
	return roots
}

// Pure function: count total comments including replies
const countComments = (comments: readonly CommentWithReplies[]): number =>
	comments.reduce((total, c) => total + 1 + countComments(c.replies), 0)

export function CommentSection({
	comments,
	onAddComment,
	onUpvote,
}: Omit<CommentSectionProps, 'ideaId'>) {
	const organizedComments = useMemo(() => organizeComments(comments), [comments])
	const [newComment, setNewComment] = useState('')
	const [replyingTo, setReplyingTo] = useState<string | null>(null)
	const [replyContent, setReplyContent] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)

	const totalComments = countComments(organizedComments)

	const handleSubmitComment = async () => {
		const content = newComment.trim()
		if (!content) return
		setIsSubmitting(true)
		try {
			await onAddComment(content)
			setNewComment('')
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleSubmitReply = async () => {
		const content = replyContent.trim()
		if (!content || !replyingTo) return
		setIsSubmitting(true)
		try {
			await onAddComment(content, replyingTo)
			setReplyContent('')
			setReplyingTo(null)
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleCancelReply = () => {
		setReplyingTo(null)
		setReplyContent('')
	}

	return (
		<section id="comments" className="scroll-mt-20">
			<h3 className="text-lg font-semibold mb-4">Comments ({totalComments})</h3>

			<div className="mb-6">
				<Textarea
					placeholder="Share your thoughts..."
					value={newComment}
					onChange={(e) => setNewComment(e.target.value)}
					maxLength={2000}
					className="min-h-[100px]"
				/>
				<div className="flex justify-end mt-2">
					<Button
						onClick={handleSubmitComment}
						disabled={!newComment.trim() || isSubmitting}
						isLoading={isSubmitting && !replyingTo}
					>
						Comment
					</Button>
				</div>
			</div>

			<div className="space-y-6">
				{organizedComments.length === 0 ? (
					<p className="text-center text-text-muted py-8">
						No comments yet. Be the first to share your thoughts!
					</p>
				) : (
					organizedComments.map((comment) => (
						<div key={comment.id}>
							<CommentItem comment={comment} onReply={setReplyingTo} onUpvote={onUpvote} />
							{replyingTo === comment.id && (
								<div className="ml-11 mt-3">
									<Textarea
										placeholder={`Reply to ${comment.author.name}...`}
										value={replyContent}
										onChange={(e) => setReplyContent(e.target.value)}
										maxLength={2000}
										className="min-h-[80px]"
									/>
									<div className="flex justify-end gap-2 mt-2">
										<Button variant="ghost" size="sm" onClick={handleCancelReply}>
											Cancel
										</Button>
										<Button
											size="sm"
											onClick={handleSubmitReply}
											disabled={!replyContent.trim() || isSubmitting}
											isLoading={isSubmitting && replyingTo === comment.id}
										>
											Reply
										</Button>
									</div>
								</div>
							)}
						</div>
					))
				)}
			</div>
		</section>
	)
}
