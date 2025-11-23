
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FunnelStage {
  name: string;
  value: number;
  percentage: number;
}

interface FunnelChartProps {
  data: FunnelStage[];
  className?: string;
}

export const FunnelChart: React.FC<FunnelChartProps> = ({ data, className }) => {
  const maxValue = data[0]?.value || 1;

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary-800">Conversion Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((stage, index) => {
            const width = (stage.value / maxValue) * 100;
            const dropoff = index > 0 ? ((data[index - 1].value - stage.value) / data[index - 1].value) * 100 : 0;
            
            return (
              <div key={stage.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">{stage.name}</span>
                  <div className="text-right">
                    <span className="text-lg font-bold text-primary-700">{stage.value.toLocaleString()}</span>
                    <span className="text-sm text-slate-500 ml-2">({stage.percentage}%)</span>
                  </div>
                </div>
                <div className="relative h-8 bg-slate-100 rounded-lg overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
                    style={{ width: `${width}%` }}
                  />
                </div>
                {index > 0 && dropoff > 0 && (
                  <div className="text-xs text-red-600 text-right">
                    -{dropoff.toFixed(1)}% drop-off
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
