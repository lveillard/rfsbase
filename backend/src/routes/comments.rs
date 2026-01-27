use axum::{
    extract::{Path, State},
    routing::{get, post, put},
    Json, Router,
};
use serde::Deserialize;
use std::sync::Arc;

use crate::{
    auth::AuthUser,
    db::Database,
    models::{ApiResponse, CreateComment},
    AppError, AppState, Result,
};

/// Maximum allowed content length for comments
const MAX_COMMENT_LENGTH: usize = 10_000;

#[derive(Debug, Deserialize)]
pub struct UpdateCommentRequest {
    content: String,
}

// ============================================================================
// Helper Functions - DRY Principle
// ============================================================================

/// Validates comment content, returning an error if invalid
fn validate_comment_content(content: &str) -> Result<()> {
    if content.trim().is_empty() {
        return Err(AppError::validation("Comment content cannot be empty"));
    }
    if content.len() > MAX_COMMENT_LENGTH {
        return Err(AppError::validation("Comment content is too long"));
    }
    Ok(())
}

/// Extracts a record ID from a SurrealDB reference field, stripping table prefix if present
fn extract_record_id<'a>(json: &'a serde_json::Value, field: &str, prefix: &str) -> &'a str {
    let raw = json[field]
        .as_str()
        .or_else(|| json[field]["id"].as_str())
        .unwrap_or_default();
    raw.strip_prefix(prefix).unwrap_or(raw)
}

/// Fetches a comment by ID, returning NotFound error if not found
async fn fetch_comment(db: &Database, id: String) -> Result<serde_json::Value> {
    db.client
        .query("SELECT * FROM type::thing('comment', $id)")
        .bind(("id", id))
        .await?
        .take::<Option<serde_json::Value>>(0)?
        .ok_or_else(|| AppError::not_found("Comment not found"))
}

/// Checks if the given user owns the comment, returning Forbidden error if not
fn verify_comment_ownership(comment: &serde_json::Value, user_id: &str) -> Result<()> {
    let author_id = extract_record_id(comment, "author", "user:");
    if author_id != user_id {
        return Err(AppError::forbidden("You can only modify your own comments"));
    }
    Ok(())
}

/// Checks if a user has upvoted a comment (using graph relation)
async fn has_user_upvoted(db: &Database, user_id: String, comment_id: String) -> Result<bool> {
    let upvote: Option<serde_json::Value> = db
        .client
        .query(
            r#"
            SELECT * FROM upvoted
            WHERE in = type::thing('user', $user_id)
            AND out = type::thing('comment', $comment_id)
            LIMIT 1
            "#,
        )
        .bind(("user_id", user_id))
        .bind(("comment_id", comment_id))
        .await?
        .take(0)?;

    Ok(upvote.is_some())
}

/// Extracts upvote count from a comment JSON value
fn extract_upvotes(comment: Option<serde_json::Value>) -> i32 {
    comment
        .and_then(|c| c["upvotes"].as_i64())
        .unwrap_or(0) as i32
}

// ============================================================================
// Route Handlers
// ============================================================================

async fn get_comments_for_idea(
    State(db): State<Arc<Database>>,
    Path(idea_id): Path<String>,
) -> Result<Json<ApiResponse<Vec<serde_json::Value>>>> {
    let comments: Vec<serde_json::Value> = db
        .client
        .query(
            r#"
            SELECT
                *,
                author.id as author_id,
                author.name as author_name,
                author.avatar as author_avatar,
                author.verified_email as author_verified,
                author.verified_yc as author_yc
            FROM comment
            WHERE idea = type::thing('idea', $idea_id)
            ORDER BY created_at ASC
            "#,
        )
        .bind(("idea_id", idea_id))
        .await?
        .take(0)?;

    Ok(Json(ApiResponse::success(comments)))
}

async fn create_comment(
    State(db): State<Arc<Database>>,
    Path(idea_id): Path<String>,
    auth_user: AuthUser,
    Json(body): Json<CreateComment>,
) -> Result<Json<ApiResponse<serde_json::Value>>> {
    validate_comment_content(&body.content)?;

    let comment: Option<serde_json::Value> = db
        .client
        .query(
            r#"
            CREATE comment SET
                author = type::thing('user', $author_id),
                idea = type::thing('idea', $idea_id),
                parent = IF $parent_id != NONE THEN type::thing('comment', $parent_id) ELSE NONE END,
                content = $content,
                upvotes = 0,
                created_at = time::now(),
                updated_at = time::now()
            "#,
        )
        .bind(("author_id", auth_user.id))
        .bind(("idea_id", idea_id.clone()))
        .bind(("parent_id", body.parent_id))
        .bind(("content", body.content))
        .await?
        .take(0)?;

    let comment = comment.ok_or_else(|| AppError::internal("Failed to create comment"))?;

    // Update comment_count on the idea
    db.client
        .query("UPDATE type::thing('idea', $idea_id) SET comment_count += 1")
        .bind(("idea_id", idea_id))
        .await?;

    Ok(Json(ApiResponse::success(comment)))
}

