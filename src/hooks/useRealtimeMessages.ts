import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface Message {
  id: string;
  campaign_id: string;
  content: string;
  sender_id: string;
  user_email: string;
  user_type: 'admin' | 'brand';
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Hook to subscribe to real-time messages for a campaign
 * @param campaignId - The campaign ID to get messages for
 * @returns Messages array, loading state, and sendMessage function
 */
export function useRealtimeMessages(campaignId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!campaignId) {
      setLoading(false);
      return;
    }

    let channel: RealtimeChannel;

    const setupSubscription = async () => {
      // Initial fetch of messages
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data || []);
      }
      setLoading(false);

      // Subscribe to new messages
      channel = supabase
        .channel(`campaign:${campaignId}:messages`)
        .on('postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `campaign_id=eq.${campaignId}`
          },
          (payload) => {
            console.log('💬 New message received:', payload);
            const newMessage = payload.new as Message;
            
            setMessages(prev => [...prev, newMessage]);
            
            // Play notification sound if message is from someone else
            if (newMessage.sender_id !== user?.id) {
              playNotificationSound();
            }
          }
        )
        .on('postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'messages',
            filter: `campaign_id=eq.${campaignId}`
          },
          (payload) => {
            console.log('💬 Message updated:', payload);
            setMessages(prev =>
              prev.map(msg => msg.id === payload.new.id ? payload.new as Message : msg)
            );
          }
        )
        .subscribe((status) => {
          console.log(`📡 Messages subscription status: ${status}`);
        });
    };

    setupSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [campaignId, user?.id]);

  const sendMessage = async (content: string) => {
    if (!campaignId || !user) {
      throw new Error('Campaign ID and user are required to send messages');
    }

    const isAdmin = user.user_metadata?.role === 'admin' || user.email === 'admin@campayn.local';

    const { data, error } = await supabase
      .from('messages')
      .insert({
        campaign_id: campaignId,
        content,
        sender_id: user.id,
        user_email: user.email || '',
        user_type: isAdmin ? 'admin' : 'brand',
        is_admin: isAdmin,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }

    return data;
  };

  return { messages, loading, sendMessage };
}

function playNotificationSound() {
  try {
    const audio = new Audio('/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.log('Could not play notification sound:', e));
  } catch (e) {
    console.log('Notification sound not available');
  }
}
