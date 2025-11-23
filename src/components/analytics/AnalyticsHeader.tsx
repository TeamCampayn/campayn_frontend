
import React from 'react';
import { Clock } from 'lucide-react';

interface AnalyticsHeaderProps {
  selectedCampaigns: string[];
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({ selectedCampaigns }) => {
  return (
    <header className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <nav className="text-sm text-slate-500 mt-1">
            Home / Analytics / {selectedCampaigns.length > 0 ? selectedCampaigns[0] : 'All Campaigns'}
          </nav>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-600 bg-white px-4 py-2 rounded-lg shadow-sm">
          <Clock className="h-4 w-4 text-primary-500" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </header>
  );
};
