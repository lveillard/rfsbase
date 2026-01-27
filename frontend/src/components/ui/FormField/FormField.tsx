'use client'

import type { ReactNode } from 'react'

interface FormFieldProps {
	id?: string
	label?: string
	error?: string
	hint?: string
	children: ReactNode
	footer?: ReactNode
}

function FormField({ id, label, error, hint, children, footer }: FormFieldProps) {
	const hasMessage = Boolean(error || hint)
	const hasFooter = Boolean(footer) || hasMessage

	return (
		<div className="w-full">
			{label && (
				<label htmlFor={id} className="block text-sm font-medium text-text mb-1.5">
					{label}
				</label>
			)}
			{children}
			{hasFooter && (
				<div className="flex justify-between items-center mt-1.5">
					<div>
						{error && (
							<p className="text-sm text-error" role="alert">
								{error}
							</p>
						)}
						{hint && !error && <p className="text-sm text-text-muted">{hint}</p>}
					</div>
					{footer}
				</div>
			)}
		</div>
	)
}

export { FormField, type FormFieldProps }
