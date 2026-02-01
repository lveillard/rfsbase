'use client'

import { cn } from '@/lib/utils'

interface ToggleProps {
	checked: boolean
	onChange: (checked: boolean) => void
	disabled?: boolean
	className?: string
}

export function Toggle({ checked, onChange, disabled, className }: ToggleProps) {
	return (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			disabled={disabled}
			onClick={() => onChange(!checked)}
			className={cn(
				'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent',
				'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
				checked ? 'bg-accent' : 'bg-surface-alt',
				disabled && 'cursor-not-allowed opacity-50',
				className,
			)}
		>
			<span
				className={cn(
					'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform',
					checked ? 'translate-x-5' : 'translate-x-0',
				)}
			/>
		</button>
	)
}
