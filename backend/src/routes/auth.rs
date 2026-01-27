use axum::{
    extract::State,
    routing::{get, post},
    Json, Router,
};
use chrono::{Duration, Utc};
use serde::{Deserialize, Serialize};
use std::sync::Arc;

use crate::{
    auth::{AuthUser, JwtService},
    db::Database,
    models::ApiResponse,
    AppError, AppState, Result,
};

#[derive(Debug, Deserialize)]
pub struct MagicLinkRequest {
    email: String,
}

#[derive(Debug, Deserialize)]
pub struct VerifyRequest {
    token: String,
}

#[derive(Debug, Serialize)]
pub struct AuthResponse {
    user: UserResponse,
    token: String,
}

#[derive(Debug, Serialize)]
pub struct UserResponse {
    id: String,
    email: String,
    name: String,
    avatar: Option<String>,
    bio: Option<String>,
    verified: VerifiedStatus,
    stats: UserStats,
    #[serde(rename = "createdAt")]
    created_at: String,
    #[serde(rename = "updatedAt")]
    updated_at: String,
}

#[derive(Debug, Serialize, Default)]
pub struct VerifiedStatus {
    email: bool,
    yc: Option<YCVerification>,
}

#[derive(Debug, Serialize)]
pub struct YCVerification {
    #[serde(rename = "companyName")]
    company_name: String,
    batch: String,
    #[serde(rename = "verifiedAt")]
    verified_at: String,
}

#[derive(Debug, Serialize, Default)]
pub struct UserStats {
    #[serde(rename = "ideasCount")]
    ideas_count: i64,
    #[serde(rename = "votesReceived")]
    votes_received: i64,
    #[serde(rename = "commentsCount")]
    comments_count: i64,
    #[serde(rename = "followersCount")]
    followers_count: i64,
    #[serde(rename = "followingCount")]
    following_count: i64,
}

/// Helper trait to extract string fields from JSON with less boilerplate
trait JsonExt {
    fn str_field(&self, key: &str) -> String;
    fn opt_str_field(&self, key: &str) -> Option<String>;
    fn bool_field(&self, key: &str) -> bool;
}

impl JsonExt for serde_json::Value {
    #[inline]
    fn str_field(&self, key: &str) -> String {
        self[key].as_str().unwrap_or_default().into()
    }

    #[inline]
    fn opt_str_field(&self, key: &str) -> Option<String> {
        self[key].as_str().map(Into::into)
    }

    #[inline]
    fn bool_field(&self, key: &str) -> bool {
        self[key].as_bool().unwrap_or(false)
    }
}

async fn send_magic_link(
    State(db): State<Arc<Database>>,
    Json(body): Json<MagicLinkRequest>,
) -> Result<Json<ApiResponse<serde_json::Value>>> {
    // Validate email format
    if !body.email.contains('@') || body.email.len() < 5 {
        return Err(AppError::validation("Invalid email address"));
    }

    // Generate token
    let token = uuid::Uuid::new_v4().to_string();
    let expires_at = Utc::now() + Duration::minutes(15);
    let email = body.email; // Move ownership for 'static requirement

    // Store magic link
    let _: Option<serde_json::Value> = db
        .client
        .query(
            r#"
            CREATE magic_link SET
                email = $email,
                token = $token,
                expires_at = $expires_at,
                used = false,
                created_at = time::now()
            "#,
        )
        .bind(("email", email.clone()))
        .bind(("token", token.clone()))
        .bind(("expires_at", expires_at))
        .await?
        .take(0)?;

    tracing::info!(
        "Magic link for {email}: http://localhost:3000/auth/verify?token={token}"
    );

    Ok(Json(ApiResponse::success(serde_json::json!({
        "message": "Magic link sent to your email"
    }))))
}

