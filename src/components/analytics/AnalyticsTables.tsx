
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedTable } from '@/components/ui/enhanced-table';

interface AnalyticsTablesProps {
  campaigns: any[];
}

export const AnalyticsTables: React.FC<AnalyticsTablesProps> = ({ campaigns }) => {
  // Transform campaign data for table
  const campaignTableData = campaigns.map(campaign => ({
    name: campaign.name,
    status: campaign.status,
    impressions: (campaign.impressions / 1000000).toFixed(1) + 'M',
    engagement: ((campaign.engagements / campaign.impressions) * 100).toFixed(1) + '%',
    cpa: '₹' + (campaign.spend_amount / campaign.conversions).toFixed(0),
    roi: ((campaign.emv_amount / campaign.spend_amount) * 100).toFixed(0) + '%',
    emv: '₹' + (campaign.emv_amount / 100000).toFixed(1) + 'L'
  }));

  const campaignColumns = [
    { key: 'name', label: 'Campaign Name', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'impressions', label: 'Impressions', sortable: true },
    { key: 'engagement', label: 'Engagement Rate', sortable: true },
    { key: 'cpa', label: 'CPA', sortable: true },
    { key: 'roi', label: 'ROI', sortable: true },
    { key: 'emv', label: 'EMV', sortable: true }
  ];

  return (
    <Card id="campaigns-section" className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full"></div>
          🚀 Indian Brand Campaign Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EnhancedTable
          columns={campaignColumns}
          data={campaignTableData}
          searchable={true}
          filterable={true}
          stickyHeader={true}
          zebraStripes={true}
          renderActions={(row) => (
            <div className="flex space-x-1">
              <button className="px-3 py-1 text-xs bg-primary-50 text-primary-700 rounded-md hover:bg-primary-100 transition-colors font-medium">
                View
              </button>
              <button className="px-3 py-1 text-xs bg-slate-50 text-slate-700 rounded-md hover:bg-slate-100 transition-colors font-medium">
                Edit
              </button>
            </div>
          )}
        />
      </CardContent>
    </Card>
  );
};
