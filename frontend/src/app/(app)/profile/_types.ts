// Profile types - shared across profile components (colocated)
// Principle: Keep types close to where they're used, not in a global types folder

export type YCType = 'partner' | 'alumni' | null

export interface ProfileUser {
	readonly id: string
	readonly name: string
	readonly avatar?: string
	readonly bio?: string
	readonly verified_email: boolean
	readonly yc_type: YCType
	readonly created_at: string
}

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
