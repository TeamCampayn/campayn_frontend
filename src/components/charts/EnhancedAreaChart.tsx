
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/lib/utils';

interface EnhancedAreaChartProps {
  data: any[];
  title: string;
  config: Record<string, { label: string; color: string }>;
  className?: string;
  height?: number;
}

export const EnhancedAreaChart: React.FC<EnhancedAreaChartProps> = ({
  data,
  title,
  config,
  className,
  height = 400
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
        <ChartContainer config={config} className={`h-[${height}px]`}>
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              {Object.entries(config).map(([key, { color }]) => (
                <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.05} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
            <XAxis 
              dataKey="period_name" 
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
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                return value.toString();
              }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            {Object.entries(config).map(([key, { color }]) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={color}
                strokeWidth={3}
                fill={`url(#gradient-${key})`}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: color, strokeWidth: 2, fill: 'white' }}
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
