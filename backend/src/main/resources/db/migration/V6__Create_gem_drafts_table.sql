-- Create gem_drafts table for saving draft Gem creations
CREATE TABLE gem_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

-- Create indexes for gem_drafts table
CREATE INDEX idx_gem_draft_user_id ON gem_drafts(user_id);
CREATE INDEX idx_gem_draft_expires_at ON gem_drafts(expires_at);

-- Create trigger for gem_drafts updated_at
CREATE OR REPLACE FUNCTION update_gem_drafts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER gem_drafts_updated_at_trigger
    BEFORE UPDATE ON gem_drafts
    FOR EACH ROW
    EXECUTE FUNCTION update_gem_drafts_updated_at();

-- Add comment
COMMENT ON TABLE gem_drafts IS 'Stores draft Gem creation data for users to save and resume later. Drafts expire after 30 days.';

