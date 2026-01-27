/**
 * Re-export types from the shared package
 * This ensures type consistency between frontend and backend
 * and follows the DRY principle
 */
export type {
	Comment,
	CommentCreate,
	CommentSort,
	CommentUpdate,
	CommentWithReplies,
	Idea,
	IdeaCard,
	IdeaCreate,
	IdeaListFilter,
	IdeaUpdate,
	SimilarIdeaQuery,
	SimilarIdeaResult,
	UserSummary,
	VoteCounts,
	VoteRequest,
	VoteType,
} from '@rfsbase/shared'
