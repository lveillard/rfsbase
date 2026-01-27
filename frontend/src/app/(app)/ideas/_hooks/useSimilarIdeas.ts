'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ideasApi, type SimilarIdea } from '@/lib/api'
import { useDebouncedValue } from '@/lib/hooks/useDebouncedValue'

// Re-export for consumers
export type { SimilarIdea }

interface UseSimilarIdeasParams {
	readonly text: string
	readonly threshold?: number
	readonly limit?: number
	readonly excludeId?: string
	readonly minLength?: number
	readonly debounceMs?: number
}

interface UseSimilarIdeasResult {
	readonly ideas: readonly SimilarIdea[]
	readonly isLoading: boolean
	readonly error: string | null
}

// Default configuration as const for immutability
const DEFAULTS = {
	threshold: 0.75,
	limit: 5,
	minLength: 50,
	debounceMs: 500,
} as const

export function useSimilarIdeas({
	text,
	threshold = DEFAULTS.threshold,
	limit = DEFAULTS.limit,
	excludeId,
	minLength = DEFAULTS.minLength,
	debounceMs = DEFAULTS.debounceMs,
}: UseSimilarIdeasParams): UseSimilarIdeasResult {
	const [ideas, setIdeas] = useState<readonly SimilarIdea[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const debouncedText = useDebouncedValue(text, debounceMs)

	// Track mounted state to prevent state updates after unmount
	const mountedRef = useRef(true)
	useEffect(() => {
		mountedRef.current = true
		return () => {
			mountedRef.current = false
		}
	}, [])

	// Track request version to handle race conditions
	const requestIdRef = useRef(0)

	// Memoize search params for stable comparison
	const searchParams = useMemo(
		() => ({
			text: debouncedText,
			threshold,
			limit,
			excludeId,
		}),
		[debouncedText, threshold, limit, excludeId],
	)

	const searchSimilar = useCallback(async () => {
		// Early return for insufficient text
		if (!searchParams.text || searchParams.text.length < minLength) {
			setIdeas([])
			setError(null)
			return
		}

		const currentRequestId = ++requestIdRef.current

		setIsLoading(true)
		setError(null)

		try {
			const response = await ideasApi.findSimilar(searchParams)

			// Ignore stale responses
			if (!mountedRef.current || currentRequestId !== requestIdRef.current) return

			if (response.success) {
				setIdeas(response.data)
			} else {
				setError(response.error.message)
				setIdeas([])
			}
		} catch (err) {
			if (mountedRef.current && currentRequestId === requestIdRef.current) {
				setError(err instanceof Error ? err.message : 'Search failed')
				setIdeas([])
			}
		} finally {
			if (mountedRef.current && currentRequestId === requestIdRef.current) {
				setIsLoading(false)
			}
		}
	}, [searchParams, minLength])

	useEffect(() => {
		searchSimilar()
	}, [searchSimilar])

	return { ideas, isLoading, error }
}
