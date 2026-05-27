import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ConversationHistory from '@/components/ConversationHistory';
// Legacy PaymentManagement (manual UPI flow) removed; admin now only monitors payment status.
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
  Settings,
  Target,
  Reply,
  Send,
} from 'lucide-react';

// Types
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
  brand_reply?: string;
  brand_reply_at?: string;
  created_at: string;
  creators: Creator;
}

interface Campaign {
  id: string;
  brand_id: string;
  brand_name?: string;
  campaign_name: string;
  phase: 'creator_selection' | 'payment_pending' | 'content_approval' | 'campaign_active' | 'campaign_complete';
  status: string;
  budget: number;
  description: string;
  campaign_objectives?: string[];
  requirements?: string;
  deliverables?: string[];
  target_creators_count?: number;
  created_at: string;
  updated_at: string;
}

const AdminCampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth(); // Admin users use 'user' instead of 'brand'
  const { toast } = useToast();
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [campaignCreators, setCampaignCreators] = useState<CampaignCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isSendingInvites, setIsSendingInvites] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCampaignDetails();
    }
  }, [id]);

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

  const fetchCampaignDetails = async () => {
    try {
      setLoading(true);
      const url = getApiUrl(`api/campaigns/${id}`);
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setCampaign(data.campaign);
        setCampaignCreators(data.creators || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to load campaign details",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching campaign details:', error);
      toast({
        title: "Error",
        description: "Failed to load campaign details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvitations = async () => {
    if (selectedCreators.length === 0) return;
    
    setIsSendingInvites(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/send-invitations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: id,
          creatorIds: selectedCreators,
          adminId: user?.id
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setInvitations(data.invites);
        setIsInviteDialogOpen(true);
        toast({ title: "Invitations Generated", description: `${data.invites.length} links ready to share.` });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate invitations", variant: "destructive" });
    } finally {
      setIsSendingInvites(false);
    }
  };

  const toggleCreatorSelection = (creatorId: string) => {
    setSelectedCreators(prev => 
      prev.includes(creatorId) 
        ? prev.filter(id => id !== creatorId) 
        : [...prev, creatorId]
    );
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
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading campaign details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Campaign Not Found</h2>
          <p className="text-gray-600 mt-2">The campaign you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button 
            onClick={() => navigate('/admin/campaigns')} 
            className="mt-4"
          >
            Back to Campaigns
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/campaigns')}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{campaign.campaign_name}</h1>
            <p className="text-gray-600">Brand: {campaign.brand_name}</p>
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
                <Target className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">{campaign.target_creators_count || 1}</div>
                <div className="text-sm text-gray-600">Target</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Calendar className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">{new Date(campaign.created_at).toLocaleDateString()}</div>
                <div className="text-sm text-gray-600">Created</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Creator Management Section */}
      {campaignCreators.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Creator Management
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
                      ✅ Target reached - Campaign advancing
                    </div>
                  )}
                  {!targetReached && allResponded && (
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      Need {targetCount - approvedCreators} more creators - Recommend more
                    </div>
                  )}
                  {!targetReached && !allResponded && (
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      Waiting for brand responses
                    </div>
                  )}
                </div>
              );
            })()}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-500">{selectedCreators.length} creators selected</p>
                <Button 
                  size="sm" 
                  disabled={selectedCreators.length === 0 || isSendingInvites}
                  onClick={handleSendInvitations}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  {isSendingInvites ? 'Generating...' : 'Generate Invitation Links'}
                </Button>
              </div>

              {campaignCreators.map((campaignCreator) => (
                <div key={campaignCreator.id} className={`border rounded-lg p-4 transition-colors ${selectedCreators.includes(campaignCreator.creator_id) ? 'border-violet-500 bg-violet-50/30' : 'bg-white'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                        checked={selectedCreators.includes(campaignCreator.creator_id)}
                        onChange={() => toggleCreatorSelection(campaignCreator.creator_id)}
                      />
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

                  {/* Admin Notes */}
                  {campaignCreator.admin_notes && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-sm text-blue-800">
                        <strong>Admin Notes:</strong> {campaignCreator.admin_notes}
                      </p>
                    </div>
                  )}

                  {/* Brand Response */}
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
                            Brand {campaignCreator.status === 'approved' ? '✅ Approved' : '❌ Rejected'} this creator
                          </p>
                          <p className={`text-sm ${
                            campaignCreator.status === 'approved' 
                              ? 'text-green-800' 
                              : 'text-red-800'
                          }`}>
                            <strong>Message:</strong> {campaignCreator.brand_response}
                          </p>
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
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm font-medium text-blue-900 mb-2">
                            💬 Brand requested more information
                          </p>
                          <div className="mt-3">
                            <ConversationHistory
                              campaignId={id!}
                              creatorId={campaignCreator.creator_id}
                              creatorName={campaignCreator.creators.name}
                              userType="admin"
                              currentStatus={campaignCreator.status}
                              onStatusUpdate={fetchCampaignDetails}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Show conversation if admin started the conversation (even for approved/rejected) */}
                  {campaignCreator.admin_reply && campaignCreator.status !== 'requested_more' && (
                    <div className="mt-3">
                      <ConversationHistory
                        campaignId={id!}
                        creatorId={campaignCreator.creator_id}
                        creatorName={campaignCreator.creators.name}
                        userType="admin"
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

      {/* Admin Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Admin Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {campaign.phase === 'creator_selection' && (
              <Button
                onClick={() => navigate('/admin/creators')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Users className="h-4 w-4 mr-2" />
                Assign More Creators
              </Button>
            )}
            
            {(campaign.phase === 'content_approval' || campaign.phase === 'campaign_active') && (
              <Button
                onClick={() => navigate(`/admin/campaigns/${id}/links`)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <FileText className="h-4 w-4 mr-2" />
                Manage Post Links
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={() => navigate('/admin/campaigns')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Campaign Management
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Phase Status */}
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
                    <h3 className="text-lg font-semibold mb-2">Awaiting Brand Payment</h3>
                    <p className="text-gray-600 mb-4">
                      The brand is completing payment via Razorpay checkout. Once verified, the campaign will advance to content approval automatically.
                    </p>
                    <p className="text-xs text-gray-500">Manual UPI payment flow removed.</p>
                  </div>
                </div>
              )}
              {campaign.phase === 'content_approval' && (
                <>
                  <FileText className="h-12 w-12 mx-auto mb-4 text-purple-500" />
                  <h3 className="text-lg font-semibold mb-2">Content Review</h3>
                  <p className="text-gray-600">Creators are submitting content for brand approval.</p>
                </>
              )}
              {campaign.phase === 'campaign_active' && (
                <>
                  <Eye className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <h3 className="text-lg font-semibold mb-2">Campaign Live</h3>
                  <p className="text-gray-600">Campaign is currently active and content is being published.</p>
                </>
              )}
              {campaign.phase === 'campaign_complete' && (
                <>
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                  <h3 className="text-lg font-semibold mb-2">Campaign Completed</h3>
                  <p className="text-gray-600">Campaign has been successfully completed.</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invitation Links Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Campaign Invitation Links</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">Copy these messages and send them to creators on Instagram/WhatsApp.</p>
            {invitations.map((invite, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">Creator ID: {invite.creatorId}</span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(invite.teaserText);
                      toast({ title: "Copied!", description: "Message copied to clipboard." });
                    }}
                  >
                    Copy Message
                  </Button>
                </div>
                <div className="p-2 bg-white border rounded text-xs font-mono break-all">
                  {invite.teaserText}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setIsInviteDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCampaignDetail;