use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};

use crate::{config::Config, error::AppError};

const ISSUER: &str = "rfsbase";
const SECS_PER_HOUR: u64 = 3600;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Claims {
    pub sub: String,   // user id
    pub email: String, // user email
    pub name: String,  // user name
    pub exp: u64,      // expiration time
    pub iat: u64,      // issued at
    pub iss: String,   // issuer
}

impl Claims {
    /// Create new claims with configurable expiry duration in hours
    pub fn with_expiry(user_id: &str, email: &str, name: &str, expiry_hours: i64) -> Self {
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .expect("Time went backwards")
            .as_secs();

        Self {
            sub: user_id.into(),
            email: email.into(),
            name: name.into(),
            exp: now + (expiry_hours as u64 * SECS_PER_HOUR),
            iat: now,
            iss: ISSUER.into(),
        }
    }

    #[inline]
    pub fn user_id(&self) -> &str {
        &self.sub
    }
}

pub struct JwtService {
    encoding_key: EncodingKey,
    decoding_key: DecodingKey,
    validation: Validation,
    expiry_hours: i64,
}

impl JwtService {
    pub fn new(config: &Config) -> Self {
        let secret = config.jwt_secret.as_bytes();

        let mut validation = Validation::default();
        validation.set_issuer(&[ISSUER]);
        validation.leeway = 60; // 60 seconds leeway for clock skew

        Self {
            encoding_key: EncodingKey::from_secret(secret),
            decoding_key: DecodingKey::from_secret(secret),
            validation,
            expiry_hours: config.jwt_expiry_hours,
        }
    }

    /// Create claims for a user using the configured expiry time
    pub fn create_claims(&self, user_id: &str, email: &str, name: &str) -> Claims {
        Claims::with_expiry(user_id, email, name, self.expiry_hours)
    }

    pub fn create_token(&self, claims: &Claims) -> Result<String, AppError> {
        encode(&Header::default(), claims, &self.encoding_key)
            .map_err(|e| AppError::internal(format!("Failed to create token: {e}")))
    }

    pub fn verify_token(&self, token: &str) -> Result<Claims, AppError> {
        decode::<Claims>(token, &self.decoding_key, &self.validation)
            .map(|data| data.claims)
            .map_err(|_| AppError::Unauthorized) // All JWT errors -> Unauthorized
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn test_config() -> Config {
        Config {
            port: 3001,
            surreal_url: String::new(),
            surreal_ns: String::new(),
            surreal_db: String::new(),
            surreal_user: String::new(),
            surreal_pass: String::new(),
            jwt_secret: "test-secret-key-must-be-at-least-32-characters-long".into(),
            jwt_expiry_hours: 168,
            google_client_id: None,
            google_client_secret: None,
            github_client_id: None,
            github_client_secret: None,
            smtp_host: None,
            smtp_port: None,
            smtp_user: None,
            smtp_pass: None,
            from_email: "test@test.com".into(),
            openai_api_key: None,
            app_url: String::new(),
            api_url: String::new(),
        }
    }

    #[test]
    fn test_create_and_verify_token() {
        let config = test_config();
        let jwt = JwtService::new(&config);

        let claims = jwt.create_claims("user:123", "test@example.com", "Test User");
        let token = jwt.create_token(&claims).unwrap();

        let verified = jwt.verify_token(&token).unwrap();
        assert_eq!(verified.sub, "user:123");
        assert_eq!(verified.email, "test@example.com");
        assert_eq!(verified.name, "Test User");
    }

    #[test]
    fn test_invalid_token() {
        let config = test_config();
        let jwt = JwtService::new(&config);

        let result = jwt.verify_token("invalid-token");
        assert!(result.is_err());
    }
}
