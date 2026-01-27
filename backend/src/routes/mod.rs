use axum::{routing::get, Json, Router};
use serde::Serialize;
use std::borrow::Cow;

use crate::AppState;

mod auth;
mod comments;
mod ideas;
mod notifications;
mod users;

#[derive(Serialize)]
struct HealthResponse {
    status: Cow<'static, str>,
    version: Cow<'static, str>,
}

async fn health_check() -> Json<HealthResponse> {
    Json(HealthResponse {
        status: Cow::Borrowed("healthy"),
        version: Cow::Borrowed(env!("CARGO_PKG_VERSION")),
    })
}

pub fn api_routes() -> Router<AppState> {
    Router::new()
        .route("/health", get(health_check))
        .nest("/v1/auth", auth::routes())
        .nest("/v1/ideas", ideas::routes())
        .nest("/v1/comments", comments::routes())
        .nest("/v1/users", users::routes())
        .nest("/v1/notifications", notifications::routes())
}
