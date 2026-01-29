'use client'

import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Spinner } from '../Spinner'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant
	size?: ButtonSize
	isLoading?: boolean
	leftIcon?: ReactNode
	rightIcon?: ReactNode
}

const BASE_STYLES = cn(
	'inline-flex items-center justify-center font-medium',
	'rounded-lg transition-all duration-200 cursor-pointer',
	'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
	'disabled:opacity-50 disabled:cursor-not-allowed',
)

const VARIANT_STYLES: Record<ButtonVariant, string> = {
	primary: 'bg-primary text-white hover:bg-primary-hover focus-visible:ring-primary',
	secondary: 'bg-secondary text-white hover:bg-secondary-hover focus-visible:ring-secondary',
	outline:
		'border border-border bg-transparent text-text hover:bg-surface-alt hover:border-border-hover focus-visible:ring-primary',
	ghost: 'bg-transparent text-text hover:bg-surface-alt focus-visible:ring-primary',
	danger: 'bg-error text-white hover:bg-error/90 focus-visible:ring-error',
} as const

const SIZE_STYLES: Record<ButtonSize, string> = {
	sm: 'h-8 px-3 text-sm gap-1.5',
	md: 'h-10 px-4 text-sm gap-2',
	lg: 'h-12 px-6 text-base gap-2',
} as const

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
	{
		className,
		variant = 'primary',
		size = 'md',
		isLoading = false,
		leftIcon,
		rightIcon,
		disabled,
		children,
		type = 'button',
		...props
	},
	ref,
) {
	const isDisabled = disabled || isLoading

	return (
		<button
			ref={ref}
			type={type}
			className={cn(BASE_STYLES, VARIANT_STYLES[variant], SIZE_STYLES[size], className)}
			disabled={isDisabled}
			aria-busy={isLoading}
			{...props}
		>
			{isLoading ? <Spinner size="sm" aria-hidden /> : leftIcon}
			{children}
			{!isLoading && rightIcon}
		</button>
	)
})

export { Button, type ButtonProps, type ButtonVariant, type ButtonSize }
