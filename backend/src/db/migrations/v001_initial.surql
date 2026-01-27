-- RFSbase Initial Schema Migration
-- Version: 001
-- Uses SurrealDB graph relations and vector search

-- ============================================
-- TABLES
-- ============================================

-- Users
DEFINE TABLE IF NOT EXISTS user SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS email ON user TYPE string;
DEFINE FIELD IF NOT EXISTS name ON user TYPE string;
DEFINE FIELD IF NOT EXISTS password_hash ON user TYPE option<string>;
DEFINE FIELD IF NOT EXISTS avatar ON user TYPE option<string>;
DEFINE FIELD IF NOT EXISTS bio ON user TYPE option<string>;
DEFINE FIELD IF NOT EXISTS verified_email ON user TYPE bool DEFAULT false;
DEFINE FIELD IF NOT EXISTS verified_yc ON user TYPE option<object>;
DEFINE FIELD IF NOT EXISTS verified_yc.batch ON user TYPE option<string>;
DEFINE FIELD IF NOT EXISTS verified_yc.company ON user TYPE option<string>;
DEFINE FIELD IF NOT EXISTS oauth_provider ON user TYPE option<string>;
DEFINE FIELD IF NOT EXISTS oauth_id ON user TYPE option<string>;
DEFINE FIELD IF NOT EXISTS created_at ON user TYPE datetime DEFAULT time::now();
DEFINE FIELD IF NOT EXISTS updated_at ON user TYPE datetime VALUE time::now();

DEFINE INDEX IF NOT EXISTS user_email ON user COLUMNS email UNIQUE;
DEFINE INDEX IF NOT EXISTS user_oauth ON user COLUMNS oauth_provider, oauth_id;

-- Sessions
DEFINE TABLE IF NOT EXISTS session SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS user ON session TYPE record<user>;
DEFINE FIELD IF NOT EXISTS token ON session TYPE string;
DEFINE FIELD IF NOT EXISTS refresh_token ON session TYPE option<string>;
DEFINE FIELD IF NOT EXISTS expires_at ON session TYPE datetime;
DEFINE FIELD IF NOT EXISTS ip ON session TYPE option<string>;
DEFINE FIELD IF NOT EXISTS user_agent ON session TYPE option<string>;
DEFINE FIELD IF NOT EXISTS created_at ON session TYPE datetime DEFAULT time::now();

DEFINE INDEX IF NOT EXISTS session_token ON session COLUMNS token UNIQUE;
DEFINE INDEX IF NOT EXISTS session_refresh ON session COLUMNS refresh_token;

-- Magic Links
DEFINE TABLE IF NOT EXISTS magic_link SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS email ON magic_link TYPE string;
DEFINE FIELD IF NOT EXISTS token ON magic_link TYPE string;
DEFINE FIELD IF NOT EXISTS expires_at ON magic_link TYPE datetime;
DEFINE FIELD IF NOT EXISTS used ON magic_link TYPE bool DEFAULT false;
DEFINE FIELD IF NOT EXISTS created_at ON magic_link TYPE datetime DEFAULT time::now();

DEFINE INDEX IF NOT EXISTS magic_link_token ON magic_link COLUMNS token UNIQUE;

-- Ideas
DEFINE TABLE IF NOT EXISTS idea SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS author ON idea TYPE record<user>;
DEFINE FIELD IF NOT EXISTS title ON idea TYPE string;
DEFINE FIELD IF NOT EXISTS problem ON idea TYPE string;
DEFINE FIELD IF NOT EXISTS solution ON idea TYPE option<string>;
DEFINE FIELD IF NOT EXISTS target_audience ON idea TYPE option<string>;
DEFINE FIELD IF NOT EXISTS category ON idea TYPE string;
DEFINE FIELD IF NOT EXISTS tags ON idea TYPE array<string> DEFAULT [];
DEFINE FIELD IF NOT EXISTS links ON idea TYPE array<string> DEFAULT [];
DEFINE FIELD IF NOT EXISTS embedding ON idea TYPE option<array<float>>;
DEFINE FIELD IF NOT EXISTS votes_problem ON idea TYPE int DEFAULT 0;
DEFINE FIELD IF NOT EXISTS votes_solution ON idea TYPE int DEFAULT 0;
DEFINE FIELD IF NOT EXISTS votes_total ON idea TYPE int DEFAULT 0;
DEFINE FIELD IF NOT EXISTS comment_count ON idea TYPE int DEFAULT 0;
DEFINE FIELD IF NOT EXISTS created_at ON idea TYPE datetime DEFAULT time::now();
DEFINE FIELD IF NOT EXISTS updated_at ON idea TYPE datetime VALUE time::now();

