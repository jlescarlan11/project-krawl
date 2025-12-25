-- Create saved_krawls table
-- Allows users to save/favorite Krawls for later reference
CREATE TABLE saved_krawls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    krawl_id UUID NOT NULL REFERENCES krawls(id) ON DELETE CASCADE,
    saved_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_saved_krawl_user_krawl UNIQUE (user_id, krawl_id)
);

-- Create indexes for saved_krawls table
CREATE INDEX idx_saved_krawl_user_id ON saved_krawls(user_id);
CREATE INDEX idx_saved_krawl_krawl_id ON saved_krawls(krawl_id);
CREATE INDEX idx_saved_krawl_saved_at ON saved_krawls(saved_at);



