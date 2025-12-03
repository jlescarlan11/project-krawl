-- Add cloudinary_public_id column to gem_photos table
-- Migration: V8__Add_cloudinary_public_id_to_gem_photos.sql
-- Description: Adds cloudinary_public_id field to store Cloudinary public IDs for optimized image URL generation

-- Add cloudinary_public_id column (nullable for backward compatibility)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'gem_photos' AND column_name = 'cloudinary_public_id'
    ) THEN
        ALTER TABLE gem_photos 
        ADD COLUMN cloudinary_public_id VARCHAR(255);
        
        -- Add comment for cloudinary_public_id column
        COMMENT ON COLUMN gem_photos.cloudinary_public_id IS 'Cloudinary public ID for generating optimized image URLs with transformations';
    END IF;
END $$;

-- Create index for cloudinary_public_id lookups
CREATE INDEX IF NOT EXISTS idx_gem_photo_public_id 
ON gem_photos (cloudinary_public_id);

