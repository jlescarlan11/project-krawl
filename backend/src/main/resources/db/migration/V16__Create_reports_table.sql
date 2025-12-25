-- Create enum types for reports
CREATE TYPE content_type_enum AS ENUM ('GEM', 'KRAWL');
CREATE TYPE report_reason_enum AS ENUM ('INACCURATE', 'COMMERCIAL', 'OFFENSIVE', 'SPAM', 'OTHER');
CREATE TYPE report_status_enum AS ENUM ('PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED');

-- Create reports table
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    content_type content_type_enum NOT NULL,
    content_id UUID NOT NULL,
    reason report_reason_enum NOT NULL,
    description TEXT CHECK (char_length(description) <= 500),
    status report_status_enum NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    CONSTRAINT chk_report_content_id_not_null CHECK (content_id IS NOT NULL),
    CONSTRAINT chk_report_reason_not_null CHECK (reason IS NOT NULL)
);

-- Create indexes for reports
CREATE INDEX idx_report_content ON reports(content_type, content_id);
CREATE INDEX idx_report_status ON reports(status);
CREATE INDEX idx_report_created_at ON reports(created_at DESC);
CREATE INDEX idx_report_user_id ON reports(user_id) WHERE user_id IS NOT NULL;

-- Add comment to table
COMMENT ON TABLE reports IS 'Stores user reports for Gems and Krawls';
COMMENT ON COLUMN reports.user_id IS 'Nullable to allow guest reports';
COMMENT ON COLUMN reports.content_type IS 'Type of content being reported (GEM or KRAWL)';
COMMENT ON COLUMN reports.content_id IS 'UUID of the Gem or Krawl being reported';
COMMENT ON COLUMN reports.reason IS 'Reason for the report';
COMMENT ON COLUMN reports.description IS 'Optional additional details (max 500 characters)';
COMMENT ON COLUMN reports.status IS 'Current status of the report (default: PENDING)';




