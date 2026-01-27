'use client'

import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { FormField } from '../FormField'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string
	error?: string
	hint?: string
	showCount?: boolean
}

const BASE_STYLES = cn(
	'w-full min-h-[120px] px-3 py-2.5 rounded-lg resize-y',
	'bg-surface border border-border',
	'text-text placeholder:text-text-muted',
	'transition-colors duration-200',
	'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
	'disabled:opacity-50 disabled:cursor-not-allowed',
)

const CHARACTER_WARNING_THRESHOLD = 0.9

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
	{ className, label, error, hint, showCount, maxLength, id, name, value, ...props },
	ref,
) {
	const textareaId = id ?? name
	const currentLength = typeof value === 'string' ? value.length : 0
	const isNearLimit = maxLength ? currentLength > maxLength * CHARACTER_WARNING_THRESHOLD : false

	const countDisplay =
		showCount && maxLength ? (
			<p className={cn('text-sm', isNearLimit ? 'text-warning' : 'text-text-muted')}>
				{currentLength}/{maxLength}
			</p>
		) : null

	return (
		<FormField id={textareaId} label={label} error={error} hint={hint} footer={countDisplay}>
			<textarea
				ref={ref}
				id={textareaId}
				name={name}
				value={value}
				maxLength={maxLength}
				className={cn(BASE_STYLES, error && 'border-error focus:ring-error', className)}
				aria-invalid={Boolean(error)}
				aria-describedby={error ? `${textareaId}-error` : undefined}
				{...props}
			/>
		</FormField>
	)
})

export { Textarea, type TextareaProps }
