'use client'

import { ArrowLeft, Clock, Edit, ExternalLink, Flag, MessageSquare, Share2 } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Avatar, Badge, Button, Card, SkeletonCard } from '@/components/ui'
import { createComment, getCommentsForIdea, upvoteComment } from '@/lib/actions'
import { useSession } from '@/lib/auth-client'
import { formatRelativeTime, getCategoryById, parseId } from '@/lib/utils'
import type { Comment } from '@/types'
import { useIdea } from '../_hooks'
import { CommentSection } from './_components/CommentSection'
import { VoteButtons } from './_components/VoteButtons'

const YOUTUBE_PATTERNS = [
	/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
	/youtube\.com\/shorts\/([^&\s?]+)/,
] as const

const extractYouTubeId = (url: string): string | null =>
	YOUTUBE_PATTERNS.map((p) => url.match(p)?.[1]).find(Boolean) ?? null

const BackLink = () => (
	<Link
		href="/ideas"
		className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text mb-6"
	>
		<ArrowLeft className="h-4 w-4" />
		Back to Ideas
	</Link>
)

function VideoEmbed({ url, className }: { readonly url: string; readonly className?: string }) {
	const videoId = extractYouTubeId(url)
	if (!videoId) return null

	return (
		<div className={className}>
			<div className="mx-auto h-[400px] w-full max-w-[300px] sm:h-[500px] sm:w-[350px] sm:max-w-none">
				<iframe
					src={`https://www.youtube-nocookie.com/embed/${videoId}?loop=1&rel=0&modestbranding=1`}
					title="Video"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
					className="h-full w-full rounded-xl shadow-md"
				/>
			</div>
		</div>
	)
}

function LinksSection({ links }: { links?: readonly string[] }) {
	if (!links?.length) return null
	return (
		<Card padding="lg">
			<h2 className="text-lg font-semibold mb-3">Related Links</h2>
			<div className="space-y-2">
				{links.map((link) => (
					<a
						key={link}
						href={link}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2 text-sm text-primary hover:underline"
					>
						<ExternalLink className="h-4 w-4" />
						{link}
					</a>
				))}
			</div>
		</Card>
	)
}

