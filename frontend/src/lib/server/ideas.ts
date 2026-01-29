'use server'

import type { Idea, IdeaCard, SimilarIdeaResult, VoteType } from '@rfsbase/shared'
import { IdeaCreateSchema, IdeaListFilterSchema, SimilarIdeaQuerySchema } from '@rfsbase/shared'
import { Value } from '@sinclair/typebox/value'
import { getSurrealDB } from '@/lib/db/surreal'
import { Errors } from '@/lib/errors'
import { requireAuth } from '@/lib/server/auth'
import { all, first, parseId } from '@/lib/server/db'
import { generateEmbedding } from '@/lib/server/embedding'
import { rateLimits } from '@/lib/server/rate-limit'
import { mapAuthor, mapVotes } from '@/lib/server/types'
import { checkRateLimitOrThrow } from './utils'

// Pure mapper - uses TypeBox types
const mapIdea = (row: unknown): Idea => {
	const r = row as Record<string, unknown>
	return {
		id: parseId(r.id),
		author: mapAuthor(r),
		title: String(r.title),
		problem: String(r.problem),
		solution: r.solution ? String(r.solution) : undefined,
		targetAudience: r.target_audience ? String(r.target_audience) : undefined,
		category: String(r.category),
		tags: (r.tags as string[] | undefined) ?? [],
		links: (r.links as string[] | undefined) ?? [],
		votes: mapVotes(r),
		commentCount: Number(r.comment_count ?? 0),
		userVote: (r.user_vote as 'problem' | 'solution' | null | undefined) ?? null,
		createdAt: String(r.created_at),
		updatedAt: String(r.updated_at ?? r.created_at),
	}
}

// Query builders - pure functions
const buildOrderBy = (sortBy: string) =>
	({
		new: 'created_at DESC',
		top: 'votes_total DESC',
		hot: 'votes_total DESC, created_at DESC',
	})[sortBy] ?? 'created_at DESC'

export async function listIdeas(
	page = 1,
	pageSize = 20,
	sortBy = 'new',
	category?: string,
): Promise<{ ideas: readonly IdeaCard[]; total: number }> {
	const filters = Value.Parse(IdeaListFilterSchema, { sortBy, category })
	const db = await getSurrealDB()
	const offset = (page - 1) * pageSize

	const whereClause = filters.category ? 'WHERE category = $category' : ''

	const [result, countResult] = await Promise.all([
		db.query(
			`SELECT id, title, problem, solution, target_audience, category, tags, links,
				votes_problem, votes_solution, votes_total, comment_count,
				author.name as author_name, author.avatar as author_avatar,
				author.verified_email as author_verified, author.verified_yc as author_yc_verified,
				created_at
			FROM idea ${whereClause}
			ORDER BY ${buildOrderBy(sortBy)}
			LIMIT $limit START $offset`,
			{ category: filters.category, limit: pageSize, offset },
		),
		db.query(`SELECT count() as count FROM idea ${whereClause} GROUP ALL`, {
			category: filters.category,
		}),
	])

	const ideas = all(result).map(mapIdea)
	const total = Number(first<{ count: number }>(countResult)?.count ?? 0)

	return { ideas, total }
}

export async function getIdea(id: string): Promise<Idea | null> {
	const db = await getSurrealDB()

	const result = await db.query(
		`SELECT id, title, problem, solution, target_audience, category, tags, links,
			votes_problem, votes_solution, votes_total, comment_count,
			author, author.name as author_name, author.avatar as author_avatar,
			author.verified_email as author_verified, author.verified_yc as author_yc_verified,
			created_at, updated_at
		FROM type::thing('idea', $id)`,
		{ id },
	)

	const row = first<Record<string, unknown>>(result)
	return row ? mapIdea(row) : null
}

export async function createIdea(input: unknown): Promise<Idea> {
	const validated = Value.Parse(IdeaCreateSchema, input)

	return requireAuth(async (userId) => {
		// Rate limit: 5 ideas per minute per user
		checkRateLimitOrThrow(`idea:create:${userId}`, rateLimits.idea)

		const db = await getSurrealDB()

		const textToEmbed = `${validated.title} ${validated.problem} ${validated.solution ?? ''}`
		const embedding = await generateEmbedding(textToEmbed)

		const result = await db.query(
			`CREATE idea SET
				author = type::thing('user', $userId),
				title = $title, problem = $problem, solution = $solution,
				target_audience = $targetAudience, category = $category,
				tags = $tags, links = $links, embedding = $embedding,
				votes_problem = 0, votes_solution = 0, votes_total = 0, comment_count = 0,
				created_at = time::now(), updated_at = time::now()
			RETURN *`,
			{
				userId,
				title: validated.title,
				problem: validated.problem,
				solution: validated.solution ?? null,
				targetAudience: validated.targetAudience ?? null,
				category: validated.category,
				tags: validated.tags ?? [],
				links: validated.links ?? [],
				embedding,
			},
		)

		const created = first<Record<string, unknown>>(result)
		if (!created) throw Errors.internal('Failed to create idea')

		return mapIdea(created)
	})
}

export async function voteIdea(ideaId: string, voteType: VoteType): Promise<void> {
	return requireAuth(async (userId) => {
		// Rate limit: 60 votes per minute per user
		checkRateLimitOrThrow(`vote:${userId}`, rateLimits.vote)

		const db = await getSurrealDB()

		await db.query(
			`DELETE voted WHERE in = type::thing('user', $userId) AND out = type::thing('idea', $ideaId);
			RELATE type::thing('user', $userId)->voted->type::thing('idea', $ideaId)
			SET vote_type = $voteType, created_at = time::now();
			UPDATE type::thing('idea', $ideaId) SET
				votes_problem = (SELECT count() FROM voted WHERE out = type::thing('idea', $ideaId) AND vote_type = 'problem')[0].count || 0,
				votes_solution = (SELECT count() FROM voted WHERE out = type::thing('idea', $ideaId) AND vote_type = 'solution')[0].count || 0,
				votes_total = votes_problem + votes_solution`,
			{ userId, ideaId, voteType },
		)
	})
}

export async function findSimilarIdeas(input: unknown): Promise<readonly SimilarIdeaResult[]> {
	const query = Value.Parse(SimilarIdeaQuerySchema, input)

	const embedding = await generateEmbedding(query.text)

	const db = await getSurrealDB()

	const result = await db.query(
		`SELECT id, title, problem, category, votes_total,
			vector::similarity::cosine(embedding, $embedding) AS similarity
		FROM idea
		WHERE embedding != NONE
			AND ($excludeId = NONE OR id != type::thing('idea', $excludeId))
			AND vector::similarity::cosine(embedding, $embedding) >= $threshold
		ORDER BY similarity DESC
		LIMIT $limit`,
		{
			embedding,
			threshold: query.threshold,
			limit: query.limit,
			excludeId: query.excludeId ?? null,
		},
	)

	return all<Record<string, unknown>>(result).map((r) => ({
		id: parseId(r.id),
		title: String(r.title),
		problem: String(r.problem),
		category: String(r.category),
		votes: Number(r.votes_total ?? 0),
		similarity: Number(r.similarity),
	}))
}
