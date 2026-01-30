-- Fix embedding index for Cohere v4
-- HNSW is faster than MTREE for approximate search

USE NAMESPACE rfsbase;
USE DATABASE main;

-- Remove old MTREE index
REMOVE INDEX IF EXISTS idea_embedding_idx ON idea;

-- Create optimized HNSW index for Cohere v4 (1024 dimensions)
DEFINE INDEX idea_embedding_idx ON idea FIELDS embedding
    HNSW
    DIMENSION 1024
    DIST COSINE
    TYPE F32
    EFC 200
    M 16;

SELECT "Embedding index updated to HNSW with Cohere v4 settings" AS status;
