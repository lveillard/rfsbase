-- Initial schema for RFSbase
-- Run this to set up the database

-- Define namespace and database
DEFINE NAMESPACE IF NOT EXISTS rfsbase;
USE NAMESPACE rfsbase;
DEFINE DATABASE IF NOT EXISTS main;
USE DATABASE main;

-- ============================================
-- TABLES
-- ============================================

-- Users (managed by Better Auth, but we add custom fields)
DEFINE TABLE IF NOT EXISTS user SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS name ON user TYPE string;
DEFINE FIELD IF NOT EXISTS email ON user TYPE string ASSERT string::is::email($value);
DEFINE FIELD IF NOT EXISTS emailVerified ON user TYPE option<datetime>;
DEFINE FIELD IF NOT EXISTS image ON user TYPE option<string>;
DEFINE FIELD IF NOT EXISTS avatar ON user TYPE option<string>;
DEFINE FIELD IF NOT EXISTS bio ON user TYPE option<string>;
DEFINE FIELD IF NOT EXISTS verified_email ON user TYPE bool DEFAULT false;
DEFINE FIELD IF NOT EXISTS verified_yc ON user TYPE option<object>;
DEFINE FIELD IF NOT EXISTS created_at ON user TYPE datetime DEFAULT time::now();
DEFINE FIELD IF NOT EXISTS updated_at ON user TYPE datetime DEFAULT time::now();
DEFINE INDEX IF NOT EXISTS email_idx ON user COLUMNS email UNIQUE;

-- Ideas (RFS - Request for Startups)
DEFINE TABLE IF NOT EXISTS idea SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS title ON idea TYPE string;
DEFINE FIELD IF NOT EXISTS problem ON idea TYPE string;
DEFINE FIELD IF NOT EXISTS solution ON idea TYPE option<string>;
DEFINE FIELD IF NOT EXISTS target_audience ON idea TYPE option<string>;
DEFINE FIELD IF NOT EXISTS category ON idea TYPE string;
DEFINE FIELD IF NOT EXISTS tags ON idea TYPE array<string> DEFAULT [];
DEFINE FIELD IF NOT EXISTS links ON idea TYPE array<string> DEFAULT [];
DEFINE FIELD IF NOT EXISTS embedding ON idea TYPE option<array>;
DEFINE FIELD IF NOT EXISTS votes_problem ON idea TYPE int DEFAULT 0;
DEFINE FIELD IF NOT EXISTS votes_solution ON idea TYPE int DEFAULT 0;
DEFINE FIELD IF NOT EXISTS votes_total ON idea TYPE int DEFAULT 0;
DEFINE FIELD IF NOT EXISTS comment_count ON idea TYPE int DEFAULT 0;
DEFINE FIELD IF NOT EXISTS author ON idea TYPE record<user>;
DEFINE FIELD IF NOT EXISTS created_at ON idea TYPE datetime DEFAULT time::now();
DEFINE FIELD IF NOT EXISTS updated_at ON idea TYPE datetime DEFAULT time::now();
DEFINE INDEX IF NOT EXISTS category_idx ON idea COLUMNS category;
DEFINE INDEX IF NOT EXISTS votes_total_idx ON idea COLUMNS votes_total;
DEFINE INDEX IF NOT EXISTS created_at_idx ON idea COLUMNS created_at;

-- Comments
DEFINE TABLE IF NOT EXISTS comment SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS content ON comment TYPE string;
DEFINE FIELD IF NOT EXISTS upvotes ON comment TYPE int DEFAULT 0;
DEFINE FIELD IF NOT EXISTS author ON comment TYPE record<user>;
DEFINE FIELD IF NOT EXISTS idea ON comment TYPE record<idea>;
DEFINE FIELD IF NOT EXISTS parent ON comment TYPE option<record<comment>>;
DEFINE FIELD IF NOT EXISTS created_at ON comment TYPE datetime DEFAULT time::now();
DEFINE FIELD IF NOT EXISTS updated_at ON comment TYPE datetime DEFAULT time::now();
DEFINE INDEX IF NOT EXISTS idea_idx ON comment COLUMNS idea;
DEFINE INDEX IF NOT EXISTS parent_idx ON comment COLUMNS parent;

