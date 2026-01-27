'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Debounce a value - returns the value after it stops changing for `delay` ms
 * Uses referential equality check for objects to prevent unnecessary updates
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value)
	const previousValueRef = useRef<T>(value)

	useEffect(() => {
		// Skip if value hasn't actually changed (for primitives and same references)
		if (Object.is(previousValueRef.current, value)) {
			return
		}

		previousValueRef.current = value

		const timeoutId = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)

		return () => clearTimeout(timeoutId)
	}, [value, delay])

	return debouncedValue
}

/**
 * Debounce a value with immediate flag option
 * When immediate is true, fires on the leading edge instead of trailing
 */
export function useDebouncedValueImmediate<T>(
	value: T,
	delay: number,
	immediate: boolean = false,
): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value)
	const isFirstRender = useRef(true)

	useEffect(() => {
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
