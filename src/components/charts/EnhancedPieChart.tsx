
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/lib/utils';

interface EnhancedPieChartProps {
  data: any[];
  title: string;
  dataKey: string;
  nameKey: string;
  colorKey?: string;
  className?: string;
  showPercentage?: boolean;
}

export const EnhancedPieChart: React.FC<EnhancedPieChartProps> = ({
  data,
  title,
  dataKey,
  nameKey,
  colorKey = 'color_hex',
  className,
  showPercentage = true
}) => {
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {showPercentage ? `${value}%` : value}
      </text>
    );
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
        <ChartContainer
          config={{}}
          className="h-[350px]"
        >
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={120}
              fill="#8884d8"
              dataKey={dataKey}
              stroke="white"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry[colorKey]} />
              ))}
            </Pie>
            <ChartTooltip 
              content={<ChartTooltipContent />}
              formatter={(value, name) => [
                showPercentage ? `${value}%` : value,
                name
              ]}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry) => (
                <span style={{ color: entry.color, fontWeight: 'bold' }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
