-- Fix messages table - Run this in Supabase SQL Editor

-- Check if messages table exists and add missing columns if needed
DO $$ 
BEGIN
    -- Add user_email column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='messages' AND column_name='user_email') THEN
        ALTER TABLE messages ADD COLUMN user_email TEXT;
    END IF;
    
    -- Add is_admin column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='messages' AND column_name='is_admin') THEN
        ALTER TABLE messages ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
    END IF;
    
    RAISE NOTICE 'Messages table updated successfully';
END $$;

-- Update existing messages to set is_admin flag for admin users
UPDATE messages 
SET is_admin = TRUE 
WHERE user_email = 'admin@campayn.local' OR user_type = 'admin';

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'messages' 
ORDER BY ordinal_position;