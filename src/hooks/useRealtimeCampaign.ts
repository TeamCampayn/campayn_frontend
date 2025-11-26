import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

interface CampaignUpdate {
  id: string;
  phase: string;
  payment_status: string;
  status: string;
  updated_at: string;
  [key: string]: any;
}

/**
 * Hook to subscribe to real-time campaign updates
 * @param campaignId - The campaign ID to subscribe to
 * @returns Campaign data and loading state
 */
export function useRealtimeCampaign(campaignId: string | undefined) {
  const [campaign, setCampaign] = useState<CampaignUpdate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!campaignId) {
      setLoading(false);
      return;
    }

    let channel: RealtimeChannel;

    const setupSubscription = async () => {
      // Initial fetch
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (error) {
        console.error('Error fetching campaign:', error);
      } else {
        setCampaign(data);
      }
      setLoading(false);

      // Subscribe to real-time updates
      channel = supabase
        .channel(`campaign:${campaignId}`)
        .on('postgres_changes',
          {
            event: '*', // Listen to INSERT, UPDATE, DELETE
            schema: 'public',
            table: 'campaigns',
            filter: `id=eq.${campaignId}`
          },
          (payload) => {
            if (payload.eventType === 'UPDATE') {
              setCampaign(payload.new as CampaignUpdate);
            } else if (payload.eventType === 'DELETE') {
              setCampaign(null);
            }
          }
        )
        .subscribe();
    };

    setupSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [campaignId]);

  return { campaign, loading };
}
