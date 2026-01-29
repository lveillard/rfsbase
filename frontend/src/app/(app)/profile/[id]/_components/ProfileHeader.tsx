'use client'

import { Calendar, Check, UserMinus, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Avatar, Badge, Button, Card } from '@/components/ui'
import { followUser, unfollowUser } from '@/lib/actions'
import { formatDate, parseId } from '@/lib/utils'
import type { ProfileUser } from '../../_types'

interface ProfileHeaderProps {
	readonly user: ProfileUser
	readonly isOwnProfile: boolean
	readonly isFollowing?: boolean
	readonly onFollowToggle?: () => void
}

export function ProfileHeader({
	user,
	isOwnProfile,
	isFollowing = false,
	onFollowToggle,
}: ProfileHeaderProps) {
	const [following, setFollowing] = useState(isFollowing)
	const [isLoading, setIsLoading] = useState(false)

	const handleFollowToggle = async () => {
		if (isOwnProfile) return
		setIsLoading(true)
		try {
			if (following) {
				await unfollowUser(parseId(user.id))
			} else {
				await followUser(parseId(user.id))
			}
			setFollowing((prev) => !prev)
			onFollowToggle?.()
		} catch (error) {
			console.error('Failed to toggle follow:', error)
		} finally {
			setIsLoading(false)
		}
	}

	const isVerified = user.verified_email || !!user.verified_yc

	return (
		<Card padding="lg">
			<div className="flex flex-col sm:flex-row gap-6">
				<Avatar
					src={user.avatar}
					name={user.name}
					size="xl"
					verified={isVerified}
					className="shrink-0"
				/>

				<div className="flex-1 min-w-0">
					<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
						<div>
							<div className="flex items-center gap-2 mb-1">
								<h1 className="text-2xl font-bold truncate">{user.name}</h1>
								{user.verified_yc && (
									<Badge variant="warning" size="md">
										<Check className="h-3 w-3 mr-1" /> YC {user.verified_yc.batch}
									</Badge>
								)}
								{user.verified_email && !user.verified_yc && (
									<Badge variant="success" size="sm">
										<Check className="h-3 w-3 mr-1" /> Verified
									</Badge>
								)}
							</div>

							{user.verified_yc?.company && (
								<p className="text-text-secondary mb-2">{user.verified_yc.company}</p>
							)}
							{user.bio && <p className="text-text-secondary mt-2 max-w-xl">{user.bio}</p>}

							<div className="flex items-center gap-4 mt-3 text-sm text-text-muted">
								<span className="flex items-center gap-1.5">
									<Calendar className="h-4 w-4" /> Joined {formatDate(user.created_at)}
								</span>
							</div>
						</div>

						{!isOwnProfile && (
							<Button
								variant={following ? 'outline' : 'primary'}
								onClick={handleFollowToggle}
								disabled={isLoading}
								leftIcon={
									following ? <UserMinus className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />
								}
							>
								{following ? 'Unfollow' : 'Follow'}
							</Button>
						)}

						{isOwnProfile && (
							<Link href="/settings">
								<Button variant="outline">Edit Profile</Button>
							</Link>
						)}
					</div>
				</div>
			</div>
		</Card>
	)
}
