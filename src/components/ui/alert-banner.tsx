import React from 'react';
import { Button } from './button';
import { X, AlertTriangle, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertBannerProps {
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  className?: string;
}

const alertConfig = {
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-600'
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-800',
    iconColor: 'text-yellow-600'
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
    iconColor: 'text-red-600'
  },
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-800',
    iconColor: 'text-green-600'
  }
};

export const AlertBanner: React.FC<AlertBannerProps> = ({
  type,
  title,
  description,
  actionLabel,
  onAction,
  onDismiss,
  className
}) => {
  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <div className={cn(
      "flex items-start space-x-3 p-4 rounded-lg border",
      config.bgColor,
      config.borderColor,
      className
    )}>
      <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", config.iconColor)} />
      
      <div className="flex-1 min-w-0">
        <h3 className={cn("text-sm font-medium", config.textColor)}>
          {title}
        </h3>
        <p className={cn("text-sm mt-1", config.textColor)}>
          {description}
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        {actionLabel && onAction && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAction}
            className={cn(
              "text-xs",
              type === 'info' && "border-blue-300 text-blue-700 hover:bg-blue-100",
              type === 'warning' && "border-yellow-300 text-yellow-700 hover:bg-yellow-100",
              type === 'error' && "border-red-300 text-red-700 hover:bg-red-100",
              type === 'success' && "border-green-300 text-green-700 hover:bg-green-100"
            )}
          >
            {actionLabel}
          </Button>
        )}
        
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className={cn(
              "h-6 w-6 p-0",
              config.textColor,
              "hover:bg-white/50"
            )}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};