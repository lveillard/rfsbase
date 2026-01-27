'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type CardVariant = 'default' | 'outlined' | 'elevated'
type CardPadding = 'none' | 'sm' | 'md' | 'lg'
type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
	variant?: CardVariant
	padding?: CardPadding
	hoverable?: boolean
}

const CARD_VARIANTS: Record<CardVariant, string> = {
	default: 'bg-surface border border-border',
	outlined: 'bg-transparent border border-border',
	elevated: 'bg-surface shadow-lg border border-border/50',
} as const

const CARD_PADDING: Record<CardPadding, string> = {
	none: '',
	sm: 'p-3',
	md: 'p-4 sm:p-6',
	lg: 'p-6 sm:p-8',
} as const

const HOVER_STYLES =
	'transition-all duration-200 hover:border-border-hover hover:shadow-md cursor-pointer'

const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
	{ className, variant = 'default', padding = 'md', hoverable = false, children, ...props },
	ref,
) {
	return (
		<div
			ref={ref}
			className={cn(
				'rounded-xl',
				CARD_VARIANTS[variant],
				CARD_PADDING[padding],
				hoverable && HOVER_STYLES,
				className,
			)}
			{...props}
		>
			{children}
		</div>
	)
})

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
	{ className, ...props },
	ref,
) {
	return <div ref={ref} className={cn('flex flex-col space-y-1.5', className)} {...props} />
})

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
	as?: HeadingLevel
}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle(
	{ className, as: Component = 'h3', ...props },
	ref,
) {
	return (
		<Component ref={ref} className={cn('text-lg font-semibold text-text', className)} {...props} />
	)
})

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
	function CardDescription({ className, ...props }, ref) {
		return <p ref={ref} className={cn('text-sm text-text-secondary', className)} {...props} />
	},
)

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(function CardContent(
	{ className, ...props },
	ref,
) {
	return <div ref={ref} className={className} {...props} />
})

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter(
	{ className, ...props },
	ref,
) {
	return <div ref={ref} className={cn('flex items-center pt-4', className)} {...props} />
})

export {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
	type CardProps,
	type CardHeaderProps,
	type CardTitleProps,
	type CardDescriptionProps,
	type CardContentProps,
	type CardFooterProps,
	type CardVariant,
	type CardPadding,
}
