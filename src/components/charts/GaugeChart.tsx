
import React from 'react';
import { cn } from '@/lib/utils';

interface GaugeChartProps {
  value: number;
  max: number;
  min?: number;
  title: string;
  unit?: string;
  className?: string;
  colorStops?: Array<{ offset: string; color: string }>;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({ 
  value, 
  max, 
  min = 0, 
  title, 
  unit = '%',
  className,
  colorStops = [
    { offset: '0%', color: '#dc2626' },
    { offset: '50%', color: '#d97706' },
    { offset: '100%', color: '#059669' }
  ]
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const angle = (percentage / 100) * 180 - 90;
  
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative w-32 h-16">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              {colorStops.map((stop, index) => (
                <stop key={index} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>
          </defs>
          
          {/* Background arc */}
          <path
            d="M 20 80 A 60 60 0 0 1 180 80"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="12"
            strokeLinecap="round"
          />
          
          {/* Value arc */}
          <path
            d="M 20 80 A 60 60 0 0 1 180 80"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${(percentage / 100) * 188.5} 188.5`}
            className="transition-all duration-500"
          />
          
          {/* Needle */}
          <line
            x1="100"
            y1="80"
            x2="100"
            y2="30"
            stroke="#1A3E5C"
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${angle} 100 80)`}
            className="transition-transform duration-500"
          />
          
          {/* Center dot */}
          <circle cx="100" cy="80" r="4" fill="#1A3E5C" />
        </svg>
      </div>
      
      <div className="text-center mt-2">
        <div className="text-2xl font-bold text-primary-700">{value}{unit}</div>
        <div className="text-sm text-slate-600">{title}</div>
      </div>
    </div>
  );
};
