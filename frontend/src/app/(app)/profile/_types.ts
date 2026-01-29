// Profile types - colocated with profile feature

import type { User } from '@rfsbase/shared'

export type ProfileUser = Pick<
	User,
	'id' | 'name' | 'avatar' | 'bio' | 'verified' | 'createdAt' | 'updatedAt'
>

export interface ProfileStats {
	readonly ideasCount: number
	readonly votesReceived: number
	readonly commentsCount: number
	readonly followersCount: number
	readonly followingCount: number
}

export interface IdeaSummary {
	readonly id: string
	readonly title: string
	readonly problem: string
	readonly category: string
	readonly tags: readonly string[]
	readonly votesTotal: number
	readonly commentCount: number
	readonly createdAt: string
}
