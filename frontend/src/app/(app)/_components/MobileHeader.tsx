'use client'

import { Menu, X } from 'lucide-react'
import { Brand } from '@/components/layout'

interface MobileHeaderProps {
	isOpen: boolean
	onToggle: () => void
}

export function MobileHeader({ isOpen, onToggle }: MobileHeaderProps) {
	return (
		<header className="sticky top-0 z-50 lg:hidden flex items-center justify-between h-14 px-4 border-b border-border bg-surface">
			<Brand href="/ideas" />
			<button
				type="button"
				onClick={onToggle}
				className="p-2 rounded-lg hover:bg-surface-alt"
				aria-label={isOpen ? 'Close menu' : 'Open menu'}
			>
				{isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
			</button>
		</header>
	)
}
