-- Campayn Database Schema
-- Execute this SQL in your Supabase SQL Editor

-- Enable Row Level Security
ALTER TABLE IF EXISTS brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS campaign_influencers ENABLE ROW LEVEL SECURITY;

-- 1. Brands Table
CREATE TABLE IF NOT EXISTS brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  brand_name VARCHAR(255) NOT NULL,
  brand_website VARCHAR(500),
  social_handles JSONB DEFAULT '{}',
  niches JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  campaign_name VARCHAR(255) NOT NULL,
  campaign_description TEXT,
  campaign_type VARCHAR(100) DEFAULT 'Instagram',
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'quoting', 'live', 'completed', 'paused')),
  budget INTEGER NOT NULL,
  duration INTEGER, -- in days
  target_audience TEXT,
  objectives TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Quotations Table
CREATE TABLE IF NOT EXISTS quotations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  version INTEGER DEFAULT 1,
  total_cost INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'revised')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Influencers Table
CREATE TABLE IF NOT EXISTS influencers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  handle VARCHAR(255) NOT NULL,
  platform VARCHAR(100) NOT NULL,
  followers_count INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0.00,
  niche VARCHAR(100),
  profile_pic_url TEXT,
  contact_email VARCHAR(255),
  rates JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Campaign Influencers (Junction Table)
CREATE TABLE IF NOT EXISTS campaign_influencers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  influencer_id UUID REFERENCES influencers(id) ON DELETE CASCADE NOT NULL,
  quotation_id UUID REFERENCES quotations(id) ON DELETE CASCADE,
  cost INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'shortlisted', 'selected', 'rejected')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(campaign_id, influencer_id)
);

-- 6. Quotation Items (Breakdown of costs)
CREATE TABLE IF NOT EXISTS quotation_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quotation_id UUID REFERENCES quotations(id) ON DELETE CASCADE NOT NULL,
  influencer_id UUID REFERENCES influencers(id) ON DELETE CASCADE NOT NULL,
  item_type VARCHAR(100) NOT NULL, -- 'influencer', 'production', 'management', etc.
  description TEXT,
  cost INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_brands_user_id ON brands(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_brand_id ON campaigns(brand_id);
CREATE INDEX IF NOT EXISTS idx_quotations_campaign_id ON quotations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_quotations_brand_id ON quotations(brand_id);
CREATE INDEX IF NOT EXISTS idx_campaign_influencers_campaign_id ON campaign_influencers(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_influencers_influencer_id ON campaign_influencers(influencer_id);
CREATE INDEX IF NOT EXISTS idx_quotation_items_quotation_id ON quotation_items(quotation_id);

-- Row Level Security Policies

-- Brands: Users can only access their own brand
CREATE POLICY "Users can view own brand" ON brands
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own brand" ON brands
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own brand" ON brands
  FOR UPDATE USING (auth.uid() = user_id);

-- Campaigns: Users can only access campaigns for their brand
CREATE POLICY "Users can view own campaigns" ON campaigns
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = campaigns.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own campaigns" ON campaigns
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = campaigns.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own campaigns" ON campaigns
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = campaigns.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

-- Quotations: Users can only access quotations for their campaigns
CREATE POLICY "Users can view own quotations" ON quotations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      JOIN brands ON brands.id = campaigns.brand_id
      WHERE campaigns.id = quotations.campaign_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own quotations" ON quotations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns 
      JOIN brands ON brands.id = campaigns.brand_id
      WHERE campaigns.id = quotations.campaign_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own quotations" ON quotations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      JOIN brands ON brands.id = campaigns.brand_id
      WHERE campaigns.id = quotations.campaign_id 
      AND brands.user_id = auth.uid()
    )
  );

-- Influencers: Public read access (for discovery)
CREATE POLICY "Anyone can view influencers" ON influencers
  FOR SELECT USING (true);

-- Campaign Influencers: Users can only access for their campaigns
CREATE POLICY "Users can view own campaign influencers" ON campaign_influencers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      JOIN brands ON brands.id = campaigns.brand_id
      WHERE campaigns.id = campaign_influencers.campaign_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own campaign influencers" ON campaign_influencers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns 
      JOIN brands ON brands.id = campaigns.brand_id
      WHERE campaigns.id = campaign_influencers.campaign_id 
      AND brands.user_id = auth.uid()
    )
  );

-- Quotation Items: Users can only access for their quotations
CREATE POLICY "Users can view own quotation items" ON quotation_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM quotations 
      JOIN campaigns ON campaigns.id = quotations.campaign_id
      JOIN brands ON brands.id = campaigns.brand_id
      WHERE quotations.id = quotation_items.quotation_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own quotation items" ON quotation_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM quotations 
      JOIN campaigns ON campaigns.id = quotations.campaign_id
      JOIN brands ON brands.id = campaigns.brand_id
      WHERE quotations.id = quotation_items.quotation_id 
      AND brands.user_id = auth.uid()
    )
  );

-- Insert Sample Data

-- Sample Influencers
INSERT INTO influencers (name, handle, platform, followers_count, engagement_rate, niche, contact_email) VALUES
('Sarah Johnson', '@sarahfashion', 'Instagram', 250000, 4.8, 'Fashion', 'sarah@example.com'),
('Mike Chen', '@mikelifestyle', 'Instagram', 180000, 5.2, 'Lifestyle', 'mike@example.com'),
('Emma Davis', '@emmatech', 'YouTube', 320000, 3.9, 'Tech', 'emma@example.com'),
('Alex Rodriguez', '@alexfitness', 'Instagram', 150000, 6.1, 'Fitness', 'alex@example.com'),
('Priya Sharma', '@priyabeauty', 'Instagram', 200000, 4.5, 'Beauty', 'priya@example.com');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quotations_updated_at BEFORE UPDATE ON quotations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_influencers_updated_at BEFORE UPDATE ON influencers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