-- Better Auth Tables (required by better-auth)
DEFINE TABLE IF NOT EXISTS session SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS userId ON session TYPE record<user>;
DEFINE FIELD IF NOT EXISTS token ON session TYPE string;
DEFINE FIELD IF NOT EXISTS expiresAt ON session TYPE datetime;
DEFINE FIELD IF NOT EXISTS ipAddress ON session TYPE option<string>;
DEFINE FIELD IF NOT EXISTS userAgent ON session TYPE option<string>;
DEFINE INDEX IF NOT EXISTS token_idx ON session COLUMNS token UNIQUE;

DEFINE TABLE IF NOT EXISTS account SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS userId ON account TYPE record<user>;
DEFINE FIELD IF NOT EXISTS accountId ON account TYPE string;
DEFINE FIELD IF NOT EXISTS providerId ON account TYPE string;
DEFINE FIELD IF NOT EXISTS accessToken ON account TYPE option<string>;
DEFINE FIELD IF NOT EXISTS refreshToken ON account TYPE option<string>;
DEFINE FIELD IF NOT EXISTS accessTokenExpiresAt ON account TYPE option<datetime>;
DEFINE FIELD IF NOT EXISTS refreshTokenExpiresAt ON account TYPE option<datetime>;
DEFINE FIELD IF NOT EXISTS scope ON account TYPE option<string>;
DEFINE FIELD IF NOT EXISTS idToken ON account TYPE option<string>;
DEFINE FIELD IF NOT EXISTS password ON account TYPE option<string>;
DEFINE INDEX IF NOT EXISTS account_provider_idx ON account COLUMNS accountId, providerId UNIQUE;

DEFINE TABLE IF NOT EXISTS verification SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS identifier ON verification TYPE string;
DEFINE FIELD IF NOT EXISTS value ON verification TYPE string;
DEFINE FIELD IF NOT EXISTS expiresAt ON verification TYPE datetime;
DEFINE INDEX IF NOT EXISTS identifier_idx ON verification COLUMNS identifier, value;

-- ============================================
-- GRAPH RELATIONS
-- ============================================

-- User votes on Idea (problem or solution)
DEFINE TABLE IF NOT EXISTS voted TYPE RELATION SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS vote_type ON voted TYPE string ASSERT $value IN ['problem', 'solution'];
DEFINE FIELD IF NOT EXISTS created_at ON voted TYPE datetime DEFAULT time::now();

-- User follows User
DEFINE TABLE IF NOT EXISTS follows TYPE RELATION SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS created_at ON follows TYPE datetime DEFAULT time::now();

-- User upvotes Comment
DEFINE TABLE IF NOT EXISTS upvoted TYPE RELATION SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS created_at ON upvoted TYPE datetime DEFAULT time::now();

-- ============================================
-- VECTOR INDEX (for semantic search)
-- ============================================

DEFINE INDEX IF NOT EXISTS idea_embedding_idx ON idea FIELDS embedding HNSW DIMENSION 1024 DIST COSINE TYPE F32 EFC 200 M 16;

-- ============================================
-- EVENTS (auto-update timestamps)
-- ============================================

DEFINE EVENT IF NOT EXISTS update_user_timestamp ON user WHEN $event = "UPDATE" THEN (
    UPDATE user SET updated_at = time::now() WHERE id = $after.id
);

DEFINE EVENT IF NOT EXISTS update_idea_timestamp ON idea WHEN $event = "UPDATE" THEN (
    UPDATE idea SET updated_at = time::now() WHERE id = $after.id
);

DEFINE EVENT IF NOT EXISTS update_comment_timestamp ON comment WHEN $event = "UPDATE" THEN (
    UPDATE comment SET updated_at = time::now() WHERE id = $after.id
);

-- ============================================
-- PERMISSIONS
-- ============================================

-- Allow public read access to ideas and comments
DEFINE PERMISSION IF NOT EXISTS ON idea FOR select FULL;
DEFINE PERMISSION IF NOT EXISTS ON comment FOR select FULL;
DEFINE PERMISSION IF NOT EXISTS ON user FOR select FULL;

-- Relations are read-only from client
DEFINE PERMISSION IF NOT EXISTS ON voted FOR select FULL;
DEFINE PERMISSION IF NOT EXISTS ON follows FOR select FULL;
DEFINE PERMISSION IF NOT EXISTS ON upvoted FOR select FULL;

-- Note: All mutations go through Server Actions with 'root' auth
-- So we don't need complex permissions here

-- ============================================
-- INITIAL SETUP COMPLETE
-- ============================================

SELECT "Database schema initialized successfully" AS status;
