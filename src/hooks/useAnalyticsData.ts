
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

export interface Campaign {
  id: string;
  name: string;
  status: string;
  impressions: number;
  engagements: number;
  clicks: number;
  conversions: number;
  spend_amount: number;
  emv_amount: number;
  start_date: string | null;
  end_date: string | null;
}

export interface PerformanceTrend {
  period_name: string;
  period_date: string;
  impressions: number;
  engagements: number;
  clicks: number;
  conversions: number;
}

export interface CreatorTier {
  tier_name: string;
  tier_range: string;
  percentage: number;
  color_hex: string;
}

export interface ContentType {
  type_name: string;
  engagement_rate: number;
  content_count: number;
}

export interface EngagementHeatmap {
  day_of_week: string;
  hour_of_day: number;
  engagement_value: number;
}

export interface KpiMetric {
  metric_name: string;
  metric_value: number;
  trend_value: string;
  trend_direction: 'up' | 'down' | 'neutral';
}

export const useAnalyticsData = () => {
  const campaignsQuery = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Campaign[];
    }
  });

  const performanceTrendsQuery = useQuery({
    queryKey: ['performance-trends'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('performance_trends')
        .select('*')
        .order('period_date', { ascending: true });
      
      if (error) throw error;
      return data as PerformanceTrend[];
    }
  });

  const creatorTiersQuery = useQuery({
    queryKey: ['creator-tiers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('creator_tiers')
        .select('*');
      
      if (error) throw error;
      return data as CreatorTier[];
    }
  });

  const contentTypesQuery = useQuery({
    queryKey: ['content-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_types')
        .select('*')
        .order('engagement_rate', { ascending: false });
      
      if (error) throw error;
      return data as ContentType[];
    }
  });

  const engagementHeatmapQuery = useQuery({
    queryKey: ['engagement-heatmap'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('engagement_heatmap')
        .select('*');
      
      if (error) throw error;
      return data as EngagementHeatmap[];
    }
  });

  const kpiMetricsQuery = useQuery({
    queryKey: ['kpi-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpi_metrics')
        .select('*');
      
      if (error) throw error;
      return data as KpiMetric[];
    }
  });

  return {
    campaigns: campaignsQuery.data || [],
    performanceTrends: performanceTrendsQuery.data || [],
    creatorTiers: creatorTiersQuery.data || [],
    contentTypes: contentTypesQuery.data || [],
    engagementHeatmap: engagementHeatmapQuery.data || [],
    kpiMetrics: kpiMetricsQuery.data || [],
    isLoading: campaignsQuery.isLoading || performanceTrendsQuery.isLoading || 
               creatorTiersQuery.isLoading || contentTypesQuery.isLoading ||
               engagementHeatmapQuery.isLoading || kpiMetricsQuery.isLoading,
    error: campaignsQuery.error || performanceTrendsQuery.error || 
           creatorTiersQuery.error || contentTypesQuery.error ||
           engagementHeatmapQuery.error || kpiMetricsQuery.error
  };
};
