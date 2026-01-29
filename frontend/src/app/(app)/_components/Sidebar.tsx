'use client'

import { Bell, Lightbulb, LogOut, PlusCircle, Search, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Brand, ThemeToggle } from '@/components/layout'
import { Avatar } from '@/components/ui'
import { signOut, useSession } from '@/lib/auth-client'
import { cn, parseId } from '@/lib/utils'

const navItems = [
	{ href: '/ideas', label: 'Ideas', icon: Lightbulb },
	{ href: '/ideas/new', label: 'New Idea', icon: PlusCircle },
	{ href: '/notifications', label: 'Notifications', icon: Bell },
	{ href: '/settings', label: 'Settings', icon: Settings },
] as const

interface SidebarProps {
	isOpen: boolean
	onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
	const pathname = usePathname()
	const router = useRouter()

	// Better Auth native session hook
	const { data: session, isPending } = useSession()
	const user = session?.user
	const isAuthenticated = !!user

	const isNavItemActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

	const handleLogout = async () => {
		await signOut()
		router.push('/login')
	}

	// Default user info for unauthenticated state
	const displayUser = {
		id: user?.id ?? '',
		name: user?.name ?? 'Guest',
		email: user?.email ?? '',
		avatar: user?.image ?? undefined,
	}

	return (
		<>
			<aside
				className={cn(
					'fixed inset-y-0 left-0 z-40 w-64 bg-surface border-r border-border',
					'transform transition-transform duration-200 ease-in-out',
					'lg:relative lg:translate-x-0',
					isOpen ? 'translate-x-0' : '-translate-x-full',
				)}
			>
				<div className="hidden lg:flex items-center gap-2 h-14 px-4 border-b border-border">
					<Brand href="/" />
				</div>

				<div className="p-4 lg:pt-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
						<input
							type="text"
							placeholder="Search ideas..."
							className="w-full h-9 pl-9 pr-3 rounded-lg bg-surface-alt border border-border text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
						/>
					</div>
				</div>

				<nav className="px-2 space-y-1">
					{navItems.map((item) => {
						const isActive = isNavItemActive(item.href)
						return (
							<Link
								key={item.href}
								href={item.href}
								onClick={onClose}
								className={cn(
									'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium',
									'transition-colors',
									isActive
										? 'bg-accent-muted text-accent'
										: 'text-text-secondary hover:text-text hover:bg-surface-alt',
								)}
							>
								<item.icon className="h-4 w-4" />
								{item.label}
							</Link>
						)
					})}
				</nav>

				<div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
					<div className="flex items-center gap-3">
						{isAuthenticated && user ? (
							<Link href={`/profile/${parseId(user.id)}`} onClick={onClose}>
								<Avatar src={displayUser.avatar} name={displayUser.name} size="sm" />
							</Link>
						) : (
							<Avatar src={undefined} name={displayUser.name} size="sm" />
						)}
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium truncate">{displayUser.name}</p>
							<p className="text-xs text-text-muted truncate">
								{displayUser.email || 'Not signed in'}
							</p>
						</div>
						<div className="flex gap-1">
							<ThemeToggle />
							{isAuthenticated && !isPending && (
								<button
									type="button"
									onClick={handleLogout}
									className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-alt"
									title="Log out"
								>
									<LogOut className="h-4 w-4" />
								</button>
							)}
						</div>
					</div>
				</div>
			</aside>

			{isOpen && (
				<button
					type="button"
					className="fixed inset-0 z-30 bg-black/50 lg:hidden cursor-default"
					onClick={onClose}
					aria-label="Close sidebar"
				/>
			)}
		</>
	)
}
