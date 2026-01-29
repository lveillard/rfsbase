'use client'

import { useSession } from '@/lib/auth-client'
import type { ProfileStats as ProfileStatsType, ProfileUser } from '../../_types'
import { ProfileHeader } from './ProfileHeader'
import { ProfileStats } from './ProfileStats'
import { UserIdeas } from './UserIdeas'

interface ProfileContentProps {
	readonly profileUserId: string
	readonly user: ProfileUser
	readonly stats: ProfileStatsType
}

export function ProfileContent({ profileUserId, user, stats }: ProfileContentProps) {
	// Better Auth native session hook
	const { data: session } = useSession()
	const currentUserId = session?.user?.id
	const isOwnProfile = currentUserId === profileUserId

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			<ProfileHeader user={user} isOwnProfile={isOwnProfile} />
			<ProfileStats {...stats} />
			<UserIdeas userId={profileUserId} />
		</div>
	)
}
