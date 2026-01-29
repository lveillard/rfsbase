// Domain types - shared across all server actions
// Re-export from shared package for consistency
export type { UserSummary, YCType } from '@rfsbase/shared'

export interface Author {
	readonly id: string
	readonly name: string
	readonly avatar?: string
	readonly verified: boolean
	readonly ycType: 'partner' | 'alumni' | null
}

export interface VoteCounts {
	readonly problem: number
	readonly solution: number
	readonly total: number
}

// Raw SurrealDB row types (snake_case from DB)
export interface AuthorRow {
	readonly author?: unknown
	readonly author_id?: unknown
	readonly author_name?: string
	readonly author_avatar?: string
	readonly author_verified?: boolean
	readonly author_yc_type?: string | null
}

// Pure mapper functions (immutable)
export const mapAuthor = (row: unknown): Author => {
	const r = row as AuthorRow & Record<string, unknown>
	const ycType = r.author_yc_type as 'partner' | 'alumni' | null
	return {
		id: String(r.author_id ?? r.author ?? ''),
		name: String(r.author_name ?? 'Unknown'),
		avatar: r.author_avatar,
		verified: r.author_verified ?? false,
		ycType: ycType === 'partner' || ycType === 'alumni' ? ycType : null,
	}
}

export const mapVotes = (row: unknown): VoteCounts => {
	const r = row as { votes_problem?: number; votes_solution?: number; votes_total?: number }
	return {
		problem: r.votes_problem ?? 0,
		solution: r.votes_solution ?? 0,
		total: r.votes_total ?? 0,
	}
}
