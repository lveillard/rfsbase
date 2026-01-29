'use client'

import { Bell } from 'lucide-react'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { cn } from '@/lib/utils'

type NotificationType = 'vote' | 'comment' | 'reply' | 'follow' | 'similar'

interface Notification {
	readonly id: string
	readonly type: NotificationType
	readonly read: boolean
	readonly data: {
		readonly idea?: { readonly id: string; readonly title: string }
		readonly voter?: { readonly id: string; readonly name: string; readonly avatar?: string }
		readonly commenter?: { readonly id: string; readonly name: string; readonly avatar?: string }
		readonly follower?: { readonly id: string; readonly name: string; readonly avatar?: string }
		readonly vote_type?: string
		readonly comment_preview?: string
	}
	readonly created_at: string
}

export function NotificationList() {
	// TODO: Implement notifications with Server Actions
	const [notifications] = useState<Notification[]>([])

	if (notifications.length === 0) {
		return (
			<Card padding="none">
				<div className="px-4 py-3 border-b border-border">
					<h2 className="font-semibold">Notifications</h2>
				</div>
				<div className="p-8 text-center text-text-muted">
					<Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
					<p>No notifications yet</p>
					<p className="text-sm mt-1">We&apos;ll notify you when something happens</p>
				</div>
			</Card>
		)
	}

	return (
		<Card padding="none">
			<div className="px-4 py-3 border-b border-border">
				<h2 className="font-semibold">Notifications</h2>
			</div>
			<div className="divide-y divide-border">
				{notifications.map((n) => (
					<div key={n.id} className={cn('p-4', !n.read && 'bg-primary-muted/20')}>
						Notification {n.type}
					</div>
				))}
			</div>
		</Card>
	)
}