export default function IdeaPage() {
	const params = useParams()
	const id = params.id as string
	const { idea, isLoading, error, refetch } = useIdea(id)
	const { data: session } = useSession()
	const isAuthenticated = !!session?.user
	const isAuthor =
		session?.user?.id && idea?.author?.id && parseId(session.user.id) === parseId(idea.author.id)
	const [comments, setComments] = useState<readonly Comment[]>([])

	useEffect(() => {
		if (id) {
			getCommentsForIdea(id)
				.then(setComments)
				.catch(() => setComments([]))
		}
	}, [id])

	const handleAddComment = useCallback(
		async (content: string, parentId?: string) => {
			const newComment = await createComment(id, { content, parentId })
			setComments((prev) => [...prev, newComment])
		},
		[id],
	)

	const handleUpvoteComment = useCallback(async (commentId: string) => {
		await upvoteComment(commentId)
	}, [])

	const handleShare = async () => {
		if (!idea) return
		try {
			await navigator.share({
				title: idea.title,
				text: `${idea.problem.slice(0, 200)}...`,
				url: window.location.href,
			})
		} catch {
			await navigator.clipboard.writeText(window.location.href)
		}
	}

	if (isLoading) {
		return (
			<div className="max-w-4xl mx-auto">
				<BackLink />
				<div className="space-y-6">
					<SkeletonCard />
					<SkeletonCard />
				</div>
			</div>
		)
	}

	if (error || !idea) {
		return (
			<div className="max-w-4xl mx-auto">
				<BackLink />
				<Card padding="lg" className="text-center">
					<p className="text-error mb-4">{error?.message ?? 'Idea not found'}</p>
					<Button onClick={refetch}>Try Again</Button>
				</Card>
			</div>
		)
	}

	const category = getCategoryById(idea.category)

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<BackLink />
			<div className="grid lg:grid-cols-[1fr,240px] gap-8">
				<div className="space-y-6">
					<Card padding="lg">
						<div className="flex items-center gap-3 mb-4">
							<Avatar
								src={idea.author.avatar}
								name={idea.author.name}
								size="lg"
								verified={idea.author.verified}
								ycType={idea.author.ycType}
							/>
							<div>
								<div className="flex items-center gap-2">
									<Link
										href={`/profile/${parseId(idea.author.id)}`}
										className="font-medium hover:text-primary"
									>
										{idea.author.name}
									</Link>
									{idea.author.ycType && (
										<Badge variant="yc">
											{idea.author.ycType === 'partner' ? 'YC Partner' : 'YC Alumni'}
										</Badge>
									)}
								</div>
								<div className="flex items-center gap-2 text-sm text-text-muted">
									<Clock className="h-3.5 w-3.5" />
									<span>{formatRelativeTime(idea.createdAt)}</span>
									{category && (
										<>
											<span>·</span>
											<span className="flex items-center gap-1" style={{ color: category.color }}>
												<span
													className="h-2 w-2 rounded-full"
													style={{ backgroundColor: category.color }}
												/>
												{category.label}
											</span>
										</>
									)}
								</div>
							</div>
						</div>

						<h1 className="text-2xl font-bold mb-4">{idea.title}</h1>

						<div className="flex flex-wrap gap-2 mb-6">
							{idea.tags.map((tag) => (
								<Badge key={tag} variant="secondary">
									{tag}
								</Badge>
							))}
						</div>

						{idea.videoUrl && <VideoEmbed url={idea.videoUrl} className="lg:hidden mb-6" />}

						<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
							<div className="prose prose-sm max-w-none lg:col-span-7">
								{idea.problem.split('\n\n').map((paragraph, i) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: static content
									<p key={i} className="text-text-secondary leading-relaxed mb-4 last:mb-0">
										{paragraph.split('\n').map((line, j) => (
											// biome-ignore lint/suspicious/noArrayIndexKey: static content
											<span key={j}>
												{j > 0 && <br />}
												{line}
											</span>
										))}
									</p>
								))}
							</div>

							{idea.videoUrl && (
								<div className="hidden lg:block lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
									<VideoEmbed url={idea.videoUrl} />
								</div>
							)}
						</div>

						<div className="flex items-center gap-2 pt-4 mt-6 border-t border-border">
							<Button variant="ghost" size="sm" onClick={handleShare}>
								<Share2 className="h-4 w-4 mr-1" /> Share
							</Button>
							{isAuthenticated && (
								<Button variant="ghost" size="sm">
									<Flag className="h-4 w-4 mr-1" /> Report
								</Button>
							)}
							{isAuthor && (
								<Button variant="ghost" size="sm">
									<Edit className="h-4 w-4 mr-1" /> Edit
								</Button>
							)}
						</div>
					</Card>
					<LinksSection links={idea.links} />

					{isAuthenticated ? (
						<Card padding="lg">
							<CommentSection
								comments={comments}
								onAddComment={handleAddComment}
								onUpvote={handleUpvoteComment}
							/>
						</Card>
					) : (
						<Card padding="lg" className="text-center">
							<MessageSquare className="h-8 w-8 mx-auto mb-2 text-text-muted" />
							<p className="text-text-secondary">
								<Link href="/login" className="text-primary hover:underline">
									Log in
								</Link>{' '}
								to comment
							</p>
						</Card>
					)}
				</div>

				<div className="space-y-6 lg:sticky lg:top-20 lg:self-start">
					{isAuthenticated ? (
						<VoteButtons ideaId={idea.id} votes={idea.votes} userVote={idea.userVote} />
					) : (
						<Card padding="md" className="text-center">
							<p className="text-text-secondary text-sm">
								<Link href="/login" className="text-primary hover:underline">
									Log in
								</Link>{' '}
								to vote
							</p>
						</Card>
					)}

					<Card padding="md">
						<h3 className="font-semibold mb-3">Stats</h3>
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-text-secondary">Comments</span>
								<span className="font-medium">{idea.commentCount}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-text-secondary">Posted</span>
								<span className="font-medium">{formatRelativeTime(idea.createdAt)}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-text-secondary">Last activity</span>
								<span className="font-medium">{formatRelativeTime(idea.updatedAt)}</span>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	)
}
