'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { createIdea, findSimilarIdeas, getIdea, listIdeas, voteIdea } from '@/lib/actions'
import type { Idea, IdeaCard, IdeaCreate, SimilarIdeaResult, VoteType } from '@/types'

// Query keys for consistent cache management
const ideaKeys = {
	all: ['ideas'] as const,
	lists: () => [...ideaKeys.all, 'list'] as const,
	list: (filters: ListIdeasFilters) => [...ideaKeys.lists(), filters] as const,
	details: () => [...ideaKeys.all, 'detail'] as const,
	detail: (id: string) => [...ideaKeys.details(), id] as const,
	similar: (text: string) => [...ideaKeys.all, 'similar', text] as const,
}

interface ListIdeasFilters {
	readonly page?: number
	readonly pageSize?: number
	readonly sortBy?: 'hot' | 'new' | 'top' | 'discussed'
	readonly category?: string
}

interface PaginationInfo {
	readonly page: number
	readonly pageSize: number
	readonly total: number
	readonly totalPages: number
	readonly hasNext: boolean
	readonly hasPrev: boolean
}

interface UseIdeasResult {
	readonly ideas: readonly IdeaCard[]
	readonly isLoading: boolean
	readonly isFetching: boolean
	readonly error: Error | null
	readonly pagination: PaginationInfo | null
	readonly refetch: () => void
	readonly loadMore: () => void
}

export function useIdeas(filters: ListIdeasFilters = {}): UseIdeasResult {
	const { page = 1, pageSize = 20, sortBy = 'new', category } = filters

	const { data, isLoading, isFetching, error, refetch } = useQuery({
		queryKey: ideaKeys.list(filters),
		queryFn: async () => {
			const result = await listIdeas(page, pageSize, sortBy, category)
			return result
		},
		// Keep previous data while fetching new data
		placeholderData: (previousData) => previousData,
	})

	const queryClient = useQueryClient()

	const loadMore = useCallback(() => {
		if (!data) return
		const nextPage = page + 1
		const totalPages = Math.ceil(data.total / pageSize)

		if (nextPage <= totalPages) {
			queryClient.prefetchQuery({
				queryKey: ideaKeys.list({ ...filters, page: nextPage }),
				queryFn: () => listIdeas(nextPage, pageSize, sortBy, category),
			})
		}
	}, [data, filters, page, pageSize, sortBy, category, queryClient])

	const pagination: PaginationInfo | null = data
		? {
				page,
				pageSize,
				total: data.total,
				totalPages: Math.ceil(data.total / pageSize),
				hasNext: page * pageSize < data.total,
				hasPrev: page > 1,
			}
		: null

	return {
		ideas: data?.ideas ?? [],
		isLoading,
		isFetching,
		error: error ? (error instanceof Error ? error : new Error(String(error))) : null,
		pagination,
		refetch,
		loadMore,
	}
}

interface UseIdeaResult {
	readonly idea: Idea | null
	readonly isLoading: boolean
	readonly error: Error | null
	readonly refetch: () => void
}

export function useIdea(id: string): UseIdeaResult {
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ideaKeys.detail(id),
		queryFn: () => getIdea(id),
		// Don't refetch on window focus for detail views
		refetchOnWindowFocus: false,
		// Stale time: 5 minutes for idea details
		staleTime: 5 * 60 * 1000,
		enabled: !!id,
	})

	return {
		idea: data ?? null,
		isLoading,
		error: error ? (error instanceof Error ? error : new Error(String(error))) : null,
		refetch,
	}
}

interface UseCreateIdeaResult {
	readonly mutate: (data: IdeaCreate) => void
	readonly isPending: boolean
	readonly error: Error | null
	readonly data: Idea | null
}

export function useCreateIdea(): UseCreateIdeaResult {
	const queryClient = useQueryClient()

	const { mutate, isPending, error, data } = useMutation({
		mutationFn: createIdea,
		onSuccess: (newIdea) => {
			// Invalidate and refetch lists
			queryClient.invalidateQueries({ queryKey: ideaKeys.lists() })
			// Pre-populate cache with new idea
			queryClient.setQueryData(ideaKeys.detail(newIdea.id), newIdea)
		},
	})

	return {
		mutate,
		isPending,
		error: error ? (error instanceof Error ? error : new Error(String(error))) : null,
		data: data ?? null,
	}
}

interface UseVoteResult {
	readonly vote: (type: VoteType) => void
	readonly isPending: boolean
}

export function useVote(ideaId: string): UseVoteResult {
	const queryClient = useQueryClient()

	const { mutate, isPending } = useMutation({
		mutationFn: (type: VoteType) => voteIdea(ideaId, type),
		onMutate: async (type) => {
			// Cancel outgoing refetches
			await queryClient.cancelQueries({ queryKey: ideaKeys.detail(ideaId) })

			// Snapshot previous value
			const previousIdea = queryClient.getQueryData<Idea>(ideaKeys.detail(ideaId))

			// Optimistically update
			if (previousIdea) {
				queryClient.setQueryData(ideaKeys.detail(ideaId), {
					...previousIdea,
					userVote: type,
					votes: {
						...previousIdea.votes,
						[type]: previousIdea.votes[type] + 1,
						total: previousIdea.votes.total + 1,
					},
				})
			}

			return { previousIdea }
		},
		onError: (_err, _type, context) => {
			// Rollback on error
			if (context?.previousIdea) {
				queryClient.setQueryData(ideaKeys.detail(ideaId), context.previousIdea)
			}
		},
		onSettled: () => {
			// Always refetch after error or success
			queryClient.invalidateQueries({ queryKey: ideaKeys.detail(ideaId) })
			queryClient.invalidateQueries({ queryKey: ideaKeys.lists() })
		},
	})

	return { vote: mutate, isPending }
}

interface UseSimilarIdeasResult {
	readonly ideas: readonly SimilarIdeaResult[]
	readonly isLoading: boolean
	readonly error: Error | null
}

export function useSimilarIdeas(
	text: string,
	options: {
		readonly threshold?: number
		readonly limit?: number
		readonly excludeId?: string
		readonly minLength?: number
	} = {},
): UseSimilarIdeasResult {
	const { threshold = 0.75, limit = 5, excludeId, minLength = 50 } = options

	const { data, isLoading, error } = useQuery({
		queryKey: ideaKeys.similar(text),
		queryFn: () =>
			findSimilarIdeas({
				text,
				threshold,
				limit,
				excludeId,
			}),
		// Only fetch if text is long enough
		enabled: text.length >= minLength,
		// Don't retry on 404s (no similar ideas)
		retry: (failureCount, error) => {
			if (error instanceof Error && error.message.includes('not found')) {
				return false
			}
			return failureCount < 2
		},
		// Results stale after 30 seconds (embedding expensive)
		staleTime: 30 * 1000,
	})

	return {
		ideas: data ?? [],
		isLoading,
		error: error ? (error instanceof Error ? error : new Error(String(error))) : null,
	}
}
