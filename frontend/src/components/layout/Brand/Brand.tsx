import appConfig from '@config/app.config.json'
import { Sparkles } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface BrandProps {
	href?: string
	size?: 'sm' | 'md' | 'lg'
	showName?: boolean
	className?: string
}

const sizes = {
	sm: { icon: 'h-6 w-6', iconInner: 'h-3 w-3', text: 'text-sm' },
	md: { icon: 'h-8 w-8', iconInner: 'h-4 w-4', text: 'text-lg' },
	lg: { icon: 'h-10 w-10', iconInner: 'h-5 w-5', text: 'text-xl' },
} as const

export function Brand({ href = '/', size = 'md', showName = true, className }: BrandProps) {
	const { icon, iconInner, text } = sizes[size]

	const content = (
		<div className={cn('flex items-center gap-2', className)}>
			<div
				className={cn('flex items-center justify-center rounded-lg bg-primary text-white', icon)}
			>
				<Sparkles className={iconInner} />
			</div>
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
