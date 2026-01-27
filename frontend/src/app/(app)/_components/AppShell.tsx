'use client'

import { useState } from 'react'
import { MobileHeader } from './MobileHeader'
import { Sidebar } from './Sidebar'

interface AppShellProps {
	children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false)

	const toggleSidebar = () => setSidebarOpen((prev) => !prev)
	const closeSidebar = () => setSidebarOpen(false)

	return (
		<div className="min-h-screen bg-background">
			<MobileHeader isOpen={sidebarOpen} onToggle={toggleSidebar} />

			<div className="flex">
				<Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

				<main className="flex-1 min-h-screen lg:min-h-[calc(100vh-0px)]">
					<div className="container-wide py-6">{children}</div>
				</main>
			</div>
		</div>
	)
}
