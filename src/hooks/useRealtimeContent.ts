import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface ContentItem {
  id: string;
  campaign_id: string;
  creator_id: string;
  content_type: 'reel' | 'post' | 'story' | 'igtv' | 'carousel';
  content_url?: string | null;
  thumbnail_url?: string | null;
  caption?: string;
  scheduled_date?: string;
  posted_date?: string;
  approval_status: 'pending' | 'approved' | 'needs_revision' | 'rejected';
  brand_feedback?: string;
  performance_metrics?: any;
  created_at: string;
  updated_at: string;
}

/**
 * Hook to subscribe to real-time content updates for a campaign
 * @param campaignId - The campaign ID to get content for
 * @returns Contents array and loading state
 */
export function useRealtimeContent(campaignId: string | undefined) {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!campaignId) {
      setLoading(false);
      return;
    }

    let channel: RealtimeChannel;

    const setupSubscription = async () => {
      // Initial fetch of content
      const { data, error } = await supabase
        .from('campaign_contents')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching content:', error);
      } else {
        setContents(data || []);
      }
      setLoading(false);

      // Subscribe to content changes
      channel = supabase
        .channel(`campaign:${campaignId}:contents`)
        .on('postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'campaign_contents',
            filter: `campaign_id=eq.${campaignId}`
          },
          (payload) => {
            console.log('📸 New content added:', payload);
            setContents(prev => [payload.new as ContentItem, ...prev]);
          }
        )
        .on('postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'campaign_contents',
            filter: `campaign_id=eq.${campaignId}`
          },
          (payload) => {
            console.log('📸 Content updated:', payload);
            setContents(prev =>
              prev.map(c => c.id === payload.new.id ? payload.new as ContentItem : c)
            );
          }
        )
        .on('postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'campaign_contents',
            filter: `campaign_id=eq.${campaignId}`
          },
          (payload) => {
            console.log('📸 Content deleted:', payload);
            setContents(prev => prev.filter(c => c.id !== payload.old.id));
          }
        )
        .subscribe((status) => {
          console.log(`📡 Content subscription status: ${status}`);
        });
    };

    setupSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [campaignId]);

  return { contents, loading };
}
