import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Brand {
  id: string
  user_id: string
  brand_name: string
  brand_website: string
  social_handles?: string
  niches: string[]
  created_at: string
  updated_at: string
}

export interface Campaign {
  id: string
  brand_id: string
  campaign_name: string
  campaign_type: 'Brand Awareness' | 'Product Marketing'
  campaign_description: string
  tagline?: string
  budget: number
  content_types: string[]
  creator_category: string
  creator_tier: string
  status: 'draft' | 'pending_quotation' | 'quotation_sent' | 'approved' | 'active' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface Quotation {
  id: string
  campaign_id: string
  total_cost: number
  creator_count: number
  estimated_reach: number
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
  notes?: string
}

export interface Product {
  id: string
  campaign_id: string
  product_name: string
  product_description: string
  product_website: string
  product_features: string[]
  launch_status: 'New Launch' | 'Existing Product'
  shipping_details?: string
  created_at: string
  updated_at: string
}
