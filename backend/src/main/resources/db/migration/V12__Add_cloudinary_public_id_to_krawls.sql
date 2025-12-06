-- Add cloudinary_public_id column to krawls table
-- Migration: V12__Add_cloudinary_public_id_to_krawls.sql
-- Description: Adds cloudinary_public_id field to store Cloudinary public IDs for optimized Krawl cover image URL generation

-- Add cloudinary_public_id column (nullable for backward compatibility)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'krawls' AND column_name = 'cloudinary_public_id'
    ) THEN
        ALTER TABLE krawls 
        ADD COLUMN cloudinary_public_id VARCHAR(255);
        
        -- Add comment for cloudinary_public_id column
        COMMENT ON COLUMN krawls.cloudinary_public_id IS 'Cloudinary public ID for generating optimized Krawl cover image URLs with transformations (16:9 aspect ratio, WebP format, multiple sizes)';
    END IF;
END $$;

-- Create index for cloudinary_public_id lookups
CREATE INDEX IF NOT EXISTS idx_krawl_public_id 
ON krawls (cloudinary_public_id);
