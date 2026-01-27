//! Domain models - scaffolding for typed database operations
//! These will be used when we move away from serde_json::Value queries

#![allow(dead_code)]

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use surrealdb::sql::Thing;

// User models
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: Thing,
    pub email: String,
    pub name: String,
    #[serde(skip_serializing)]
    pub password_hash: Option<String>,
    pub avatar: Option<String>,
    pub bio: Option<String>,
    pub verified_email: bool,
    pub verified_yc: Option<YCVerification>,
    pub oauth_provider: Option<String>,
    pub oauth_id: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct YCVerification {
    pub company_name: String,
    pub batch: String,
    pub verified_at: DateTime<Utc>,
    pub verification_url: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserSummary {
    pub id: String,
    pub name: String,
    pub avatar: Option<String>,
    pub verified: bool,
    pub yc_verified: bool,
}

impl From<&User> for UserSummary {
    fn from(user: &User) -> Self {
        UserSummary {
            id: user.id.id.to_string(),
            name: user.name.clone(),
            avatar: user.avatar.clone(),
            verified: user.verified_email,
            yc_verified: user.verified_yc.is_some(),
        }
    }
}

// Idea models
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Idea {
    pub id: Thing,
    pub author: Thing,
    pub title: String,
    pub problem: String,
    pub solution: Option<String>,
    pub target_audience: Option<String>,
    pub category: String,
    pub tags: Vec<String>,
    pub links: Vec<String>,
    pub embedding: Option<Vec<f32>>,
    pub votes_problem: i32,
    pub votes_solution: i32,
    pub votes_total: i32,
    pub comment_count: i32,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IdeaWithAuthor {
    pub id: String,
    pub author: UserSummary,
    pub title: String,
    pub problem: String,
    pub solution: Option<String>,
    pub target_audience: Option<String>,
    pub category: String,
    pub tags: Vec<String>,
    pub links: Vec<String>,
    pub votes: VoteCounts,
    pub comment_count: i32,
    pub user_vote: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VoteCounts {
    pub problem: i32,
    pub solution: i32,
    pub total: i32,
}

#[derive(Debug, Deserialize)]
pub struct CreateIdea {
    pub title: String,
    pub problem: String,
    pub solution: Option<String>,
    pub target_audience: Option<String>,
    pub category: String,
    pub tags: Option<Vec<String>>,
    pub links: Option<Vec<String>>,
}

// Vote models
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Vote {
    pub id: Thing,
    pub user: Thing,
    pub idea: Thing,
    pub vote_type: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateVote {
    #[serde(rename = "type")]
    pub vote_type: String,
}

// Comment models
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Comment {
    pub id: Thing,
    pub author: Thing,
    pub idea: Thing,
    pub parent: Option<Thing>,
    pub content: String,
    pub upvotes: i32,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CommentWithAuthor {
    pub id: String,
    pub idea_id: String,
    pub author: UserSummary,
    pub parent_id: Option<String>,
    pub content: String,
    pub upvotes: i32,
    pub user_upvoted: bool,
    pub reply_count: i32,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateComment {
    pub content: String,
    pub parent_id: Option<String>,
}

// Session model
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Session {
    pub id: Thing,
    pub user: Thing,
    pub token: String,
    pub refresh_token: Option<String>,
    pub expires_at: DateTime<Utc>,
    pub ip: Option<String>,
    pub user_agent: Option<String>,
    pub created_at: DateTime<Utc>,
}

// Pagination
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PaginationParams {
    pub page: Option<u32>,
    pub page_size: Option<u32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PaginationInfo {
    pub page: u32,
    pub page_size: u32,
    pub total: u64,
    pub total_pages: u32,
    pub has_next: bool,
    pub has_prev: bool,
}

// API Response
#[derive(Debug, Serialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<T>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub pagination: Option<PaginationInfo>,
}

impl<T> ApiResponse<T> {
    pub fn success(data: T) -> Self {
        ApiResponse {
            success: true,
            data: Some(data),
            pagination: None,
        }
    }

    pub fn with_pagination(data: T, pagination: PaginationInfo) -> Self {
        ApiResponse {
            success: true,
            data: Some(data),
            pagination: Some(pagination),
        }
    }
}
