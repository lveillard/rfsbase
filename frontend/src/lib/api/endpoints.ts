import { api, type QueryParams } from './client'

// ============================================================================
// Domain Types (immutable by convention with readonly)
// ============================================================================

export interface UserSummary {
	readonly id: string
	readonly name: string
	readonly avatar?: string
	readonly verified: boolean
	readonly ycVerified: boolean
}

export interface VoteCounts {
	readonly problem: number
	readonly solution: number
	readonly total: number
}

export interface Idea {
	readonly id: string
	readonly author: UserSummary
	readonly title: string
	readonly problem: string
	readonly solution?: string
	readonly targetAudience?: string
	readonly category: string
	readonly tags: readonly string[]
	readonly links: readonly string[]
	readonly votes: VoteCounts
	readonly commentCount: number
	readonly userVote?: 'problem' | 'solution'
	readonly createdAt: string
	readonly updatedAt: string
}

export interface Comment {
	readonly id: string
	readonly ideaId: string
	readonly author: UserSummary
	readonly parentId?: string
	readonly content: string
	readonly upvotes: number
	readonly userUpvoted: boolean
	readonly replyCount: number
	readonly createdAt: string
	readonly updatedAt: string
}

export interface YCVerification {
	readonly companyName: string
	readonly batch: string
	readonly verifiedAt: string
}

export interface UserStats {
	readonly ideasCount: number
	readonly votesReceived: number
	readonly commentsCount: number
	readonly followersCount: number
	readonly followingCount: number
}

export interface User {
	readonly id: string
	readonly email: string
	readonly name: string
	readonly avatar?: string
	readonly bio?: string
	readonly verified: {
		readonly email: boolean
		readonly yc?: YCVerification
	}
	readonly stats: UserStats
	readonly createdAt: string
	readonly updatedAt: string
}

// ============================================================================
// Request/Response Types
// ============================================================================

export type SortOption = 'hot' | 'new' | 'top' | 'discussed'
export type VoteType = 'problem' | 'solution'

export interface ListIdeasParams {
	readonly page?: number
	readonly pageSize?: number
	readonly sortBy?: SortOption
	readonly category?: string
	readonly tags?: readonly string[]
	readonly search?: string
}

export interface CreateIdeaInput {
	readonly title: string
	readonly problem: string
	readonly solution?: string
	readonly targetAudience?: string
	readonly category: string
	readonly tags?: readonly string[]
	readonly links?: readonly string[]
}

export interface CreateCommentInput {
	readonly content: string
	readonly parentId?: string
}

export interface SimilarIdeasParams {
	readonly text: string
	readonly threshold?: number
	readonly limit?: number
	readonly excludeId?: string
}

export interface SimilarIdea {
	readonly id: string
	readonly title: string
	readonly problem: string
	readonly category: string
	readonly votesTotal: number
	readonly similarity: number
}

interface PaginationParams {
	readonly page?: number
	readonly pageSize?: number
}

interface UserUpdateInput {
	readonly name?: string
	readonly avatar?: string
	readonly bio?: string
}

// ============================================================================
// Pure helper to convert params to QueryParams
// ============================================================================

const toQueryParams = <T extends object>(params: T | undefined): QueryParams | undefined => {
	if (!params) return undefined

	return Object.fromEntries(
		Object.entries(params)
			.filter(([, value]) => value !== undefined)
			.map(([key, value]) => [key, value as string | number | boolean]),
	)
}

// ============================================================================
// API Endpoints (using const objects for tree-shaking)
// ============================================================================

export const authApi = {
	login: (email: string) => api.post<{ message: string }>('/api/v1/auth/magic-link', { email }),

	verifyMagicLink: (token: string) =>
		api.post<{ user: User; token: string }>('/api/v1/auth/verify', { token }),

	loginWithGoogle: (code: string) =>
		api.post<{ user: User; token: string }>('/api/v1/auth/oauth/google', {
			code,
		}),

	loginWithGithub: (code: string) =>
		api.post<{ user: User; token: string }>('/api/v1/auth/oauth/github', {
			code,
		}),

	me: () => api.get<User>('/api/v1/auth/me'),

	logout: () => api.post<void>('/api/v1/auth/logout'),
} as const

export const ideasApi = {
	list: (params?: ListIdeasParams) =>
		api.get<Idea[]>('/api/v1/ideas', { params: toQueryParams(params) }),

	get: (id: string) => api.get<Idea>(`/api/v1/ideas/${id}`),

	create: (data: CreateIdeaInput) => api.post<Idea>('/api/v1/ideas', data),

	update: (id: string, data: Partial<CreateIdeaInput>) =>
		api.put<Idea>(`/api/v1/ideas/${id}`, data),

	delete: (id: string) => api.delete<void>(`/api/v1/ideas/${id}`),

	vote: (id: string, type: VoteType) => api.post<VoteCounts>(`/api/v1/ideas/${id}/vote`, { type }),

	removeVote: (id: string) => api.delete<VoteCounts>(`/api/v1/ideas/${id}/vote`),

	findSimilar: (params: SimilarIdeasParams) =>
		api.get<SimilarIdea[]>('/api/v1/ideas/similar', {
			params: toQueryParams({
				text: params.text,
				threshold: params.threshold,
				limit: params.limit,
				exclude_id: params.excludeId,
			}),
		}),
} as const

export const commentsApi = {
	list: (ideaId: string, params?: PaginationParams) =>
		api.get<Comment[]>(`/api/v1/comments/idea/${ideaId}`, {
			params: toQueryParams(params),
		}),

	create: (ideaId: string, data: CreateCommentInput) =>
		api.post<Comment>(`/api/v1/comments/idea/${ideaId}`, data),

	update: (commentId: string, content: string) =>
		api.put<Comment>(`/api/v1/comments/${commentId}`, { content }),

	delete: (commentId: string) => api.delete<void>(`/api/v1/comments/${commentId}`),

	upvote: (commentId: string) =>
		api.post<{ upvotes: number }>(`/api/v1/comments/${commentId}/upvote`),

	removeUpvote: (commentId: string) =>
		api.delete<{ upvotes: number }>(`/api/v1/comments/${commentId}/upvote`),
} as const

export const usersApi = {
	get: (id: string) => api.get<User>(`/api/v1/users/${id}`),

	update: (data: UserUpdateInput) => api.put<User>('/api/v1/users/me', data),

	follow: (id: string) => api.post<void>(`/api/v1/users/${id}/follow`),

	unfollow: (id: string) => api.delete<void>(`/api/v1/users/${id}/follow`),

	ideas: (id: string, params?: PaginationParams) =>
		api.get<Idea[]>(`/api/v1/users/${id}/ideas`, {
			params: toQueryParams(params),
		}),
} as const

export const notificationsApi = {
	list: () => api.get<Notification[]>('/api/v1/notifications'),

	getUnreadCount: () => api.get<number>('/api/v1/notifications/unread-count'),

	markAsRead: (id: string) => api.put<void>(`/api/v1/notifications/${id}/read`, {}),

	markAllAsRead: () => api.put<void>('/api/v1/notifications/read-all', {}),

	delete: (id: string) => api.delete<void>(`/api/v1/notifications/${id}`),
} as const

interface Notification {
	readonly id: string
	readonly type: string
	readonly data: Record<string, unknown>
	readonly read: boolean
	readonly created_at: string
}

export { api }
