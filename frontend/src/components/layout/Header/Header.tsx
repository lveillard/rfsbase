'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import { Brand } from '../Brand'
import { ThemeToggle } from '../ThemeToggle'

interface HeaderProps {
	variant?: 'marketing' | 'app'
	user?: {
		id: string
		name: string
		avatar?: string
	} | null
}

const marketingLinks = [
	{ href: '/about', label: 'About' },
	{ href: '/pricing', label: 'Pricing' },
	{ href: '/blog', label: 'Blog' },
] as const

export function Header({ variant = 'marketing', user }: HeaderProps) {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const toggleMenu = useCallback(() => setMobileMenuOpen((prev) => !prev), [])
	const closeMenu = useCallback(() => setMobileMenuOpen(false), [])

	const navLinkClass = cn(
		'px-3 py-2 rounded-lg text-sm font-medium',
		'text-text-secondary hover:text-text',
		'hover:bg-surface-alt transition-colors',
	)

	const renderNavLinks = (onClick?: () => void) =>
		variant === 'marketing' &&
		marketingLinks.map((link) => (
			<Link key={link.href} href={link.href} className={navLinkClass} onClick={onClick}>
				{link.label}
			</Link>
		))

	const renderAuthButtons = (mobile = false) => {
		const buttonClass = mobile ? 'w-full' : ''

		if (user) {
			return (
				<Link href="/ideas" onClick={mobile ? closeMenu : undefined}>
					<Button variant="primary" size={mobile ? 'md' : 'sm'} className={buttonClass}>
						Go to App
					</Button>
				</Link>
			)
		}

		return (
			<>
				<Link href="/login" onClick={mobile ? closeMenu : undefined}>
					<Button
						variant={mobile ? 'outline' : 'ghost'}
						size={mobile ? 'md' : 'sm'}
						className={buttonClass}
					>
						Log in
					</Button>
				</Link>
				<Link href="/signup" onClick={mobile ? closeMenu : undefined}>
					<Button variant="primary" size={mobile ? 'md' : 'sm'} className={buttonClass}>
						Sign up
					</Button>
				</Link>
			</>
		)
	}

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
			<div className="container-wide">
				<div className="flex h-16 items-center justify-between">
					<Brand />

					<nav className="hidden md:flex items-center gap-1">{renderNavLinks()}</nav>

					<div className="flex items-center gap-2">
						<ThemeToggle />

						<div className="hidden md:flex items-center gap-2">{renderAuthButtons()}</div>

						<button
							type="button"
							className="md:hidden p-2 rounded-lg hover:bg-surface-alt"
							onClick={toggleMenu}
							aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
						>
							{mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
						</button>
					</div>
				</div>

				{mobileMenuOpen && (
					<div className="md:hidden py-4 border-t border-border">
						<nav className="flex flex-col gap-1">
							{renderNavLinks(closeMenu)}
							<div className="flex flex-col gap-2 mt-4 px-3">{renderAuthButtons(true)}</div>
						</nav>
					</div>
				)}
			</div>
		</header>
	)
}
