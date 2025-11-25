-- Add last_login_at column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;

-- Create index for last_login_at (optional, for analytics queries)
CREATE INDEX IF NOT EXISTS idx_users_last_login_at 
ON users(last_login_at);


