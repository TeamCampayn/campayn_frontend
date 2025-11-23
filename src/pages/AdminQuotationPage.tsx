import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import QuotationChat from '../components/QuotationChat';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ArrowLeft, Calendar, DollarSign, Target, Users, Building } from 'lucide-react';
import LoadingSpinner from '../components/ui/loading-spinner';

interface Campaign {
  id: string;
  campaign_name: string;
  budget: number;
  status: string;
  created_at: string;
  platform: string;
  objective?: string;
  brands: {
    brand_name: string;
    brand_website?: string;
    social_handles?: string;
  };
}

const AdminQuotationPage: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (!campaignId || !user) return;

    // Only fetch if we don't already have campaign data for this campaign or haven't initialized
    if (campaign?.id === campaignId && hasInitialized) return;

    const fetchCampaign = async () => {
      try {
        // Only show loading on first load, not on tab switches
        if (!hasInitialized) {
          setLoading(true);
        }
        
        // Fetch campaign details with brand info
        const { data: campaignData, error: campaignError } = await supabase
          .from('campaigns')
          .select(`
            *,
            brands!inner (
              brand_name,
              brand_website,
              social_handles
            )
          `)
          .eq('id', campaignId)
          .single();

        if (campaignError) {
          console.error('Campaign fetch error:', campaignError);
          setError('Campaign not found');
          return;
        }

        setCampaign(campaignData);
        setHasInitialized(true);
      } catch (err) {
        console.error('Error fetching campaign:', err);
        setError('Failed to load campaign details');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignId, hasInitialized]);

  const formatCurrency = (value: number) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${value.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'quoting':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'live':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const updateCampaignStatus = async (newStatus: string) => {
    if (!campaignId) return;

    try {
      const { error } = await supabase
        .from('campaigns')
        .update({ status: newStatus })
        .eq('id', campaignId);

      if (error) {
        console.error('Status update error:', error);
        return;
      }

      setCampaign(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Campaign Not Found</h2>
            <p className="text-gray-600 mb-4">{error || 'The requested campaign could not be found.'}</p>
            <Button onClick={() => navigate('/admin')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={() => navigate('/admin')} 
            variant="ghost" 
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{campaign.campaign_name}</h1>
              <p className="text-gray-600 mt-1">Quotation Management</p>
            </div>
            <Badge className={getStatusColor(campaign.status)}>
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Campaign & Brand Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Campaign Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Campaign Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Budget</span>
                  <span className="font-semibold">{formatCurrency(campaign.budget)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Platform</span>
                  <span className="font-semibold">{campaign.platform}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge className={getStatusColor(campaign.status)}>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="font-semibold">{formatDate(campaign.created_at)}</span>
                </div>

                {campaign.objective && (
                  <div>
                    <span className="text-sm text-gray-600 block mb-2">Objective</span>
                    <p className="text-sm text-gray-900">{campaign.objective}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Brand Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Brand Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-sm text-gray-600 block mb-1">Brand Name</span>
                  <span className="font-semibold">{campaign.brands.brand_name}</span>
                </div>
                
                {campaign.brands.brand_website && (
                  <div>
                    <span className="text-sm text-gray-600 block mb-1">Website</span>
                    <a 
                      href={campaign.brands.brand_website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {campaign.brands.brand_website}
                    </a>
                  </div>
                )}
                
                {campaign.brands.social_handles && (
                  <div>
                    <span className="text-sm text-gray-600 block mb-1">Social Handles</span>
                    <span className="text-sm text-gray-900">{campaign.brands.social_handles}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Campaign Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => updateCampaignStatus('approved')}
                  className="w-full"
                  variant={campaign.status === 'approved' ? 'default' : 'outline'}
                >
                  Approve Campaign
                </Button>
                <Button 
                  onClick={() => updateCampaignStatus('rejected')}
                  className="w-full"
                  variant={campaign.status === 'rejected' ? 'destructive' : 'outline'}
                >
                  Reject Campaign
                </Button>
                <Button 
                  onClick={() => updateCampaignStatus('live')}
                  className="w-full"
                  variant={campaign.status === 'live' ? 'default' : 'outline'}
                >
                  Mark as Live
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <QuotationChat 
              campaignId={campaignId!} 
              campaignName={campaign.campaign_name}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminQuotationPage;
