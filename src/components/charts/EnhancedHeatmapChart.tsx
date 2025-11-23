
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface HeatmapData {
  day_of_week: string;
  hour_of_day: number;
  engagement_value: number;
}

interface EnhancedHeatmapChartProps {
  data: HeatmapData[];
  title: string;
  className?: string;
}

export const EnhancedHeatmapChart: React.FC<EnhancedHeatmapChartProps> = ({ 
  data, 
  title, 
  className 
}) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  const maxValue = Math.max(...data.map(d => d.engagement_value));
  
  const getValue = (day: string, hour: number) => {
    const item = data.find(d => d.day_of_week === day && d.hour_of_day === hour);
    return item?.engagement_value || 0;
  };
  
  const getIntensity = (value: number) => {
    return value / maxValue;
  };

  const getColorFromIntensity = (intensity: number) => {
    if (intensity === 0) return '#f1f5f9';
    
    // Create a more vibrant color scale
    const colors = [
      '#e0f2fe', // Very light blue
      '#bae6fd', // Light blue
      '#7dd3fc', // Medium light blue
      '#38bdf8', // Medium blue
      '#0ea5e9', // Strong blue
      '#0284c7', // Dark blue
      '#0369a1', // Very dark blue
      '#1e40af'  // Deep blue
    ];
    
    const index = Math.min(Math.floor(intensity * colors.length), colors.length - 1);
    return colors[index];
  };

  return (
    <Card className={cn("w-full shadow-lg border-0 bg-gradient-to-br from-white to-slate-50", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full"></div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="space-y-3">
          {/* Hour labels */}
          <div className="grid grid-cols-25 gap-1 text-xs">
            <div className="text-center font-medium text-slate-600">Day</div>
            {hours.map(hour => (
              <div key={hour} className="text-center text-slate-500 font-medium">
                {hour % 4 === 0 ? `${hour}h` : ''}
              </div>
            ))}
          </div>
          
          {/* Heatmap grid */}
          <div className="space-y-1">
            {days.map(day => (
              <div key={day} className="grid grid-cols-25 gap-1">
                <div className="text-xs text-slate-700 font-bold flex items-center justify-center bg-slate-100 rounded">
                  {day}
                </div>
                {hours.map(hour => {
                  const value = getValue(day, hour);
                  const intensity = getIntensity(value);
                  return (
                    <div
                      key={`${day}-${hour}`}
                      className="h-8 rounded-md cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-md border border-white"
                      style={{
                        backgroundColor: getColorFromIntensity(intensity)
                      }}
                      title={`${day} ${hour}:00 - ${value} engagements`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
            <span className="text-sm font-medium text-slate-600">Less</span>
            <div className="flex space-x-1">
              {[0.1, 0.3, 0.5, 0.7, 0.9].map(intensity => (
                <div
                  key={intensity}
                  className="w-4 h-4 rounded-sm border border-white"
                  style={{ backgroundColor: getColorFromIntensity(intensity) }}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-slate-600">More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
