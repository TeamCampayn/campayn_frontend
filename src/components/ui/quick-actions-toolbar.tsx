import React from 'react';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Plus, Download, CreditCard, Zap, Target, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionsToolbarProps {
  onLaunchCampaign?: () => void;
  onExportReport?: () => void;
  onAddFunds?: () => void;
  onViewAnalytics?: () => void;
  onManageCampaigns?: () => void;
  className?: string;
}

export const QuickActionsToolbar: React.FC<QuickActionsToolbarProps> = ({
  onLaunchCampaign,
  onExportReport,
  onAddFunds,
  onViewAnalytics,
  onManageCampaigns,
  className
}) => {
  const actions = [
    {
      label: 'Launch Campaign',
      icon: Plus,
      onClick: onLaunchCampaign,
      variant: 'default' as const,
      className: 'bg-primary hover:bg-primary-600 text-white'
    },
    {
      label: 'Export Report',
      icon: Download,
      onClick: onExportReport,
      variant: 'outline' as const
    },
    {
      label: 'Add Funds',
      icon: CreditCard,
      onClick: onAddFunds,
      variant: 'outline' as const
    },
    {
      label: 'View Analytics',
      icon: BarChart3,
      onClick: onViewAnalytics,
      variant: 'outline' as const
    },
    {
      label: 'Manage Campaigns',
      icon: Target,
      onClick: onManageCampaigns,
      variant: 'outline' as const
    }
  ];

  return (
    <Card className={cn("bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-primary-900">Quick Actions</h3>
            </div>
            <p className="text-sm text-primary-700">
              Streamline your workflow with these common tasks
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant={action.variant}
                  onClick={action.onClick}
                  className={cn(
                    "flex items-center space-x-2",
                    action.className
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{action.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};