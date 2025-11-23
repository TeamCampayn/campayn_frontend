
import React, { useState } from 'react';
import { AlertBanner } from '@/components/ui/alert-banner';
import { FilterBar } from '@/components/analytics/FilterBar';
import { AnalyticsHeader } from '@/components/analytics/AnalyticsHeader';
import { AnalyticsMetrics } from '@/components/analytics/AnalyticsMetrics';
import { AnalyticsCharts } from '@/components/analytics/AnalyticsCharts';
import { AnalyticsTables } from '@/components/analytics/AnalyticsTables';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';

const Analytics = () => {
  // State for filters
  const [dateRange, setDateRange] = useState('30d');
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [creatorTier, setCreatorTier] = useState('all');
  const [region, setRegion] = useState('global');
  const [viewMode, setViewMode] = useState<'chart' | 'table' | 'grid'>('chart');
  const [compareMode, setCompareMode] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // Fetch data from Supabase
  const { 
    campaigns, 
    performanceTrends, 
    creatorTiers, 
    contentTypes, 
    engagementHeatmap, 
    kpiMetrics, 
    isLoading, 
    error 
  } = useAnalyticsData();

  // Transform KPI data
  const kpiData = kpiMetrics.reduce((acc, metric) => {
    acc[metric.metric_name] = {
      value: metric.metric_value,
      trend: {
        value: metric.trend_value,
        direction: metric.trend_direction as 'up' | 'down'
      }
    };
    return acc;
  }, {} as any);

  // Transform funnel data
  const funnelData = performanceTrends.length > 0 ? [
    { name: 'Impressions', value: performanceTrends[performanceTrends.length - 1]?.impressions || 0, percentage: 100 },
    { name: 'Engagements', value: performanceTrends[performanceTrends.length - 1]?.engagements || 0, percentage: 12.0 },
    { name: 'Clicks', value: performanceTrends[performanceTrends.length - 1]?.clicks || 0, percentage: 4.7 },
    { name: 'Conversions', value: performanceTrends[performanceTrends.length - 1]?.conversions || 0, percentage: 7.4 }
  ] : [];

  const handleKpiClick = (metric: string) => {
    setSelectedMetric(metric);
    const element = document.getElementById(`${metric}-section`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-slate-600">Loading analytics data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Error loading analytics data</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen p-6">
      <AnalyticsHeader selectedCampaigns={selectedCampaigns} />

      {/* Alert Banner */}
      <AlertBanner
        type="success"
        title="🎉 Campaign Performance Alert"
        description="Diwali Festive Collection has achieved 650% ROI - highest performing campaign this quarter!"
        actionLabel="View Details"
        onAction={() => console.log('Navigate to campaign details')}
        onDismiss={() => console.log('Dismiss alert')}
      />

      {/* Filter Bar */}
      <FilterBar
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        selectedCampaigns={selectedCampaigns}
        onCampaignChange={setSelectedCampaigns}
        creatorTier={creatorTier}
        onCreatorTierChange={setCreatorTier}
        region={region}
        onRegionChange={setRegion}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        compareMode={compareMode}
        onCompareModeToggle={() => setCompareMode(!compareMode)}
      />

      <AnalyticsMetrics 
        kpiData={kpiData}
        onCardClick={handleKpiClick}
      />

      <AnalyticsCharts 
        performanceTrends={performanceTrends}
        funnelData={funnelData}
        kpiData={kpiData}
        creatorTiers={creatorTiers}
        contentTypes={contentTypes}
        engagementHeatmap={engagementHeatmap}
      />

      <AnalyticsTables campaigns={campaigns} />
    </div>
  );
};

export default Analytics;
