'use client'

import { ArrowBigUp, Lightbulb, MessageSquare, Users } from 'lucide-react'
import { Card } from '@/components/ui'
import { formatNumber } from '@/lib/utils'

interface ProfileStatsProps {
	ideasCount: number
	votesReceived: number
	commentsCount: number
	followersCount: number
	followingCount: number
}

interface StatItemProps {
	icon: React.ReactNode
	value: number
	label: string
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

export function ProfileStats({
	ideasCount,
	votesReceived,
	commentsCount,
	followersCount,
	followingCount,
}: ProfileStatsProps) {
	return (
		<Card padding="none">
			<div className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-y sm:divide-y-0 divide-border">
				<StatItem icon={<Lightbulb className="h-5 w-5" />} value={ideasCount} label="Ideas" />
				<StatItem
					icon={<ArrowBigUp className="h-5 w-5" />}
					value={votesReceived}
					label="Votes Received"
				/>
				<StatItem
					icon={<MessageSquare className="h-5 w-5" />}
					value={commentsCount}
					label="Comments"
				/>
				<StatItem icon={<Users className="h-5 w-5" />} value={followersCount} label="Followers" />
				<StatItem icon={<Users className="h-5 w-5" />} value={followingCount} label="Following" />
			</div>
		</Card>
	)
}
