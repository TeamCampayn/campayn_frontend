-- Create messages table for quotation chat
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type TEXT NOT NULL CHECK (user_type IN ('admin', 'brand')),
  user_name TEXT NOT NULL,
  user_email TEXT,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_messages_campaign_id ON messages(campaign_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their campaigns" ON messages
FOR SELECT USING (
  -- Brands can see messages in their campaigns
  (user_type = 'brand' AND campaign_id IN (
    SELECT id FROM campaigns WHERE brand_id IN (
      SELECT id FROM brands WHERE user_id = auth.uid()
    )
  ))
  OR
  -- Admins can see all messages
  (EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'is_admin' = 'true'
  ))
  OR
  -- Campaign participants can see messages
  (campaign_id IN (
    SELECT c.id FROM campaigns c
    JOIN brands b ON c.brand_id = b.id
    WHERE b.user_id = auth.uid()
  ))
);

CREATE POLICY "Users can insert messages in their campaigns" ON messages
FOR INSERT WITH CHECK (
  -- Brands can send messages in their campaigns
  (user_type = 'brand' AND campaign_id IN (
    SELECT id FROM campaigns WHERE brand_id IN (
      SELECT id FROM brands WHERE user_id = auth.uid()
    )
  ))
  OR
  -- Admins can send messages in any campaign
  (user_type = 'admin' AND EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'is_admin' = 'true'
  ))
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER messages_updated_at
BEFORE UPDATE ON messages
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();