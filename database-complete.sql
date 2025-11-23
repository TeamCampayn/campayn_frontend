-- Complete Database Setup for Campayn
-- Run this entire file in one go

-- ==============================================
-- STEP 1: CREATE ALL TABLES
-- ==============================================

-- 1. Create brands table
CREATE TABLE brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  brand_website TEXT NOT NULL,
  social_handles TEXT,
  niches TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create campaigns table
CREATE TABLE campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  campaign_name TEXT NOT NULL,
  campaign_type TEXT NOT NULL,
  campaign_description TEXT NOT NULL,
  tagline TEXT,
  budget INTEGER NOT NULL DEFAULT 0,
  content_types TEXT[] DEFAULT '{}',
  creator_category TEXT,
  creator_tier TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  product_description TEXT,
  product_website TEXT,
  product_features TEXT[] DEFAULT '{}',
  launch_status TEXT,
  shipping_details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create quotations table
CREATE TABLE quotations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  total_cost INTEGER NOT NULL,
  creator_count INTEGER NOT NULL DEFAULT 0,
  estimated_reach INTEGER NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create audience_details table
CREATE TABLE audience_details (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  ideal_audience TEXT,
  target_states TEXT[] DEFAULT '{}',
  age_range_min INTEGER DEFAULT 18,
  age_range_max INTEGER DEFAULT 65,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create shipping_details table
CREATE TABLE shipping_details (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  product_shipping BOOLEAN DEFAULT FALSE,
  shipping_product_name TEXT,
  shipping_product_link TEXT,
  retail_value INTEGER,
  is_mrp BOOLEAN DEFAULT FALSE,
  barter_discount BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- STEP 2: ENABLE ROW LEVEL SECURITY
-- ==============================================

-- Enable RLS on all tables
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audience_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_details ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- STEP 3: CREATE RLS POLICIES
-- ==============================================

-- Brands table policies
CREATE POLICY "Users can view their own brand" ON brands
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own brand" ON brands
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own brand" ON brands
  FOR UPDATE USING (auth.uid() = user_id);

-- Campaigns table policies
CREATE POLICY "Users can view campaigns for their brands" ON campaigns
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = campaigns.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert campaigns for their brands" ON campaigns
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = campaigns.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update campaigns for their brands" ON campaigns
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = campaigns.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

-- Products table policies
CREATE POLICY "Users can view products for their campaigns" ON products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      JOIN brands ON brands.id = campaigns.brand_id
      WHERE campaigns.id = products.campaign_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert products for their campaigns" ON products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns 
      JOIN brands ON brands.id = campaigns.brand_id
      WHERE campaigns.id = products.campaign_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update products for their campaigns" ON products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      JOIN brands ON brands.id = campaigns.brand_id
      WHERE campaigns.id = products.campaign_id 
      AND brands.user_id = auth.uid()
    )
  );

-- Quotations table policies
CREATE POLICY "Users can view quotations for their campaigns" ON quotations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      JOIN brands ON brands.id = campaigns.brand_id
      WHERE campaigns.id = quotations.campaign_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert quotations for their campaigns" ON quotations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns 
      JOIN brands ON brands.id = campaigns.brand_id
      WHERE campaigns.id = quotations.campaign_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update quotations for their campaigns" ON quotations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      JOIN brands ON brands.id = campaigns.brand_id
      WHERE campaigns.id = quotations.campaign_id 
      AND brands.user_id = auth.uid()
    )
  );

-- Audience details table policies
CREATE POLICY "Users can view audience details for their campaigns" ON audience_details
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      JOIN brands ON brands.id = campaigns.brand_id
      WHERE campaigns.id = audience_details.campaign_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert audience details for their campaigns" ON audience_details
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns 
      JOIN brands ON brands.id = campaigns.brand_id
      WHERE campaigns.id = audience_details.campaign_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update audience details for their campaigns" ON audience_details
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      JOIN brands ON brands.id = campaigns.brand_id
      WHERE campaigns.id = audience_details.campaign_id 
      AND brands.user_id = auth.uid()
    )
  );

-- Shipping details table policies
CREATE POLICY "Users can view shipping details for their campaigns" ON shipping_details
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      JOIN brands ON brands.id = campaigns.brand_id
      WHERE campaigns.id = shipping_details.campaign_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert shipping details for their campaigns" ON shipping_details
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns 
      JOIN brands ON brands.id = campaigns.brand_id
      WHERE campaigns.id = shipping_details.campaign_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update shipping details for their campaigns" ON shipping_details
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      JOIN brands ON brands.id = campaigns.brand_id
      WHERE campaigns.id = shipping_details.campaign_id 
      AND brands.user_id = auth.uid()
    )
  );

-- ==============================================
-- STEP 4: CREATE TRIGGERS FOR UPDATED_AT
-- ==============================================

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotations_updated_at BEFORE UPDATE ON quotations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_audience_details_updated_at BEFORE UPDATE ON audience_details
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipping_details_updated_at BEFORE UPDATE ON shipping_details
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