async fn update_comment(
    State(db): State<Arc<Database>>,
    Path(id): Path<String>,
    auth_user: AuthUser,
    Json(body): Json<UpdateCommentRequest>,
) -> Result<Json<ApiResponse<serde_json::Value>>> {
    validate_comment_content(&body.content)?;

    let comment = fetch_comment(&db, id.clone()).await?;
    verify_comment_ownership(&comment, &auth_user.id)?;

    let updated: Option<serde_json::Value> = db
        .client
        .query(
            r#"
            UPDATE type::thing('comment', $id) SET
                content = $content,
                updated_at = time::now()
            "#,
        )
        .bind(("id", id))
        .bind(("content", body.content))
        .await?
        .take(0)?;

    let updated = updated.ok_or_else(|| AppError::internal("Failed to update comment"))?;

    Ok(Json(ApiResponse::success(updated)))
}

async fn delete_comment(
    State(db): State<Arc<Database>>,
    Path(id): Path<String>,
    auth_user: AuthUser,
) -> Result<Json<ApiResponse<()>>> {
    let comment = fetch_comment(&db, id.clone()).await?;
    verify_comment_ownership(&comment, &auth_user.id)?;

    let idea_id = extract_record_id(&comment, "idea", "idea:").to_owned();

    db.client
        .query("DELETE type::thing('comment', $id)")
        .bind(("id", id))
        .await?;

    if !idea_id.is_empty() {
        db.client
            .query("UPDATE type::thing('idea', $idea_id) SET comment_count -= 1")
            .bind(("idea_id", idea_id))
            .await?;
    }

    Ok(Json(ApiResponse::success(())))
}

async fn upvote_comment(
    State(db): State<Arc<Database>>,
    Path(id): Path<String>,
    auth_user: AuthUser,
) -> Result<Json<ApiResponse<i32>>> {
    // Verify comment exists
    let _ = fetch_comment(&db, id.clone()).await?;

    if has_user_upvoted(&db, auth_user.id.clone(), id.clone()).await? {
        return Err(AppError::conflict("You have already upvoted this comment"));
    }

    // Create upvote relation using RELATE
    db.client
        .query(
            r#"
            RELATE type::thing('user', $user_id)->upvoted->type::thing('comment', $comment_id) SET
                created_at = time::now()
            "#,
        )
        .bind(("user_id", auth_user.id))
        .bind(("comment_id", id.clone()))
        .await?;

    let updated: Option<serde_json::Value> = db
        .client
        .query("UPDATE type::thing('comment', $id) SET upvotes += 1")
        .bind(("id", id))
        .await?
        .take(0)?;

    Ok(Json(ApiResponse::success(extract_upvotes(updated))))
}

async fn remove_upvote(
    State(db): State<Arc<Database>>,
    Path(id): Path<String>,
    auth_user: AuthUser,
) -> Result<Json<ApiResponse<i32>>> {
    // Verify comment exists
    let _ = fetch_comment(&db, id.clone()).await?;

    if !has_user_upvoted(&db, auth_user.id.clone(), id.clone()).await? {
        return Err(AppError::not_found("You have not upvoted this comment"));
    }

    // Delete the upvoted relation
    db.client
        .query(
            r#"
            DELETE upvoted
            WHERE in = type::thing('user', $user_id)
            AND out = type::thing('comment', $comment_id)
            "#,
        )
        .bind(("user_id", auth_user.id))
        .bind(("comment_id", id.clone()))
        .await?;

    let updated: Option<serde_json::Value> = db
        .client
        .query("UPDATE type::thing('comment', $id) SET upvotes -= 1")
        .bind(("id", id))
        .await?
        .take(0)?;

    Ok(Json(ApiResponse::success(extract_upvotes(updated))))
}

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/idea/{idea_id}", get(get_comments_for_idea).post(create_comment))
        .route("/{id}", put(update_comment).delete(delete_comment))
        .route("/{id}/upvote", post(upvote_comment).delete(remove_upvote))
}
