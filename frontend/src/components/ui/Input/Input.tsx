'use client'

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { FormField } from '../FormField'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
	label?: string
	error?: string
	hint?: string
	leftIcon?: ReactNode
	rightIcon?: ReactNode
}

const BASE_STYLES = cn(
	'w-full h-10 px-3 rounded-lg',
	'bg-surface border border-border',
	'text-text placeholder:text-text-muted',
	'transition-colors duration-200',
	'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
	'disabled:opacity-50 disabled:cursor-not-allowed',
)

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
	{ className, label, error, hint, leftIcon, rightIcon, id, name, ...props },
	ref,
) {
	const inputId = id ?? name

	return (
		<FormField id={inputId} label={label} error={error} hint={hint}>
			<div className="relative">
				{leftIcon && (
					<div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
						{leftIcon}
					</div>
				)}
				<input
					ref={ref}
					id={inputId}
					name={name}
					className={cn(
						BASE_STYLES,
						leftIcon && 'pl-10',
						rightIcon && 'pr-10',
						error && 'border-error focus:ring-error',
						className,
					)}
					aria-invalid={Boolean(error)}
					aria-describedby={error ? `${inputId}-error` : undefined}
					{...props}
				/>
				{rightIcon && (
					<div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
						{rightIcon}
					</div>
				)}
			</div>
		</FormField>
	)
})

export { Input, type InputProps }
