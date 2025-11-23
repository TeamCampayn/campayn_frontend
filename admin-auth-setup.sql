-- Admin Authentication Setup for Campayn
-- Run this SQL in your Supabase SQL Editor

-- 1. Create admin user (replace email and password as needed)
-- Note: This creates a user in the auth.users table
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@campayn.local',
  crypt('campayn2024!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- 2. Mark the user as admin by updating raw_app_meta_data
UPDATE auth.users 
SET raw_app_meta_data = '{"is_admin": true}'::jsonb
WHERE email = 'admin@campayn.local';

-- 3. Verify the admin user was created
SELECT 
  id,
  email,
  raw_app_meta_data,
  created_at
FROM auth.users 
WHERE email = 'admin@campayn.local';

-- 4. Clean up duplicate user_id entries before adding unique constraint
-- Keep only the most recent brand profile for each user
WITH duplicates AS (
  SELECT user_id, 
         ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
  FROM brands
  WHERE user_id IS NOT NULL
)
DELETE FROM brands 
WHERE id IN (
  SELECT b.id 
  FROM brands b
  JOIN duplicates d ON b.user_id = d.user_id
  WHERE d.rn > 1
);

-- 5. Add unique constraint on user_id if it doesn't exist
-- This ensures each user can only have one brand profile
ALTER TABLE brands 
ADD CONSTRAINT unique_user_id UNIQUE (user_id);

-- 6. Optional: Create a brand profile for the admin (if needed)
-- This allows the admin to also appear as a brand in the system
-- Note: niches and marketing_goals are TEXT[] arrays, not JSONB
INSERT INTO brands (
  user_id,
  brand_name,
  brand_website,
  social_handles,
  niches,
  company_size,
  industry,
  brand_description,
  marketing_goals,
  monthly_budget,
  experience_level
) 
SELECT 
  id,
  'Campayn Admin',
  'https://campayn.com',
  '@campayn',
  '{}'::text[],  -- Empty text array for niches
  '1000+',
  'tech',
  'Platform administrator',
  '{}'::text[],  -- Empty text array for marketing_goals
  '500k+',
  'expert'
FROM auth.users 
WHERE email = 'admin@campayn.local'
ON CONFLICT (user_id) DO NOTHING;

-- 7. Verify the brand profile was created
SELECT 
  b.id,
  b.brand_name,
  b.user_id,
  u.email
FROM brands b
JOIN auth.users u ON b.user_id = u.id
WHERE u.email = 'admin@campayn.local';

-- Alternative: If you prefer to use a different email/password
-- Replace 'admin@campayn.local' and 'campayn2024!' with your preferred credentials

-- Example with custom credentials:
/*
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'your-admin-email@example.com',
  crypt('your-secure-password', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

UPDATE auth.users 
SET raw_app_meta_data = '{"is_admin": true}'::jsonb
WHERE email = 'your-admin-email@example.com';
*/

-- 8. RLS Policies for Admin Access
-- Ensure admin can access all campaigns and quotations

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admin can view all campaigns" ON campaigns;
DROP POLICY IF EXISTS "Admin can view all quotations" ON quotations;
DROP POLICY IF EXISTS "Admin can view all brands" ON brands;

-- Create admin policies
CREATE POLICY "Admin can view all campaigns" ON campaigns
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_app_meta_data->>'is_admin' = 'true'
    )
  );

CREATE POLICY "Admin can view all quotations" ON quotations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_app_meta_data->>'is_admin' = 'true'
    )
  );

CREATE POLICY "Admin can view all brands" ON brands
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_app_meta_data->>'is_admin' = 'true'
    )
  );

-- 9. Test the setup
-- This query should return the admin user with is_admin: true
SELECT 
  id,
  email,
  raw_app_meta_data->>'is_admin' as is_admin,
  created_at
FROM auth.users 
WHERE email = 'admin@campayn.local';

-- 10. Clean up (if needed)
-- Uncomment these lines if you need to remove the admin user
/*
DELETE FROM brands WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'admin@campayn.local'
);
DELETE FROM auth.users WHERE email = 'admin@campayn.local';
*/
