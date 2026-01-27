'use client'

import { ArrowBigUp, Bell, Check, MessageSquare, Reply, Sparkles, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Avatar, Button, Card, Skeleton } from '@/components/ui'
import { api } from '@/lib/api'
import { cn, formatRelativeTime } from '@/lib/utils'

type NotificationType = 'vote' | 'comment' | 'reply' | 'follow' | 'similar'

interface Notification {
	readonly id: string
	readonly type: NotificationType
	readonly read: boolean
	readonly data: {
		readonly idea?: {
			readonly id: string
			readonly title: string
		}
		readonly voter?: {
			readonly id: string
			readonly name: string
			readonly avatar?: string
		}
		readonly commenter?: {
			readonly id: string
			readonly name: string
			readonly avatar?: string
		}
		readonly follower?: {
			readonly id: string
			readonly name: string
			readonly avatar?: string
		}
		readonly vote_type?: string
		readonly comment_preview?: string
	}
	readonly created_at: string
}

const NOTIFICATION_ICONS: Record<NotificationType, React.ReactNode> = {
	vote: <ArrowBigUp className="h-4 w-4" />,
	comment: <MessageSquare className="h-4 w-4" />,
	reply: <Reply className="h-4 w-4" />,
	follow: <UserPlus className="h-4 w-4" />,
	similar: <Sparkles className="h-4 w-4" />,
}

const NOTIFICATION_COLORS: Record<NotificationType, string> = {
	vote: 'bg-primary-muted text-primary',
	comment: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
	reply: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
	follow: 'bg-success-muted text-success',
	similar: 'bg-warning-muted text-warning',
}

function getNotificationContent(notification: Notification): {
	message: string
	link: string
	actor?: { name: string; avatar?: string }
} {
	const { type, data } = notification

	switch (type) {
		case 'vote':
			return {
				message: `voted on your idea "${data.idea?.title}"`,
				link: `/ideas/${data.idea?.id}`,
				actor: data.voter,
			}
		case 'comment':
			return {
				message: `commented on "${data.idea?.title}"`,
				link: `/ideas/${data.idea?.id}#comments`,
				actor: data.commenter,
			}
		case 'reply':
			return {
				message: `replied to your comment on "${data.idea?.title}"`,
				link: `/ideas/${data.idea?.id}#comments`,
				actor: data.commenter,
			}
		case 'follow':
			return {
				message: 'started following you',
				link: `/profile/${data.follower?.id}`,
				actor: data.follower,
			}
		case 'similar':
			return {
				message: `A similar idea to yours was posted: "${data.idea?.title}"`,
				link: `/ideas/${data.idea?.id}`,
			}
		default:
			return {
				message: 'New notification',
				link: '/app',
			}
	}
}

function NotificationItem({
	notification,
	onMarkRead,
}: {
	notification: Notification
	onMarkRead: (id: string) => void
}) {
	const { message, link, actor } = getNotificationContent(notification)

	return (
		<Link
			href={link}
			onClick={() => !notification.read && onMarkRead(notification.id)}
			className={cn(
				'flex items-start gap-3 p-4 hover:bg-surface-alt/50 transition-colors',
				!notification.read && 'bg-primary-muted/20',
			)}
		>
			<div
				className={cn(
					'shrink-0 h-8 w-8 rounded-full flex items-center justify-center',
					NOTIFICATION_COLORS[notification.type],
				)}
			>
				{NOTIFICATION_ICONS[notification.type]}
			</div>

			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2 mb-1">
					{actor && (
						<>
							<Avatar src={actor.avatar} name={actor.name} size="xs" />
							<span className="font-medium text-sm">{actor.name}</span>
						</>
					)}
				</div>
				<p className="text-sm text-text-secondary line-clamp-2">{message}</p>
				<span className="text-xs text-text-muted mt-1 block">
					{formatRelativeTime(notification.created_at)}
				</span>
			</div>

			{!notification.read && (
				<div className="shrink-0">
					<span className="h-2 w-2 rounded-full bg-primary block" />
				</div>
			)}
		</Link>
	)
}

function NotificationSkeleton() {
	return (
		<div className="flex items-start gap-3 p-4">
			<Skeleton className="h-8 w-8 rounded-full" />
			<div className="flex-1">
				<Skeleton className="h-4 w-32 mb-2" />
				<Skeleton className="h-4 w-full mb-1" />
				<Skeleton className="h-3 w-20" />
			</div>
		</div>
	)
}

export function NotificationList() {
	const [notifications, setNotifications] = useState<Notification[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				const response = await api.get<Notification[]>('/api/v1/notifications')
				const data = 'data' in response ? response.data : response
				setNotifications(data as Notification[])
			} catch (err) {
				setError('Failed to load notifications')
				console.error('Failed to fetch notifications:', err)
			} finally {
				setIsLoading(false)
			}
		}

		fetchNotifications()
	}, [])

	const handleMarkRead = async (id: string) => {
		try {
			await api.put(`/api/v1/notifications/${id}/read`, {})
			setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
		} catch (err) {
			console.error('Failed to mark notification as read:', err)
		}
	}

	const handleMarkAllRead = async () => {
		try {
			await api.put('/api/v1/notifications/read-all', {})
			setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
		} catch (err) {
			console.error('Failed to mark all as read:', err)
		}
	}

	const unreadCount = notifications.filter((n) => !n.read).length

	return (
		<Card padding="none">
			<div className="flex items-center justify-between px-4 py-3 border-b border-border">
				<h2 className="font-semibold">Notifications</h2>
				{unreadCount > 0 && (
					<Button
						variant="ghost"
						size="sm"
						onClick={handleMarkAllRead}
						leftIcon={<Check className="h-4 w-4" />}
					>
						Mark all read
					</Button>
				)}
			</div>

			{isLoading && (
				<div className="divide-y divide-border">
					<NotificationSkeleton />
					<NotificationSkeleton />
					<NotificationSkeleton />
				</div>
			)}

			{error && <div className="p-8 text-center text-text-muted">{error}</div>}

			{!isLoading && !error && notifications.length === 0 && (
				<div className="p-8 text-center text-text-muted">
					<Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
					<p>No notifications yet</p>
					<p className="text-sm mt-1">We&apos;ll notify you when something happens</p>
				</div>
			)}

			{!isLoading && !error && notifications.length > 0 && (
				<div className="divide-y divide-border">
					{notifications.map((notification) => (
						<NotificationItem
							key={notification.id}
							notification={notification}
							onMarkRead={handleMarkRead}
						/>
					))}
				</div>
			)}
		</Card>
	)
}
