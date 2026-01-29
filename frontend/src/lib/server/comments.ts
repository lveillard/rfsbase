'use server'

import type { Comment } from '@rfsbase/shared'
import { CommentCreateSchema } from '@rfsbase/shared'
import { Value } from '@sinclair/typebox/value'
import { getSurrealDB } from '@/lib/db/surreal'
import { Errors } from '@/lib/errors'
import { requireAuth } from '@/lib/server/auth'
import { all, first, parseId } from '@/lib/server/db'
import { rateLimits } from '@/lib/server/rate-limit'
import { mapAuthor } from '@/lib/server/types'
import { checkRateLimitOrThrow } from './utils'

// Pure mapper
const mapComment = (row: unknown): Comment => {
	const r = row as Record<string, unknown>
	return {
		id: parseId(r.id),
		ideaId: parseId(r.idea),
		author: mapAuthor(r),
		parentId: r.parent ? parseId(r.parent) : undefined,
		content: String(r.content),
		upvotes: Number(r.upvotes ?? 0),
		userUpvoted: Boolean(r.user_upvoted),
		replyCount: Number(r.reply_count ?? 0),
		replies: undefined, // Loaded separately if needed
		createdAt: String(r.created_at),
		updatedAt: String(r.updated_at ?? r.created_at),
	}
}

export async function getCommentsForIdea(ideaId: string): Promise<readonly Comment[]> {
	const db = await getSurrealDB()

	const result = await db.query(
		`SELECT id, content, upvotes, created_at, updated_at,
			author, parent,
			author.id as author_id,
			author.name as author_name,
			author.avatar as author_avatar,
			author.verified_email as author_verified,
			author.verified_yc as author_yc
		FROM comment
		WHERE idea = type::thing('idea', $ideaId)
		ORDER BY created_at ASC`,
		{ ideaId },
	)

	return all(result).map(mapComment)
}

export async function createComment(ideaId: string, input: unknown): Promise<Comment> {
	const validated = Value.Parse(CommentCreateSchema, { ...(input as object), ideaId })

	return requireAuth(async (userId) => {
		// Rate limit: 20 comments per minute per user
		checkRateLimitOrThrow(`comment:create:${userId}`, rateLimits.comment)

		const db = await getSurrealDB()

		const [commentResult] = await Promise.all([
			db.query(
				`CREATE comment SET
					author = type::thing('user', $userId),
					idea = type::thing('idea', $ideaId),
					parent = IF $parentId != NONE THEN type::thing('comment', $parentId) ELSE NONE END,
					content = $content,
					upvotes = 0,
					created_at = time::now(),
					updated_at = time::now()
				RETURN *`,
				{ userId, ideaId, content: validated.content, parentId: validated.parentId ?? null },
			),
			db.query(`UPDATE type::thing('idea', $ideaId) SET comment_count += 1`, { ideaId }),
		])

		const created = first<Record<string, unknown>>(commentResult)
		if (!created) throw Errors.internal('Failed to create comment')

		return mapComment(created)
	})
}

export async function upvoteComment(commentId: string): Promise<number> {
	return requireAuth(async (userId) => {
		// Rate limit: 60 upvotes per minute per user
		checkRateLimitOrThrow(`comment:upvote:${userId}`, rateLimits.vote)

		const db = await getSurrealDB()

		const existing = await db.query(
			`SELECT * FROM upvoted
			WHERE in = type::thing('user', $userId) AND out = type::thing('comment', $commentId)
			LIMIT 1`,
			{ userId, commentId },
		)

		if (first(existing)) throw Errors.conflict('Already upvoted')

		await db.query(
			`RELATE type::thing('user', $userId)->upvoted->type::thing('comment', $commentId)
			SET created_at = time::now();
			UPDATE type::thing('comment', $commentId) SET upvotes += 1`,
			{ userId, commentId },
		)

		const result = await db.query(`SELECT upvotes FROM type::thing('comment', $commentId)`, {
			commentId,
		})

		return Number(first<{ upvotes: number }>(result)?.upvotes ?? 0)
	})
}

export async function removeUpvote(commentId: string): Promise<number> {
	return requireAuth(async (userId) => {
		const db = await getSurrealDB()

		await db.query(
			`DELETE upvoted WHERE in = type::thing('user', $userId) AND out = type::thing('comment', $commentId);
			UPDATE type::thing('comment', $commentId) SET upvotes -= 1`,
			{ userId, commentId },
		)

		const result = await db.query(`SELECT upvotes FROM type::thing('comment', $commentId)`, {
			commentId,
		})

		return Number(first<{ upvotes: number }>(result)?.upvotes ?? 0)
	})
}
