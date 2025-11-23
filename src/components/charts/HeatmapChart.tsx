
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface HeatmapData {
  day: string;
  hour: number;
  value: number;
}

interface HeatmapChartProps {
  data: HeatmapData[];
  title: string;
  className?: string;
}

export const HeatmapChart: React.FC<HeatmapChartProps> = ({ data, title, className }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  const maxValue = Math.max(...data.map(d => d.value));
  
  const getValue = (day: string, hour: number) => {
    const item = data.find(d => d.day === day && d.hour === hour);
    return item?.value || 0;
  };
  
  const getIntensity = (value: number) => {
    return value / maxValue;
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary-800">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-25 gap-1 text-xs">
            <div></div>
            {hours.map(hour => (
              <div key={hour} className="text-center text-slate-500">
                {hour % 6 === 0 ? hour : ''}
              </div>
            ))}
          </div>
          
          {days.map(day => (
            <div key={day} className="grid grid-cols-25 gap-1">
              <div className="text-xs text-slate-600 flex items-center">{day}</div>
              {hours.map(hour => {
                const value = getValue(day, hour);
                const intensity = getIntensity(value);
                return (
                  <div
                    key={`${day}-${hour}`}
                    className="h-4 rounded-sm cursor-pointer hover:ring-2 hover:ring-primary-300 transition-all"
                    style={{
                      backgroundColor: intensity > 0 
                        ? `rgba(0, 102, 204, ${0.1 + intensity * 0.9})`
                        : '#f1f5f9'
                    }}
                    title={`${day} ${hour}:00 - ${value} engagements`}
                  />
                );
              })}
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
          <span>Less</span>
          <div className="flex space-x-1">
            {[0.1, 0.3, 0.5, 0.7, 0.9].map(intensity => (
              <div
                key={intensity}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: `rgba(0, 102, 204, ${intensity})` }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
};
