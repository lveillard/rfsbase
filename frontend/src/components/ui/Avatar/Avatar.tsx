'use client'

import Image from 'next/image'
import { forwardRef } from 'react'
import { cn, getInitials } from '@/lib/utils'
import { CheckIcon } from '../Icon'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
	src?: string | null
	alt?: string
	name?: string
	size?: AvatarSize
	className?: string
	verified?: boolean
	ycVerified?: boolean
}

const SIZE_CLASSES: Record<AvatarSize, string> = {
	xs: 'h-6 w-6 text-xs',
	sm: 'h-8 w-8 text-xs',
	md: 'h-10 w-10 text-sm',
	lg: 'h-12 w-12 text-base',
	xl: 'h-16 w-16 text-lg',
} as const

const SIZE_PX: Record<AvatarSize, number> = {
	xs: 24,
	sm: 32,
	md: 40,
	lg: 48,
	xl: 64,
} as const

const BADGE_CONTAINER_SIZE: Record<AvatarSize, string> = {
	xs: 'h-3 w-3',
	sm: 'h-3 w-3',
	md: 'h-4 w-4',
	lg: 'h-4 w-4',
	xl: 'h-5 w-5',
} as const

const isSmallSize = (size: AvatarSize): boolean => size === 'xs' || size === 'sm'

const YC_BADGE_SIZE: Record<AvatarSize, number> = {
	xs: 12,
	sm: 12,
	md: 16,
	lg: 16,
	xl: 20,
} as const

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
	{ src, alt, name = '', size = 'md', className, verified, ycVerified },
	ref,
) {
	const initials = getInitials(name)
	const pixelSize = SIZE_PX[size]
	const ycBadgeSize = YC_BADGE_SIZE[size]

	// YC verification takes precedence over email verification
	const showYcBadge = ycVerified
	const showVerifiedBadge = verified && !ycVerified

	return (
		<div className="relative inline-block">
			<div
				ref={ref}
				className={cn(
					'relative rounded-full overflow-hidden',
					'bg-primary-muted text-primary',
					'flex items-center justify-center font-medium',
					SIZE_CLASSES[size],
					className,
				)}
			>
				{src ? (
					<Image
						src={src}
						alt={alt ?? name}
						fill
						className="object-cover"
						sizes={`${pixelSize}px`}
						unoptimized={src.endsWith('.svg')}
					/>
				) : (
					<span>{initials}</span>
				)}
			</div>
			{showYcBadge && (
				<div
					className={cn(
						'absolute -bottom-0.5 -right-0.5',
						'rounded-full overflow-hidden',
						BADGE_CONTAINER_SIZE[size],
					)}
					title="YC Verified"
				>
					<Image
						src="/icons/yc-badge.png"
						alt="YC Verified"
						width={ycBadgeSize}
						height={ycBadgeSize}
						className="object-contain"
					/>
				</div>
			)}
			{showVerifiedBadge && (
				<div
					className={cn(
						'absolute -bottom-0.5 -right-0.5',
						'bg-primary text-white rounded-full',
						'flex items-center justify-center',
						BADGE_CONTAINER_SIZE[size],
					)}
				>
					<CheckIcon size={isSmallSize(size) ? 'xs' : 'sm'} />
				</div>
			)}
		</div>
	)
})

export { Avatar, type AvatarProps, type AvatarSize }
