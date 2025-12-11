-- Create krawls table
CREATE TABLE krawls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    full_description TEXT,
    category VARCHAR(100),
    difficulty VARCHAR(50),
    cover_image VARCHAR(500),
    estimated_duration_minutes INTEGER,
    estimated_distance_km DOUBLE PRECISION,
    route_polyline TEXT,
    view_count INTEGER NOT NULL DEFAULT 0,
    created_by_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for krawls table
CREATE INDEX idx_krawl_category ON krawls(category);
CREATE INDEX idx_krawl_difficulty ON krawls(difficulty);
CREATE INDEX idx_krawl_created_by ON krawls(created_by_id);
CREATE INDEX idx_krawl_created_at ON krawls(created_at);

-- Create trigger for krawls updated_at
CREATE OR REPLACE FUNCTION update_krawls_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER krawls_updated_at_trigger
    BEFORE UPDATE ON krawls
    FOR EACH ROW
    EXECUTE FUNCTION update_krawls_updated_at();

-- Create krawl_tags table
CREATE TABLE krawl_tags (
    krawl_id UUID NOT NULL REFERENCES krawls(id) ON DELETE CASCADE,
    tag VARCHAR(255) NOT NULL,
    PRIMARY KEY (krawl_id, tag)
);

-- Create krawl_gems table (junction table for ordered gems in krawls)
CREATE TABLE krawl_gems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    krawl_id UUID NOT NULL REFERENCES krawls(id) ON DELETE CASCADE,
    gem_id UUID NOT NULL REFERENCES gems(id) ON DELETE CASCADE,
    "order" INTEGER NOT NULL,
    CONSTRAINT uk_krawl_gem UNIQUE (krawl_id, gem_id)
);

-- Create indexes for krawl_gems
CREATE INDEX idx_krawl_gem_krawl_id ON krawl_gems(krawl_id);
CREATE INDEX idx_krawl_gem_order ON krawl_gems(krawl_id, "order");

-- Create krawl_ratings table
CREATE TABLE krawl_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    krawl_id UUID NOT NULL REFERENCES krawls(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_krawl_rating_krawl_user UNIQUE (krawl_id, user_id)
);

-- Create indexes for krawl_ratings
CREATE INDEX idx_krawl_rating_krawl_id ON krawl_ratings(krawl_id);
CREATE INDEX idx_krawl_rating_user_id ON krawl_ratings(user_id);

-- Create trigger for krawl_ratings updated_at
CREATE OR REPLACE FUNCTION update_krawl_ratings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER krawl_ratings_updated_at_trigger
    BEFORE UPDATE ON krawl_ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_krawl_ratings_updated_at();

-- Create krawl_vouches table
CREATE TABLE krawl_vouches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    krawl_id UUID NOT NULL REFERENCES krawls(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_krawl_vouch_krawl_user UNIQUE (krawl_id, user_id)
);

-- Create indexes for krawl_vouches
CREATE INDEX idx_krawl_vouch_krawl_id ON krawl_vouches(krawl_id);
CREATE INDEX idx_krawl_vouch_user_id ON krawl_vouches(user_id);




