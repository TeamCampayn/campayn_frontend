import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import QuotationChat from './QuotationChat';
import { supabase } from '@/lib/supabase';
import { getApiUrl } from '@/lib/api';

const CONTENT_BUCKET = (import.meta as any)?.env?.VITE_CONTENT_BUCKET || 'campaign-contents';
const MAX_UPLOAD_MB = Number((import.meta as any)?.env?.VITE_MAX_UPLOAD_MB) || 50; // Supabase free tier default

type UserType = 'admin' | 'brand';

interface Creator {
  id: string;
  name: string;
  ig_handle: string;
}

interface ContentItem {
  id: string;
  campaign_id: string;
  creator_id: string;
  content_type: 'reel' | 'post' | 'story' | 'igtv' | 'carousel';
  content_url?: string | null;
  thumbnail_url?: string | null;
  caption?: string | null;
  hashtags?: string[] | null;
  scheduled_post_time?: string | null;
  approval_status: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  brand_feedback?: string | null;
  revision_count?: number | null;
  created_at: string;
  post_url?: string | null;
  posted_at?: string | null;
  performance_metrics?: {
    likes?: number;
    comments?: number;
    views?: number;
    engagement_rate?: number;
  } | null;
  creators?: Creator;
}

interface CampaignDetailsResponse {
  success: boolean;
  campaign: {
    id: string;
    campaign_name: string;
    phase: string;
    brand_id: string;
  };
  creators: Array<{
    creator_id: string;
    status: string;
    creators: Creator;
  }>;
  contents: ContentItem[];
  applications?: any[];
}

interface ContentReviewProps {
  campaignId?: string; // optional when used inside routes with :id
  userType: UserType;
}

