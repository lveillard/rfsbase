'use client'

import type { SVGAttributes } from 'react'
import { cn } from '@/lib/utils'

type IconSize = 'xs' | 'sm' | 'md' | 'lg'

interface IconProps extends SVGAttributes<SVGElement> {
	size?: IconSize
}

const SIZE_CLASSES: Record<IconSize, string> = {
	xs: 'h-3 w-3',
	sm: 'h-4 w-4',
	md: 'h-5 w-5',
	lg: 'h-6 w-6',
} as const

function CheckIcon({ size = 'sm', className, ...props }: IconProps) {
	return (
		<svg
			className={cn(SIZE_CLASSES[size], className)}
			fill="currentColor"
			viewBox="0 0 20 20"
			aria-hidden="true"
			{...props}
		>
			<path
				fillRule="evenodd"
				d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
				clipRule="evenodd"
			/>
		</svg>
	)
}

export { CheckIcon, type IconProps, type IconSize }
