-- Add user profile fields
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS bio TEXT CHECK (char_length(bio) <= 500),
ADD COLUMN IF NOT EXISTS notification_preferences JSONB,
ADD COLUMN IF NOT EXISTS privacy_settings JSONB,
ADD COLUMN IF NOT EXISTS app_preferences JSONB;

-- Update display_name constraint to match max length
ALTER TABLE users 
ALTER COLUMN display_name TYPE VARCHAR(100);

-- Create indexes for frequently queried fields
CREATE INDEX IF NOT EXISTS idx_users_display_name ON users(display_name) WHERE display_name IS NOT NULL;

-- Add comments
COMMENT ON COLUMN users.bio IS 'User bio/description (max 500 characters)';
COMMENT ON COLUMN users.notification_preferences IS 'JSON object storing email and push notification preferences';
COMMENT ON COLUMN users.privacy_settings IS 'JSON object storing privacy preferences (visibility, data sharing)';
COMMENT ON COLUMN users.app_preferences IS 'JSON object storing app preferences (map style, language, units)';

