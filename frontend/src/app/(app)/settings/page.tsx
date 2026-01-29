'use client'

import { Settings as SettingsIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, Skeleton } from '@/components/ui'
import { useSession } from '@/lib/auth-client'
import { SettingsForm } from './_components'

export default function SettingsPage() {
	const router = useRouter()
	// Better Auth native session hook
	const { data: session, isPending } = useSession()
	const user = session?.user
	const isAuthenticated = !!user

	useEffect(() => {
		if (!isPending && !isAuthenticated) {
			router.push('/login')
		}
	}, [isPending, isAuthenticated, router])

	if (isPending) {
		return (
			<div className="max-w-2xl mx-auto">
				<Skeleton className="h-8 w-32 mb-6" />
				<Card padding="lg">
					<Skeleton className="h-6 w-40 mb-6" />
					<div className="space-y-6">
						<Skeleton className="h-16 w-16 rounded-full" />
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-24 w-full" />
					</div>
				</Card>
			</div>
		)
	}

	if (!user) {
		return null // Will redirect
	}

	return (
		<div className="max-w-2xl mx-auto">
			<div className="flex items-center gap-3 mb-6">
				<SettingsIcon className="h-6 w-6 text-primary" />
				<h1 className="text-2xl font-bold">Settings</h1>
			</div>

			<SettingsForm
				user={{
					id: user.id,
					name: user.name ?? '',
					email: user.email ?? '',
					avatar: user.image ?? undefined,
					bio: undefined, // TODO: Add bio to Better Auth user metadata
				}}
			/>
		</div>
	)
}
