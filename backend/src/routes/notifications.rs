use axum::{
    extract::{Path, State},
    routing::{get, put},
    Json, Router,
};
use serde::Serialize;
use std::sync::Arc;

use crate::{auth::AuthUser, db::Database, models::ApiResponse, AppError, AppState, Result};

// ============================================================================
// Response Types
// ============================================================================

#[derive(Debug, Serialize)]
pub struct NotificationResponse {
    id: String,
    #[serde(rename = "type")]
    notification_type: String,
    data: serde_json::Value,
    read: bool,
    created_at: String,
}

// ============================================================================
// Helper Functions
// ============================================================================

fn extract_notification_id(value: &serde_json::Value) -> String {
    value["id"]
        .as_str()
        .or_else(|| value["id"]["id"].as_str())
        .unwrap_or_default()
        .strip_prefix("notification:")
        .unwrap_or_default()
        .to_string()
}

fn json_to_notification(row: &serde_json::Value) -> NotificationResponse {
    NotificationResponse {
        id: extract_notification_id(row),
        notification_type: row["notification_type"]
            .as_str()
            .unwrap_or_default()
            .to_string(),
        data: row["data"].clone(),
        read: row["read"].as_bool().unwrap_or(false),
        created_at: row["created_at"]
            .as_str()
            .unwrap_or_default()
            .to_string(),
    }
}

// ============================================================================
// Route Handlers
// ============================================================================

/// List notifications for the authenticated user
async fn list_notifications(
    State(db): State<Arc<Database>>,
    auth_user: AuthUser,
) -> Result<Json<ApiResponse<Vec<NotificationResponse>>>> {
    let notifications: Vec<serde_json::Value> = db
        .client
        .query(
            r#"
            SELECT *
            FROM notification
            WHERE user = type::thing('user', $user_id)
            ORDER BY created_at DESC
            LIMIT 50
            "#,
        )
        .bind(("user_id", auth_user.id))
        .await?
        .take(0)?;

    let response: Vec<NotificationResponse> = notifications
        .iter()
        .map(json_to_notification)
        .collect();

    Ok(Json(ApiResponse::success(response)))
}

/// Get count of unread notifications
async fn get_unread_count(
    State(db): State<Arc<Database>>,
    auth_user: AuthUser,
) -> Result<Json<ApiResponse<i32>>> {
    let result: Option<serde_json::Value> = db
        .client
        .query(
            r#"
            SELECT count() as count
            FROM notification
            WHERE user = type::thing('user', $user_id) AND read = false
            GROUP ALL
            "#,
        )
        .bind(("user_id", auth_user.id))
        .await?
        .take(0)?;

    let count = result
        .and_then(|v| v["count"].as_i64())
        .unwrap_or(0) as i32;

    Ok(Json(ApiResponse::success(count)))
}

/// Mark a specific notification as read
async fn mark_as_read(
    State(db): State<Arc<Database>>,
    Path(id): Path<String>,
    auth_user: AuthUser,
) -> Result<Json<ApiResponse<()>>> {
    // Verify ownership and update
    let result: Option<serde_json::Value> = db
        .client
        .query(
            r#"
            UPDATE type::thing('notification', $id)
            SET read = true
            WHERE user = type::thing('user', $user_id)
            "#,
        )
        .bind(("id", id))
        .bind(("user_id", auth_user.id))
        .await?
        .take(0)?;

    if result.is_none() {
        return Err(AppError::not_found("Notification not found"));
    }

    Ok(Json(ApiResponse::success(())))
}

/// Mark all notifications as read
async fn mark_all_as_read(
    State(db): State<Arc<Database>>,
    auth_user: AuthUser,
) -> Result<Json<ApiResponse<()>>> {
    db.client
        .query(
            r#"
            UPDATE notification
            SET read = true
            WHERE user = type::thing('user', $user_id) AND read = false
            "#,
        )
        .bind(("user_id", auth_user.id))
        .await?;

    Ok(Json(ApiResponse::success(())))
}

/// Delete a specific notification
async fn delete_notification(
    State(db): State<Arc<Database>>,
    Path(id): Path<String>,
    auth_user: AuthUser,
) -> Result<Json<ApiResponse<()>>> {
    // Verify ownership before deleting
    let notification: Option<serde_json::Value> = db
        .client
        .query(
            r#"
            SELECT * FROM type::thing('notification', $id)
            WHERE user = type::thing('user', $user_id)
            "#,
        )
        .bind(("id", id.clone()))
        .bind(("user_id", auth_user.id))
        .await?
        .take(0)?;

    if notification.is_none() {
        return Err(AppError::not_found("Notification not found"));
    }

    db.client
        .query("DELETE type::thing('notification', $id)")
        .bind(("id", id))
        .await?;

    Ok(Json(ApiResponse::success(())))
}

// ============================================================================
// Routes
// ============================================================================

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/", get(list_notifications))
        .route("/unread-count", get(get_unread_count))
        .route("/read-all", put(mark_all_as_read))
        .route("/{id}/read", put(mark_as_read))
        .route("/{id}", axum::routing::delete(delete_notification))
}
