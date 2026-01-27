pub mod jwt;
pub mod middleware;

pub use jwt::JwtService;
pub use middleware::AuthUser;

// Re-export middleware functions when needed
#[allow(unused_imports)]
pub use jwt::Claims;
#[allow(unused_imports)]
pub use middleware::{optional_auth, require_auth};
