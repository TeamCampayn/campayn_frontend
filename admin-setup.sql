-- Admin Setup for Campayn
-- Run this in your Supabase SQL Editor

-- 1. First, make sure you've signed up with admin@campayn.local through the UI
-- 2. Then run this script to set admin privileges

-- Set admin metadata for the admin user
UPDATE auth.users 
SET raw_app_meta_data = jsonb_set(
  COALESCE(raw_app_meta_data, '{}'::jsonb),
  '{is_admin}',
  'true'::jsonb
),
raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{is_admin}',
  'true'::jsonb
)
WHERE email = 'admin@campayn.local';

-- Create/update brands table entry for admin
INSERT INTO brands (
  user_id,
  brand_name,
  brand_website,
  social_handles,
  niches,
  created_at,
  updated_at
)
SELECT 
  id,
  'Campayn Admin',
  'https://campayn.local',
  '@campayn',
  ARRAY['admin', 'platform']::text[],
  NOW(),
  NOW()
FROM auth.users 
WHERE email = 'admin@campayn.local'
ON CONFLICT (user_id) 
DO UPDATE SET 
  brand_name = 'Campayn Admin',
  updated_at = NOW();

-- Verify admin setup
SELECT 
  u.email,
  u.raw_app_meta_data,
  u.raw_user_meta_data,
  b.brand_name
FROM auth.users u
LEFT JOIN brands b ON u.id = b.user_id
WHERE u.email = 'admin@campayn.local';