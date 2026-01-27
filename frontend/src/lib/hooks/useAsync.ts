'use client'

import { useEffect, useRef, useState } from 'react'

// Discriminated union for async state - no impossible states
type AsyncState<T, E = string> =
	| { readonly status: 'idle'; readonly data: null; readonly error: null }
	| {
			readonly status: 'loading'
			readonly data: T | null
			readonly error: null
	  }
	| { readonly status: 'success'; readonly data: T; readonly error: null }
	| { readonly status: 'error'; readonly data: T | null; readonly error: E }

interface UseAsyncOptions {
	readonly immediate?: boolean
}

interface UseAsyncResult<T, E = string> {
	readonly data: T | null
	readonly error: E | null
	readonly isLoading: boolean
	readonly isIdle: boolean
	readonly isSuccess: boolean
	readonly isError: boolean
	readonly execute: () => Promise<void>
	readonly reset: () => void
}

/**
 * Generic hook for async operations with proper state management
 * Follows functional patterns: immutable state, pure state transitions
 */
export function useAsync<T, E = string>(
	asyncFn: () => Promise<T>,
	options: UseAsyncOptions = {},
): UseAsyncResult<T, E> {
	const { immediate = true } = options

	const [state, setState] = useState<AsyncState<T, E>>({
		status: 'idle',
		data: null,
		error: null,
	})

	// Track mounted state to prevent updates after unmount
	const mountedRef = useRef(true)

	useEffect(() => {
		mountedRef.current = true
		return () => {
			mountedRef.current = false
		}
	}, [])

	const execute = async () => {
		setState((prev) => ({ status: 'loading', data: prev.data, error: null }))

		try {
			const data = await asyncFn()
			if (mountedRef.current) {
				setState({ status: 'success', data, error: null })
			}
		} catch (err) {
			if (mountedRef.current) {
				const error = (err instanceof Error ? err.message : String(err)) as E
				setState((prev) => ({ status: 'error', data: prev.data, error }))
			}
		}
	}

	const reset = () => {
		setState({ status: 'idle', data: null, error: null })
	}

	useEffect(() => {
		if (immediate) {
			execute()
		}
	}, [immediate, execute])

	return {
		data: state.data,
		error: state.error,
		isLoading: state.status === 'loading',
		isIdle: state.status === 'idle',
		isSuccess: state.status === 'success',
		isError: state.status === 'error',
		execute,
		reset,
	}
}

// Type for paginated async results
interface PaginatedData<T> {
	readonly items: readonly T[]
	readonly pagination: {
		readonly page: number
		readonly pageSize: number
		readonly total: number
		readonly totalPages: number
		readonly hasNext: boolean
		readonly hasPrev: boolean
	} | null
}

interface UsePaginatedAsyncResult<T, E = string>
	extends Omit<UseAsyncResult<PaginatedData<T>, E>, 'data'> {
	readonly items: readonly T[]
	readonly pagination: PaginatedData<T>['pagination']
	readonly loadMore: () => Promise<void>
	readonly refetch: () => Promise<void>
}

/**
 * Hook for paginated async data with load more support
 */
export function usePaginatedAsync<T, E = string>(
	fetchFn: (page: number) => Promise<{
		items: readonly T[]
		pagination: PaginatedData<T>['pagination']
	}>,
	options: UseAsyncOptions = {},
): UsePaginatedAsyncResult<T, E> {
	const { immediate = true } = options

	const [state, setState] = useState<{
		readonly items: readonly T[]
		readonly pagination: PaginatedData<T>['pagination']
		readonly error: E | null
		readonly status: 'idle' | 'loading' | 'success' | 'error'
	}>({
		items: [],
		pagination: null,
		error: null,
		status: 'idle',
	})

	const mountedRef = useRef(true)

	useEffect(() => {
		mountedRef.current = true
		return () => {
			mountedRef.current = false
		}
	}, [])

	const fetchPage = async (page: number, append: boolean = false) => {
		setState((prev) => ({ ...prev, status: 'loading', error: null }))

		try {
			const { items, pagination } = await fetchFn(page)
			if (mountedRef.current) {
				setState((prev) => ({
					items: append ? [...prev.items, ...items] : items,
					pagination,
					error: null,
					status: 'success',
				}))
			}
		} catch (err) {
			if (mountedRef.current) {
				const error = (err instanceof Error ? err.message : String(err)) as E
				setState((prev) => ({ ...prev, status: 'error', error }))
			}
		}
	}

	const execute = () => fetchPage(1, false)

	const loadMore = async () => {
		if (state.pagination?.hasNext) {
			await fetchPage(state.pagination.page + 1, true)
		}
	}

	const reset = () => {
		setState({ items: [], pagination: null, error: null, status: 'idle' })
	}

	useEffect(() => {
		if (immediate) {
			execute()
		}
	}, [immediate, execute])

	return {
		items: state.items,
		pagination: state.pagination,
		error: state.error,
		isLoading: state.status === 'loading',
		isIdle: state.status === 'idle',
		isSuccess: state.status === 'success',
		isError: state.status === 'error',
		execute,
		loadMore,
		refetch: execute,
		reset,
	}
}
