'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant =
	| 'default'
	| 'primary'
	| 'secondary'
	| 'success'
	| 'warning'
	| 'error'
	| 'outline'
	| 'yc'
type BadgeSize = 'sm' | 'md'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
	variant?: BadgeVariant
	size?: BadgeSize
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
	default: 'bg-surface-alt text-text-secondary border border-border',
	primary: 'bg-primary-muted text-primary',
	secondary: 'bg-surface-alt text-text',
	success: 'bg-success-muted text-success',
	warning: 'bg-warning-muted text-warning',
	error: 'bg-error-muted text-error',
	outline: 'bg-transparent border border-border text-text-secondary',
	yc: 'bg-accent-muted text-accent',
} as const

const SIZE_STYLES: Record<BadgeSize, string> = {
	sm: 'px-1.5 py-0.5 text-xs',
	md: 'px-2.5 py-0.5 text-xs',
} as const

const BASE_STYLES = 'inline-flex items-center font-medium rounded-full'

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
	{ className, variant = 'default', size = 'md', ...props },
	ref,
) {
	return (
		<span
			ref={ref}
			className={cn(BASE_STYLES, VARIANT_STYLES[variant], SIZE_STYLES[size], className)}
			{...props}
		/>
	)
})

export { Badge, type BadgeProps, type BadgeVariant, type BadgeSize }
