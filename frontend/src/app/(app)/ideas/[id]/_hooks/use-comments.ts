'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createComment, getCommentsForIdea, upvoteComment } from '@/lib/actions'
import type { Comment } from '@/types'

// Query keys
const commentKeys = {
	all: ['comments'] as const,
	byIdea: (ideaId: string) => [...commentKeys.all, 'byIdea', ideaId] as const,
}

interface UseCommentsResult {
	readonly comments: readonly Comment[]
	readonly isLoading: boolean
	readonly error: Error | null
	readonly refetch: () => void
}

export function useComments(ideaId: string): UseCommentsResult {
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: commentKeys.byIdea(ideaId),
		queryFn: () => getCommentsForIdea(ideaId),
		enabled: !!ideaId,
		// Refetch every 30 seconds for live comment updates
		refetchInterval: 30 * 1000,
	})

	return {
		comments: data ?? [],
		isLoading,
		error: error ? (error instanceof Error ? error : new Error(String(error))) : null,
		refetch,
	}
}

interface UseCreateCommentResult {
	readonly mutate: (content: string, parentId?: string) => void
	readonly isPending: boolean
	readonly error: Error | null
}

export function useCreateComment(ideaId: string): UseCreateCommentResult {
	const queryClient = useQueryClient()

	const { mutate, isPending, error } = useMutation({
		mutationFn: ({ content, parentId }: { content: string; parentId?: string }) =>
			createComment(ideaId, { content, parentId }),
		onSuccess: () => {
			// Invalidate comments for this idea
			queryClient.invalidateQueries({
				queryKey: commentKeys.byIdea(ideaId),
			})
			// Also invalidate idea to update comment count
			queryClient.invalidateQueries({ queryKey: ['ideas'] })
		},
	})

	return {
		mutate: (content, parentId) => mutate({ content, parentId }),
		isPending,
		error: error ? (error instanceof Error ? error : new Error(String(error))) : null,
	}
}

interface UseUpvoteCommentResult {
	readonly upvote: (commentId: string) => void
	readonly isPending: boolean
}

export function useUpvoteComment(): UseUpvoteCommentResult {
	const queryClient = useQueryClient()

	const { mutate, isPending } = useMutation({
		mutationFn: upvoteComment,
		onSuccess: () => {
			// Invalidate all comment queries
			queryClient.invalidateQueries({ queryKey: commentKeys.all })
		},
	})

	return { upvote: mutate, isPending }
}
