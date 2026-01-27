use axum::{
    extract::{Path, State},
    routing::{get, post, put},
    Json, Router,
};
use serde::Deserialize;
use std::sync::Arc;

use crate::{auth::AuthUser, db::Database, models::ApiResponse, AppError, AppState, Result};

#[derive(Debug, Deserialize)]
pub struct UpdateProfileRequest {
    name: Option<String>,
    avatar: Option<String>,
    bio: Option<String>,
}

async fn get_user(
    State(db): State<Arc<Database>>,
    Path(id): Path<String>,
) -> Result<Json<ApiResponse<serde_json::Value>>> {
    let user: Option<serde_json::Value> = db
        .client
        .query(
            r#"
            SELECT
                id,
                name,
                avatar,
                bio,
                verified_email,
                verified_yc,
                created_at
            FROM user
            WHERE id = type::thing('user', $id)
            LIMIT 1
            "#,
        )
        .bind(("id", id))
        .await?
        .take(0)?;

    user.map(|u| Json(ApiResponse::success(u)))
        .ok_or_else(|| AppError::not_found("User not found"))
}

async fn get_user_ideas(
    State(db): State<Arc<Database>>,
    Path(id): Path<String>,
) -> Result<Json<ApiResponse<Vec<serde_json::Value>>>> {
    let ideas: Vec<serde_json::Value> = db
        .client
        .query(
            r#"
            SELECT
                id,
                title,
                problem,
                category,
                tags,
                votes_total,
                comment_count,
                created_at
            FROM idea
            WHERE author = type::thing('user', $id)
            ORDER BY created_at DESC
            "#,
        )
        .bind(("id", id))
        .await?
        .take(0)?;

    Ok(Json(ApiResponse::success(ideas)))
}

async fn get_followers(
    State(db): State<Arc<Database>>,
    Path(id): Path<String>,
) -> Result<Json<ApiResponse<Vec<serde_json::Value>>>> {
    let followers: Vec<serde_json::Value> = db
        .client
        .query(
            r#"
            SELECT
                follower.id as id,
                follower.name as name,
                follower.avatar as avatar,
                follower.verified_email as verified,
                follower.verified_yc as yc_verified
            FROM follows
            WHERE following = type::thing('user', $id)
            "#,
        )
        .bind(("id", id))
        .await?
        .take(0)?;

    Ok(Json(ApiResponse::success(followers)))
}

async fn get_following(
    State(db): State<Arc<Database>>,
    Path(id): Path<String>,
) -> Result<Json<ApiResponse<Vec<serde_json::Value>>>> {
    let following: Vec<serde_json::Value> = db
        .client
        .query(
            r#"
            SELECT
                following.id as id,
                following.name as name,
                following.avatar as avatar,
                following.verified_email as verified,
                following.verified_yc as yc_verified
            FROM follows
            WHERE follower = type::thing('user', $id)
            "#,
        )
        .bind(("id", id))
        .await?
        .take(0)?;

    Ok(Json(ApiResponse::success(following)))
}

/// Update the authenticated user's profile
async fn update_profile(
    State(db): State<Arc<Database>>,
    auth_user: AuthUser,
    Json(body): Json<UpdateProfileRequest>,
) -> Result<Json<ApiResponse<serde_json::Value>>> {
    // Validate name if provided
    if let Some(ref name) = body.name {
        if name.trim().is_empty() {
            return Err(AppError::validation("Name cannot be empty"));
        }
        if name.len() > 100 {
            return Err(AppError::validation("Name must be less than 100 characters"));
        }
    }

    // Validate bio if provided
    if let Some(ref bio) = body.bio {
        if bio.len() > 500 {
            return Err(AppError::validation("Bio must be less than 500 characters"));
        }
    }

    let updated: Option<serde_json::Value> = db
        .client
        .query(
            r#"
            UPDATE type::thing('user', $user_id) SET
                name = IF $name != NONE THEN $name ELSE name END,
                avatar = IF $avatar != NONE THEN $avatar ELSE avatar END,
                bio = IF $bio != NONE THEN $bio ELSE bio END,
                updated_at = time::now()
            "#,
        )
        .bind(("user_id", auth_user.id))
        .bind(("name", body.name))
        .bind(("avatar", body.avatar))
        .bind(("bio", body.bio))
        .await?
        .take(0)?;

    updated
        .map(|u| Json(ApiResponse::success(u)))
        .ok_or_else(|| AppError::internal("Failed to update profile"))
}

/// Follow a user
async fn follow_user(
    State(db): State<Arc<Database>>,
    Path(id): Path<String>,
    auth_user: AuthUser,
) -> Result<Json<ApiResponse<()>>> {
    // Can't follow yourself
    if id == auth_user.id {
        return Err(AppError::validation("You cannot follow yourself"));
    }

    // Check if user exists
    let user: Option<serde_json::Value> = db
        .client
        .query("SELECT id FROM type::thing('user', $id)")
        .bind(("id", id.clone()))
        .await?
        .take(0)?;

    if user.is_none() {
        return Err(AppError::not_found("User not found"));
    }

    // Create follow relation using RELATE (unique index will prevent duplicates)
    db.client
        .query(
            r#"
            RELATE type::thing('user', $follower_id)->follows->type::thing('user', $following_id) SET
                created_at = time::now()
            "#,
        )
        .bind(("follower_id", auth_user.id))
        .bind(("following_id", id))
        .await?;

    Ok(Json(ApiResponse::success(())))
}

/// Unfollow a user
async fn unfollow_user(
    State(db): State<Arc<Database>>,
    Path(id): Path<String>,
    auth_user: AuthUser,
) -> Result<Json<ApiResponse<()>>> {
    db.client
        .query(
            r#"
            DELETE follows
            WHERE in = type::thing('user', $follower_id)
            AND out = type::thing('user', $following_id)
            "#,
        )
        .bind(("follower_id", auth_user.id))
        .bind(("following_id", id))
        .await?;

    Ok(Json(ApiResponse::success(())))
}

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/me", put(update_profile))
        .route("/{id}", get(get_user))
        .route("/{id}/ideas", get(get_user_ideas))
        .route("/{id}/followers", get(get_followers))
        .route("/{id}/following", get(get_following))
        .route("/{id}/follow", post(follow_user).delete(unfollow_user))
}
