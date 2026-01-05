-- V20__Add_performance_indexes.sql
-- Add database indexes to optimize query performance
-- Based on comprehensive repository analysis (TASK-222)

-- =====================================================
-- CRITICAL: Revoked Tokens Index
-- Impact: HIGH - This affects EVERY authenticated request
-- =====================================================
CREATE UNIQUE INDEX IF NOT EXISTS idx_revoked_tokens_token
ON revoked_tokens(token);

-- =====================================================
-- Composite Indexes for Common Query Patterns
-- Impact: HIGH - Frequently used in findBy queries
-- =====================================================

-- Gem Ratings: gem_id + user_id composite
CREATE INDEX IF NOT EXISTS idx_gem_ratings_gem_user
ON ratings(gem_id, user_id);

-- Krawl Ratings: krawl_id + user_id composite
CREATE INDEX IF NOT EXISTS idx_krawl_ratings_krawl_user
ON krawl_ratings(krawl_id, user_id);

-- Gem Vouches: gem_id + user_id composite
CREATE INDEX IF NOT EXISTS idx_gem_vouches_gem_user
ON vouches(gem_id, user_id);

-- Krawl Vouches: krawl_id + user_id composite
CREATE INDEX IF NOT EXISTS idx_krawl_vouches_krawl_user
ON krawl_vouches(krawl_id, user_id);

-- =====================================================
-- Ordering and Filtering Indexes
-- Impact: MEDIUM - Improves sort and search performance
-- =====================================================

-- Gem Photos: gem_id + display_order for ordered retrieval
CREATE INDEX IF NOT EXISTS idx_gem_photos_gem_order
ON gem_photos(gem_id, display_order ASC);

-- Search Queries: created_at + query for popular searches
CREATE INDEX IF NOT EXISTS idx_search_queries_created_query
ON search_queries(created_at DESC, query);

-- =====================================================
-- Session and Progress Indexes
-- Impact: MEDIUM - Improves session tracking performance
-- =====================================================

-- Krawl Sessions: user_id for user session queries
CREATE INDEX IF NOT EXISTS idx_krawl_sessions_user
ON krawl_sessions(user_id);

-- Krawl Sessions: krawl_id for krawl-specific sessions
CREATE INDEX IF NOT EXISTS idx_krawl_sessions_krawl
ON krawl_sessions(krawl_id);

-- Krawl Progress: session_id for progress tracking
CREATE INDEX IF NOT EXISTS idx_krawl_progress_session
ON krawl_progress(session_id);

-- Krawl Location History: session_id for location tracking
CREATE INDEX IF NOT EXISTS idx_krawl_location_history_session
ON krawl_location_history(session_id);

-- =====================================================
-- Comment Indexes for Pagination
-- Impact: MEDIUM - Improves comment loading performance
-- =====================================================

-- Gem Comments: gem_id + created_at for paginated retrieval
CREATE INDEX IF NOT EXISTS idx_gem_comments_gem_created
ON gem_comments(gem_id, created_at DESC);

-- Krawl Comments: krawl_id + created_at for paginated retrieval
CREATE INDEX IF NOT EXISTS idx_krawl_comments_krawl_created
ON krawl_comments(krawl_id, created_at DESC);

-- =====================================================
-- Report Indexes
-- Impact: LOW - Admin functionality
-- =====================================================

-- Reports: content_type + content_id for content lookups
CREATE INDEX IF NOT EXISTS idx_reports_content
ON reports(content_type, content_id);

-- Reports: status for filtering
CREATE INDEX IF NOT EXISTS idx_reports_status
ON reports(status);

-- =====================================================
-- Draft Indexes
-- Impact: LOW - Improves draft retrieval
-- =====================================================

-- Gem Drafts: user_id + updated_at for user draft listing
CREATE INDEX IF NOT EXISTS idx_gem_drafts_user_updated
ON gem_drafts(user_id, updated_at DESC);

-- Krawl Drafts: user_id + updated_at for user draft listing
CREATE INDEX IF NOT EXISTS idx_krawl_drafts_user_updated
ON krawl_drafts(user_id, updated_at DESC);

-- =====================================================
-- Saved Krawls Index
-- Impact: MEDIUM - Improves offline download feature
-- =====================================================

-- Saved Krawls: user_id + saved_at for user's saved krawls
CREATE INDEX IF NOT EXISTS idx_saved_krawls_user_saved
ON saved_krawls(user_id, saved_at DESC);

-- =====================================================
-- Summary of Indexes Added
-- =====================================================
-- CRITICAL (1): revoked_tokens(token)
-- HIGH (4): rating and vouch composite indexes
-- MEDIUM (10): photos, search, sessions, progress, comments
-- LOW (5): reports, drafts, saved krawls
--
-- Total: 20 new indexes for optimal query performance
-- =====================================================
