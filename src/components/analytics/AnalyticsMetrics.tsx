
import React from 'react';
import { KpiRibbon } from '@/components/analytics/KpiRibbon';

interface AnalyticsMetricsProps {
  kpiData: any;
  onCardClick: (metric: string) => void;
}

export const AnalyticsMetrics: React.FC<AnalyticsMetricsProps> = ({ kpiData, onCardClick }) => {
  return (
    <div className="space-y-4">
      <KpiRibbon
        data={kpiData}
        onCardClick={onCardClick}
      />
    </div>
  );
};
