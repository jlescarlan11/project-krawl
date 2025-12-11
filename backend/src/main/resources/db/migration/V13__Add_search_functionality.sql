-- ================================================================
-- V13: Add Search Functionality
-- ================================================================
-- Adds full-text search capability using PostgreSQL tsvector and GIN indexes
-- Adds search query tracking for analytics and popular searches

-- Add tsvector columns for full-text search
ALTER TABLE gems ADD COLUMN search_vector tsvector;
ALTER TABLE krawls ADD COLUMN search_vector tsvector;

-- Create GIN indexes for fast full-text search
-- GIN (Generalized Inverted Index) provides excellent performance for full-text search
CREATE INDEX gems_search_idx ON gems USING GIN(search_vector);
CREATE INDEX krawls_search_idx ON krawls USING GIN(search_vector);

-- ================================================================
-- Gems Search Vector Update Function
-- ================================================================
-- Automatically maintains search_vector with weighted content:
--   A (highest) - name (most important for search)
--   B - category and district (important for filtering)
--   C - short_description (helpful for preview)
--   D (lowest) - full_description (nice to have, but less important)

CREATE OR REPLACE FUNCTION gems_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.district, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.short_description, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.full_description, '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- Krawls Search Vector Update Function
-- ================================================================
-- Automatically maintains search_vector with weighted content:
--   A (highest) - name (most important for search)
--   B - category (important for filtering)
--   C - description (short description)
--   D (lowest) - full_description (detailed content)

CREATE OR REPLACE FUNCTION krawls_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.full_description, '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- Create Triggers
-- ================================================================
-- Automatically update search_vector on INSERT or UPDATE

CREATE TRIGGER gems_search_vector_trigger
BEFORE INSERT OR UPDATE ON gems
FOR EACH ROW EXECUTE FUNCTION gems_search_vector_update();

CREATE TRIGGER krawls_search_vector_trigger
BEFORE INSERT OR UPDATE ON krawls
FOR EACH ROW EXECUTE FUNCTION krawls_search_vector_update();

-- ================================================================
-- Initialize Existing Rows
-- ================================================================
-- Update search_vector for all existing gems and krawls
-- This ensures existing data is immediately searchable

UPDATE gems SET search_vector =
  setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(category, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(district, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(short_description, '')), 'C') ||
  setweight(to_tsvector('english', COALESCE(full_description, '')), 'D');

UPDATE krawls SET search_vector =
  setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(category, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(description, '')), 'C') ||
  setweight(to_tsvector('english', COALESCE(full_description, '')), 'D');

-- ================================================================
-- Search Queries Tracking Table
-- ================================================================
-- Tracks user search queries for analytics and popular search calculation
-- Used to power the "Popular Searches" feature

CREATE TABLE search_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query TEXT NOT NULL,
    result_count INTEGER NOT NULL DEFAULT 0,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for efficient queries
CREATE INDEX search_queries_query_idx ON search_queries(query);
CREATE INDEX search_queries_created_at_idx ON search_queries(created_at DESC);
CREATE INDEX search_queries_user_id_idx ON search_queries(user_id) WHERE user_id IS NOT NULL;

-- Add comment for documentation
COMMENT ON TABLE search_queries IS 'Tracks all search queries for analytics and popular search calculation';
COMMENT ON COLUMN search_queries.query IS 'The search query text entered by the user';
COMMENT ON COLUMN search_queries.result_count IS 'Number of results returned for this query';
COMMENT ON COLUMN search_queries.user_id IS 'User who performed the search (null for anonymous users)';
COMMENT ON COLUMN search_queries.created_at IS 'Timestamp when the search was performed';
