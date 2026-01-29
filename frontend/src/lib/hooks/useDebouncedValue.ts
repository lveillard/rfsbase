'use client'

import { useEffect, useRef, useState } from 'react'

interface UseDebouncedValueOptions {
	readonly delay: number
	readonly immediate?: boolean
}

/**
 * Debounce a value - returns the value after it stops changing for `delay` ms
 * Uses referential equality check for objects to prevent unnecessary updates
 * When immediate is true, fires on the leading edge instead of trailing
 */
export function useDebouncedValue<T>(
	value: T,
	{ delay, immediate = false }: UseDebouncedValueOptions,
): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value)
	const previousValueRef = useRef<T>(value)
	const isFirstRender = useRef(true)

	useEffect(() => {
		// Skip if value hasn't actually changed (for primitives and same references)
		if (Object.is(previousValueRef.current, value) && !isFirstRender.current) {
			return
		}

		previousValueRef.current = value

		// Immediate mode: fire on first render immediately
		if (immediate && isFirstRender.current) {
			isFirstRender.current = false
			setDebouncedValue(value)
			return
		}

		isFirstRender.current = false

		const timeoutId = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)

		return () => clearTimeout(timeoutId)
	}, [value, delay, immediate])

	return debouncedValue
}
