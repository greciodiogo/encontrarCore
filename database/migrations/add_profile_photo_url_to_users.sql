-- Migration: Add profile_photo_url column to users table
-- Date: 2026-05-13
-- Description: Adds profile photo URL field to store user profile pictures from Supabase

-- Add profile_photo_url column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS profile_photo_url VARCHAR(500);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_users_profile_photo_url 
ON users(profile_photo_url);

-- Add comment to column
COMMENT ON COLUMN users.profile_photo_url IS 'URL of user profile photo stored in Supabase storage';
