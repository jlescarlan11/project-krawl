-- Add creator_note and lokal_secret fields to krawl_gems table
-- These fields store context information provided by the krawl creator for each gem

-- Add columns with default empty strings initially
ALTER TABLE krawl_gems 
ADD COLUMN creator_note TEXT NOT NULL DEFAULT '',
ADD COLUMN lokal_secret TEXT NOT NULL DEFAULT '';

-- Add check constraints for minimum length (10 chars)
ALTER TABLE krawl_gems
ADD CONSTRAINT chk_creator_note_length CHECK (LENGTH(TRIM(creator_note)) >= 10),
ADD CONSTRAINT chk_lokal_secret_length CHECK (LENGTH(TRIM(lokal_secret)) >= 10);

-- Remove default values after adding constraints
-- Note: This will fail if there are existing rows with empty strings
-- In that case, update existing rows first or handle migration differently
ALTER TABLE krawl_gems
ALTER COLUMN creator_note DROP DEFAULT,
ALTER COLUMN lokal_secret DROP DEFAULT;

