-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create spatial index for gems table using geography type
-- This enables efficient spatial queries using ST_DWithin
-- Note: Using CAST instead of :: syntax for better Flyway compatibility
CREATE INDEX IF NOT EXISTS idx_gems_location_geography 
ON gems 
USING GIST (CAST(ST_MakePoint(longitude, latitude) AS geography));

-- Add comment explaining the index
COMMENT ON INDEX idx_gems_location_geography IS 'PostGIS spatial index for efficient distance queries using ST_DWithin. Uses geography type for accurate distance calculations in meters.';

