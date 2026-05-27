import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import ConversationHistory from '@/components/ConversationHistory';
// Replaced legacy PaymentManagement (manual UPI) with RazorpayCheckout
import RazorpayCheckout from '@/components/RazorpayCheckout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useRealtimeCampaign } from '@/hooks/useRealtimeCampaign';
import { supabase } from '@/lib/supabase';
import { formatNumber, formatPercentage } from '@/utils/formatters';
import { getApiUrl } from '@/lib/api';
import {
  ArrowLeft,
  Users,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  MessageSquare,
  Eye,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  RefreshCw,
  Reply,
  Send,
  TrendingUp,
  Sparkles,
  Star
} from 'lucide-react';

interface Creator {
  id: string | number;
  name: string;
  ig_handle: string;
  category: string;
  subcategory?: string;
  followers_count: number;
  engagement_rate: number | null;
  profile_picture_url?: string;
  verified?: boolean;
  bio?: string;
  avg_likes?: number;
  avg_comments?: number;
  avg_views?: number;
}

interface CampaignCreator {
  id: string;
  campaign_id: string;
  creator_id: string | number;
  status: 'recommended' | 'approved' | 'rejected' | 'requested_more';
  recommended_by_admin: boolean;
  admin_notes?: string;
  brand_response?: string;
  brand_response_at?: string;
  admin_reply?: string;
  admin_reply_at?: string;
  created_at: string;
  creators: Creator;
}

interface Campaign {
  id: string;
  campaign_name: string;
  brand_id: string;
  brand_name: string;
  phase: 'creator_selection' | 'approval_pending' | 'approved_pending_funds' | 'payment_pending' | 'content_approval' | 'campaign_active' | 'campaign_complete';
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  budget: number;
  start_date: string;
  end_date: string;
  description: string;
  campaign_objectives?: string[];
  requirements?: string;
  deliverables?: string[];
  target_creators_count?: number;
  min_guarantee_per_creator?: number;
  max_payout_per_creator?: number;
  cpv_rate?: number;
  created_at: string;
  updated_at: string;
}

const BrandCampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { brand } = useAuth();
  const { toast } = useToast();
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [campaignCreators, setCampaignCreators] = useState<CampaignCreator[]>([]);
  const [contents, setContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, { status: string; response: string }>>({});
  const [selectionStatus, setSelectionStatus] = useState<any>(null);
  const [initiatingPayment, setInitiatingPayment] = useState(false);

  // New states for direct applications and script workflows
  const [applications, setApplications] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'applicants' | 'recommended'>('applicants');
  const [appResponses, setAppResponses] = useState<Record<string, string>>({});
  const [brandScripts, setBrandScripts] = useState<Record<string, string>>({});
  const [scriptRevisionFeedback, setScriptRevisionFeedback] = useState<Record<string, string>>({});
  const [scriptOptions, setScriptOptions] = useState<Record<string, 'brand' | 'creator'>>({});
  const [refreshingApps, setRefreshingApps] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (id && brand?.id) {
      fetchCampaignDetails();
      fetchSelectionStatus();
    }
  }, [id, brand?.id]);

  // Real-time campaign updates via Supabase Realtime
  const { campaign: realtimeCampaign } = useRealtimeCampaign(id);
  
  useEffect(() => {
    if (realtimeCampaign && campaign) {
      // Update campaign when it changes in real-time
      if (realtimeCampaign.phase !== campaign.phase) {
        fetchCampaignDetails(); // Refetch to get complete updated data
        toast({
          title: "Campaign Updated",
          description: `Campaign phase changed`,
          variant: "default",
        });
      }
    }
  }, [realtimeCampaign]);

  // Real-time updates for applications, submissions, and view snapshots
  useEffect(() => {
    if (!id) return;
    const channel = supabase
      .channel(`brand-campaign-realtime-${id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "applications", filter: `campaign_id=eq.${id}` },
        () => {
          fetchCampaignDetails();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "submissions" },
        () => {
          fetchCampaignDetails();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "view_snapshots" },
        () => {
          fetchCampaignDetails();
        }
      )
      .subscribe();
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [id]);

  const fetchCampaignDetails = async () => {
    try {
      setLoading(true);
      const url = getApiUrl(`api/campaigns/${id}`);
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setCampaign(data.campaign);
        setApplications(data.applications || []);
        
        // Fetch enriched creator data with clean formatting
        try {
          const enrichedUrl = getApiUrl(`api/campaigns/${id}/creators-enriched`);
          const enrichedResponse = await fetch(enrichedUrl);
          const enrichedData = await enrichedResponse.json();
          
          if (enrichedData.success) {
            setCampaignCreators(enrichedData.creators || []);
          } else {
            // Fallback to regular data
            setCampaignCreators(data.creators || []);
          }
        } catch (enrichError) {
          setCampaignCreators(data.creators || []);
        }
        
        setContents(data.contents || []);
      } else {
        toast({
          title: "Error",
          description: data.details ? `${data.error}: ${data.details}` : (data.error || "Failed to load campaign details"),
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load campaign details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSelectionStatus = async () => {
    try {
      const url = getApiUrl(`api/campaigns/${id}/selection-status`);
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setSelectionStatus(data);
      }
    } catch (error) {
      // Silently fail - selection status is optional
    }
  };

  const handleInitiatePayment = async () => {
    try {
      setInitiatingPayment(true);
      
      const selectedCreators = campaignCreators.filter(cc => cc.status === 'approved');
      const totalCost = selectionStatus?.budget?.totalEstimatedCost || 0;
      
      const response = await fetch(
        getApiUrl(`api/campaigns/${id}/initiate-payment`),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            totalCost,
            selectedCreatorIds: selectedCreators.map(sc => sc.creator_id)
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Payment Initiated",
          description: `Payment process started for ${data.payment.selectedCount} creators`,
        });
        
        // Refresh data
        fetchCampaignDetails();
        fetchSelectionStatus();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to initiate payment",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast({
        title: "Error",
        description: "Failed to initiate payment process",
        variant: "destructive",
      });
    } finally {
      setInitiatingPayment(false);
    }
  };

  const handleCreatorResponse = async (creatorId: string | number, status: 'approved' | 'rejected' | 'requested_more') => {
    try {
      setResponding(String(creatorId));
      const responseData = responses[String(creatorId)];
      
      // Ensure brand is available
      if (!brand?.id) {
        toast({
          title: "Error",
          description: "Brand information is missing. Please refresh the page.",
          variant: "destructive",
        });
        return;
      }
      
      const response = await fetch(
        getApiUrl(`api/campaigns/${id}/creators/${creatorId}/respond`),
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status,
            brand_response: responseData?.response || '',
            brand_id: brand.id
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to update creator status`);
      }

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Response Submitted",
          description: `Creator ${status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'request sent'} successfully`,
        });
        
        // Optimistically update the creator status without full page reload
        setCampaignCreators(prev => 
          prev.map(cc => 
            cc.creator_id === creatorId 
              ? { 
                  ...cc, 
                  status, 
                  brand_response: responseData?.response || '',
                  brand_response_at: new Date().toISOString() 
                }
              : cc
          )
        );

        // Clear the response for this creator
        setResponses(prev => {
          const newResponses = { ...prev };
          delete newResponses[creatorId];
          return newResponses;
        });

        // Refresh selection status after approval/rejection
        fetchSelectionStatus();
        
        // Check if we need to update campaign phase (only if approved and reached target)
        if (status === 'approved' && campaign) {
          const approvedCount = campaignCreators.filter(cc => 
            cc.status === 'approved' || (cc.creator_id === creatorId && status === 'approved')
          ).length;
          
          if (approvedCount >= (campaign.target_creators_count || 1)) {
            // Fetch updated campaign data to get new phase
            const url = getApiUrl(`api/campaigns/${id}`);
            const campaignResponse = await fetch(url);
            const campaignData = await campaignResponse.json();
            if (campaignData.success && campaignData.campaign) {
              setCampaign(campaignData.campaign);
            }
          }
        }
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to submit response",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error responding to creator:', error);
      toast({
        title: "Error",
        description: "Failed to submit response",
        variant: "destructive",
      });
    } finally {
      setResponding(null);
    }
  };

  const handleApplicationResponse = async (applicationId: string, status: 'approved' | 'rejected') => {
    try {
      setResponding(applicationId);
      const responseData = appResponses[applicationId] || '';
      
      if (!brand?.id) {
        toast({
          title: "Error",
          description: "Brand information is missing. Please refresh the page.",
          variant: "destructive",
        });
        return;
      }
      
      const response = await fetch(
        getApiUrl(`api/campaigns/${id}/applications/${applicationId}/respond`),
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status,
            brand_response: responseData,
            brand_id: brand.id
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to respond to application`);
      }

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Response Submitted",
          description: `Applicant ${status === 'approved' ? 'approved' : 'rejected'} successfully`,
        });
        
        // Update applications list
        setApplications(prev => 
          prev.map(app => 
            app.id === applicationId 
              ? { 
                  ...app, 
                  status,
                  brand_feedback: responseData
                }
              : app
          )
        );

        // Clear response
        setAppResponses(prev => {
          const next = { ...prev };
          delete next[applicationId];
          return next;
        });

        fetchSelectionStatus();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to submit response",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error responding to application:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit response",
        variant: "destructive",
      });
    } finally {
      setResponding(null);
    }
  };

  const handleSendBrandScript = async (applicationId: string) => {
    try {
      setResponding(applicationId);
      const scriptContent = brandScripts[applicationId] || '';
      
      if (!brand?.id) {
        toast({
          title: "Error",
          description: "Brand information is missing.",
          variant: "destructive",
        });
        return;
      }
      
      const response = await fetch(
        getApiUrl(`api/campaigns/${id}/applications/${applicationId}/submit-brand-script`),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            script_content: scriptContent,
            brand_id: brand.id
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to submit script`);
      }

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Script Submitted",
          description: "Your script was successfully sent and approved for the creator.",
        });
        
        // Update applications list with status & submission
        setApplications(prev => 
          prev.map(app => 
            app.id === applicationId 
              ? { 
                  ...app, 
                  status: 'script_approved',
                  submissions: [data.submission, ...(app.submissions || [])]
                }
              : app
          )
        );

        // Clear script content
        setBrandScripts(prev => {
          const next = { ...prev };
          delete next[applicationId];
          return next;
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to submit script",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error submitting brand script:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit script",
        variant: "destructive",
      });
    } finally {
      setResponding(null);
    }
  };

  const handleReviewCreatorScript = async (applicationId: string, approved: boolean) => {
    try {
      setResponding(applicationId);
      const feedback = scriptRevisionFeedback[applicationId] || '';
      
      if (!brand?.id) {
        toast({
          title: "Error",
          description: "Brand information is missing.",
          variant: "destructive",
        });
        return;
      }
      
      const response = await fetch(
        getApiUrl(`api/campaigns/${id}/applications/${applicationId}/review-script`),
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            approved,
            feedback,
            brand_id: brand.id
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to review script`);
      }

      const data = await response.json();

      if (data.success) {
        toast({
          title: approved ? "Script Approved" : "Revision Requested",
          description: approved ? "Script has been approved." : "Revision request sent to the creator.",
        });
        
        // Update applications list
        setApplications(prev => 
          prev.map(app => 
            app.id === applicationId 
              ? { 
                  ...app, 
                  status: approved ? 'script_approved' : 'revision_requested',
                  brand_feedback: feedback,
                  submissions: app.submissions?.map((s: any) => 
                    s.id === data.submission.id ? data.submission : s
                  )
                }
              : app
          )
        );

        // Clear feedback
        setScriptRevisionFeedback(prev => {
          const next = { ...prev };
          delete next[applicationId];
          return next;
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to review script",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error reviewing script:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to review script",
        variant: "destructive",
      });
    } finally {
      setResponding(null);
    }
  };

  const handleRefreshInsights = async (applicationId: string) => {
    try {
      setRefreshingApps(prev => ({ ...prev, [applicationId]: true }));
      const url = getApiUrl(`api/applications/${applicationId}/refresh-insights`);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      if (data.success) {
        toast({
          title: "Metrics Refreshed",
          description: "Live Instagram metrics have been updated successfully!",
        });
        fetchCampaignDetails();
      } else {
        toast({
          title: "Refresh Rate Limited",
          description: data.error || "Please wait before refreshing again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to refresh insights",
        variant: "destructive",
      });
    } finally {
      setRefreshingApps(prev => ({ ...prev, [applicationId]: false }));
    }
  };

  const updateResponse = (creatorId: string | number, status: string, response: string) => {
    setResponses(prev => ({
      ...prev,
      [String(creatorId)]: { status, response }
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recommended': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'requested_more': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPhaseProgress = (phase: string) => {
    switch (phase) {
      case 'approval_pending': return 10;
      case 'creator_selection': return 30;
      case 'approved_pending_funds': return 50;
      case 'payment_pending': return 60;
      case 'content_approval': return 75;
      case 'campaign_active': return 90;
      case 'campaign_complete': return 100;
      default: return 0;
    }
  };

  const formatPhaseLabel = (phase: string) => {
    return phase.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Campaign not found</h3>
            <p className="text-gray-600 mb-4">The campaign you're looking for doesn't exist or you don't have access to it.</p>
            <Button onClick={() => navigate('/campaigns')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Campaigns
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/campaigns')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{campaign.campaign_name}</h1>
            <p className="text-gray-600">Campaign Details & Management</p>
          </div>
        </div>
        <Badge className="text-sm px-3 py-1">
          {formatPhaseLabel(campaign.phase)}
        </Badge>
      </div>

      {/* Campaign Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-700">{campaign.description}</p>
            
            {/* Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Campaign Progress</span>
                <span className="text-sm text-gray-500">{getPhaseProgress(campaign.phase)}%</span>
              </div>
              <Progress value={getPhaseProgress(campaign.phase)} className="h-3" />
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">₹{formatNumber(campaign.budget)}</div>
                <div className="text-sm text-gray-600">Budget</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{campaignCreators.length}</div>
                <div className="text-sm text-gray-600">Creators</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Calendar className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">{new Date(campaign.created_at).toLocaleDateString()}</div>
                <div className="text-sm text-gray-600">Created</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Clock className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">{campaign.status}</div>
                <div className="text-sm text-gray-600">Status</div>
              </div>
            </div>

            {/* Campaign Objectives */}
            {campaign.campaign_objectives && campaign.campaign_objectives.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Campaign Objectives</h4>
                <div className="flex flex-wrap gap-2">
                  {campaign.campaign_objectives.map((objective, index) => (
                    <Badge key={index} variant="outline">{objective}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Budget-Based Creator Selection Status */}
      {selectionStatus && campaign.phase === 'creator_selection' && (
        <Card className="border-2 border-green-500 bg-green-50">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Users className="h-6 w-6 text-green-600" />
                    Creator Selection Progress
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectionStatus.selection.currentSelected} of {selectionStatus.selection.maxAllowed} creators selected
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">
                    {selectionStatus.selection.percentage}%
                  </div>
                  <div className="text-xs text-gray-600">Complete</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <Progress 
                  value={selectionStatus.selection.percentage} 
                  className="h-4 bg-gray-200"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-600">
                  <span>{selectionStatus.selection.currentSelected} selected</span>
                  <span>{selectionStatus.selection.remaining} remaining</span>
                </div>
              </div>

              {/* Budget Information */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <DollarSign className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                  <div className="text-lg font-bold text-gray-900">
                    ₹{formatNumber(selectionStatus.budget.totalEstimatedCost)}
                  </div>
                  <div className="text-xs text-gray-600">Estimated Cost</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <TrendingUp className="h-5 w-5 mx-auto mb-1 text-green-600" />
                  <div className="text-lg font-bold text-gray-900">
                    ₹{formatNumber(selectionStatus.budget.remainingBudget)}
                  </div>
                  <div className="text-xs text-gray-600">Remaining Budget</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <Users className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                  <div className="text-lg font-bold text-gray-900">
                    ₹{formatNumber(selectionStatus.budget.costPerCreator)}
                  </div>
                  <div className="text-xs text-gray-600">Per Creator</div>
                </div>
              </div>

              {/* Warning if limit reached */}
              {selectionStatus.selection.limitReached && (
                <div className="flex items-center gap-2 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">
                    <strong>Selection limit reached!</strong> You've selected the maximum number of creators within your budget.
                  </p>
                </div>
              )}

              {/* Proceed to Payment Button */}
              {selectionStatus.selection.canProceedToPayment && !selectionStatus.selection.paymentInitiated && (
                <div className="mt-4 pt-4 border-t border-green-200">
                  <Button
                    onClick={handleInitiatePayment}
                    disabled={initiatingPayment}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                    size="lg"
                  >
                    {initiatingPayment ? (
                      <>
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Proceed to Payment ({selectionStatus.selection.currentSelected} Creators)
                      </>
                    )}
                  </Button>
                  <p className="text-center text-xs text-gray-600 mt-2">
                    Total Amount: ₹{formatNumber(selectionStatus.budget.totalEstimatedCost)}
                  </p>
                </div>
              )}

              {selectionStatus.selection.paymentInitiated && (
                <div className="flex items-center gap-2 p-3 bg-blue-100 border border-blue-300 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    Payment has been initiated. Please complete the payment process.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Creator Selection Phase */}
      {campaign.phase === 'creator_selection' && (
        <Card className="border-t-4 border-t-purple-600 shadow-lg">
          <CardHeader className="bg-gray-50/50">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <Users className="h-6 w-6 text-purple-600" />
                Campaign Workspace
              </CardTitle>
              {(() => {
                const totalRecommended = campaignCreators.length;
                const respondedCreators = campaignCreators.filter(c => c.status !== 'recommended').length;
                const approvedCreators = campaignCreators.filter(c => c.status === 'approved').length;
                const targetCount = campaign?.target_creators_count || 1;
                const allResponded = respondedCreators === totalRecommended;
                const targetReached = approvedCreators >= targetCount;
                
                return (
                  <div className="flex items-center gap-3 text-sm flex-wrap">
                    <div className="flex items-center gap-1.5 bg-white border px-3 py-1.5 rounded-full shadow-sm">
                      <span className="font-semibold text-gray-600">Target:</span>
                      <span className={`font-bold ${targetReached ? 'text-green-600' : 'text-purple-600'}`}>
                        {approvedCreators}/{targetCount} creators needed
                      </span>
                    </div>
                    {targetReached && (
                      <div className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full font-bold flex items-center gap-1 shadow-sm border border-green-200">
                        <CheckCircle className="h-4 w-4" />
                        Target reached - Proceed to Payment!
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Elegant Tab Selectors */}
            <div className="flex border-b mb-6 bg-gray-100/50 p-1.5 rounded-xl border">
              <button
                onClick={() => setActiveTab('applicants')}
                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'applicants'
                    ? 'bg-white text-gray-900 shadow-sm border'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Users className="h-4 w-4 text-purple-600" />
                Direct Applicants ({applications.length})
              </button>
              <button
                onClick={() => setActiveTab('recommended')}
                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'recommended'
                    ? 'bg-white text-gray-900 shadow-sm border'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />
                AI Recommended Creators ({campaignCreators.length})
              </button>
            </div>

            {/* TAB CONTENTS */}
            {activeTab === 'applicants' ? (
              applications.length === 0 ? (
                <div className="text-center py-16 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <h4 className="font-bold text-gray-800 text-lg">No direct applicants yet</h4>
                  <p className="text-sm text-gray-500 max-w-md mx-auto mt-1 px-4">
                    Creators will browse your active campaign within their app. Once they apply, they will instantly appear here for your review and script planning.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => {
                    const creator = app.creator || {};
                    const isResponding = responding === app.id;
                    const latestScript = app.submissions?.find((s: any) => s.kind === 'script');
                    
                    return (
                      <div key={app.id} className="border rounded-2xl p-6 hover:shadow-md transition-all bg-white relative overflow-hidden text-left">
                        {/* Premium Side Border Indicator based on application status */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                          app.status === 'applied' ? 'bg-blue-500' :
                          app.status === 'approved' ? 'bg-amber-500' :
                          app.status === 'rejected' ? 'bg-red-500' :
                          app.status === 'script_submitted' ? 'bg-purple-600' :
                          app.status === 'script_approved' ? 'bg-green-600' :
                          app.status === 'revision_requested' ? 'bg-orange-500' :
                          'bg-gray-400'
                        }`} />

                        <div className="flex items-start justify-between gap-6 flex-wrap">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                              <img 
                                src={creator.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}&size=200&background=random`}
                                alt={creator.name}
                                className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                                onError={(e) => {
                                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}&size=200&background=random`;
                                }}
                              />
                              {creator.campayn_score > 80 && (
                                <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-1 border border-white">
                                  <Star className="h-3 w-3 text-white fill-current" />
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h4 className="font-bold text-lg text-gray-900">{creator.name}</h4>
                                <Badge className="bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold border border-purple-200 text-xs">
                                  ⭐ Score: {creator.campayn_score || 0}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2 font-medium">
                                <a 
                                  href={`https://instagram.com/${creator.ig_handle}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:text-purple-600 transition-colors font-semibold"
                                >
                                  @{creator.ig_handle}
                                </a>
                                {creator.city && ` • ${creator.city}, ${creator.state || ''}`}
                              </p>
                              {creator.bio && (
                                <p className="text-sm text-gray-500 mb-3 line-clamp-2 italic">"{creator.bio}"</p>
                              )}

                              {/* Stats Grid */}
                              <div className="grid grid-cols-3 gap-4 text-center bg-gray-50 rounded-xl p-3 max-w-lg border">
                                <div>
                                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5 tracking-wider">Followers</p>
                                  <p className="font-bold text-gray-900 text-sm">{formatNumber(creator.followers_count || 0)}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5 tracking-wider">Engagement</p>
                                  <p className="font-bold text-purple-600 text-sm">{formatPercentage(creator.engagement_rate || 0)}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5 tracking-wider">Avg Views</p>
                                  <p className="font-bold text-blue-600 text-sm">{formatNumber(creator.avg_views || 0)}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Top-Right Status Badge */}
                          <div className="flex items-center gap-2">
                            <Badge className={
                              app.status === 'applied' ? 'bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-100' :
                              app.status === 'approved' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200 hover:bg-yellow-100' :
                              app.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-200 hover:bg-red-100' :
                              app.status === 'script_submitted' ? 'bg-purple-100 text-purple-800 border border-purple-200 hover:bg-purple-100' :
                              app.status === 'script_approved' ? 'bg-green-100 text-green-800 border border-green-200 hover:bg-green-100' :
                              app.status === 'revision_requested' ? 'bg-orange-100 text-orange-800 border border-orange-200 hover:bg-orange-100' :
                              'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-100'
                            }>
                              {app.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>

                        {/* ACTIONS LIFECYCLE */}

                        {/* Phase 1: Review Application (applied status) */}
                        {app.status === 'applied' && (
                          <div className="mt-5 border-t pt-4 space-y-4">
                            <textarea
                              placeholder="Add application feedback or instructions... (e.g. Nice profile, look forward to working with you!)"
                              className="w-full p-3 border rounded-lg resize-none text-sm focus:ring-purple-500 focus:border-purple-500"
                              rows={2}
                              value={appResponses[app.id] || ''}
                              onChange={(e) => setAppResponses(prev => ({ ...prev, [app.id]: e.target.value }))}
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleApplicationResponse(app.id, 'approved')}
                                disabled={isResponding}
                                className="bg-green-600 hover:bg-green-700 flex items-center text-sm font-semibold h-10 px-4 text-white"
                              >
                                <ThumbsUp className="h-4 w-4 mr-1.5" />
                                Approve Applicant
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleApplicationResponse(app.id, 'rejected')}
                                disabled={isResponding}
                                className="text-red-600 hover:bg-red-50 border-red-200 flex items-center text-sm font-semibold h-10 px-4"
                              >
                                <ThumbsDown className="h-4 w-4 mr-1.5" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Phase 2: Script Options Choice (approved status) */}
                        {app.status === 'approved' && (
                          <div className="mt-5 border-t pt-4">
                            <div className="mb-4 bg-gray-50/50 p-4 rounded-xl border border-dashed">
                              <label className="text-sm font-bold text-gray-800 block mb-3">Choose Scripting Protocol:</label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className={`flex items-start gap-3 cursor-pointer text-sm border rounded-xl p-4 transition-all ${
                                  scriptOptions[app.id] !== 'creator'
                                    ? 'bg-purple-50/30 border-purple-300 ring-1 ring-purple-300'
                                    : 'bg-white hover:bg-gray-50 border-gray-200'
                                }`}>
                                  <input
                                    type="radio"
                                    name={`script-option-${app.id}`}
                                    checked={scriptOptions[app.id] !== 'creator'}
                                    onChange={() => setScriptOptions(prev => ({ ...prev, [app.id]: 'brand' }))}
                                    className="text-purple-600 focus:ring-purple-500 mt-0.5"
                                  />
                                  <div>
                                    <span className="font-bold block text-gray-900">Provide Custom Brand Script</span>
                                    <span className="text-xs text-gray-500 mt-0.5 block">Paste your script directly to skip drafting. Fast & instant.</span>
                                  </div>
                                </label>
                                <label className={`flex items-start gap-3 cursor-pointer text-sm border rounded-xl p-4 transition-all ${
                                  scriptOptions[app.id] === 'creator'
                                    ? 'bg-purple-50/30 border-purple-300 ring-1 ring-purple-300'
                                    : 'bg-white hover:bg-gray-50 border-gray-200'
                                }`}>
                                  <input
                                    type="radio"
                                    name={`script-option-${app.id}`}
                                    checked={scriptOptions[app.id] === 'creator'}
                                    onChange={() => setScriptOptions(prev => ({ ...prev, [app.id]: 'creator' }))}
                                    className="text-purple-600 focus:ring-purple-500 mt-0.5"
                                  />
                                  <div>
                                    <span className="font-bold block text-gray-900">Let Creator Draft Script</span>
                                    <span className="text-xs text-gray-500 mt-0.5 block">Creator will upload their custom script draft for your review.</span>
                                  </div>
                                </label>
                              </div>
                            </div>

                            {scriptOptions[app.id] !== 'creator' ? (
                              <div className="space-y-3">
                                <textarea
                                  placeholder="Paste or write your campaign script here... Include Hook, Key Messages, and Call-to-action (CTA)."
                                  className="w-full p-4 border rounded-xl resize-none text-sm font-mono bg-purple-50/10 focus:ring-purple-500 focus:border-purple-500"
                                  rows={4}
                                  value={brandScripts[app.id] || ''}
                                  onChange={(e) => setBrandScripts(prev => ({ ...prev, [app.id]: e.target.value }))}
                                />
                                <Button
                                  onClick={() => handleSendBrandScript(app.id)}
                                  disabled={isResponding || !brandScripts[app.id]?.trim()}
                                  className="bg-purple-600 hover:bg-purple-700 flex items-center text-sm font-semibold h-10 px-4 text-white"
                                >
                                  <Send className="h-4 w-4 mr-1.5" />
                                  Submit & Approve Script
                                </Button>
                              </div>
                            ) : (
                              <div className="bg-purple-50/50 border border-purple-200 rounded-xl p-4 flex items-center gap-3">
                                <Clock className="h-5 w-5 text-purple-600 animate-pulse" />
                                <div className="text-sm">
                                  <p className="font-bold text-purple-900">Awaiting Creator Script Draft</p>
                                  <p className="text-purple-700 text-xs mt-0.5">
                                    The creator has been notified to draft a script matching your campaign guidelines. They will submit it inside the App shortly.
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Phase 3: Review Submitted Script (script_submitted status) */}
                        {app.status === 'script_submitted' && latestScript && (
                          <div className="mt-5 border-t pt-4 space-y-4">
                            <div className="bg-purple-50/30 border border-purple-200 rounded-2xl p-5 shadow-inner">
                              <h5 className="font-bold text-sm text-purple-950 flex items-center gap-1.5 mb-3">
                                <FileText className="h-4.5 w-4.5 text-purple-700" />
                                Creator's Custom Script Draft:
                              </h5>
                              <p className="text-sm text-gray-800 font-mono bg-white border border-gray-100 rounded-xl p-4 whitespace-pre-wrap leading-relaxed shadow-sm">
                                {latestScript.content}
                              </p>
                              <p className="text-xs text-gray-400 mt-2 text-right">
                                Submitted {new Date(latestScript.created_at).toLocaleString()}
                              </p>
                            </div>

                            <textarea
                              placeholder="Feedback/Revision details... (Required if requesting revision, optional for approval)"
                              className="w-full p-3 border rounded-lg resize-none text-sm focus:ring-purple-500 focus:border-purple-500"
                              rows={2}
                              value={scriptRevisionFeedback[app.id] || ''}
                              onChange={(e) => setScriptRevisionFeedback(prev => ({ ...prev, [app.id]: e.target.value }))}
                            />

                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleReviewCreatorScript(app.id, true)}
                                disabled={isResponding}
                                className="bg-green-600 hover:bg-green-700 flex items-center text-sm font-semibold h-10 px-4 text-white"
                              >
                                <CheckCircle className="h-4 w-4 mr-1.5" />
                                Approve Script
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleReviewCreatorScript(app.id, false)}
                                disabled={isResponding || !scriptRevisionFeedback[app.id]?.trim()}
                                className="text-amber-700 hover:bg-amber-50 border-amber-300 flex items-center text-sm font-semibold h-10 px-4"
                              >
                                <RefreshCw className="h-4 w-4 mr-1.5" />
                                Request Revision
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Phase 4: Awaiting Revision (revision_requested status) */}
                        {app.status === 'revision_requested' && (
                          <div className="mt-5 border-t pt-4">
                            <div className="bg-orange-50/50 border border-orange-200 rounded-xl p-4">
                              <div className="flex items-center gap-3 mb-2">
                                <Clock className="h-5 w-5 text-orange-600 animate-spin" style={{ animationDuration: '3s' }} />
                                <p className="font-bold text-orange-950 text-sm">Revision Requested from Creator</p>
                              </div>
                              {app.brand_feedback && (
                                <p className="text-orange-900 text-xs bg-white border border-orange-100 rounded-lg p-3 italic">
                                  "Feedback: {app.brand_feedback}"
                                </p>
                              )}
                              <p className="text-orange-700 text-xs mt-2.5">
                                We've notified the creator of the feedback. Awaiting script modification resubmission.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Phase 5: Script Approved (script_approved status) */}
                        {app.status === 'script_approved' && (
                          <div className="mt-5 border-t pt-4 space-y-3">
                            <div className="bg-green-50/50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <div className="text-sm">
                                <p className="font-bold text-green-950">Script Approved & Finalized</p>
                                <p className="text-green-800 text-xs mt-0.5">
                                  The script is locked. Creator is now recording their video reel matching this text structure.
                                </p>
                              </div>
                            </div>
                            {latestScript?.content && (
                              <details className="text-xs text-gray-500 cursor-pointer bg-gray-50 border rounded-lg p-3 hover:bg-gray-100 transition-colors">
                                <summary className="font-semibold select-none">Show Final Approved Script</summary>
                                <p className="mt-2 font-mono whitespace-pre-wrap text-gray-700 p-3 bg-white rounded-lg border leading-relaxed text-sm">
                                  {latestScript.content}
                                </p>
                              </details>
                            )}
                          </div>
                        )}

                        {/* Phase 6: Content Posted & Views Tracking (posted, verified, paid statuses) */}
                        {['posted', 'verified', 'paid'].includes(app.status) && (
                          <div className="mt-5 border-t pt-4 space-y-4">
                            <div className="bg-purple-50/20 border border-purple-200 rounded-2xl p-5 text-left">
                              <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                                <div className="flex items-center gap-2">
                                  <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                  </span>
                                  <h5 className="font-bold text-sm text-purple-950 flex items-center gap-1.5">
                                    🎥 Live Instagram Reel Analytics
                                  </h5>
                                </div>
                                <div className="flex items-center gap-2">
                                  <a
                                    href={app.post_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-purple-600 hover:text-purple-800 font-semibold border border-purple-300 rounded-full px-3 py-1 bg-white hover:bg-purple-50 transition-all flex items-center gap-1"
                                  >
                                    <Eye className="h-3.5 w-3.5" />
                                    View Reel
                                  </a>
                                  <Button
                                    size="sm"
                                    onClick={() => handleRefreshInsights(app.id)}
                                    disabled={refreshingApps[app.id]}
                                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full text-xs px-3 h-8 flex items-center gap-1.5 shadow-sm"
                                  >
                                    <RefreshCw className={`h-3 w-3 ${refreshingApps[app.id] ? 'animate-spin' : ''}`} />
                                    Refresh Insights
                                  </Button>
                                </div>
                              </div>

                              {/* Analytics Grid */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                                <div className="bg-white border rounded-xl p-3.5 text-center shadow-sm">
                                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5 tracking-wider">Views</p>
                                  <p className="font-extrabold text-gray-900 text-base">{formatNumber(app.verified_views || 0)}</p>
                                </div>
                                <div className="bg-white border rounded-xl p-3.5 text-center shadow-sm">
                                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5 tracking-wider">Likes</p>
                                  <p className="font-extrabold text-purple-600 text-base">{formatNumber(app.likes || 0)}</p>
                                </div>
                                <div className="bg-white border rounded-xl p-3.5 text-center shadow-sm">
                                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5 tracking-wider">Comments</p>
                                  <p className="font-extrabold text-blue-600 text-base">{formatNumber(app.comments || 0)}</p>
                                </div>
                                <div className="bg-white border rounded-xl p-3.5 text-center shadow-sm">
                                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5 tracking-wider">Est. Earnings</p>
                                  <p className="font-extrabold text-green-600 text-base">₹{formatNumber(app.final_earning_inr || 0)}</p>
                                </div>
                              </div>

                              {/* Hybrid Pricing Progress Bar */}
                              {campaign && (campaign.max_payout_per_creator || 0) > 0 && (
                                <div className="mb-5 bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
                                  <div className="flex justify-between items-center text-xs">
                                    <div className="flex items-center gap-1.5 font-semibold text-gray-700">
                                      <TrendingUp className="h-4 w-4 text-blue-500" />
                                      Performance Payout Progress
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {app.final_earning_inr === (campaign.min_guarantee_per_creator || 0) && (campaign.min_guarantee_per_creator || 0) > 0 && (
                                        <Badge className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] hover:bg-blue-50">
                                          Base Guarantee Applied
                                        </Badge>
                                      )}
                                      {app.final_earning_inr === (campaign.max_payout_per_creator || 0) && (
                                        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] hover:bg-emerald-50">
                                          Max Payout Cap Reached
                                        </Badge>
                                      )}
                                      <span className="font-bold text-gray-900">
                                        ₹{formatNumber(app.final_earning_inr || 0)} / ₹{formatNumber(campaign.max_payout_per_creator || 0)}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {/* Progress bar */}
                                  <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden border">
                                    {/* Min guarantee indicator line */}
                                    {(campaign.min_guarantee_per_creator || 0) > 0 && (
                                      <div 
                                        className="absolute top-0 bottom-0 w-0.5 bg-blue-400 z-10"
                                        style={{ left: `${((campaign.min_guarantee_per_creator || 0) / (campaign.max_payout_per_creator || 1)) * 100}%` }}
                                        title={`Base Guarantee: ₹${campaign.min_guarantee_per_creator}`}
                                      />
                                    )}
                                    <div 
                                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                                      style={{ width: `${Math.min(100, ((app.final_earning_inr || 0) / (campaign.max_payout_per_creator || 1)) * 100)}%` }}
                                    />
                                  </div>
                                  
                                  <div className="flex justify-between items-center text-[10px] text-gray-400">
                                    <span>Base Guarantee: ₹{formatNumber(campaign.min_guarantee_per_creator || 0)}</span>
                                    <span>CPV: {campaign.cpv_rate || (app.legacy_campaigns?.cpv_paise || 50)} Paise</span>
                                    <span>Max Payout: ₹{formatNumber(campaign.max_payout_per_creator || 0)}</span>
                                  </div>
                                </div>
                              )}

                              {/* Refresh Timelines */}
                              {app.refreshes && app.refreshes.length > 0 && (
                                <div className="bg-white/80 border rounded-xl p-4 text-left">
                                  <h6 className="font-bold text-xs text-gray-700 uppercase tracking-wider mb-3">
                                    🕒 Anti-Restriction Automated Refresh Schedule
                                  </h6>
                                  <div className="space-y-3">
                                    {app.refreshes.map((ref: any, idx: number) => {
                                      const isPending = ref.status === 'pending';
                                      const isDone = ref.status === 'done';
                                      const isFailed = ref.status === 'failed';
                                      
                                      return (
                                        <div key={ref.id} className="flex items-center justify-between text-xs border-b border-gray-50 pb-2 last:border-b-0 last:pb-0">
                                          <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${
                                              isPending ? 'bg-amber-400 animate-pulse' :
                                              isDone ? 'bg-green-500' : 'bg-red-500'
                                            }`} />
                                            <span className="font-semibold text-gray-700">
                                              Interval {idx + 1}: {ref.refresh_interval === '7_hours' ? '7 Hours Postcheck' : '48 Hours (2 Days) Postcheck'}
                                            </span>
                                          </div>
                                          <div className="text-right">
                                            <span className="text-gray-500 mr-2">
                                              Scheduled: {new Date(ref.scheduled_at).toLocaleString()}
                                            </span>
                                            <Badge className={
                                              isPending ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-50' :
                                              isDone ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-50' :
                                              'bg-red-50 text-red-700 border border-red-200 hover:bg-red-50'
                                            }>
                                              {ref.status.toUpperCase()}
                                            </Badge>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* General Feedback display */}
                        {app.brand_feedback && ['approved', 'rejected'].includes(app.status) && (
                          <div className={`mt-3 p-3 rounded-lg text-sm ${
                            app.status === 'approved' ? 'bg-green-50 border border-green-100 text-green-800' : 'bg-red-50 border border-red-100 text-red-800'
                          }`}>
                            <p className="font-semibold">{app.status === 'approved' ? '✅ Selection Notes' : '❌ Rejection Notes'}:</p>
                            <p className="mt-1 italic">"{app.brand_feedback}"</p>
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              campaignCreators.length === 0 ? (
                <div className="text-center py-16 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
                  <Sparkles className="h-12 w-12 mx-auto text-purple-400 mb-3 animate-pulse" />
                  <h4 className="font-bold text-gray-800 text-lg">AI Matching Recommendations Loading</h4>
                  <p className="text-sm text-gray-500 max-w-md mx-auto mt-1 px-4">
                    Our AI models are fetching matched profiles inside the backend directory. Fresh recommendations will display here shortly.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {campaignCreators.map((campaignCreator) => (
                    <div key={campaignCreator.id} className="border rounded-2xl p-6 hover:shadow-md transition-shadow bg-white text-left">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          {/* Profile Picture */}
                          <div className="relative flex-shrink-0">
                            <img 
                              src={campaignCreator.creators.profile_picture_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(campaignCreator.creators.name)}&size=200&background=random`}
                              alt={campaignCreator.creators.name}
                              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                              onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(campaignCreator.creators.name)}&size=200&background=random`;
                              }}
                            />
                            {campaignCreator.creators.verified && (
                              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>

                          {/* Creator Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold text-lg text-gray-900">{campaignCreator.creators.name}</h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/dashboard/creator-profile/${campaignCreator.creators.ig_handle}`, {
                                  state: { creator: campaignCreator.creators }
                                })}
                                className="text-blue-600 hover:text-blue-800 px-2 py-1 h-auto"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View Full Profile
                              </Button>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2">
                              <a 
                                href={`https://instagram.com/${campaignCreator.creators.ig_handle}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-purple-600 transition-colors"
                              >
                                @{campaignCreator.creators.ig_handle}
                              </a>
                            </p>

                            {/* Bio */}
                            {campaignCreator.creators.bio && (
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{campaignCreator.creators.bio}</p>
                            )}
                            
                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-4 text-center bg-gray-50 rounded-lg p-3">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Followers</p>
                                <p className="font-bold text-gray-900">{formatNumber(campaignCreator.creators.followers_count)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Engagement</p>
                                <p className="font-bold text-purple-600">{formatPercentage(campaignCreator.creators.engagement_rate)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Category</p>
                                <Badge variant="outline" className="font-semibold">{campaignCreator.creators.category}</Badge>
                              </div>
                            </div>

                            {/* Subcategory */}
                            {campaignCreator.creators.subcategory && (
                              <div className="mt-2">
                                <Badge variant="secondary" className="text-xs">
                                  {campaignCreator.creators.subcategory}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(campaignCreator.status)}>
                            {campaignCreator.status}
                          </Badge>
                        </div>
                      </div>

                      {campaignCreator.status === 'recommended' && (
                        <div className="mt-4 space-y-3">
                          <textarea
                            placeholder="Add your message... (For 'Request More Info', this will start a chat with admin)"
                            className="w-full p-3 border rounded-lg resize-none"
                            rows={3}
                            value={responses[campaignCreator.creator_id]?.response || ''}
                            onChange={(e) => updateResponse(campaignCreator.creator_id, 'response', e.target.value)}
                          />
                          <div className="space-y-2">
                            <div className="flex gap-2 flex-wrap">
                              <Button
                                onClick={() => handleCreatorResponse(campaignCreator.creator_id, 'approved')}
                                disabled={responding === String(campaignCreator.creator_id)}
                                className="flex items-center text-white bg-purple-600 hover:bg-purple-700"
                              >
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                Approve Recommendation
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleCreatorResponse(campaignCreator.creator_id, 'requested_more')}
                                disabled={responding === String(campaignCreator.creator_id)}
                                className="flex items-center"
                              >
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Request More Info
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleCreatorResponse(campaignCreator.creator_id, 'rejected')}
                                disabled={responding === String(campaignCreator.creator_id)}
                                className="flex items-center"
                              >
                                <ThumbsDown className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                              💡 <strong>Approve/Reject:</strong> Sends your message as final decision • <strong>Request More Info:</strong> Starts a chat with admin
                            </div>
                          </div>
                        </div>
                      )}

                      {campaignCreator.brand_response && (
                        <>
                          {/* Show response as status update for approve/reject */}
                          {(campaignCreator.status === 'approved' || campaignCreator.status === 'rejected') && (
                            <div className={`mt-3 p-3 rounded-lg ${
                              campaignCreator.status === 'approved' 
                                ? 'bg-green-50 border border-green-200' 
                                : 'bg-red-50 border border-red-200'
                            }`}>
                              <p className={`text-sm font-medium mb-1 ${
                                campaignCreator.status === 'approved' 
                                  ? 'text-green-900' 
                                  : 'text-red-900'
                              }`}>
                                {campaignCreator.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                              </p>
                              {campaignCreator.brand_response && (
                                <p className={`text-sm ${
                                  campaignCreator.status === 'approved' 
                                    ? 'text-green-800' 
                                    : 'text-red-800'
                                }`}>
                                  {campaignCreator.brand_response}
                                </p>
                              )}
                              <p className={`text-xs mt-1 ${
                                campaignCreator.status === 'approved' 
                                  ? 'text-green-600' 
                                  : 'text-red-600'
                              }`}>
                                Responded on {new Date(campaignCreator.brand_response_at || '').toLocaleDateString()}
                              </p>
                            </div>
                          )}

                          {/* Show conversation for requested_more */}
                          {campaignCreator.status === 'requested_more' && (
                            <div className="mt-3">
                              <ConversationHistory
                                campaignId={id!}
                                creatorId={String(campaignCreator.creator_id)}
                                creatorName={campaignCreator.creators.name}
                                userType="brand"
                                currentStatus={campaignCreator.status}
                                onStatusUpdate={fetchCampaignDetails}
                              />
                            </div>
                          )}
                        </>
                      )}

                      {/* Also show conversation if admin has replied (even for approved/rejected) */}
                      {campaignCreator.admin_reply && campaignCreator.status !== 'requested_more' && (
                        <div className="mt-3">
                          <ConversationHistory
                            campaignId={id!}
                            creatorId={String(campaignCreator.creator_id)}
                            creatorName={campaignCreator.creators.name}
                            userType="brand"
                            currentStatus={campaignCreator.status}
                            onStatusUpdate={fetchCampaignDetails}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            )}
          </CardContent>
        </Card>
      )}

      {/* Other Phase Information */}
      {campaign.phase !== 'creator_selection' && (
        <Card>
          <CardHeader>
            <CardTitle>Current Phase: {formatPhaseLabel(campaign.phase)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              {campaign.phase === 'approval_pending' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-blue-500 animate-pulse" />
                    <h3 className="text-lg font-semibold mb-2">Pending Admin Approval</h3>
                    <p className="text-gray-600 mb-4">
                      Our team is currently reviewing your campaign details and creator requirements. 
                      You will be notified once the campaign is approved and ready for the next step.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-700">
                        Estimated review time: 12-24 hours.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {campaign.phase === 'approved_pending_funds' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <h3 className="text-lg font-semibold mb-2">Campaign Approved!</h3>
                    <p className="text-gray-600 mb-4">
                      Admin has approved your campaign. Please add funds to your wallet to proceed with creator invitations.
                    </p>
                    <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="text-sm text-green-800">
                        Total Budget: ₹{formatNumber(campaign.budget)}
                      </div>
                    </div>
                  </div>
                  <RazorpayCheckout
                    campaignId={id!}
                    amount={campaign.budget}
                    campaignName={campaign.campaign_name}
                    onSuccess={() => {
                      fetchCampaignDetails();
                      toast({
                        title: 'Funds Added',
                        description: 'Your wallet has been funded and campaign is moving to selection phase.',
                      });
                    }}
                    onError={(err) => {
                      toast({
                        title: 'Payment Error',
                        description: err.message || 'Payment failed',
                        variant: 'destructive'
                      });
                    }}
                  />
                </div>
              )}
              {campaign.phase === 'payment_pending' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                    <h3 className="text-lg font-semibold mb-2">Secure Payment Required</h3>
                    <p className="text-gray-600 mb-4">
                      You've approved the required number of creators. Complete the payment securely to unlock content approval.
                    </p>
                    {(() => {
                      const approvedCreators = campaignCreators.filter(c => c.status === 'approved');
                      const targetCount = campaign?.target_creators_count || 1;
                      return (
                        <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="text-sm text-green-800">
                            ✅ Target achieved: {approvedCreators.length}/{targetCount} creators approved
                          </div>
                          <p className="text-xs text-green-700 mt-2">Next: Pay campaign budget to proceed</p>
                        </div>
                      );
                    })()}
                  </div>
                  <RazorpayCheckout
                    campaignId={id!}
                    amount={campaign.budget}
                    campaignName={campaign.campaign_name}
                    onSuccess={() => {
                      // After successful payment, backend moves phase to content_approval. Refetch.
                      fetchCampaignDetails();
                      toast({
                        title: 'Payment Verified',
                        description: 'Campaign moved to Content Approval phase.',
                      });
                    }}
                    onError={(err) => {
                      console.error('Razorpay payment error:', err);
                      toast({
                        title: 'Payment Error',
                        description: err.message || 'Payment failed or cancelled',
                        variant: 'destructive'
                      });
                    }}
                  />
                  <div className="text-xs text-gray-500 text-center">
                    Powered by Razorpay • Supports UPI, Cards, NetBanking & Wallets
                  </div>
                </div>
              )}
              {campaign.phase === 'content_approval' && (() => {
                // Check if content exists and if all content is approved
                const hasContent = contents.length > 0;
                const allContentApproved = hasContent && contents.every((c: any) => c.approval_status === 'approved');
                
                if (hasContent && allContentApproved) {
                  return (
                    <>
                      <Clock className="h-12 w-12 mx-auto mb-4 text-blue-500 animate-pulse" />
                      <h3 className="text-lg font-semibold mb-2">Content Approved!</h3>
                      <p className="text-gray-600 mb-4">
                        Great! All content has been approved. Creators will be posting soon and you'll see your posts live.
                      </p>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 text-blue-800">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">What happens next:</span>
                        </div>
                        <ul className="mt-2 text-sm text-blue-700 space-y-1">
                          <li>• Admin will coordinate with creators for posting</li>
                          <li>• Live post links will be added as content goes live</li>
                          <li>• You'll be notified when analytics become available</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <Button onClick={() => navigate(`/dashboard/campaigns/${id}/content`)} variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          View Approved Content
                        </Button>
                      </div>
                    </>
                  );
                } else {
                  return (
                    <>
                      <FileText className="h-12 w-12 mx-auto mb-4 text-purple-500" />
                      <h3 className="text-lg font-semibold mb-2">Content Review</h3>
                      <p className="text-gray-600">Creators are submitting content for your review and approval.</p>
                      <div className="mt-4">
                        <Button onClick={() => navigate(`/dashboard/campaigns/${id}/content`)}>
                          Go to Content Review
                        </Button>
                      </div>
                    </>
                  );
                }
              })()}
              {campaign.phase === 'campaign_active' && (
                <>
                  <Eye className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <h3 className="text-lg font-semibold mb-2">Campaign Active</h3>
                  <p className="text-gray-600 mb-4">Your content has been approved! Creators are now posting and you can monitor live performance metrics.</p>
                  <div className="mt-4 space-y-3">
                    <Button onClick={() => navigate(`/dashboard/campaigns/${id}/analytics`)} className="w-full bg-green-600 hover:bg-green-700">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Monitor Campaign Analytics
                    </Button>
                    <Button variant="outline" onClick={() => navigate(`/dashboard/campaigns/${id}/content`)}>
                      <FileText className="h-4 w-4 mr-2" />
                      View Content Details
                    </Button>
                  </div>
                </>
              )}
              {campaign.phase === 'campaign_complete' && (
                <>
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                  <h3 className="text-lg font-semibold mb-2">Campaign Completed</h3>
                  <p className="text-gray-600">Your campaign has been successfully completed. Review the results and analytics.</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BrandCampaignDetail;