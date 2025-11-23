import React from 'react';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  sparklineData?: number[];
  icon?: React.ComponentType<{ className?: string }>;
  tooltip?: string;
  formatValue?: (value: string | number) => string;
  onClick?: () => void;
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  description,
  trend,
  sparklineData,
  icon: Icon,
  tooltip,
  formatValue,
  onClick,
  className
}) => {
  const formattedValue = formatValue ? formatValue(value) : value.toString();

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer",
        onClick && "hover:scale-105",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-600">{title}</p>
              {Icon && (
                <Icon className="h-5 w-5 text-slate-400" />
              )}
            </div>
            
            <div className="flex items-baseline space-x-2">
              <p className="text-3xl font-bold text-slate-900">
                {formattedValue}
              </p>
              {trend && (
                <div className={cn(
                  "flex items-center space-x-1 text-sm font-medium",
                  trend.direction === 'up' && "text-green-600",
                  trend.direction === 'down' && "text-red-600",
                  trend.direction === 'neutral' && "text-slate-600"
                )}>
                  {trend.direction === 'up' && <TrendingUp className="h-4 w-4" />}
                  {trend.direction === 'down' && <TrendingDown className="h-4 w-4" />}
                  <span>{trend.value}</span>
                </div>
              )}
            </div>
            
            {description && (
              <p className="text-sm text-slate-500 mt-1">
                {description}
              </p>
            )}
          </div>
        </div>
        
        {sparklineData && sparklineData.length > 0 && (
          <div className="mt-4">
            <div className="flex items-end space-x-1 h-8">
              {sparklineData.map((point, index) => (
                <div
                  key={index}
                  className="bg-primary-200 rounded-sm flex-1"
                  style={{ 
                    height: `${Math.max(4, (point / Math.max(...sparklineData)) * 100)}%` 
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};