use axum::{
    extract::{Path, Query, State},
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;

use crate::{
    auth::AuthUser,
    db::Database,
    models::ApiResponse,
    AppError, AppState, Result,
};

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_PAGE: u32 = 1;
const DEFAULT_PAGE_SIZE: u32 = 20;
const MAX_PAGE_SIZE: u32 = 100;
const MAX_SIMILAR_RESULTS: u32 = 20;
const DEFAULT_SIMILAR_THRESHOLD: f32 = 0.75;

// ============================================================================
// Request/Response Types
// ============================================================================

#[derive(Debug, Clone, Copy, Deserialize, Default)]
#[serde(rename_all = "snake_case")]
pub enum SortBy {
    #[default]
    New,
    Top,
    Hot,
}

#[derive(Debug, Deserialize)]
pub struct ListIdeasQuery {
    page: Option<u32>,
    page_size: Option<u32>,
    sort_by: Option<SortBy>,
    category: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct CreateIdeaRequest {
    title: String,
    problem: String,
    solution: Option<String>,
    target_audience: Option<String>,
    category: String,
    tags: Option<Vec<String>>,
    links: Option<Vec<String>>,
    embedding: Option<Vec<f32>>,
}

#[derive(Debug, Deserialize)]
pub struct VoteRequest {
    #[serde(rename = "type")]
    vote_type: VoteType,
}

#[derive(Debug, Clone, Copy, Deserialize, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum VoteType {
    Problem,
    Solution,
}

#[derive(Debug, Deserialize)]
pub struct SimilarIdeasQuery {
    embedding: String,
    threshold: Option<f32>,
    limit: Option<u32>,
    exclude_id: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct IdeaResponse {
    id: String,
    title: String,
    problem: String,
    solution: Option<String>,
    category: String,
    tags: Vec<String>,
    votes: VoteCounts,
    #[serde(rename = "commentCount")]
    comment_count: i32,
    #[serde(rename = "createdAt")]
    created_at: String,
}

#[derive(Debug, Serialize, Default, Clone)]
pub struct VoteCounts {
    problem: i32,
    solution: i32,
    total: i32,
}

#[derive(Debug, Serialize)]
pub struct SimilarIdeaResponse {
    id: String,
    title: String,
    problem: String,
    category: String,
    tags: Vec<String>,
    votes_total: i32,
    similarity: f32,
}

// ============================================================================
// JSON Field Extraction (zero-copy where possible)
// ============================================================================

trait JsonExt {
    fn str_field(&self, key: &str) -> String;
    fn opt_str_field(&self, key: &str) -> Option<String>;
    fn i32_field(&self, key: &str) -> i32;
    fn f32_field(&self, key: &str) -> f32;
    fn tags_field(&self) -> Vec<String>;
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
    fn i32_field(&self, key: &str) -> i32 {
        self[key].as_i64().map(|v| v.clamp(i32::MIN as i64, i32::MAX as i64) as i32).unwrap_or(0)
    }

    #[inline]
    fn f32_field(&self, key: &str) -> f32 {
        self[key].as_f64().map(|v| v as f32).unwrap_or(0.0)
    }

    fn tags_field(&self) -> Vec<String> {
        self["tags"]
            .as_array()
            .map(|arr| arr.iter().filter_map(|v| v.as_str().map(Into::into)).collect())
            .unwrap_or_default()
    }
}

impl VoteCounts {
    fn from_json(json: &serde_json::Value) -> Self {
        Self {
            problem: json.i32_field("votes_problem"),
            solution: json.i32_field("votes_solution"),
            total: json.i32_field("votes_total"),
        }
    }
}

// Pure transformation functions
fn to_idea_response(row: &serde_json::Value, created_at: &str) -> IdeaResponse {
    IdeaResponse {
        id: row.str_field("id"),
        title: row.str_field("title"),
        problem: row.str_field("problem"),
        solution: row.opt_str_field("solution"),
        category: row.str_field("category"),
        tags: row.tags_field(),
        votes: VoteCounts::from_json(row),
        comment_count: row.i32_field("comment_count"),
        created_at: created_at.into(),
    }
}

fn to_similar_response(row: &serde_json::Value) -> SimilarIdeaResponse {
    SimilarIdeaResponse {
        id: row.str_field("id"),
        title: row.str_field("title"),
        problem: row.str_field("problem"),
        category: row.str_field("category"),
        tags: row.tags_field(),
        votes_total: row.i32_field("votes_total"),
        similarity: row.f32_field("similarity"),
    }
}

// ============================================================================
// Route Handlers
// ============================================================================

async fn list_ideas(
    State(db): State<Arc<Database>>,
    Query(params): Query<ListIdeasQuery>,
) -> Result<Json<ApiResponse<Vec<IdeaResponse>>>> {
    let page = params.page.unwrap_or(DEFAULT_PAGE);
    let page_size = params.page_size.unwrap_or(DEFAULT_PAGE_SIZE).min(MAX_PAGE_SIZE);
    let offset = (page.saturating_sub(1)) * page_size;

    // Safe sort - enum prevents SQL injection
    let order_by = match params.sort_by.unwrap_or_default() {
        SortBy::Top => "votes_total DESC",
        SortBy::Hot => "votes_total DESC, created_at DESC",
        SortBy::New => "created_at DESC",
    };

    let query = format!(
        "SELECT * FROM idea ORDER BY {order_by} LIMIT $limit START $offset"
    );

    let results: Vec<serde_json::Value> = db.client
        .query(&query)
        .bind(("limit", page_size))
        .bind(("offset", offset))
        .await?
        .take(0)?;

    let now = chrono::Utc::now().to_rfc3339();
    let ideas: Vec<_> = results.iter().map(|row| to_idea_response(row, &now)).collect();

    Ok(Json(ApiResponse::success(ideas)))
}

async fn get_idea(
    State(db): State<Arc<Database>>,
    Path(id): Path<String>,
) -> Result<Json<ApiResponse<IdeaResponse>>> {
    let idea: Option<serde_json::Value> = db.client
        .query("SELECT * FROM type::thing('idea', $id)")
        .bind(("id", id))
        .await?
        .take(0)?;

    let idea = idea.ok_or_else(|| AppError::not_found("Idea not found"))?;
    let response = to_idea_response(&idea, &chrono::Utc::now().to_rfc3339());

    Ok(Json(ApiResponse::success(response)))
}

async fn create_idea(
    State(db): State<Arc<Database>>,
    auth_user: AuthUser,
    Json(body): Json<CreateIdeaRequest>,
) -> Result<Json<ApiResponse<IdeaResponse>>> {
    let title_len = body.title.len();
    if !(10..=100).contains(&title_len) {
        return Err(AppError::validation("Title must be between 10 and 100 characters"));
    }

    let tags = body.tags.unwrap_or_default();
    let CreateIdeaRequest { title, problem, solution, category, embedding, .. } = body;

    let result: Option<serde_json::Value> = db.client
        .query(
            r#"
            CREATE idea SET
                author = type::thing('user', $author_id),
                title = $title,
                problem = $problem,
                solution = $solution,
                category = $category,
                tags = $tags,
                embedding = $embedding,
                votes_problem = 0,
                votes_solution = 0,
                votes_total = 0,
                comment_count = 0,
                created_at = time::now(),
                updated_at = time::now()
            "#,
        )
        .bind(("author_id", auth_user.id.clone()))
        .bind(("title", title.clone()))
        .bind(("problem", problem.clone()))
        .bind(("solution", solution.clone()))
        .bind(("category", category.clone()))
        .bind(("tags", tags.clone()))
        .bind(("embedding", embedding))
        .await?
        .take(0)?;

    let idea = result.ok_or_else(|| AppError::internal("Failed to create idea"))?;

    Ok(Json(ApiResponse::success(IdeaResponse {
        id: idea.str_field("id"),
        title,
        problem,
        solution,
        category,
        tags,
        votes: VoteCounts::default(),
        comment_count: 0,
        created_at: chrono::Utc::now().to_rfc3339(),
    })))
}

// ============================================================================
// Voting (using SurrealDB RELATE)
// ============================================================================

async fn vote_idea(
    State(db): State<Arc<Database>>,
    Path(idea_id): Path<String>,
    auth_user: AuthUser,
    Json(body): Json<VoteRequest>,
) -> Result<Json<ApiResponse<VoteCounts>>> {
    let vote_type = match body.vote_type {
        VoteType::Problem => "problem",
        VoteType::Solution => "solution",
    };

    db.client
        .query(
            r#"
            DELETE voted WHERE in = type::thing('user', $user_id) AND out = type::thing('idea', $idea_id);
            RELATE type::thing('user', $user_id)->voted->type::thing('idea', $idea_id) SET
                vote_type = $vote_type,
                created_at = time::now();
            "#,
        )
        .bind(("user_id", auth_user.id))
        .bind(("idea_id", idea_id.clone()))
        .bind(("vote_type", vote_type))
        .await?;

    update_idea_vote_counts(&db, &idea_id).await?;
    fetch_vote_counts(&db, idea_id).await
}

async fn delete_vote(
    State(db): State<Arc<Database>>,
    Path(idea_id): Path<String>,
    auth_user: AuthUser,
) -> Result<Json<ApiResponse<VoteCounts>>> {
    db.client
        .query("DELETE voted WHERE in = type::thing('user', $user_id) AND out = type::thing('idea', $idea_id)")
        .bind(("user_id", auth_user.id))
        .bind(("idea_id", idea_id.clone()))
        .await?;

    update_idea_vote_counts(&db, &idea_id).await?;
    fetch_vote_counts(&db, idea_id).await
}

async fn update_idea_vote_counts(db: &Database, idea_id: &str) -> Result<()> {
    db.client
        .query(
            r#"
            LET $problem_votes = (SELECT count() FROM voted WHERE out = type::thing('idea', $idea_id) AND vote_type = 'problem' GROUP ALL)[0].count ?? 0;
            LET $solution_votes = (SELECT count() FROM voted WHERE out = type::thing('idea', $idea_id) AND vote_type = 'solution' GROUP ALL)[0].count ?? 0;
            UPDATE type::thing('idea', $idea_id) SET
                votes_problem = $problem_votes,
                votes_solution = $solution_votes,
                votes_total = $problem_votes + $solution_votes;
            "#,
        )
        .bind(("idea_id", idea_id.to_owned()))
        .await?;
    Ok(())
}

async fn fetch_vote_counts(db: &Database, idea_id: String) -> Result<Json<ApiResponse<VoteCounts>>> {
    let result: Option<serde_json::Value> = db.client
        .query("SELECT votes_problem, votes_solution, votes_total FROM type::thing('idea', $id)")
        .bind(("id", idea_id))
        .await?
        .take(0)?;

    let counts = result.as_ref().map(VoteCounts::from_json).unwrap_or_default();
    Ok(Json(ApiResponse::success(counts)))
}

// ============================================================================
// Vector Search for Similar Ideas
// ============================================================================

async fn find_similar_ideas(
    State(db): State<Arc<Database>>,
    Query(params): Query<SimilarIdeasQuery>,
) -> Result<Json<ApiResponse<Vec<SimilarIdeaResponse>>>> {
    let embedding: Vec<f32> = serde_json::from_str(&params.embedding)
        .map_err(|_| AppError::validation("Invalid embedding format"))?;

    let threshold = params.threshold.unwrap_or(DEFAULT_SIMILAR_THRESHOLD);
    let limit = params.limit.unwrap_or(5).min(MAX_SIMILAR_RESULTS);

    let results: Vec<serde_json::Value> = db.client
        .query(
            r#"
            SELECT
                id, title, problem, category, tags, votes_total,
                vector::similarity::cosine(embedding, $embedding) AS similarity
            FROM idea
            WHERE embedding != NONE
                AND ($exclude_id = NONE OR id != type::thing('idea', $exclude_id))
                AND vector::similarity::cosine(embedding, $embedding) >= $threshold
            ORDER BY similarity DESC
            LIMIT $limit
            "#,
        )
        .bind(("embedding", embedding))
        .bind(("threshold", threshold))
        .bind(("limit", limit))
        .bind(("exclude_id", params.exclude_id))
        .await?
        .take(0)?;

    let ideas: Vec<_> = results.iter().map(to_similar_response).collect();
    Ok(Json(ApiResponse::success(ideas)))
}

// ============================================================================
// Routes
// ============================================================================

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/", get(list_ideas).post(create_idea))
        .route("/similar", get(find_similar_ideas))
        .route("/{id}", get(get_idea))
        .route("/{id}/vote", post(vote_idea).delete(delete_vote))
}
