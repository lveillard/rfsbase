import { Bell } from 'lucide-react'
import type { Metadata } from 'next'
import { NotificationList } from './_components'

export const metadata: Metadata = {
	title: 'Notifications | RFSbase',
	description: 'Your RFSbase notifications',
}

export default function NotificationsPage() {
	return (
		<div className="max-w-2xl mx-auto">
			<div className="flex items-center gap-3 mb-6">
				<Bell className="h-6 w-6 text-primary" />
				<h1 className="text-2xl font-bold">Notifications</h1>
			</div>

			<NotificationList />
		</div>
	)
}
