
import React from 'react';
import { KpiCard } from '@/components/ui/kpi-card';
import { TrendingUp, Target, Users, DollarSign, Zap, Gauge } from 'lucide-react';

interface KpiData {
  totalCampaigns: { value: number; trend: { value: string; direction: 'up' | 'down' | 'neutral' } };
  avgRoi: { value: number; trend: { value: string; direction: 'up' | 'down' | 'neutral' } };
  avgCpa: { value: number; trend: { value: string; direction: 'up' | 'down' | 'neutral' } };
  avgEngagementRate: { value: number; trend: { value: string; direction: 'up' | 'down' | 'neutral' } };
  totalEmv: { value: number; trend: { value: string; direction: 'up' | 'down' | 'neutral' } };
  budgetUtilization: { value: number; trend: { value: string; direction: 'up' | 'down' | 'neutral' } };
}

interface KpiRibbonProps {
  data: KpiData;
  onCardClick: (metric: string) => void;
  className?: string;
}

export const KpiRibbon: React.FC<KpiRibbonProps> = ({ data, onCardClick, className }) => {
  const sparklineData = [65, 72, 68, 75, 82, 78, 85, 90, 87, 92, 88, 95];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 ${className}`}>
      <KpiCard
        title="Total Campaigns"
        value={data.totalCampaigns.value}
        trend={data.totalCampaigns.trend}
        icon={Target}
        sparklineData={sparklineData}
        onClick={() => onCardClick('campaigns')}
        tooltip="Total number of campaigns launched in the selected period"
        formatValue={(value) => value.toString()}
      />

      <KpiCard
        title="Average ROI"
        value={data.avgRoi.value}
        trend={data.avgRoi.trend}
        icon={TrendingUp}
        onClick={() => onCardClick('roi')}
        tooltip="Return on Investment: (Earned Media Value - Spend) / Spend"
        formatValue={(value) => `${value}%`}
      />

      <KpiCard
        title="Average CPA"
        value={data.avgCpa.value}
        trend={data.avgCpa.trend}
        icon={DollarSign}
        sparklineData={[45, 52, 48, 41, 38, 42, 39, 35, 38, 33, 36, 32]}
        onClick={() => onCardClick('cpa')}
        tooltip="Cost Per Acquisition: Total Spend / Total Conversions"
        formatValue={(value) => `$${value}`}
      />

      <KpiCard
        title="Avg Engagement Rate"
        value={data.avgEngagementRate.value}
        trend={data.avgEngagementRate.trend}
        icon={Users}
        sparklineData={[3.2, 3.8, 4.1, 3.9, 4.5, 4.2, 4.8, 5.1, 4.9, 5.3, 5.0, 5.5]}
        onClick={() => onCardClick('engagement')}
        tooltip="Average engagement rate across all campaigns: Engagements / Impressions × 100"
        formatValue={(value) => `${value}%`}
      />

      <KpiCard
        title="Total EMV"
        value={data.totalEmv.value}
        trend={data.totalEmv.trend}
        icon={Zap}
        sparklineData={[125000, 142000, 138000, 155000, 168000, 172000, 185000, 192000, 188000, 205000, 198000, 215000]}
        onClick={() => onCardClick('emv')}
        tooltip="Earned Media Value: Total value of organic content and engagement generated"
        formatValue={(value) => {
          const numValue = Number(value);
          return `$${Math.round(numValue / 1000)}K`;
        }}
      />

      <KpiCard
        title="Budget Utilization"
        value={data.budgetUtilization.value}
        trend={data.budgetUtilization.trend}
        icon={Gauge}
        onClick={() => onCardClick('budget')}
        tooltip="Percentage of allocated budget spent: Total Spend / Total Budget × 100"
        formatValue={(value) => `${value}%`}
      />
    </div>
  );
};
