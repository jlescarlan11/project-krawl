-- Add lifecycle_status and approval_status fields to gems table
-- Migration: V7__Add_gem_lifecycle_and_approval_status.sql
-- Description: Adds lifecycle_status and approval_status fields to track Gem lifecycle and approval workflow separately from status field

-- Add lifecycle_status column (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'gems' AND column_name = 'lifecycle_status'
    ) THEN
        -- Add column with default value
        ALTER TABLE gems 
        ADD COLUMN lifecycle_status VARCHAR(20) DEFAULT 'open';
        
        -- Update existing rows with default value
        UPDATE gems 
        SET lifecycle_status = 'open' 
        WHERE lifecycle_status IS NULL;
        
        -- Add NOT NULL constraint
        ALTER TABLE gems 
        ALTER COLUMN lifecycle_status SET NOT NULL;
        
        -- Set default value
        ALTER TABLE gems 
        ALTER COLUMN lifecycle_status SET DEFAULT 'open';
    END IF;
END $$;

-- Add check constraint for lifecycle_status
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'chk_gems_lifecycle_status'
    ) THEN
        ALTER TABLE gems 
        ADD CONSTRAINT chk_gems_lifecycle_status 
        CHECK (lifecycle_status IN ('open', 'closed'));
    END IF;
END $$;

-- Add comment for lifecycle_status column
COMMENT ON COLUMN gems.lifecycle_status IS 'Gem lifecycle status (open by default, closed when 3+ ''Permanently Closed'' reports)';

-- Add approval_status column (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'gems' AND column_name = 'approval_status'
    ) THEN
        -- Add column with default value
        ALTER TABLE gems 
        ADD COLUMN approval_status VARCHAR(20) DEFAULT 'pending';
        
        -- Update existing rows with default value
        UPDATE gems 
        SET approval_status = 'pending' 
        WHERE approval_status IS NULL;
        
        -- Add NOT NULL constraint
        ALTER TABLE gems 
        ALTER COLUMN approval_status SET NOT NULL;
        
        -- Set default value
        ALTER TABLE gems 
        ALTER COLUMN approval_status SET DEFAULT 'pending';
    END IF;
END $$;

-- Add check constraint for approval_status
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'chk_gems_approval_status'
    ) THEN
        ALTER TABLE gems 
        ADD CONSTRAINT chk_gems_approval_status 
        CHECK (approval_status IN ('pending', 'approved', 'rejected'));
    END IF;
END $$;

-- Add comment for approval_status column
COMMENT ON COLUMN gems.approval_status IS 'Gem approval status (pending by default on creation)';

-- Create index for lifecycle_status
CREATE INDEX IF NOT EXISTS idx_gems_lifecycle_status 
ON gems (lifecycle_status);

-- Create index for approval_status
CREATE INDEX IF NOT EXISTS idx_gems_approval_status 
ON gems (approval_status);

