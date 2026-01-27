'use client'

import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

type SkeletonVariant = 'text' | 'circular' | 'rectangular'
type SkeletonSize = 'sm' | 'md' | 'lg'

interface SkeletonProps {
	className?: string
	variant?: SkeletonVariant
	width?: string | number
	height?: string | number
	lines?: number
}

const VARIANT_STYLES: Record<SkeletonVariant, string> = {
	circular: 'rounded-full',
	text: 'rounded h-4',
	rectangular: 'rounded-lg',
} as const

const BASE_STYLES = 'animate-pulse bg-surface-alt'

function Skeleton({ className, variant = 'rectangular', width, height, lines = 1 }: SkeletonProps) {
	const style: CSSProperties = { width, height }
	const combinedStyles = cn(BASE_STYLES, VARIANT_STYLES[variant])

	if (variant === 'text' && lines > 1) {
		return (
			<div className={cn('space-y-2', className)} role="status" aria-label="Loading">
				{Array.from({ length: lines }, (_, index) => (
					<div
						key={index}
						className={cn(combinedStyles, index === lines - 1 && 'w-3/4')}
						style={style}
					/>
				))}
			</div>
		)
	}

	return (
		<div
			className={cn(combinedStyles, className)}
			style={style}
			role="status"
			aria-label="Loading"
		/>
	)
}

const AVATAR_SIZE_CLASSES: Record<SkeletonSize, string> = {
	sm: 'h-8 w-8',
	md: 'h-10 w-10',
	lg: 'h-12 w-12',
} as const

const BUTTON_SIZE_CLASSES: Record<SkeletonSize, string> = {
	sm: 'h-8 w-20',
	md: 'h-10 w-24',
	lg: 'h-12 w-28',
} as const

interface SkeletonSizeProps {
	size?: SkeletonSize
}

function SkeletonCard() {
	return (
		<div
			className="p-4 sm:p-6 bg-surface border border-border rounded-xl space-y-4"
			role="status"
			aria-label="Loading card"
		>
			<div className="flex items-center gap-3">
				<Skeleton variant="circular" className="h-10 w-10" />
				<div className="space-y-2 flex-1">
					<Skeleton variant="text" className="w-24" />
					<Skeleton variant="text" className="w-16 h-3" />
				</div>
			</div>
			<Skeleton variant="text" className="w-3/4 h-5" />
			<Skeleton variant="text" lines={3} />
			<div className="flex gap-2">
				<Skeleton className="h-6 w-16 rounded-full" />
				<Skeleton className="h-6 w-20 rounded-full" />
			</div>
			<div className="flex items-center gap-4 pt-2">
				<Skeleton className="h-8 w-20" />
				<Skeleton className="h-8 w-24" />
			</div>
		</div>
	)
}

function SkeletonAvatar({ size = 'md' }: SkeletonSizeProps) {
	return <Skeleton variant="circular" className={AVATAR_SIZE_CLASSES[size]} />
}

function SkeletonButton({ size = 'md' }: SkeletonSizeProps) {
	return <Skeleton className={cn(BUTTON_SIZE_CLASSES[size], 'rounded-lg')} />
}

export {
	Skeleton,
	SkeletonCard,
	SkeletonAvatar,
	SkeletonButton,
	type SkeletonProps,
	type SkeletonVariant,
	type SkeletonSize,
}
