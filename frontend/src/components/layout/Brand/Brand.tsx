import appConfig from '@config/app.config.json'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface BrandProps {
	href?: string
	size?: 'sm' | 'md' | 'lg'
	showName?: boolean
	className?: string
}

const sizes = {
	sm: { logo: 24, text: 'text-sm' },
	md: { logo: 32, text: 'text-lg' },
	lg: { logo: 40, text: 'text-xl' },
} as const

export function Brand({ href = '/', size = 'md', showName = true, className }: BrandProps) {
	const { logo, text } = sizes[size]

	const content = (
		<div className={cn('flex items-center gap-2', className)}>
			<Image
				src="/logo.svg"
				alt={appConfig.name}
				width={logo}
				height={logo}
				className="flex-shrink-0"
			/>
			{showName && <span className={cn('font-semibold', text)}>{appConfig.name}</span>}
		</div>
	)

	if (href) {
		return (
			<Link href={href} className="group">
				{content}
			</Link>
		)
	}

	return content
}
