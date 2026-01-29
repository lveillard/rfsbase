'use client'

import { Lightbulb } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, Skeleton } from '@/components/ui'
import { useSession } from '@/lib/auth-client'
import { IdeaForm } from './_components'

export default function NewIdeaPage() {
	const router = useRouter()
	const { data: session, isPending } = useSession()
	const isAuthenticated = !!session?.user

	useEffect(() => {
		if (!isPending && !isAuthenticated) {
			router.push('/login')
		}
	}, [isPending, isAuthenticated, router])

	if (isPending) {
		return (
			<div className="max-w-3xl mx-auto">
				<Skeleton className="h-8 w-48 mb-6" />
				<Card padding="lg">
					<div className="space-y-6">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-32 w-full" />
						<Skeleton className="h-32 w-full" />
					</div>
				</Card>
			</div>
		)
	}

	if (!isAuthenticated) {
		return null
	}

	return (
		<div className="max-w-3xl mx-auto">
			<div className="flex items-center gap-3 mb-6">
				<Lightbulb className="h-6 w-6 text-primary" />
				<h1 className="text-2xl font-bold">Share Your Idea</h1>
			</div>

			<Card padding="lg">
				<IdeaForm />
			</Card>
		</div>
	)
}
