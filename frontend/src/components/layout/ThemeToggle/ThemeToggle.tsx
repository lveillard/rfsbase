'use client'

import { Monitor, Moon, Sun } from 'lucide-react'
import { memo, useCallback, useMemo } from 'react'
import { useTheme } from '@/lib/theme/provider'
import { cn } from '@/lib/utils'

type ThemePreference = 'light' | 'dark' | 'system'

interface ThemeToggleProps {
	className?: string
	showLabel?: boolean
}

const THEMES: readonly ThemePreference[] = ['light', 'dark', 'system'] as const

const ICON_SIZE = 'h-4 w-4'

const ThemeToggle = memo(function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
	const { theme, setTheme, resolvedTheme } = useTheme()

	const cycleTheme = useCallback(() => {
		const currentIndex = THEMES.indexOf(theme)
		const nextIndex = (currentIndex + 1) % THEMES.length
		const nextTheme = THEMES[nextIndex]
		if (nextTheme !== undefined) {
			setTheme(nextTheme)
		}
	}, [theme, setTheme])

	const icon = useMemo(() => {
		if (theme === 'system') {
			return <Monitor className={ICON_SIZE} aria-hidden />
		}
		return resolvedTheme === 'dark' ? (
			<Moon className={ICON_SIZE} aria-hidden />
		) : (
			<Sun className={ICON_SIZE} aria-hidden />
		)
	}, [theme, resolvedTheme])

	return (
		<button
			type="button"
			onClick={cycleTheme}
			className={cn(
				'inline-flex items-center justify-center gap-2',
				'h-9 w-9 rounded-lg',
				'text-text-secondary hover:text-text',
				'hover:bg-surface-alt',
				'transition-colors duration-200',
				'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
				showLabel && 'w-auto px-3',
				className,
			)}
			aria-label={`Current theme: ${theme}. Click to change.`}
		>
			{icon}
			{showLabel && <span className="text-sm font-medium capitalize">{theme}</span>}
		</button>
	)
})

export { ThemeToggle }
