import type { ReactNode } from 'react'
import { Card } from '@/components/ui'

interface LegalPageLayoutProps {
	title: string
	lastUpdated: string
	children: ReactNode
}

export function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
	return (
		<div className="py-16 px-4 sm:px-6 lg:px-8">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-4xl font-bold mb-2">{title}</h1>
				<p className="text-text-muted mb-8">Last updated: {lastUpdated}</p>
				<Card padding="lg" className="prose prose-neutral dark:prose-invert max-w-none">
					{children}
				</Card>
			</div>
		</div>
	)
}

interface LegalSectionProps {
	title: string
	children: ReactNode
	last?: boolean
}

export function LegalSection({ title, children, last = false }: LegalSectionProps) {
	return (
		<section className={last ? '' : 'mb-8'}>
			<h2 className="text-xl font-semibold mb-4">{title}</h2>
			<div className="text-text-secondary space-y-2 [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-1">
				{children}
			</div>
		</section>
	)
}
