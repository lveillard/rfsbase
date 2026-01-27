use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde::Serialize;
use std::borrow::Cow;

pub type Result<T> = std::result::Result<T, AppError>;

// Static error messages to avoid runtime allocations
const MSG_INTERNAL_ERROR: &str = "An internal error occurred";
const MSG_RATE_LIMITED: &str = "Too many requests. Please try again later.";

#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("Authentication required")]
    Unauthorized,

    #[error("Access denied: {0}")]
    Forbidden(Cow<'static, str>),

    #[error("Resource not found: {0}")]
    NotFound(Cow<'static, str>),

    #[error("Validation error: {0}")]
    Validation(Cow<'static, str>),

    #[error("Conflict: {0}")]
    Conflict(Cow<'static, str>),

    #[error("Rate limited")]
    RateLimited,

    #[error("Database error: {0}")]
    Database(#[from] surrealdb::Error),

    #[error("Internal error: {0}")]
    Internal(Cow<'static, str>),
}

// Convenience constructors for common patterns
impl AppError {
    #[inline]
    pub fn not_found(msg: impl Into<Cow<'static, str>>) -> Self {
        Self::NotFound(msg.into())
    }

    #[inline]
    pub fn validation(msg: impl Into<Cow<'static, str>>) -> Self {
        Self::Validation(msg.into())
    }

    #[inline]
    pub fn internal(msg: impl Into<Cow<'static, str>>) -> Self {
        Self::Internal(msg.into())
    }

    #[inline]
    pub fn forbidden(msg: impl Into<Cow<'static, str>>) -> Self {
        Self::Forbidden(msg.into())
    }

    #[inline]
    pub fn conflict(msg: impl Into<Cow<'static, str>>) -> Self {
        Self::Conflict(msg.into())
    }
}

#[derive(Serialize)]
struct ErrorResponse<'a> {
    success: bool,
    error: ErrorDetail<'a>,
}

#[derive(Serialize)]
struct ErrorDetail<'a> {
    code: &'a str,
    message: Cow<'a, str>,
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, code, message): (StatusCode, &str, Cow<'_, str>) = match self {
            Self::Unauthorized => (
                StatusCode::UNAUTHORIZED,
                "UNAUTHORIZED",
                Cow::Borrowed("Authentication required"),
            ),
            Self::Forbidden(msg) => (StatusCode::FORBIDDEN, "FORBIDDEN", msg),
            Self::NotFound(msg) => (StatusCode::NOT_FOUND, "NOT_FOUND", msg),
            Self::Validation(msg) => (StatusCode::BAD_REQUEST, "VALIDATION_ERROR", msg),
            Self::Conflict(msg) => (StatusCode::CONFLICT, "CONFLICT", msg),
            Self::RateLimited => (
                StatusCode::TOO_MANY_REQUESTS,
                "RATE_LIMITED",
                Cow::Borrowed(MSG_RATE_LIMITED),
            ),
            Self::Database(ref e) => {
                tracing::error!("Database error: {e:?}");
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "INTERNAL_ERROR",
                    Cow::Borrowed(MSG_INTERNAL_ERROR),
                )
            }
            Self::Internal(ref msg) => {
                tracing::error!("Internal error: {msg}");
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "INTERNAL_ERROR",
                    Cow::Borrowed(MSG_INTERNAL_ERROR),
                )
            }
        };

        let body = Json(ErrorResponse {
            success: false,
            error: ErrorDetail { code, message },
        });

        (status, body).into_response()
    }
}
