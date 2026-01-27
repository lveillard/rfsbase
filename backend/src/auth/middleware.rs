//! Authentication middleware for Axum routes
//!
//! Provides `require_auth` and `optional_auth` middleware functions
//! for protecting routes that need authentication.

use axum::{
    body::Body,
    extract::State,
    http::{header::AUTHORIZATION, Request},
    middleware::Next,
    response::Response,
};
use std::sync::Arc;

use super::jwt::{Claims, JwtService};
use crate::error::AppError;

const BEARER_PREFIX: &str = "Bearer ";

/// Extension for extracting the authenticated user from requests
#[derive(Clone, Debug)]
pub struct AuthUser {
    pub id: String,
    #[allow(dead_code)]
    pub email: String,
    #[allow(dead_code)]
    pub name: String,
}

impl From<Claims> for AuthUser {
    fn from(claims: Claims) -> Self {
        Self {
            id: claims.sub,
            email: claims.email,
            name: claims.name,
        }
    }
}

// Public middleware functions for route composition
#[allow(dead_code)]
/// Middleware to require authentication
/// Extracts the JWT from the Authorization header and validates it
pub async fn require_auth(
    State(jwt_service): State<Arc<JwtService>>,
    mut req: Request<Body>,
    next: Next,
) -> Result<Response, AppError> {
    let token = extract_bearer_token(&req)?;
    let claims = jwt_service.verify_token(token)?;

    req.extensions_mut().insert(AuthUser::from(claims));

    Ok(next.run(req).await)
}

#[allow(dead_code)]
/// Middleware for optional authentication
/// Does not fail if no token is present, but validates if one is provided
pub async fn optional_auth(
    State(jwt_service): State<Arc<JwtService>>,
    mut req: Request<Body>,
    next: Next,
) -> Response {
    if let Some(auth_user) = extract_bearer_token(&req)
        .ok()
        .and_then(|token| jwt_service.verify_token(token).ok())
        .map(AuthUser::from)
    {
        req.extensions_mut().insert(auth_user);
    }

    next.run(req).await
}

/// Extract bearer token from Authorization header
/// Returns a reference to the token portion of the header to avoid allocation
fn extract_bearer_token(req: &Request<Body>) -> Result<&str, AppError> {
    req.headers()
        .get(AUTHORIZATION)
        .ok_or(AppError::Unauthorized)?
        .to_str()
        .map_err(|_| AppError::Unauthorized)?
        .strip_prefix(BEARER_PREFIX)
        .ok_or(AppError::Unauthorized)
}

/// Extractor for getting the authenticated user from request extensions
pub mod extractors {
    use axum::extract::FromRequestParts;
    use axum::http::request::Parts;
    use super::AuthUser;
    use crate::error::AppError;

    impl<S> FromRequestParts<S> for AuthUser
    where
        S: Send + Sync,
    {
        type Rejection = AppError;

        async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
            parts
                .extensions
                .get::<AuthUser>()
                .cloned()
                .ok_or(AppError::Unauthorized)
        }
    }
}
