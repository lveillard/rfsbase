'use client'

import { useCallback, useRef } from 'react'

/**
 * Debounce a callback function - executes after delay of inactivity
 * Uses refs to avoid re-renders and maintain stable reference
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
	callback: T,
	delay: number,
): (...args: Parameters<T>) => void {
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const callbackRef = useRef(callback)

	// Keep callback ref up to date
	callbackRef.current = callback

	return useCallback(
		(...args: Parameters<T>) => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}

			timeoutRef.current = setTimeout(() => {
				callbackRef.current(...args)
			}, delay)
		},
		[delay],
	)
}

/**
 * Debounce with leading edge option (fires immediately then debounces)
 */
export function useDebouncedCallbackLeading<T extends (...args: unknown[]) => unknown>(
	callback: T,
	delay: number,
): (...args: Parameters<T>) => void {
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const callbackRef = useRef(callback)

	callbackRef.current = callback

	return useCallback(
		(...args: Parameters<T>) => {
			const isFirstCall = timeoutRef.current === null

			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}

			if (isFirstCall) {
				callbackRef.current(...args)
			}

			timeoutRef.current = setTimeout(() => {
				timeoutRef.current = null
			}, delay)
		},
		[delay],
	)
}