async fn verify_magic_link(
    State(db): State<Arc<Database>>,
    State(jwt): State<Arc<JwtService>>,
    Json(body): Json<VerifyRequest>,
) -> Result<Json<ApiResponse<AuthResponse>>> {
    let token = body.token; // Move for 'static requirement

    // Find and validate magic link
    let magic_link: Option<serde_json::Value> = db
        .client
        .query(
            r#"
            SELECT * FROM magic_link
            WHERE token = $token
            AND expires_at > time::now()
            AND used = false
            LIMIT 1
            "#,
        )
        .bind(("token", token.clone()))
        .await?
        .take(0)?;

    let magic_link = magic_link.ok_or_else(|| AppError::validation("Invalid or expired token"))?;
    let email = magic_link.str_field("email");

    // Mark as used
    db.client
        .query("UPDATE magic_link SET used = true WHERE token = $token")
        .bind(("token", token))
        .await?;

    // Find or create user
    let user: Option<serde_json::Value> = db
        .client
        .query("SELECT * FROM user WHERE email = $email LIMIT 1")
        .bind(("email", email.clone()))
        .await?
        .take(0)?;

    let user = match user {
        Some(existing) => {
            let _: Option<serde_json::Value> = db
                .client
                .query("UPDATE user SET verified_email = true WHERE email = $email")
                .bind(("email", email.clone()))
                .await?
                .take(0)?;
            existing
        }
        None => {
            let name: String = email.split('@').next().unwrap_or("User").into();
            db.client
                .query(
                    r#"
                    CREATE user SET
                        email = $email,
                        name = $name,
                        verified_email = true,
                        created_at = time::now(),
                        updated_at = time::now()
                    "#,
                )
                .bind(("email", email.clone()))
                .bind(("name", name))
                .await?
                .take::<Option<serde_json::Value>>(0)?
                .ok_or_else(|| AppError::internal("Failed to create user"))?
        }
    };

    let user_id = user.str_field("id");
    let user_name = user.str_field("name");

    // Generate JWT using service (respects configured expiry)
    let claims = jwt.create_claims(&user_id, &email, &user_name);
    let jwt_token = jwt.create_token(&claims)?;

    Ok(Json(ApiResponse::success(AuthResponse {
        user: build_user_response(&user, UserStats::default()),
        token: jwt_token,
    })))
}

async fn get_me(
    State(db): State<Arc<Database>>,
    auth_user: AuthUser,
) -> Result<Json<ApiResponse<UserResponse>>> {
    let user: Option<serde_json::Value> = db
        .client
        .query("SELECT * FROM user WHERE id = type::thing('user', $id)")
        .bind(("id", auth_user.id))
        .await?
        .take(0)?;

    let user = user.ok_or_else(|| AppError::not_found("User not found"))?;

    Ok(Json(ApiResponse::success(build_user_response(&user, UserStats::default()))))
}

async fn logout() -> Result<Json<ApiResponse<()>>> {
    Ok(Json(ApiResponse::success(())))
}

fn build_user_response(user: &serde_json::Value, stats: UserStats) -> UserResponse {
    let yc_verification = user["verified_yc"].as_object().map(|yc| {
        let get_str = |key| yc.get(key).and_then(|v| v.as_str()).unwrap_or_default().into();
        YCVerification {
            company_name: get_str("company_name"),
            batch: get_str("batch"),
            verified_at: get_str("verified_at"),
        }
    });

    UserResponse {
        id: user.str_field("id"),
        email: user.str_field("email"),
        name: user.str_field("name"),
        avatar: user.opt_str_field("avatar"),
        bio: user.opt_str_field("bio"),
        verified: VerifiedStatus {
            email: user.bool_field("verified_email"),
            yc: yc_verification,
        },
        stats,
        created_at: user.str_field("created_at"),
        updated_at: user.str_field("updated_at"),
    }
}

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/magic-link", post(send_magic_link))
        .route("/verify", post(verify_magic_link))
        .route("/me", get(get_me))
        .route("/logout", post(logout))
}
