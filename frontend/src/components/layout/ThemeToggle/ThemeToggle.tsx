'use client'

import { Moon, Sun } from 'lucide-react'
import { memo } from 'react'
import { useTheme } from '@/lib/theme/provider'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
	className?: string
}

const ThemeToggle = memo(function ThemeToggle({ className }: ThemeToggleProps) {
	const { resolvedTheme, toggleTheme } = useTheme()
	const isDark = resolvedTheme === 'dark'

	return (
		<button
			type="button"
			onClick={toggleTheme}
			className={cn(
				'flex items-center gap-0.5 p-1 rounded-lg bg-surface-alt cursor-pointer',
				'transition-all duration-200',
				'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
				className,
			)}
			aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
		>
			<span
				className={cn(
					'p-1.5 rounded-md transition-all duration-200',
					!isDark ? 'bg-accent text-white shadow-sm' : 'text-text-muted',
				)}
			>
				<Sun className="h-3.5 w-3.5" />
			</span>
			<span
				className={cn(
					'p-1.5 rounded-md transition-all duration-200',
					isDark ? 'bg-accent text-white shadow-sm' : 'text-text-muted',
				)}
			>
				<Moon className="h-3.5 w-3.5" />
			</span>
		</button>
	)
})

export { ThemeToggle }
