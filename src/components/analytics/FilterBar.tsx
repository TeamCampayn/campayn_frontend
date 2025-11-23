
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Filter, Download, BarChart3, Table, Grid } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  selectedCampaigns: string[];
  onCampaignChange: (campaigns: string[]) => void;
  creatorTier: string;
  onCreatorTierChange: (tier: string) => void;
  region: string;
  onRegionChange: (region: string) => void;
  viewMode: 'chart' | 'table' | 'grid';
  onViewModeChange: (mode: 'chart' | 'table' | 'grid') => void;
  compareMode: boolean;
  onCompareModeToggle: () => void;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  dateRange,
  onDateRangeChange,
  selectedCampaigns,
  onCampaignChange,
  creatorTier,
  onCreatorTierChange,
  region,
  onRegionChange,
  viewMode,
  onViewModeChange,
  compareMode,
  onCompareModeToggle,
  className
}) => {
  return (
    <div className={cn("bg-white border border-primary-100 rounded-lg p-4 space-y-4", className)}>
      {/* Top Row - Date Range and Campaign Selection */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-primary-600" />
          <Select value={dateRange} onValueChange={onDateRangeChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select value={selectedCampaigns[0] || 'all'} onValueChange={(value) => onCampaignChange(value === 'all' ? [] : [value])}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="All Campaigns" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Campaigns</SelectItem>
            <SelectItem value="diwali-collection">Diwali Festive Collection</SelectItem>
            <SelectItem value="ipl-partnership">IPL Cricket Partnership</SelectItem>
            <SelectItem value="regional-series">Regional Language Series</SelectItem>
            <SelectItem value="bollywood-collab">Bollywood Celebrity Collab</SelectItem>
            <SelectItem value="sustainable-fashion">Sustainable Fashion Drive</SelectItem>
          </SelectContent>
        </Select>

        <Select value={creatorTier} onValueChange={onCreatorTierChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Creator Tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tiers</SelectItem>
            <SelectItem value="micro">Micro</SelectItem>
            <SelectItem value="macro">Macro</SelectItem>
            <SelectItem value="mega">Mega</SelectItem>
          </SelectContent>
        </Select>

        <Select value={region} onValueChange={onRegionChange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="global">All India</SelectItem>
            <SelectItem value="north">North India</SelectItem>
            <SelectItem value="south">South India</SelectItem>
            <SelectItem value="west">West India</SelectItem>
            <SelectItem value="east">East India</SelectItem>
            <SelectItem value="metro">Metro Cities</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bottom Row - View Controls and Actions */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex border border-primary-200 rounded-md">
            <Button
              variant={viewMode === 'chart' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('chart')}
              className="rounded-r-none border-r border-primary-200"
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('table')}
              className="rounded-none border-r border-primary-200"
            >
              <Table className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="rounded-l-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant={compareMode ? 'default' : 'outline'}
            size="sm"
            onClick={onCompareModeToggle}
            className="border-primary-200"
          >
            Compare Period
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="border-primary-200">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" className="border-primary-200">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm" className="border-primary-200">
            Schedule Report
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {(selectedCampaigns.length > 0 || creatorTier !== 'all' || region !== 'global') && (
        <div className="flex items-center space-x-2 pt-2 border-t border-primary-100">
          <Filter className="h-4 w-4 text-primary-600" />
          <span className="text-sm text-slate-600">Active filters:</span>
          {selectedCampaigns.map(campaign => (
            <Badge key={campaign} variant="secondary" className="bg-primary-50 text-primary-700">
              {campaign}
            </Badge>
          ))}
          {creatorTier !== 'all' && (
            <Badge variant="secondary" className="bg-primary-50 text-primary-700">
              {creatorTier} creators
            </Badge>
          )}
          {region !== 'global' && (
            <Badge variant="secondary" className="bg-primary-50 text-primary-700">
              {region === 'north' ? 'North India' : 
               region === 'south' ? 'South India' : 
               region === 'west' ? 'West India' : 
               region === 'east' ? 'East India' : 
               region === 'metro' ? 'Metro Cities' : region}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
