'use server'

import type { User, UserSummary } from '@rfsbase/shared'
import { UserUpdateSchema } from '@rfsbase/shared'
import { Value } from '@sinclair/typebox/value'
import { getSurrealDB } from '@/lib/db/surreal'
import { Errors } from '@/lib/errors'
import { getSession, requireAuth } from '@/lib/server/auth'
import { all, first, parseId } from '@/lib/server/db'

// Pure mapper
const mapUser = (row: unknown): User => {
	const r = row as Record<string, unknown>
	const ycType = r.yc_type as string | null
	return {
		id: parseId(r.id),
		name: String(r.name ?? 'Unknown'),
		email: String(r.email),
		avatar: r.avatar ? String(r.avatar) : undefined,
		bio: r.bio ? String(r.bio) : undefined,
		verified: {
			email: Boolean(r.verified_email),
			yc: ycType
				? {
						companyName: '',
						batch: ycType === 'partner' ? 'Partner' : 'Alumni',
						verifiedAt: new Date().toISOString(),
					}
				: undefined,
		},
		stats: {
			ideasCount: Number(r.ideas_count ?? 0),
			votesReceived: Number(r.votes_received ?? 0),
			votesGiven: Number(r.votes_given ?? 0),
			commentsCount: Number(r.comments_count ?? 0),
			followersCount: Number(r.followers_count ?? 0),
			followingCount: Number(r.following_count ?? 0),
		},
		createdAt: String(r.created_at),
		updatedAt: String(r.updated_at),
	}
}

const mapUserSummary = (row: unknown): UserSummary => {
	const r = row as Record<string, unknown>
	const ycType = (r.yc_type as 'partner' | 'alumni' | null) ?? null
	return {
		id: parseId(r.id),
		name: String(r.name ?? 'Unknown'),
		avatar: r.avatar ? String(r.avatar) : undefined,
		verified: Boolean(r.verified ?? r.verified_email),
		ycType: ycType === 'partner' || ycType === 'alumni' ? ycType : null,
	}
}

// Build dynamic update query
const buildUpdateParams = (fields: Record<string, unknown>) => {
	const entries = Object.entries(fields).filter(([, v]) => v !== undefined)
	if (entries.length === 0) throw Errors.validation()

	return {
		setClause: `${entries.map(([key]) => `${key} = $${key}`).join(', ')}, updated_at = time::now()`,
		params: Object.fromEntries(entries),
	}
}

export async function getUser(id: string): Promise<User | null> {
	const db = await getSurrealDB()

	const result = await db.query(
		`SELECT id, name, email, avatar, bio, verified_email, yc_type, created_at, updated_at
		FROM type::thing('user', $id)`,
		{ id },
	)

	const row = first<Record<string, unknown>>(result)
	return row ? mapUser(row) : null
}

export async function getCurrentUser(): Promise<User | null> {
	const session = await getSession()
	if (!session?.user?.id) return null
	return getUser(session.user.id)
}

export async function updateProfile(input: unknown): Promise<User> {
	const validated = Value.Parse(UserUpdateSchema, input)

	return requireAuth(async (userId) => {
		const db = await getSurrealDB()

		const { setClause, params } = buildUpdateParams({
			name: validated.name,
			bio: validated.bio,
			avatar: validated.avatar,
		})

		const result = await db.query(`UPDATE type::thing('user', $userId) SET ${setClause} RETURN *`, {
			userId,
			...params,
		})

		const row = first<Record<string, unknown>>(result)
		if (!row) throw Errors.internal('Failed to update profile')

		return mapUser(row)
	})
}

export async function getUserIdeas(userId: string): Promise<
	readonly {
		id: string
		title: string
		problem: string
		category: string
		tags: readonly string[]
		votesTotal: number
		commentCount: number
		createdAt: string
	}[]
> {
	const db = await getSurrealDB()

	const result = await db.query(
		`SELECT id, title, problem, category, tags, votes_total, comment_count, created_at
		FROM idea WHERE author = type::thing('user', $userId) ORDER BY created_at DESC`,
		{ userId },
	)

	return all<Record<string, unknown>>(result).map((r) => ({
		id: parseId(r.id),
		title: String(r.title),
		problem: String(r.problem),
		category: String(r.category),
		tags: (r.tags as string[] | undefined) ?? [],
		votesTotal: Number(r.votes_total ?? 0),
		commentCount: Number(r.comment_count ?? 0),
		createdAt: String(r.created_at),
	}))
}

export async function followUser(targetUserId: string): Promise<void> {
	return requireAuth(async (userId) => {
		if (userId === targetUserId) throw Errors.conflict('Cannot follow yourself')

		const db = await getSurrealDB()

		const user = await db.query(`SELECT id FROM type::thing('user', $targetUserId)`, {
			targetUserId,
		})
		if (!first(user)) throw Errors.notFound('User')

		await db.query(
			`RELATE type::thing('user', $userId)->follows->type::thing('user', $targetUserId)
			SET created_at = time::now()`,
			{ userId, targetUserId },
		)
	})
}

export async function unfollowUser(targetUserId: string): Promise<void> {
	return requireAuth(async (userId) => {
		const db = await getSurrealDB()

		await db.query(
			`DELETE follows WHERE in = type::thing('user', $userId) AND out = type::thing('user', $targetUserId)`,
			{ userId, targetUserId },
		)
	})
}

export async function getFollowers(userId: string): Promise<readonly UserSummary[]> {
	const db = await getSurrealDB()

	const result = await db.query(
		`SELECT follower.id as id, follower.name as name, follower.avatar as avatar,
			follower.verified_email as verified, follower.yc_type as yc_type
		FROM follows WHERE following = type::thing('user', $userId)`,
		{ userId },
	)

	return all(result).map(mapUserSummary)
}

export async function getFollowing(userId: string): Promise<readonly UserSummary[]> {
	const db = await getSurrealDB()

	const result = await db.query(
		`SELECT following.id as id, following.name as name, following.avatar as avatar,
			following.verified_email as verified, following.yc_type as yc_type
		FROM follows WHERE follower = type::thing('user', $userId)`,
		{ userId },
	)

	return all(result).map(mapUserSummary)
}
