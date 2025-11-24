import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import ConversationHistory from '@/components/ConversationHistory';
import PaymentManagementRazorpay from '@/components/PaymentManagementRazorpay';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useRealtimeCampaign } from '@/hooks/useRealtimeCampaign';
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
  TrendingUp
} from 'lucide-react';

interface Creator {
  id: string;
  name: string;
  ig_handle: string;
  category: string;
  followers_count: number;
  engagement_rate: number | null;
  profile_picture_url?: string;
}

interface CampaignCreator {
  id: string;
  campaign_id: string;
  creator_id: string;
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
  phase: 'creator_selection' | 'payment_pending' | 'content_approval' | 'campaign_active' | 'campaign_complete';
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  budget: number;
  start_date: string;
  end_date: string;
  description: string;
  campaign_objectives?: string[];
  requirements?: string;
  deliverables?: string[];
  target_creators_count?: number;
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

  useEffect(() => {
    if (id && brand?.id) {
      fetchCampaignDetails();
    }
  }, [id, brand?.id]);


  // Real-time campaign updates via Supabase Realtime
  const { campaign: realtimeCampaign } = useRealtimeCampaign(id);
  
  useEffect(() => {
    if (realtimeCampaign && campaign) {
      // Update campaign when it changes in real-time
      if (realtimeCampaign.phase !== campaign.phase || realtimeCampaign.payment_status !== campaign.payment_status) {
        fetchCampaignDetails(); // Refetch to get complete updated data
        toast({
          title: "Campaign Updated",
          description: "Campaign has been updated",
          variant: "default",
        });
      }
    }
  }, [realtimeCampaign, campaign]);
  const fetchCampaignDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl(`api/campaigns/${id}`));
      const data = await response.json();

      if (data.success) {
        setCampaign(data.campaign);
        setCampaignCreators(data.creators || []);
        setContents(data.contents || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to load campaign details",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching campaign:', error);
      toast({
        title: "Error",
        description: "Failed to load campaign details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatorResponse = async (creatorId: string, status: 'approved' | 'rejected' | 'requested_more') => {
    try {
      setResponding(creatorId);
      const responseData = responses[creatorId];
      
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
            brand_id: brand?.id
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Response Submitted",
          description: `Creator ${status} successfully`,
        });
        
        // Refresh the campaign creators
        fetchCampaignDetails();
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

  const updateResponse = (creatorId: string, status: string, response: string) => {
    setResponses(prev => ({
      ...prev,
      [creatorId]: { status, response }
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
      case 'creator_selection': return 20;
      case 'payment_pending': return 40;
      case 'content_approval': return 60;
      case 'campaign_active': return 80;
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

      {/* Creator Selection Phase */}
      {campaign.phase === 'creator_selection' && campaignCreators.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Creator Recommendations
            </CardTitle>
            {(() => {
              const totalRecommended = campaignCreators.length;
              const respondedCreators = campaignCreators.filter(c => c.status !== 'recommended').length;
              const approvedCreators = campaignCreators.filter(c => c.status === 'approved').length;
              const targetCount = campaign?.target_creators_count || 1;
              const allResponded = respondedCreators === totalRecommended;
              const targetReached = approvedCreators >= targetCount;
              
              return (
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-gray-700">Target:</span>
                      <span className={`font-medium ${targetReached ? 'text-green-600' : 'text-blue-600'}`}>
                        {approvedCreators}/{targetCount} creators needed
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-gray-700">Responses:</span>
                      <span className={`font-medium ${allResponded ? 'text-green-600' : 'text-blue-600'}`}>
                        {respondedCreators}/{totalRecommended} completed
                      </span>
                    </div>
                  </div>
                  {targetReached && (
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      ✅ Target reached - Moving to payment processing
                    </div>
                  )}
                  {!targetReached && allResponded && (
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      Need {targetCount - approvedCreators} more creators - Admin will recommend more
                    </div>
                  )}
                  {!targetReached && !allResponded && (
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      Continue reviewing creators
                    </div>
                  )}
                </div>
              );
            })()}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaignCreators.map((campaignCreator) => (
                <div key={campaignCreator.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <Users className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{campaignCreator.creators.name}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/dashboard/creator-profile/${campaignCreator.creators.ig_handle}`, {
                              state: { creator: campaignCreator.creators }
                            })}
                            className="text-blue-600 hover:text-blue-800 px-2 py-1 h-auto"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View Profile
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600">@{campaignCreator.creators.ig_handle}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span>{formatNumber(campaignCreator.creators.followers_count)} followers</span>
                          <span>{formatPercentage(campaignCreator.creators.engagement_rate)} engagement</span>
                          <Badge variant="outline">{campaignCreator.creators.category}</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(campaignCreator.status)}>
                        {campaignCreator.status}
                      </Badge>
                    </div>
                  </div>

                  {campaignCreator.admin_notes && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 mb-1">Admin Notes:</p>
                      <p className="text-sm text-blue-800">{campaignCreator.admin_notes}</p>
                    </div>
                  )}

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
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleCreatorResponse(campaignCreator.creator_id, 'approved')}
                            disabled={responding === campaignCreator.creator_id}
                            className="flex items-center"
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleCreatorResponse(campaignCreator.creator_id, 'requested_more')}
                            disabled={responding === campaignCreator.creator_id}
                            className="flex items-center"
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Request More Info
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleCreatorResponse(campaignCreator.creator_id, 'rejected')}
                            disabled={responding === campaignCreator.creator_id}
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
                            creatorId={campaignCreator.creator_id}
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
                        creatorId={campaignCreator.creator_id}
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
              {campaign.phase === 'payment_pending' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                    <h3 className="text-lg font-semibold mb-2">Payment Processing</h3>
                    <p className="text-gray-600 mb-4">
                      Great! You've approved the required number of creators. 
                      Please complete the payment to proceed to the next phase.
                    </p>
                    {(() => {
                      const approvedCreators = campaignCreators.filter(c => c.status === 'approved');
                      const targetCount = campaign?.target_creators_count || 1;
                      return (
                        <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="text-sm text-green-800">
                            ✅ Target achieved: {approvedCreators.length}/{targetCount} creators approved
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  <PaymentManagementRazorpay 
                    campaignId={id!}
                    campaignName={campaign.campaign_name}
                    amount={campaign.budget}
                    userType="brand"
                    onPaymentSuccess={fetchCampaignDetails}
                  />
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