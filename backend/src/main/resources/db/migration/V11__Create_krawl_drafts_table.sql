-- Create krawl_drafts table for saving draft Krawl creations
CREATE TABLE krawl_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

-- Create indexes for krawl_drafts table
CREATE INDEX idx_krawl_draft_user_id ON krawl_drafts(user_id);
CREATE INDEX idx_krawl_draft_expires_at ON krawl_drafts(expires_at);

-- Create trigger for krawl_drafts updated_at
CREATE OR REPLACE FUNCTION update_krawl_drafts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER krawl_drafts_updated_at_trigger
    BEFORE UPDATE ON krawl_drafts
    FOR EACH ROW
    EXECUTE FUNCTION update_krawl_drafts_updated_at();

-- Add comment
COMMENT ON TABLE krawl_drafts IS 'Stores draft Krawl creation data for users to save and resume later. Drafts expire after 30 days.';

