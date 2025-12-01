-- Create gems table
CREATE TABLE gems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    short_description VARCHAR(500),
    full_description TEXT,
    cultural_significance TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    address VARCHAR(500),
    hours VARCHAR(200),
    website VARCHAR(500),
    phone VARCHAR(50),
    thumbnail_url VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    view_count INTEGER NOT NULL DEFAULT 0,
    created_by_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for gems table
CREATE INDEX idx_gem_category ON gems(category);
CREATE INDEX idx_gem_district ON gems(district);
CREATE INDEX idx_gem_status ON gems(status);
CREATE INDEX idx_gem_created_by ON gems(created_by_id);
CREATE INDEX idx_gem_location ON gems(latitude, longitude);

-- Create trigger for gems updated_at
CREATE OR REPLACE FUNCTION update_gems_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER gems_updated_at_trigger
    BEFORE UPDATE ON gems
    FOR EACH ROW
    EXECUTE FUNCTION update_gems_updated_at();

-- Create gem_tags table
CREATE TABLE gem_tags (
    gem_id UUID NOT NULL REFERENCES gems(id) ON DELETE CASCADE,
    tag VARCHAR(255) NOT NULL,
    PRIMARY KEY (gem_id, tag)
);

-- Create gem_photos table
CREATE TABLE gem_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gem_id UUID NOT NULL REFERENCES gems(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    caption VARCHAR(500),
    width INTEGER,
    height INTEGER,
    display_order INTEGER NOT NULL DEFAULT 0,
    uploaded_by_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for gem_photos
CREATE INDEX idx_gem_photo_gem_id ON gem_photos(gem_id);
CREATE INDEX idx_gem_photo_order ON gem_photos(gem_id, display_order);

-- Create ratings table
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gem_id UUID NOT NULL REFERENCES gems(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_rating_gem_user UNIQUE (gem_id, user_id)
);

-- Create indexes for ratings
CREATE INDEX idx_rating_gem_id ON ratings(gem_id);
CREATE INDEX idx_rating_user_id ON ratings(user_id);

-- Create trigger for ratings updated_at
CREATE OR REPLACE FUNCTION update_ratings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ratings_updated_at_trigger
    BEFORE UPDATE ON ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_ratings_updated_at();

-- Create vouches table
CREATE TABLE vouches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gem_id UUID NOT NULL REFERENCES gems(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_vouch_gem_user UNIQUE (gem_id, user_id)
);

-- Create indexes for vouches
CREATE INDEX idx_vouch_gem_id ON vouches(gem_id);
CREATE INDEX idx_vouch_user_id ON vouches(user_id);
