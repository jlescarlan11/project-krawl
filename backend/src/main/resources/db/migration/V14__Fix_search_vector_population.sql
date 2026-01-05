-- ================================================================
-- V14: Fix Search Vector Population
-- ================================================================
-- Ensures search_vector is populated for all gems and krawls
-- This fixes cases where search_vector might be NULL due to:
-- - Records created before V13 migration
-- - Data migration issues
-- - Manual database operations

-- Re-populate search_vector for gems that have NULL values
UPDATE gems 
SET search_vector =
  setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(category, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(district, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(short_description, '')), 'C') ||
  setweight(to_tsvector('english', COALESCE(full_description, '')), 'D')
WHERE search_vector IS NULL;

-- Re-populate search_vector for krawls that have NULL values
UPDATE krawls 
SET search_vector =
  setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(category, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(description, '')), 'C') ||
  setweight(to_tsvector('english', COALESCE(full_description, '')), 'D')
WHERE search_vector IS NULL;









