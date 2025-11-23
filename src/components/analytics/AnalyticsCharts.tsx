
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FunnelChart } from '@/components/charts/FunnelChart';
import { GaugeChart } from '@/components/charts/GaugeChart';
import { EnhancedAreaChart } from '@/components/charts/EnhancedAreaChart';
import { EnhancedPieChart } from '@/components/charts/EnhancedPieChart';
import { EnhancedBarChart } from '@/components/charts/EnhancedBarChart';
import { EnhancedHeatmapChart } from '@/components/charts/EnhancedHeatmapChart';

interface AnalyticsChartsProps {
  performanceTrends: any[];
  funnelData: any[];
  kpiData: any;
  creatorTiers: any[];
  contentTypes: any[];
  engagementHeatmap: any[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  performanceTrends,
  funnelData,
  kpiData,
  creatorTiers,
  contentTypes,
  engagementHeatmap
}) => {
  return (
    <div className="space-y-8">
      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Trends */}
        <div className="lg:col-span-2" id="performance-section">
          <EnhancedAreaChart
            data={performanceTrends}
            title="📈 Campaign Performance Trends - Indian Market"
            config={{
              impressions: { label: 'Impressions', color: '#0066CC' },
              engagements: { label: 'Engagements', color: '#3693ff' },
              clicks: { label: 'Clicks', color: '#7bb8ff' },
              conversions: { label: 'Conversions', color: '#1A3E5C' }
            }}
          />
        </div>

        {/* Conversion Funnel */}
        <div id="funnel-section">
          <FunnelChart data={funnelData} />
        </div>

        {/* ROI Gauge */}
        <Card id="roi-section" className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full"></div>
              🎯 Average ROI Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <GaugeChart
              value={kpiData.avgRoi?.value || 485}
              max={700}
              title="Return on Investment"
              unit="%"
            />
          </CardContent>
        </Card>

        {/* Creator Diversity */}
        <EnhancedPieChart
          data={creatorTiers}
          title="👥 Indian Creator Diversity"
          dataKey="percentage"
          nameKey="tier_name"
          colorKey="color_hex"
        />

        {/* Content Performance */}
        <EnhancedBarChart
          data={contentTypes}
          title="📱 Content Type Performance"
          dataKey="engagement_rate"
          xAxisKey="type_name"
          horizontal={true}
          color="#0066CC"
        />
      </div>

      {/* Optimal Posting Times Heatmap */}
      <div id="timing-section">
        <EnhancedHeatmapChart
          data={engagementHeatmap}
          title="🕐 Optimal Posting Times - Indian Audience Engagement Heatmap"
        />
      </div>
    </div>
  );
};
