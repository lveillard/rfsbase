import { Type } from '@sinclair/typebox'
import type { Static } from '@sinclair/typebox'

// Notification types
export const NotificationTypeSchema = Type.Union([
  Type.Literal('vote'),
  Type.Literal('comment'),
  Type.Literal('reply'),
  Type.Literal('follow'),
  Type.Literal('similar'),
  Type.Literal('mention')
])

export type NotificationType = Static<typeof NotificationTypeSchema>

// Notification data for different types
export const VoteNotificationDataSchema = Type.Object({
  ideaId: Type.String(),
  ideaTitle: Type.String(),
  voterId: Type.String(),
  voterName: Type.String(),
  voteType: Type.Union([Type.Literal('problem'), Type.Literal('solution')])
})

export const CommentNotificationDataSchema = Type.Object({
  ideaId: Type.String(),
  ideaTitle: Type.String(),
  commentId: Type.String(),
  commenterId: Type.String(),
  commenterName: Type.String(),
  commentPreview: Type.String()
})

export const ReplyNotificationDataSchema = Type.Object({
  ideaId: Type.String(),
  ideaTitle: Type.String(),
  commentId: Type.String(),
  parentCommentId: Type.String(),
  replierId: Type.String(),
  replierName: Type.String(),
  replyPreview: Type.String()
})

export const FollowNotificationDataSchema = Type.Object({
  followerId: Type.String(),
  followerName: Type.String(),
  followerAvatar: Type.Optional(Type.String())
})

export const SimilarNotificationDataSchema = Type.Object({
  ideaId: Type.String(),
  ideaTitle: Type.String(),
  similarIdeaId: Type.String(),
  similarIdeaTitle: Type.String(),
  similarity: Type.Number()
})

// Generic notification data union
export const NotificationDataSchema = Type.Union([
  VoteNotificationDataSchema,
  CommentNotificationDataSchema,
  ReplyNotificationDataSchema,
  FollowNotificationDataSchema,
  SimilarNotificationDataSchema
])

export type NotificationData = Static<typeof NotificationDataSchema>

// Full Notification Schema
export const NotificationSchema = Type.Object({
  id: Type.String(),
  userId: Type.String(),
  type: NotificationTypeSchema,
  data: NotificationDataSchema,
  read: Type.Boolean({ default: false }),
  createdAt: Type.String({ format: 'date-time' })
})

export type Notification = Static<typeof NotificationSchema>

// Notification list response
export const NotificationListSchema = Type.Object({
  notifications: Type.Array(NotificationSchema),
  unreadCount: Type.Integer({ minimum: 0 })
})

export type NotificationList = Static<typeof NotificationListSchema>
