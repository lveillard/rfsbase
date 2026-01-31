'use client'

import type { UserStats } from '@rfsbase/shared'
import { ArrowBigUp, Lightbulb, MessageSquare, Users } from 'lucide-react'
import { Card } from '@/components/ui'
import { formatNumber } from '@/lib/utils'

interface ProfileStatsProps {
	readonly stats: UserStats
}

interface StatItemProps {
	readonly icon: React.ReactNode
	readonly value: number
	readonly label: string
}

function StatItem({ icon, value, label }: StatItemProps) {
	return (
		<div className="flex flex-col items-center gap-1 p-4">
			<div className="flex items-center gap-2 text-primary">
				{icon}
				<span className="text-2xl font-bold text-text">{formatNumber(value)}</span>
			</div>
			<span className="text-sm text-text-muted">{label}</span>
		</div>
	)
}

export function ProfileStats({ stats }: ProfileStatsProps) {
	return (
		<Card padding="none">
			<div className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-y sm:divide-y-0 divide-border">
				<StatItem icon={<Lightbulb className="h-5 w-5" />} value={stats.ideasCount} label="Ideas" />
				<StatItem
					icon={<ArrowBigUp className="h-5 w-5" />}
					value={stats.votesReceived}
					label="Votes Received"
				/>
				<StatItem
					icon={<MessageSquare className="h-5 w-5" />}
					value={stats.commentsCount}
					label="Comments"
				/>
				<StatItem
					icon={<Users className="h-5 w-5" />}
					value={stats.followersCount}
					label="Followers"
				/>
				<StatItem
					icon={<Users className="h-5 w-5" />}
					value={stats.followingCount}
					label="Following"
				/>
			</div>
		</Card>
	)
}
