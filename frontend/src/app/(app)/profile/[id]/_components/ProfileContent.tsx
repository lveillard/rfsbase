'use client'

import { useAuthStore } from '@/lib/auth'
import { ProfileHeader } from './ProfileHeader'
import { ProfileStats } from './ProfileStats'
import { UserIdeas } from './UserIdeas'

interface ProfileUser {
	readonly id: string
	readonly name: string
	readonly avatar?: string
	readonly bio?: string
	readonly verified_email: boolean
	readonly verified_yc?: {
		readonly batch?: string
		readonly company?: string
	}
	readonly created_at: string
}

interface ProfileStatsData {
	ideasCount: number
	votesReceived: number
	commentsCount: number
	followersCount: number
	followingCount: number
}

interface ProfileContentProps {
	profileUserId: string
	user: ProfileUser
	stats: ProfileStatsData
}

export function ProfileContent({ profileUserId, user, stats }: ProfileContentProps) {
	const { user: currentUser } = useAuthStore()
	const isOwnProfile = currentUser?.id === profileUserId

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			<ProfileHeader user={user} isOwnProfile={isOwnProfile} />
			<ProfileStats {...stats} />
			<UserIdeas userId={profileUserId} />
		</div>
	)
}
