'use server'

import type { User, UserStats, UserSummary } from '@rfsbase/shared'
import { UserUpdateSchema } from '@rfsbase/shared'
import { Value } from '@sinclair/typebox/value'
import { getSurrealDB } from '@/lib/db/surreal'
import { Errors } from '@/lib/errors'
import { getPostHogClient } from '@/lib/posthog-server'
import { getSession, requireAuth } from '@/lib/server/auth'
import { all, first, parseId } from '@/lib/server/db'

// Pure mappers
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

const mapUser = (row: unknown, stats: UserStats): User => {
	const r = row as Record<string, unknown>
	const ycType = r.yc_type as string | null
	return {
		id: parseId(r.id),
		name: String(r.name ?? 'Unknown'),
		email: String(r.email),
		avatar: r.avatar ? String(r.avatar) : undefined,
		bio: r.bio ? String(r.bio) : undefined,
		isPublic: r.is_public !== false, // default true
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
		stats,
		createdAt: String(r.created_at),
		updatedAt: String(r.updated_at),
	}
}

const DEFAULT_STATS: UserStats = {
	ideasCount: 0,
	votesReceived: 0,
	votesGiven: 0,
	commentsCount: 0,
	followersCount: 0,
	followingCount: 0,
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

/**
 * Get user stats - computed from ideas, votes, follows
 * Single efficient query with parallel aggregations
 */
export async function getUserStats(userId: string): Promise<UserStats> {
	const db = await getSurrealDB()

	// Single query with all aggregations using LET bindings
	const result = await db.query<[Record<string, unknown>[]]>(
		`
		LET $user_id = type::thing('user', $userId);
		LET $ideas = (SELECT votes_total, comment_count FROM idea WHERE author = $user_id);
		LET $followers = (SELECT count() FROM follows WHERE out = $user_id GROUP ALL);
		LET $following = (SELECT count() FROM follows WHERE in = $user_id GROUP ALL);
		LET $votes_given = (SELECT count() FROM voted WHERE in = $user_id GROUP ALL);

		RETURN {
			ideas_count: array::len($ideas),
			votes_received: math::sum($ideas.votes_total),
			comments_count: math::sum($ideas.comment_count),
			followers_count: $followers[0].count ?? 0,
			following_count: $following[0].count ?? 0,
			votes_given: $votes_given[0].count ?? 0
		}
		`,
		{ userId },
	)

	const row = first<Record<string, unknown>>(result)
	if (!row) return DEFAULT_STATS

	return {
		ideasCount: Number(row.ideas_count ?? 0),
		votesReceived: Number(row.votes_received ?? 0),
		votesGiven: Number(row.votes_given ?? 0),
		commentsCount: Number(row.comments_count ?? 0),
		followersCount: Number(row.followers_count ?? 0),
		followingCount: Number(row.following_count ?? 0),
	}
}

export async function getUser(id: string): Promise<User | null> {
	const db = await getSurrealDB()

	const [userResult, stats] = await Promise.all([
		db.query(
			`SELECT id, name, email, avatar, bio, is_public, verified_email, yc_type, created_at, updated_at
			FROM type::thing('user', $id)`,
			{ id },
		),
		getUserStats(id),
	])

	const row = first<Record<string, unknown>>(userResult)
	return row ? mapUser(row, stats) : null
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
			is_public: validated.isPublic,
		})

		const [result, stats] = await Promise.all([
			db.query(`UPDATE type::thing('user', $userId) SET ${setClause} RETURN *`, {
				userId,
				...params,
			}),
			getUserStats(userId),
		])

		const row = first<Record<string, unknown>>(result)
		if (!row) throw Errors.internal('Failed to update profile')

		const user = mapUser(row, stats)

		const posthog = getPostHogClient()
		posthog.capture({
			distinctId: userId,
			event: 'profile_updated',
			properties: {
				has_avatar: !!user.avatar,
				has_bio: !!user.bio,
			},
		})

		return user
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

		const posthog = getPostHogClient()
		posthog.capture({
			distinctId: userId,
			event: 'user_followed',
			properties: { target_user_id: targetUserId },
		})
	})
}

export async function unfollowUser(targetUserId: string): Promise<void> {
	return requireAuth(async (userId) => {
		const db = await getSurrealDB()

		await db.query(
			`DELETE follows WHERE in = type::thing('user', $userId) AND out = type::thing('user', $targetUserId)`,
			{ userId, targetUserId },
		)

		const posthog = getPostHogClient()
		posthog.capture({
			distinctId: userId,
			event: 'user_unfollowed',
			properties: { target_user_id: targetUserId },
		})
	})
}

export async function getFollowers(userId: string): Promise<readonly UserSummary[]> {
	const db = await getSurrealDB()

	// in = follower, out = followed user
	const result = await db.query(
		`SELECT in.id as id, in.name as name, in.avatar as avatar,
			in.verified_email as verified, in.yc_type as yc_type
		FROM follows WHERE out = type::thing('user', $userId)`,
		{ userId },
	)

	return all(result).map(mapUserSummary)
}

export async function getFollowing(userId: string): Promise<readonly UserSummary[]> {
	const db = await getSurrealDB()

	// in = follower (current user), out = followed user
	const result = await db.query(
		`SELECT out.id as id, out.name as name, out.avatar as avatar,
			out.verified_email as verified, out.yc_type as yc_type
		FROM follows WHERE in = type::thing('user', $userId)`,
		{ userId },
	)

	return all(result).map(mapUserSummary)
}

export async function deleteAccount(): Promise<void> {
	return requireAuth(async (userId) => {
		const db = await getSurrealDB()

		// Delete all user data in a transaction-like manner
		await db.query(
			`
			LET $user_id = type::thing('user', $userId);
			-- Delete user's votes
			DELETE voted WHERE in = $user_id;
			-- Delete votes on user's ideas
			DELETE voted WHERE out.author = $user_id;
			-- Delete user's comments
			DELETE comment WHERE author = $user_id;
			-- Delete comments on user's ideas
			DELETE comment WHERE idea.author = $user_id;
			-- Delete user's ideas
			DELETE idea WHERE author = $user_id;
			-- Delete follows
			DELETE follows WHERE in = $user_id OR out = $user_id;
			-- Delete sessions
			DELETE session WHERE userId = $user_id;
			-- Delete accounts (OAuth)
			DELETE account WHERE userId = $user_id;
			-- Delete the user
			DELETE $user_id;
			`,
			{ userId },
		)

		const posthog = getPostHogClient()
		posthog.capture({
			distinctId: userId,
			event: 'account_deleted',
		})
	})
}
