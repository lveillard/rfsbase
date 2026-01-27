'use client'

import { createContext, type ReactNode, useContext, useEffect, useState } from 'react'

// Theme types
type ThemePreference = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

interface ThemeContextValue {
	readonly theme: ThemePreference
	readonly resolvedTheme: ResolvedTheme
	readonly setTheme: (theme: ThemePreference) => void
	readonly toggleTheme: () => void
	readonly isDark: boolean
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

// Configuration
const STORAGE_KEY = 'rfsbase-theme' as const
const VALID_THEMES: readonly ThemePreference[] = ['light', 'dark', 'system'] as const
const THEME_COLORS = {
	dark: '#0D0D0D',
	light: '#FAFAF9',
} as const

// Pure functions for theme logic
const isValidTheme = (value: unknown): value is ThemePreference =>
	typeof value === 'string' && VALID_THEMES.includes(value as ThemePreference)

const getSystemTheme = (): ResolvedTheme =>
	typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light'

const resolveTheme = (preference: ThemePreference): ResolvedTheme =>
	preference === 'system' ? getSystemTheme() : preference

// Side effects extracted as pure functions
const applyThemeToDOM = (theme: ResolvedTheme): void => {
	const root = document.documentElement
	root.classList.remove('light', 'dark')
	root.classList.add(theme)

	const metaTheme = document.querySelector('meta[name="theme-color"]')
	metaTheme?.setAttribute('content', THEME_COLORS[theme])
}

const persistTheme = (theme: ThemePreference): void => {
	try {
		localStorage.setItem(STORAGE_KEY, theme)
	} catch {
		// localStorage might be unavailable (private browsing, etc.)
	}
}

const loadPersistedTheme = (): ThemePreference | null => {
	try {
		const stored = localStorage.getItem(STORAGE_KEY)
		return isValidTheme(stored) ? stored : null
	} catch {
		return null
	}
}

interface ThemeProviderProps {
	readonly children: ReactNode
	readonly defaultTheme?: ThemePreference
}

export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps) {
	const [theme, setThemeState] = useState<ThemePreference>(defaultTheme)
	const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light')

	// Initialize from localStorage on mount
	useEffect(() => {
		const persisted = loadPersistedTheme()
		if (persisted) {
			setThemeState(persisted)
		}
	}, [])

	// Apply theme changes to DOM
	useEffect(() => {
		const resolved = resolveTheme(theme)
		setResolvedTheme(resolved)
		applyThemeToDOM(resolved)
	}, [theme])

	// Listen for system preference changes when in 'system' mode
	useEffect(() => {
		if (theme !== 'system') return

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

		const handleChange = (e: MediaQueryListEvent) => {
			const newResolved = e.matches ? 'dark' : 'light'
			setResolvedTheme(newResolved)
			applyThemeToDOM(newResolved)
		}

		mediaQuery.addEventListener('change', handleChange)
		return () => mediaQuery.removeEventListener('change', handleChange)
	}, [theme])

	const setTheme = (newTheme: ThemePreference) => {
		setThemeState(newTheme)
		persistTheme(newTheme)
	}

	const toggleTheme = () => {
		const nextTheme: ResolvedTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
		setTheme(nextTheme)
	}

	const contextValue: ThemeContextValue = {
		theme,
		resolvedTheme,
		setTheme,
		toggleTheme,
		isDark: resolvedTheme === 'dark',
	}

	return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}

/**
 * Hook to access theme context
 * Throws if used outside ThemeProvider
 */
export function useTheme(): ThemeContextValue {
	const context = useContext(ThemeContext)

	if (context === null) {
		throw new Error('useTheme must be used within a ThemeProvider')
	}

	return context
}

/**
 * Hook to check if dark mode is active
 * Convenience wrapper for common use case
 */
export function useIsDarkMode(): boolean {
	return useTheme().isDark
}
