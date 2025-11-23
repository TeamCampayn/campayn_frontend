
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

interface EnhancedBarChartProps {
  data: any[];
  title: string;
  dataKey: string;
  xAxisKey: string;
  className?: string;
  horizontal?: boolean;
  color?: string;
}

export const EnhancedBarChart: React.FC<EnhancedBarChartProps> = ({
  data,
  title,
  dataKey,
  xAxisKey,
  className,
  horizontal = false,
  color = '#0066CC'
}) => {
  return (
    <Card className={cn("w-full shadow-lg border-0 bg-gradient-to-br from-white to-slate-50", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full"></div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <ChartContainer
          config={{
            [dataKey]: { label: dataKey, color }
          }}
          className="h-[350px]"
        >
          <BarChart 
            data={data} 
            layout={horizontal ? "horizontal" : "vertical"}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2={horizontal ? "1" : "0"} y2={horizontal ? "0" : "1"}>
                <stop offset="5%" stopColor={color} stopOpacity={0.9} />
                <stop offset="95%" stopColor={color} stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
            {horizontal ? (
              <>
                <XAxis 
                  type="number" 
                  stroke="#64748b" 
                  fontSize={12}
                  tick={{ fill: '#64748b' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis 
                  dataKey={xAxisKey} 
                  type="category" 
                  stroke="#64748b" 
                  fontSize={12}
                  tick={{ fill: '#64748b' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  width={80}
                />
              </>
            ) : (
              <>
                <XAxis 
                  dataKey={xAxisKey} 
                  stroke="#64748b" 
                  fontSize={12}
                  tick={{ fill: '#64748b' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12}
                  tick={{ fill: '#64748b' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
              </>
            )}
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar 
              dataKey={dataKey} 
              fill="url(#barGradient)"
              radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
              stroke={color}
              strokeWidth={1}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
