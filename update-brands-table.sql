-- Update brands table to include new signup fields
-- Execute this SQL in your Supabase SQL Editor

-- Add new columns to the brands table
ALTER TABLE brands 
ADD COLUMN IF NOT EXISTS company_size VARCHAR(50),
ADD COLUMN IF NOT EXISTS industry VARCHAR(100),
ADD COLUMN IF NOT EXISTS brand_description TEXT,
ADD COLUMN IF NOT EXISTS marketing_goals TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS monthly_budget VARCHAR(50),
ADD COLUMN IF NOT EXISTS experience_level VARCHAR(50);

-- Update existing records with default values for new fields
UPDATE brands 
SET 
  company_size = '1-10',
  industry = 'other',
  brand_description = '',
  marketing_goals = '{}',
  monthly_budget = 'under-5k',
  experience_level = 'beginner'
WHERE 
  company_size IS NULL 
  OR industry IS NULL 
  OR brand_description IS NULL 
  OR marketing_goals IS NULL 
  OR monthly_budget IS NULL 
  OR experience_level IS NULL;

-- Add constraints for the new fields
ALTER TABLE brands 
ADD CONSTRAINT check_company_size 
CHECK (company_size IN ('1-10', '11-50', '51-200', '201-1000', '1000+'));

ALTER TABLE brands 
ADD CONSTRAINT check_industry 
CHECK (industry IN ('fashion', 'tech', 'food', 'fitness', 'travel', 'finance', 'education', 'other'));

ALTER TABLE brands 
ADD CONSTRAINT check_monthly_budget 
CHECK (monthly_budget IN ('under-5k', '5k-25k', '25k-50k', '50k-100k', '100k-500k', '500k+'));

ALTER TABLE brands 
ADD CONSTRAINT check_experience_level 
CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'expert'));

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_brands_company_size ON brands(company_size);
CREATE INDEX IF NOT EXISTS idx_brands_industry ON brands(industry);
CREATE INDEX IF NOT EXISTS idx_brands_monthly_budget ON brands(monthly_budget);
CREATE INDEX IF NOT EXISTS idx_brands_experience_level ON brands(experience_level);

-- Update RLS policies to include new fields
-- The existing RLS policies should already cover the new fields since they use SELECT * and INSERT/UPDATE operations

-- Verify the table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'brands' 
ORDER BY ordinal_position;
