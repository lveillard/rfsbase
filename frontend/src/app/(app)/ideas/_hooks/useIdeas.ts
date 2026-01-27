'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
	type CreateIdeaInput,
	type Idea,
	ideasApi,
	type ListIdeasParams,
	type VoteCounts,
} from '@/lib/api'

// Shared pagination type
interface PaginationInfo {
	readonly page: number
	readonly pageSize: number
	readonly total: number
	readonly totalPages: number
	readonly hasNext: boolean
	readonly hasPrev: boolean
}

// Result type for mutation operations
type MutationResult<T> =
	| { readonly success: true; readonly data: T }
	| { readonly success: false; readonly error: string }

// Shared state management for async operations
const useAsyncState = <T>(initialData: T) => {
	const [data, setData] = useState<T>(initialData)
	const [error, setError] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const mountedRef = useRef(true)

	useEffect(() => {
		mountedRef.current = true
		return () => {
			mountedRef.current = false
		}
	}, [])

	const safeSetState = useCallback(
		<S>(setter: React.Dispatch<React.SetStateAction<S>>, value: React.SetStateAction<S>) => {
			if (mountedRef.current) setter(value)
		},
		[],
	)

	return {
		data,
		setData,
		error,
		setError,
		isLoading,
		setIsLoading,
		safeSetState,
		mountedRef,
	}
}

// ============================================================================
// useIdeas - Paginated list of ideas
// ============================================================================

interface UseIdeasResult {
	readonly ideas: readonly Idea[]
	readonly isLoading: boolean
	readonly error: string | null
	readonly pagination: PaginationInfo | null
	readonly refetch: () => Promise<void>
	readonly loadMore: () => Promise<void>
}

export function useIdeas(params?: ListIdeasParams): UseIdeasResult {
	const {
		data: ideas,
		setData: setIdeas,
		error,
		setError,
		isLoading,
		setIsLoading,
		mountedRef,
	} = useAsyncState<readonly Idea[]>([])
	const [pagination, setPagination] = useState<PaginationInfo | null>(null)

	// Serialize params for stable comparison
	const _paramsKey = JSON.stringify(params ?? {})

	// Memoize params to prevent unnecessary re-fetches
	const stableParams = useMemo(() => params, [params])

	const fetchIdeas = useCallback(
		async (page: number, append: boolean) => {
			setIsLoading(true)
			setError(null)

			const response = await ideasApi.list({ ...stableParams, page })

			if (!mountedRef.current) return

			if (response.success) {
				setIdeas((prev) => (append ? [...prev, ...response.data] : response.data))
				setPagination(response.pagination ?? null)
			} else {
				setError(response.error.message)
			}

			setIsLoading(false)
		},
		[stableParams, setIdeas, setError, setIsLoading, mountedRef],
	)

	const refetch = useCallback(() => fetchIdeas(1, false), [fetchIdeas])

	const loadMore = useCallback(async () => {
		if (pagination?.hasNext && !isLoading) {
			await fetchIdeas(pagination.page + 1, true)
		}
	}, [fetchIdeas, pagination, isLoading])

	useEffect(() => {
		fetchIdeas(1, false)
	}, [fetchIdeas])

	return { ideas, isLoading, error, pagination, refetch, loadMore }
}

// ============================================================================
// useIdea - Single idea fetch
// ============================================================================

interface UseIdeaResult {
	readonly idea: Idea | null
	readonly isLoading: boolean
	readonly error: string | null
	readonly refetch: () => Promise<void>
}

export function useIdea(id: string): UseIdeaResult {
	const {
		data: idea,
		setData: setIdea,
		error,
		setError,
		isLoading,
		setIsLoading,
		mountedRef,
	} = useAsyncState<Idea | null>(null)

	const fetchIdea = useCallback(async () => {
		setIsLoading(true)
		setError(null)

		const response = await ideasApi.get(id)

		if (!mountedRef.current) return

		if (response.success) {
			setIdea(response.data)
		} else {
			setError(response.error.message)
		}

		setIsLoading(false)
	}, [id, setIdea, setError, setIsLoading, mountedRef])

	useEffect(() => {
		fetchIdea()
	}, [fetchIdea])

	return { idea, isLoading, error, refetch: fetchIdea }
}

// ============================================================================
// useCreateIdea - Idea creation mutation
// ============================================================================

interface UseCreateIdeaResult {
	readonly createIdea: (data: CreateIdeaInput) => Promise<MutationResult<Idea>>
	readonly isCreating: boolean
}

export function useCreateIdea(): UseCreateIdeaResult {
	const [isCreating, setIsCreating] = useState(false)

	const createIdea = useCallback(async (data: CreateIdeaInput): Promise<MutationResult<Idea>> => {
		setIsCreating(true)

		try {
			const response = await ideasApi.create(data)

			if (response.success) {
				return { success: true, data: response.data }
			}

			return { success: false, error: response.error.message }
		} finally {
			setIsCreating(false)
		}
	}, [])

	return { createIdea, isCreating }
}

// ============================================================================
// useVote - Vote mutation with optimistic update support
// ============================================================================

type VoteType = 'problem' | 'solution'

interface UseVoteResult {
	readonly vote: (type: VoteType) => Promise<void>
	readonly removeVote: () => Promise<void>
	readonly isVoting: boolean
}

export function useVote(ideaId: string, onUpdate: (votes: VoteCounts) => void): UseVoteResult {
	const [isVoting, setIsVoting] = useState(false)

	// Generic vote handler to reduce duplication
	const executeVoteAction = useCallback(
		async (action: () => ReturnType<typeof ideasApi.vote>) => {
			if (isVoting) return // Prevent concurrent votes

			setIsVoting(true)

			try {
				const response = await action()
				if (response.success) {
					onUpdate(response.data)
				}
			} finally {
				setIsVoting(false)
			}
		},
		[isVoting, onUpdate],
	)

	const vote = useCallback(
		async (type: VoteType) => executeVoteAction(() => ideasApi.vote(ideaId, type)),
		[ideaId, executeVoteAction],
	)

	const removeVote = useCallback(
		async () => executeVoteAction(() => ideasApi.removeVote(ideaId)),
		[ideaId, executeVoteAction],
	)

	return { vote, removeVote, isVoting }
}
