use std::env;
use std::str::FromStr;

#[derive(Clone, Debug)]
pub struct Config {
    pub port: u16,

    // Database
    pub surreal_url: String,
    pub surreal_ns: String,
    pub surreal_db: String,
    pub surreal_user: String,
    pub surreal_pass: String,

    // Auth
    pub jwt_secret: String,
    pub jwt_expiry_hours: i64,

    // OAuth
    pub google_client_id: Option<String>,
    pub google_client_secret: Option<String>,
    pub github_client_id: Option<String>,
    pub github_client_secret: Option<String>,

    // Email
    pub smtp_host: Option<String>,
    pub smtp_port: Option<u16>,
    pub smtp_user: Option<String>,
    pub smtp_pass: Option<String>,
    pub from_email: String,

    // AI
    pub openai_api_key: Option<String>,

    // App
    pub app_url: String,
    pub api_url: String,
}

/// Get env var with default value
#[inline]
fn env_or(key: &str, default: &str) -> String {
    env::var(key).unwrap_or_else(|_| default.into())
}

/// Parse env var with default, returning error on parse failure
fn env_parse<T: FromStr>(key: &str, default: &str) -> anyhow::Result<T>
where
    T::Err: std::error::Error + Send + Sync + 'static,
{
    env_or(key, default).parse().map_err(Into::into)
}

/// Get optional env var, parsed to type
fn env_opt_parse<T: FromStr>(key: &str) -> Option<T> {
    env::var(key).ok().and_then(|v| v.parse().ok())
}

impl Config {
    pub fn from_env() -> anyhow::Result<Self> {
        Ok(Self {
            port: env_parse("PORT", "3001")?,

            // Database
            surreal_url: env_or("SURREAL_URL", "ws://localhost:8000"),
            surreal_ns: env_or("SURREAL_NS", "rfsbase"),
            surreal_db: env_or("SURREAL_DB", "main"),
            surreal_user: env_or("SURREAL_USER", "root"),
            surreal_pass: env_or("SURREAL_PASS", "root"),

            // Auth
            jwt_secret: env_or("JWT_SECRET", "your-super-secret-jwt-key-min-32-chars"),
            jwt_expiry_hours: env_parse("JWT_EXPIRY_HOURS", "168")?, // 7 days

            // OAuth
            google_client_id: env::var("GOOGLE_CLIENT_ID").ok(),
            google_client_secret: env::var("GOOGLE_CLIENT_SECRET").ok(),
            github_client_id: env::var("GITHUB_CLIENT_ID").ok(),
            github_client_secret: env::var("GITHUB_CLIENT_SECRET").ok(),

            // Email
            smtp_host: env::var("SMTP_HOST").ok(),
            smtp_port: env_opt_parse("SMTP_PORT"),
            smtp_user: env::var("SMTP_USER").ok(),
            smtp_pass: env::var("SMTP_PASS").ok(),
            from_email: env_or("FROM_EMAIL", "noreply@rfsbase.com"),

            // AI
            openai_api_key: env::var("OPENAI_API_KEY").ok(),

            // App URLs
            app_url: env_or("APP_URL", "http://localhost:3000"),
            api_url: env_or("API_URL", "http://localhost:3001"),
        })
    }
}
