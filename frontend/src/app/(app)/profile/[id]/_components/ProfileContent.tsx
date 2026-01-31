'use client'

import type { User } from '@rfsbase/shared'
import { useSession } from '@/lib/auth-client'
import { ProfileHeader } from './ProfileHeader'
import { ProfileStats } from './ProfileStats'
import { UserIdeas } from './UserIdeas'

interface ProfileContentProps {
	readonly user: User
}

export function ProfileContent({ user }: ProfileContentProps) {
	const { data: session } = useSession()
	const isOwnProfile = session?.user?.id === user.id

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			<ProfileHeader user={user} isOwnProfile={isOwnProfile} />
			<ProfileStats stats={user.stats} />
			<UserIdeas userId={user.id} />
		</div>
	)
}
