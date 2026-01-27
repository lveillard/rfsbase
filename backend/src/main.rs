use std::net::SocketAddr;
use std::sync::Arc;
use std::time::Duration;

use axum::{
    extract::FromRef,
    http::{header, Method},
    Router,
};
use tower_http::{
    cors::{Any, CorsLayer},
    trace::TraceLayer,
};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod auth;
mod config;
mod db;
mod error;
mod models;
mod routes;
mod services;

pub use error::{AppError, Result};

#[derive(Clone)]
pub struct AppState {
    pub db: Arc<db::Database>,
    pub config: Arc<config::Config>,
    pub jwt: Arc<auth::JwtService>,
}

impl FromRef<AppState> for Arc<db::Database> {
    fn from_ref(state: &AppState) -> Self {
        state.db.clone()
    }
}

impl FromRef<AppState> for Arc<config::Config> {
    fn from_ref(state: &AppState) -> Self {
        state.config.clone()
    }
}

impl FromRef<AppState> for Arc<auth::JwtService> {
    fn from_ref(state: &AppState) -> Self {
        state.jwt.clone()
    }
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Load environment variables
    dotenvy::dotenv().ok();

    // Initialize tracing
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "rfsbase_api=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Load configuration
    let config = config::Config::from_env()?;
    tracing::info!("Configuration loaded");

    // Connect to database
    let db = db::Database::connect(&config).await?;
    tracing::info!("Connected to SurrealDB");

    // Run migrations
    db.migrate().await?;
    tracing::info!("Database migrations complete");

    // Create JWT service
    let jwt_service = auth::JwtService::new(&config);
    tracing::info!("JWT service initialized");

    // Create app state - wrap config in Arc before jwt_service so we don't need clone
    let config = Arc::new(config);
    let state = AppState {
        db: Arc::new(db),
        config: Arc::clone(&config),
        jwt: Arc::new(jwt_service),
    };

    // CORS configuration
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([
            Method::GET,
            Method::POST,
            Method::PUT,
            Method::DELETE,
            Method::PATCH,
            Method::OPTIONS,
        ])
        .allow_headers([
            header::AUTHORIZATION,
            header::CONTENT_TYPE,
            header::ACCEPT,
        ])
        .max_age(Duration::from_secs(3600));

    // Build router
    let app = Router::new()
        .nest("/api", routes::api_routes())
        .with_state(state)
        .layer(cors)
        .layer(TraceLayer::new_for_http());

    // Start server
    let addr = SocketAddr::from(([0, 0, 0, 0], config.port));
    tracing::info!("Starting server on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}
