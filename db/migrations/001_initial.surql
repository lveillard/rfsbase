-- Initial schema for RFSbase

DEFINE NAMESPACE IF NOT EXISTS rfsbase;
USE NAMESPACE rfsbase;
DEFINE DATABASE IF NOT EXISTS main;
USE DATABASE main;

-- Users (managed by Better Auth)
DEFINE TABLE IF NOT EXISTS user SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS name ON user TYPE string;
DEFINE FIELD IF NOT EXISTS email ON user TYPE string;
DEFINE FIELD IF NOT EXISTS emailVerified ON user TYPE bool DEFAULT false;
DEFINE FIELD IF NOT EXISTS image ON user TYPE option<string>;
DEFINE FIELD IF NOT EXISTS avatar ON user TYPE option<string>;
DEFINE FIELD IF NOT EXISTS bio ON user TYPE option<string>;
DEFINE FIELD IF NOT EXISTS verified_email ON user TYPE bool DEFAULT false;
DEFINE FIELD IF NOT EXISTS verified_yc ON user TYPE option<object>;
DEFINE FIELD IF NOT EXISTS created_at ON user TYPE datetime DEFAULT time::now();
DEFINE FIELD IF NOT EXISTS updated_at ON user TYPE datetime DEFAULT time::now();
DEFINE INDEX IF NOT EXISTS email_idx ON user COLUMNS email UNIQUE;

-- Ideas
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

-- Better Auth Tables
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

-- Graph Relations
DEFINE TABLE IF NOT EXISTS voted TYPE RELATION SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS vote_type ON voted TYPE string;
DEFINE FIELD IF NOT EXISTS created_at ON voted TYPE datetime DEFAULT time::now();

DEFINE TABLE IF NOT EXISTS follows TYPE RELATION SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS created_at ON follows TYPE datetime DEFAULT time::now();

DEFINE TABLE IF NOT EXISTS upvoted TYPE RELATION SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS created_at ON upvoted TYPE datetime DEFAULT time::now();

-- Vector Index (HNSW for Titan v2 embeddings)
DEFINE INDEX IF NOT EXISTS idea_embedding_idx ON idea FIELDS embedding HNSW DIMENSION 1024 DIST COSINE;

RETURN "Schema initialized";