DEFINE INDEX IF NOT EXISTS idea_created ON idea COLUMNS created_at;
DEFINE INDEX IF NOT EXISTS idea_category ON idea COLUMNS category;
DEFINE INDEX IF NOT EXISTS idea_author ON idea COLUMNS author;

-- Vector index for semantic search (HNSW algorithm)
DEFINE INDEX IF NOT EXISTS idea_embedding ON idea FIELDS embedding MTREE DIMENSION 1536 DIST COSINE;

-- Comments
DEFINE TABLE IF NOT EXISTS comment SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS author ON comment TYPE record<user>;
DEFINE FIELD IF NOT EXISTS idea ON comment TYPE record<idea>;
DEFINE FIELD IF NOT EXISTS parent ON comment TYPE option<record<comment>>;
DEFINE FIELD IF NOT EXISTS content ON comment TYPE string;
DEFINE FIELD IF NOT EXISTS upvotes ON comment TYPE int DEFAULT 0;
DEFINE FIELD IF NOT EXISTS created_at ON comment TYPE datetime DEFAULT time::now();
DEFINE FIELD IF NOT EXISTS updated_at ON comment TYPE datetime VALUE time::now();

DEFINE INDEX IF NOT EXISTS comment_idea ON comment COLUMNS idea;
DEFINE INDEX IF NOT EXISTS comment_parent ON comment COLUMNS parent;

-- Notifications
DEFINE TABLE IF NOT EXISTS notification SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS user ON notification TYPE record<user>;
DEFINE FIELD IF NOT EXISTS notification_type ON notification TYPE string;
DEFINE FIELD IF NOT EXISTS data ON notification TYPE object FLEXIBLE;
DEFINE FIELD IF NOT EXISTS read ON notification TYPE bool DEFAULT false;
DEFINE FIELD IF NOT EXISTS created_at ON notification TYPE datetime DEFAULT time::now();

DEFINE INDEX IF NOT EXISTS notification_user ON notification COLUMNS user, created_at;

-- ============================================
-- GRAPH RELATIONS (using RELATE)
-- ============================================

-- Votes: user -[voted]-> idea
DEFINE TABLE IF NOT EXISTS voted SCHEMAFULL TYPE RELATION IN user OUT idea;
DEFINE FIELD IF NOT EXISTS vote_type ON voted TYPE string;
DEFINE FIELD IF NOT EXISTS created_at ON voted TYPE datetime DEFAULT time::now();
DEFINE INDEX IF NOT EXISTS voted_unique ON voted COLUMNS in, out UNIQUE;

-- Follows: user -[follows]-> user
DEFINE TABLE IF NOT EXISTS follows SCHEMAFULL TYPE RELATION IN user OUT user;
DEFINE FIELD IF NOT EXISTS created_at ON follows TYPE datetime DEFAULT time::now();
DEFINE INDEX IF NOT EXISTS follows_unique ON follows COLUMNS in, out UNIQUE;

-- Comment Upvotes: user -[upvoted]-> comment
DEFINE TABLE IF NOT EXISTS upvoted SCHEMAFULL TYPE RELATION IN user OUT comment;
DEFINE FIELD IF NOT EXISTS created_at ON upvoted TYPE datetime DEFAULT time::now();
DEFINE INDEX IF NOT EXISTS upvoted_unique ON upvoted COLUMNS in, out UNIQUE;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to find similar ideas by embedding
DEFINE FUNCTION IF NOT EXISTS fn::find_similar_ideas($embedding: array<float>, $limit: int, $threshold: float, $exclude_id: option<string>) {
    LET $results = SELECT
        id,
        title,
        problem,
        category,
        tags,
        votes_total,
        vector::similarity::cosine(embedding, $embedding) AS similarity
    FROM idea
    WHERE embedding != NONE
        AND ($exclude_id = NONE OR id != type::thing('idea', $exclude_id))
        AND vector::similarity::cosine(embedding, $embedding) >= $threshold
    ORDER BY similarity DESC
    LIMIT $limit;

    RETURN $results;
};
