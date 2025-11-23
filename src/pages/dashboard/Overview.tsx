import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Target, 
  Eye, 
  Users, 
  TrendingUp,
  Plus
} from 'lucide-react';

const Overview: React.FC = () => {
  const { brand } = useAuth();
  const navigate = useNavigate();

  // Static data for fast loading
  const stats = {
    totalCampaigns: 3,
    quotingCampaigns: 1,
    liveCampaigns: 2,
    completedCampaigns: 0
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Quick glance at your campaign activity</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCampaigns}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Quoting Stage</p>
                <p className="text-2xl font-bold text-gray-900">{stats.quotingCampaigns}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Live/Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.liveCampaigns + stats.completedCampaigns}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Influencers</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-4">
        <Button 
          onClick={() => navigate('/campaigns')}
          variant="outline"
          className="flex items-center"
        >
          <Target className="h-4 w-4 mr-2" />
          View All Campaigns
        </Button>
        <Button 
          onClick={() => navigate('/create-campaign')}
          className="flex items-center bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>
    </div>
  );
};

export default Overview;