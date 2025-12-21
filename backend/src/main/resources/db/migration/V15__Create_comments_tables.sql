-- Create gem_comments table
CREATE TABLE gem_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gem_id UUID NOT NULL REFERENCES gems(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (char_length(content) <= 500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_gem_comment_content_not_empty CHECK (char_length(trim(content)) > 0)
);

-- Create indexes for gem_comments
CREATE INDEX idx_gem_comment_gem_id ON gem_comments(gem_id);
CREATE INDEX idx_gem_comment_user_id ON gem_comments(user_id);
CREATE INDEX idx_gem_comment_created_at ON gem_comments(gem_id, created_at DESC);

-- Create trigger for gem_comments updated_at
CREATE OR REPLACE FUNCTION update_gem_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER gem_comments_updated_at_trigger
    BEFORE UPDATE ON gem_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_gem_comments_updated_at();

-- Create krawl_comments table
CREATE TABLE krawl_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    krawl_id UUID NOT NULL REFERENCES krawls(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (char_length(content) <= 500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_krawl_comment_content_not_empty CHECK (char_length(trim(content)) > 0)
);

-- Create indexes for krawl_comments
CREATE INDEX idx_krawl_comment_krawl_id ON krawl_comments(krawl_id);
CREATE INDEX idx_krawl_comment_user_id ON krawl_comments(user_id);
CREATE INDEX idx_krawl_comment_created_at ON krawl_comments(krawl_id, created_at DESC);

-- Create trigger for krawl_comments updated_at
CREATE OR REPLACE FUNCTION update_krawl_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER krawl_comments_updated_at_trigger
    BEFORE UPDATE ON krawl_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_krawl_comments_updated_at();