const ContentReview: React.FC<ContentReviewProps> = ({ campaignId, userType }) => {
  const { id, campaignId: routeCampaignId } = useParams<{ id: string; campaignId: string }>();
  const resolvedCampaignId = campaignId || id || routeCampaignId;
  const { toast } = useToast();
  const { brand, user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [campaignName, setCampaignName] = useState('');
  const [campaignPhase, setCampaignPhase] = useState('');
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [finalizeRequestedAt, setFinalizeRequestedAt] = useState<string | null>(null);
  const [finalizeConfirmedAt, setFinalizeConfirmedAt] = useState<string | null>(null);
  const [applications, setApplications] = useState<any[]>([]);

  // Admin upload form state
  const [selectedCreatorId, setSelectedCreatorId] = useState('');
  const [contentType, setContentType] = useState<'reel' | 'post' | 'story' | 'igtv' | 'carousel'>('reel');
  const [contentFile, setContentFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');

  const canUpload = userType === 'admin';
  const brandId = brand?.id;

  const approvedCreators = useMemo(() => creators, [creators]);

  const fetchCampaign = async () => {
    if (!resolvedCampaignId) return;
    setLoading(true);
    try {
  const res = await fetch(getApiUrl(`api/campaigns/${resolvedCampaignId}`));
      const data: CampaignDetailsResponse = await res.json();
      if (!data?.success) throw new Error('Failed to load campaign');
      setCampaignName(data.campaign.campaign_name);
      setCampaignPhase(data.campaign.phase);
      setContents(data.contents || []);
      setApplications(data.applications || []);
      // Only allow approved creators when available, else list all creator entries
      const uniqueCreators: Record<string, Creator> = {};
      (data.creators || [])
        .filter((cc) => cc.status === 'approved' || userType === 'admin')
        .forEach((cc) => {
          if (cc.creators) uniqueCreators[cc.creators.id] = cc.creators;
        });
      setCreators(Object.values(uniqueCreators));
    } catch (e: any) {
      toast({ title: 'Failed to load content review', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const fetchFinalizeStatus = async () => {
    if (!resolvedCampaignId) return;
    try {
      const res = await fetch(getApiUrl(`api/campaigns/${resolvedCampaignId}/finalize-status`));
      const data = await res.json();
      if (data?.success) {
        setFinalizeRequestedAt(data.finalize_requested_at || null);
        setFinalizeConfirmedAt(data.finalize_confirmed_at || null);
      }
    } catch {}
  };

  useEffect(() => {
    fetchCampaign();
    fetchFinalizeStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedCampaignId]);

  // Realtime updates

  // Helper to upload a file to Supabase Storage and return a public URL (or signed URL fallback)
  const uploadToStorage = async (file: File, folder: string) => {
    const ext = file.name.split('.').pop() || 'bin';
    const ts = Date.now();
    const path = `${resolvedCampaignId}/${selectedCreatorId}/${folder}/${ts}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from(CONTENT_BUCKET)
      .upload(path, file, { cacheControl: '3600', upsert: true, contentType: file.type });
    if (upErr) {
      // Provide a clearer hint when bucket is missing
      const hint = upErr.message?.toLowerCase().includes('not found')
        ? `Storage bucket "${CONTENT_BUCKET}" not found. Create it in Supabase Storage and set public read or signed URL access.`
        : upErr.message;
      throw new Error(`Upload failed: ${hint}`);
    }

    // Try public URL first
  const { data: pub } = supabase.storage.from(CONTENT_BUCKET).getPublicUrl(path);
    if (pub?.publicUrl) return pub.publicUrl;

    // Fallback to signed URL for 1 year
    const { data: signed, error: signErr } = await supabase.storage
      .from(CONTENT_BUCKET)
      .createSignedUrl(path, 60 * 60 * 24 * 365);
    if (signErr || !signed?.signedUrl) throw new Error('Could not create URL for uploaded file');
    return signed.signedUrl;
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvedCampaignId) return;
    if (!user?.id) {
      toast({ title: 'Not authenticated', description: 'Please sign in again to upload content.', variant: 'destructive' });
      return;
    }
    if (!selectedCreatorId) {
      toast({ title: 'Select a creator', description: 'Please choose a creator to attach content.', variant: 'destructive' });
      return;
    }
    // Validate file selection
    const isVideoType = contentType === 'reel' || contentType === 'igtv';
    if (!contentFile) {
      toast({ title: 'Select a file', description: `Please choose a ${isVideoType ? 'video' : 'photo'} file to upload.`, variant: 'destructive' });
      return;
    }

    // Optional: file type validation
    const isVideo = contentFile.type.startsWith('video/');
    const isImage = contentFile.type.startsWith('image/');
    if (isVideoType && !isVideo) {
      toast({ title: 'Invalid file type', description: 'Please upload a video file for reels/IGTV.', variant: 'destructive' });
      return;
    }
    if (!isVideoType && !isImage) {
      toast({ title: 'Invalid file type', description: 'Please upload an image for post/story/carousel.', variant: 'destructive' });
      return;
    }

    // File size guard (avoid 400 from storage payload too large)
    const sizeMB = contentFile.size / (1024 * 1024);
    if (sizeMB > MAX_UPLOAD_MB) {
      toast({
        title: 'File too large',
        description: `Max upload size is ${MAX_UPLOAD_MB}MB. Your file is ${sizeMB.toFixed(1)}MB. Please compress and try again.`,
        variant: 'destructive'
      });
      return;
    }

    setUploading(true);
    try {
      // 1) Upload primary content
      const uploadedContentUrl = await uploadToStorage(contentFile, 'content');

      // 2) Upload optional thumbnail for videos if provided
      let uploadedThumbUrl: string | null = null;
      if (thumbFile) {
        if (!thumbFile.type.startsWith('image/')) {
          throw new Error('Thumbnail must be an image file');
        }
        uploadedThumbUrl = await uploadToStorage(thumbFile, 'thumb');
      }

      // Coerce creator id to number if it looks numeric (DB expects BIGINT)
      const creatorIdPayload: any = /^\d+$/.test(String(selectedCreatorId))
        ? Number(selectedCreatorId)
        : selectedCreatorId;

      const payload = {
        creator_id: creatorIdPayload,
        content_type: contentType,
        content_url: uploadedContentUrl,
        thumbnail_url: uploadedThumbUrl,
        caption: caption || null,
        hashtags: hashtags ? hashtags.split(',').map(h => h.trim()).filter(Boolean) : null,
        uploaded_by: user.id,
        scheduled_post_time: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      };
      const url = getApiUrl(`api/campaigns/${resolvedCampaignId}/contents`);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      let data: any = {};
      try { data = await res.json(); } catch {}
      if (!res.ok || !data?.success) {
        const details = data?.details || data?.error || `HTTP ${res.status}`;
        throw new Error(details);
      }
      toast({ title: 'Content uploaded', description: `${contentType} sent for review.` });
      // Reset
      setContentFile(null);
      setThumbFile(null);
      setCaption('');
      setHashtags('');
      setScheduledAt('');
      fetchCampaign();
    } catch (e: any) {
      toast({ title: 'Upload failed', description: e.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const [actionBusyId, setActionBusyId] = useState<string | null>(null);
  const handleReview = async (contentId: string, status: 'approved' | 'rejected' | 'needs_revision', feedback: string) => {
    if (!resolvedCampaignId) return;
    if (!brandId) {
      toast({ title: 'Missing brand context', description: 'Please re-login.', variant: 'destructive' });
      return;
    }
    setActionBusyId(contentId);
    try {
      const url = getApiUrl(`api/campaigns/${resolvedCampaignId}/contents/${contentId}/approve`);
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approval_status: status, brand_feedback: feedback || null, brand_id: brandId }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.error || 'Action failed');
      toast({ title: `Content ${status}`, description: data?.message || 'Review recorded.' });
      fetchCampaign();
    } catch (e: any) {
      toast({ title: 'Failed to update', description: e.message, variant: 'destructive' });
    } finally {
      setActionBusyId(null);
    }
  };

  // Finalize actions
  const [finalizeBusy, setFinalizeBusy] = useState(false);
  const handleFinalizeRequest = async () => {
    if (!resolvedCampaignId || !user?.id) return;
    setFinalizeBusy(true);
    try {
      const url = getApiUrl(`api/campaigns/${resolvedCampaignId}/finalize-request`);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_id: user.id }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.error || 'Failed to request finalize');
      toast({ title: 'Finalize requested', description: 'Waiting for brand confirmation.' });
      fetchFinalizeStatus();
    } catch (e: any) {
      toast({ title: 'Failed to request finalize', description: e.message, variant: 'destructive' });
    } finally {
      setFinalizeBusy(false);
    }
  };

  const handleFinalizeConfirm = async () => {
    if (!resolvedCampaignId || !brandId) return;
    setFinalizeBusy(true);
    try {
      const url = getApiUrl(`api/campaigns/${resolvedCampaignId}/finalize-confirm`);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand_id: brandId }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.error || 'Failed to confirm');
      toast({ title: 'Campaign activated', description: 'Campaign moved to active phase.' });
      fetchCampaign();
      fetchFinalizeStatus();
    } catch (e: any) {
      toast({ title: 'Failed to confirm', description: e.message, variant: 'destructive' });
    } finally {
      setFinalizeBusy(false);
    }
  };

  const formatDateTime = (iso?: string | null) => {
    if (!iso) return '-';
    try { return new Date(iso).toLocaleString(); } catch { return iso || '-'; }
  };

  if (!resolvedCampaignId) {
    return (
      <div className="p-6 font-space uppercase tracking-wider text-xs text-red-600">
        Invalid campaign id.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-4">
        <div className="animate-pulse h-6 w-48 bg-zinc-200 rounded-lg mb-4" />
        <div className="animate-pulse h-4 w-96 bg-zinc-150 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-space tracking-tight text-neutral-900 uppercase">Content Review</h1>
          <p className="text-xs font-space uppercase tracking-wider text-zinc-500 mt-1">
            Campaign: {campaignName} · Phase: <span className="text-neutral-900 font-bold">{campaignPhase.replace('_', ' ')}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {userType === 'admin' && campaignPhase === 'content_approval' && (
            <button
              className="btn-primary-pill text-xs py-2 px-5 h-9 flex items-center"
              onClick={handleFinalizeRequest}
              disabled={finalizeBusy || !!finalizeRequestedAt}
            >
              {finalizeRequestedAt ? 'Finalize requested' : 'Request finalization'}
            </button>
          )}
          {userType === 'brand' && campaignPhase === 'content_approval' && finalizeRequestedAt && !finalizeConfirmedAt && (
            <button
              className="btn-primary-pill text-xs py-2 px-5 h-9 flex items-center"
              onClick={handleFinalizeConfirm}
              disabled={finalizeBusy}
            >
              Confirm finalization
            </button>
          )}
          {userType === 'brand' && (
            <button
              className="btn-secondary-pill text-xs py-2 px-5 h-9 flex items-center"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          )}
          <button
            className="btn-secondary-pill text-xs py-2 px-5 h-9 flex items-center"
            onClick={() => setShowChat(v => !v)}
          >
            {showChat ? 'Hide Chat' : 'Open Chat'}
          </button>
        </div>
      </div>

      {(finalizeRequestedAt || finalizeConfirmedAt) && (
        <div className="bg-zinc-50 border border-zinc-200 text-neutral-800 px-4 py-3 rounded-2xl flex items-center gap-2 text-[10px] font-space uppercase tracking-wider">
          <AlertCircle className="h-4 w-4 text-black flex-shrink-0" />
          <span>
            {finalizeConfirmedAt
              ? `Finalization confirmed on ${new Date(finalizeConfirmedAt).toLocaleString()}`
              : `Finalization requested on ${new Date(finalizeRequestedAt as string).toLocaleString()} (awaiting brand confirmation)`}
          </span>
        </div>
      )}

      {canUpload && (
        <Card className="bg-white border border-zinc-200 shadow-none rounded-2xl overflow-hidden">
          <CardHeader className="pb-3 border-b border-zinc-150">
            <CardTitle className="text-xs font-bold font-space uppercase tracking-wider text-neutral-800">
              Attach Content for Review
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[9px] font-bold font-space uppercase tracking-wider text-zinc-500">Creator</label>
                <select
                  className="w-full bg-transparent border border-zinc-200 focus:border-zinc-950 rounded-xl px-3.5 py-2.5 text-xs font-space uppercase tracking-wider outline-none transition-colors"
                  value={selectedCreatorId}
                  onChange={(e) => setSelectedCreatorId(e.target.value)}
                  required
                >
                  <option value="">Select creator</option>
                  {approvedCreators.map(cr => (
                    <option key={cr.id} value={cr.id}>{cr.name} (@{cr.ig_handle})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[9px] font-bold font-space uppercase tracking-wider text-zinc-500">Content type</label>
                <select 
                  className="w-full bg-transparent border border-zinc-200 focus:border-zinc-950 rounded-xl px-3.5 py-2.5 text-xs font-space uppercase tracking-wider outline-none transition-colors" 
                  value={contentType} 
                  onChange={(e) => setContentType(e.target.value as any)}
                >
                  <option value="reel">Reel</option>
                  <option value="post">Post</option>
                  <option value="story">Story</option>
                  <option value="igtv">IGTV</option>
                  <option value="carousel">Carousel</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[9px] font-bold font-space uppercase tracking-wider text-zinc-500">Upload {contentType === 'reel' || contentType === 'igtv' ? 'video' : 'image'}</label>
                <input
                  className="w-full bg-transparent border border-zinc-200 focus:border-zinc-950 rounded-xl px-3.5 py-2 text-xs font-space uppercase tracking-wider outline-none transition-colors file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200"
                  type="file"
                  accept={contentType === 'reel' || contentType === 'igtv' ? 'video/*' : 'image/*'}
                  onChange={(e) => setContentFile(e.target.files?.[0] || null)}
                  required
                />
                <p className="text-[9px] text-zinc-400 font-space uppercase tracking-wider">Max 100MB. Supported: {contentType === 'reel' || contentType === 'igtv' ? 'MP4, MOV' : 'JPG, PNG, WEBP'}.</p>
              </div>
              {(contentType === 'reel' || contentType === 'igtv') && (
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-bold font-space uppercase tracking-wider text-zinc-500">Optional thumbnail (image)</label>
                  <input
                    className="w-full bg-transparent border border-zinc-200 focus:border-zinc-950 rounded-xl px-3.5 py-2 text-xs font-space uppercase tracking-wider outline-none transition-colors file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbFile(e.target.files?.[0] || null)}
                  />
                </div>
              )}
              <div className="md:col-span-2 space-y-1.5">
                <label className="block text-[9px] font-bold font-space uppercase tracking-wider text-zinc-500">Caption</label>
                <textarea 
                  className="w-full bg-transparent border border-zinc-200 focus:border-zinc-950 rounded-xl px-3.5 py-2.5 text-xs font-space uppercase tracking-wider outline-none transition-colors resize-none" 
                  rows={3} 
                  placeholder="Optional caption..." 
                  value={caption} 
                  onChange={(e) => setCaption(e.target.value)} 
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[9px] font-bold font-space uppercase tracking-wider text-zinc-500">Hashtags (comma separated)</label>
                <input 
                  className="w-full bg-transparent border border-zinc-200 focus:border-zinc-950 rounded-xl px-3.5 py-2.5 text-xs font-space uppercase tracking-wider outline-none transition-colors" 
                  placeholder="E.g., brand, launch" 
                  value={hashtags} 
                  onChange={(e) => setHashtags(e.target.value)} 
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[9px] font-bold font-space uppercase tracking-wider text-zinc-500">Schedule (optional)</label>
                <input 
                  type="datetime-local" 
                  className="w-full bg-transparent border border-zinc-200 focus:border-zinc-950 rounded-xl px-3.5 py-2.5 text-xs font-space uppercase tracking-wider outline-none transition-colors text-zinc-600" 
                  value={scheduledAt} 
                  onChange={(e) => setScheduledAt(e.target.value)} 
                />
              </div>
              <div className="md:col-span-2 pt-2">
                <button 
                  type="submit" 
                  disabled={uploading} 
                  className="btn-primary-pill text-xs py-2.5 px-6 h-10 w-full md:w-auto"
                >
                  {uploading ? 'Uploading...' : 'Send for review'}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="bg-white border border-zinc-200 shadow-none rounded-2xl overflow-hidden">
        <CardHeader className="pb-3 border-b border-zinc-150">
          <CardTitle className="text-xs font-bold font-space uppercase tracking-wider text-neutral-800">
            Submitted Content
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {contents.length === 0 ? (
            <div className="text-[10px] font-space uppercase tracking-wider text-zinc-400 py-4">
              No content submitted yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contents.map((c) => (
                <ContentCard
                  key={c.id}
                  item={c}
                  onReview={handleReview}
                  busy={actionBusyId === c.id}
                  userType={userType}
                  formatDateTime={formatDateTime}
                  campaignId={resolvedCampaignId}
                  onPosted={() => fetchCampaign()}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live Published Content (Direct from Creator App submissions) */}
      {applications.filter(app => app.post_url).length > 0 && (
        <Card className="bg-white border border-zinc-200 shadow-none rounded-2xl overflow-hidden">
          <CardHeader className="pb-3 border-b border-zinc-150 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold font-space uppercase tracking-wider text-neutral-800">
              Live Published Content
            </CardTitle>
            <span className="text-[9px] font-bold font-space uppercase tracking-wider bg-zinc-950 text-white px-2.5 py-1 rounded-full">
              Active Monitoring
            </span>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications.filter(app => app.post_url).map((app) => (
                <div key={app.id} className="border border-zinc-200 rounded-2xl p-4 space-y-4 bg-zinc-50/50 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-bold font-space uppercase tracking-wider text-neutral-900">
                        {app.creator?.name || 'Creator'}
                      </div>
                      <a 
                        href={`https://instagram.com/${app.creator?.ig_handle || ''}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[9px] font-bold font-space uppercase tracking-wider text-neutral-900 underline hover:no-underline"
                      >
                        @{app.creator?.ig_handle || 'instagram'}
                      </a>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-space uppercase tracking-wider text-zinc-500">
                        <span className="font-bold text-neutral-800">Views:</span> {app.verified_views?.toLocaleString() || 0}
                      </div>
                      <div className="text-[10px] font-space uppercase tracking-wider text-zinc-500">
                        <span className="font-bold text-neutral-800">Posted at:</span> {formatDateTime(app.posted_at)}
                      </div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <a 
                      href={app.post_url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn-primary-pill w-full text-[10px] py-2 h-8 flex items-center justify-center"
                    >
                      Watch Instagram Reel ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {showChat && (
        <Card className="bg-white border border-zinc-200 shadow-none rounded-2xl overflow-hidden">
          <CardHeader className="pb-3 border-b border-zinc-150">
            <CardTitle className="text-xs font-bold font-space uppercase tracking-wider text-neutral-800">
              Campaign Chat
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <QuotationChat campaignId={resolvedCampaignId} campaignName={campaignName} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const statusColors: Record<ContentItem['approval_status'], string> = {
  pending: 'bg-zinc-100 text-zinc-700 border-zinc-200',
  approved: 'bg-zinc-950 text-white border-zinc-950',
  rejected: 'bg-zinc-50 text-zinc-400 border-zinc-200 line-through',
  needs_revision: 'bg-zinc-50 text-zinc-650 border-zinc-200 underline decoration-dotted decoration-zinc-400',
};

const ContentCard: React.FC<{
  item: ContentItem;
  userType: UserType;
  busy: boolean;
  onReview: (id: string, status: 'approved' | 'rejected' | 'needs_revision', feedback: string) => void;
  formatDateTime: (iso?: string | null) => string;
  campaignId: string;
  onPosted: () => void;
}> = ({ item, userType, busy, onReview, formatDateTime, campaignId, onPosted }) => {
  const [feedback, setFeedback] = useState('');
  const [postUrl, setPostUrl] = useState('');
  const [metrics, setMetrics] = useState(() => ({
    likes: item.performance_metrics?.likes || 0,
    comments: item.performance_metrics?.comments || 0,
    views: item.performance_metrics?.views || 0,
    engagement_rate: item.performance_metrics?.engagement_rate || 0,
  }));
  const [posting, setPosting] = useState(false);
  const [savingMetrics, setSavingMetrics] = useState(false);

  useEffect(() => {
    if (item.brand_feedback) setFeedback(item.brand_feedback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  const previewThumb = item.thumbnail_url || (item.content_url?.includes('mp4') ? undefined : item.content_url) || undefined;
  const isVideo = !!item.content_url && (item.content_url.endsWith('.mp4') || item.content_type === 'reel' || item.content_type === 'igtv');

  return (
    <div className="border border-zinc-200 rounded-2xl overflow-hidden flex flex-col justify-between bg-white">
      <div>
        {previewThumb && (
          <div className="aspect-video bg-zinc-50 overflow-hidden border-b border-zinc-150">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewThumb} alt={item.caption || 'thumbnail'} className="w-full h-full object-cover" />
          </div>
        )}
        {!previewThumb && isVideo && item.content_url && (
          <div className="aspect-video bg-black overflow-hidden border-b border-zinc-150">
            <video src={item.content_url} className="w-full h-full" controls />
          </div>
        )}
        <div className="p-4 space-y-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="text-[10px] font-bold font-space uppercase tracking-wider text-neutral-800 truncate">
              {item.creators?.name || 'Creator'} 
              <span className="block text-[9px] font-normal text-zinc-500 font-sans lowercase">
                @{item.creators?.ig_handle}
              </span>
            </div>
            <span className={`text-[9px] font-bold font-space uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusColors[item.approval_status]}`}>
              {item.approval_status.replace('_', ' ')}
            </span>
          </div>

          <div className="space-y-1.5 text-[10px] font-space uppercase tracking-wider text-zinc-500">
            <div>
              <span className="font-bold text-neutral-800">Type:</span> {item.content_type}
            </div>
            {item.caption && (
              <div className="text-neutral-750 line-clamp-2 mt-0.5 normal-case font-sans">
                <span className="font-bold font-space uppercase text-[10px] text-neutral-800 mr-1">Caption:</span> 
                {item.caption}
              </div>
            )}
            {item.hashtags && item.hashtags.length > 0 && (
              <div className="text-[9px] font-bold text-zinc-400 font-sans lowercase">
                {item.hashtags.map(h => `#${h}`).join(' ')}
              </div>
            )}
            <div className="pt-1.5 flex flex-wrap gap-3">
              {item.content_url && (
                <a 
                  href={item.content_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-neutral-900 font-bold underline hover:no-underline"
                >
                  Open Content ↗
                </a>
              )}
              {item.post_url && (
                <a 
                  href={item.post_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-neutral-900 font-bold underline hover:no-underline"
                >
                  Live Instagram Link ↗
                </a>
              )}
            </div>
            <div className="text-[9px] text-zinc-400 pt-1">Submitted: {formatDateTime(item.created_at)}</div>
            {item.posted_at && <div className="text-[9px] text-zinc-400">Posted: {formatDateTime(item.posted_at)}</div>}
          </div>

          {userType === 'brand' && (
            <div className="pt-2 border-t border-zinc-150 space-y-3">
              <textarea
                className="w-full bg-transparent border border-zinc-200 focus:border-zinc-950 rounded-xl px-3 py-2 text-[10px] font-sans outline-none transition-colors resize-none"
                rows={2}
                placeholder="Optional feedback (required for reject/revision)"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <div className="grid grid-cols-3 gap-2">
                <button
                  disabled={busy}
                  onClick={() => onReview(item.id, 'approved', feedback)}
                  className="btn-primary-pill text-[9px] py-1.5 px-2 h-8 flex items-center justify-center"
                >
                  Approve
                </button>
                <button
                  disabled={busy || !feedback.trim()}
                  onClick={() => onReview(item.id, 'needs_revision', feedback)}
                  className="btn-secondary-pill text-[9px] py-1.5 px-2 h-8 flex items-center justify-center"
                >
                  Revision
                </button>
                <button
                  disabled={busy || !feedback.trim()}
                  onClick={() => onReview(item.id, 'rejected', feedback)}
                  className="btn-secondary-pill text-[9px] py-1.5 px-2 h-8 flex items-center justify-center border-zinc-200 hover:bg-neutral-50"
                >
                  Reject
                </button>
              </div>
            </div>
          )}

          {userType === 'admin' && item.brand_feedback && (
            <div className="mt-2 bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-[10px] font-space uppercase tracking-wider">
              <div className="text-neutral-800 font-bold">Brand Feedback</div>
              <div className="text-zinc-500 mt-1 normal-case font-sans">{item.brand_feedback}</div>
            </div>
          )}

          {/* Admin: Add live link once approved */}
          {userType === 'admin' && item.approval_status === 'approved' && !item.post_url && (
            <div className="mt-3 border-t border-zinc-150 pt-3 space-y-2">
              <div className="text-[9px] font-bold font-space uppercase tracking-wider text-neutral-800">Add live post link</div>
              <div className="flex gap-2">
                <input
                  className="flex-1 bg-transparent border border-zinc-200 focus:border-zinc-950 rounded-xl px-3 py-1.5 text-xs font-sans outline-none transition-colors"
                  placeholder="https://instagram.com/p/..."
                  value={postUrl}
                  onChange={(e) => setPostUrl(e.target.value)}
                />
                <button
                  disabled={posting || !postUrl.trim()}
                  className="btn-primary-pill text-[10px] py-1.5 px-4 h-8 flex items-center justify-center"
                  onClick={async () => {
                    try {
                      setPosting(true);
                      const url = getApiUrl(`api/campaigns/${campaignId}/contents/${item.id}/post`);
                      const res = await fetch(url, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ post_url: postUrl })
                      });
                      const data = await res.json();
                      if (!res.ok || !data?.success) throw new Error(data?.error || 'Failed to save link');
                      onPosted();
                    } catch (e: any) {
                      // eslint-disable-next-line no-alert
                      alert(e.message);
                    } finally {
                      setPosting(false);
                    }
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Metrics display/update */}
          {(item.performance_metrics || userType === 'admin') && (
            <div className="mt-3 border-t border-zinc-150 pt-3 text-[10px] font-space uppercase tracking-wider">
              <div className="font-bold text-neutral-800 mb-2">Performance</div>
              {userType === 'admin' ? (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      className="bg-transparent border border-zinc-200 focus:border-zinc-950 rounded-xl px-2.5 py-1.5 text-xs font-sans outline-none transition-colors" 
                      type="number" 
                      min={0} 
                      value={metrics.likes}
                      onChange={(e) => setMetrics(m => ({ ...m, likes: Number(e.target.value) }))} 
                      placeholder="Likes" 
                    />
                    <input 
                      className="bg-transparent border border-zinc-200 focus:border-zinc-950 rounded-xl px-2.5 py-1.5 text-xs font-sans outline-none transition-colors" 
                      type="number" 
                      min={0} 
                      value={metrics.comments}
                      onChange={(e) => setMetrics(m => ({ ...m, comments: Number(e.target.value) }))} 
                      placeholder="Comments" 
                    />
                    <input 
                      className="bg-transparent border border-zinc-200 focus:border-zinc-950 rounded-xl px-2.5 py-1.5 text-xs font-sans outline-none transition-colors" 
                      type="number" 
                      min={0} 
                      value={metrics.views}
                      onChange={(e) => setMetrics(m => ({ ...m, views: Number(e.target.value) }))} 
                      placeholder="Views" 
                    />
                    <input 
                      className="bg-transparent border border-zinc-200 focus:border-zinc-950 rounded-xl px-2.5 py-1.5 text-xs font-sans outline-none transition-colors" 
                      type="number" 
                      min={0} 
                      step="0.01" 
                      value={metrics.engagement_rate}
                      onChange={(e) => setMetrics(m => ({ ...m, engagement_rate: Number(e.target.value) }))} 
                      placeholder="Engagement %" 
                    />
                  </div>
                  <div>
                    <button
                      disabled={savingMetrics}
                      className="btn-primary-pill w-full text-[10px] py-1.5 h-8 flex items-center justify-center"
                      onClick={async () => {
                        try {
                          setSavingMetrics(true);
                          const url = getApiUrl(`api/campaigns/${campaignId}/contents/${item.id}/metrics`);
                          const res = await fetch(url, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ performance_metrics: metrics })
                          });
                          const data = await res.json();
                          if (!res.ok || !data?.success) throw new Error(data?.error || 'Failed to save metrics');
                          onPosted();
                        } catch (e: any) {
                          alert(e.message);
                        } finally {
                          setSavingMetrics(false);
                        }
                      }}
                    >
                      Save Metrics
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 text-[10px] font-space uppercase tracking-wider text-zinc-500 bg-zinc-50 border border-zinc-150 rounded-xl p-2.5">
                  <div>
                    <span className="font-bold text-neutral-800">Likes:</span> {item.performance_metrics?.likes ?? '-'}
                  </div>
                  <div>
                    <span className="font-bold text-neutral-800">Comments:</span> {item.performance_metrics?.comments ?? '-'}
                  </div>
                  <div>
                    <span className="font-bold text-neutral-800">Views:</span> {item.performance_metrics?.views ?? '-'}
                  </div>
                  <div>
                    <span className="font-bold text-neutral-800">Engagement:</span> {item.performance_metrics?.engagement_rate ?? '-'}%
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentReview;
