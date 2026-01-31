'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { createIdea, findSimilarIdeas, getIdea, listIdeas, voteIdea } from '@/lib/actions'
import type { Idea, IdeaCard, IdeaCreate, VoteType } from '@/types'

// Query keys for consistent cache management
const ideaKeys = {
	all: ['ideas'] as const,
	lists: () => [...ideaKeys.all, 'list'] as const,
	list: (filters: ListIdeasFilters) => [...ideaKeys.lists(), filters] as const,
	details: () => [...ideaKeys.all, 'detail'] as const,
	detail: (id: string) => [...ideaKeys.details(), id] as const,
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

// On-demand similarity search (e.g., on form submit)
export function useFindSimilarIdeas() {
	return useMutation({
		mutationFn: (params: {
			text: string
			threshold?: number
			limit?: number
			excludeId?: string
		}) =>
			findSimilarIdeas({
				text: params.text,
				threshold: params.threshold ?? 0.7,
				limit: params.limit ?? 5,
				excludeId: params.excludeId,
			}),
	})
}
