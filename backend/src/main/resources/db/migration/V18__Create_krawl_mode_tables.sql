-- Create krawl_sessions table
-- Tracks active Krawl Mode sessions for users
CREATE TABLE krawl_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    krawl_id UUID NOT NULL REFERENCES krawls(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'ABANDONED')),
    total_distance_meters DOUBLE PRECISION DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_active_session_per_user_krawl UNIQUE (krawl_id, user_id, status) 
        DEFERRABLE INITIALLY DEFERRED
);

-- Create indexes for krawl_sessions
CREATE INDEX idx_krawl_session_krawl_id ON krawl_sessions(krawl_id);
CREATE INDEX idx_krawl_session_user_id ON krawl_sessions(user_id);
CREATE INDEX idx_krawl_session_status ON krawl_sessions(status);
CREATE INDEX idx_krawl_session_started_at ON krawl_sessions(started_at);

-- Create trigger for krawl_sessions updated_at
CREATE OR REPLACE FUNCTION update_krawl_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER krawl_sessions_updated_at_trigger
    BEFORE UPDATE ON krawl_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_krawl_sessions_updated_at();

-- Create krawl_progress table
-- Tracks which gems have been completed in a session
CREATE TABLE krawl_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES krawl_sessions(id) ON DELETE CASCADE,
    gem_id UUID NOT NULL REFERENCES gems(id) ON DELETE CASCADE,
    completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    distance_to_gem_meters DOUBLE PRECISION,
    arrival_method VARCHAR(20) DEFAULT 'AUTOMATIC' CHECK (arrival_method IN ('AUTOMATIC', 'MANUAL')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_session_gem UNIQUE (session_id, gem_id)
);

-- Create indexes for krawl_progress
CREATE INDEX idx_krawl_progress_session_id ON krawl_progress(session_id);
CREATE INDEX idx_krawl_progress_gem_id ON krawl_progress(gem_id);
CREATE INDEX idx_krawl_progress_completed_at ON krawl_progress(completed_at);

-- Create krawl_location_history table (optional, for analytics)
-- Stores location updates during Krawl Mode sessions
CREATE TABLE krawl_location_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES krawl_sessions(id) ON DELETE CASCADE,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    accuracy DOUBLE PRECISION,
    heading DOUBLE PRECISION,
    speed DOUBLE PRECISION,
    recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for krawl_location_history
CREATE INDEX idx_krawl_location_session_id ON krawl_location_history(session_id);
CREATE INDEX idx_krawl_location_recorded_at ON krawl_location_history(recorded_at);

-- Create spatial index for location history (using PostGIS)
CREATE INDEX idx_krawl_location_geometry ON krawl_location_history 
    USING GIST (ST_MakePoint(longitude, latitude));

-- Add comments
COMMENT ON TABLE krawl_sessions IS 'Tracks active and completed Krawl Mode sessions';
COMMENT ON TABLE krawl_progress IS 'Tracks gem completion within Krawl Mode sessions';
COMMENT ON TABLE krawl_location_history IS 'Optional storage for location updates during sessions (for analytics)';
COMMENT ON COLUMN krawl_sessions.status IS 'Session status: ACTIVE, COMPLETED, or ABANDONED';
COMMENT ON COLUMN krawl_progress.arrival_method IS 'How the user arrived: AUTOMATIC (geofencing) or MANUAL (user marked)';




