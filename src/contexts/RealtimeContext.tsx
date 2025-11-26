import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { RealtimeChannel } from '@supabase/supabase-js';

interface RealtimeContextType {
  isConnected: boolean;
  subscribeToChannel: (channelName: string, callback: (payload: any) => void) => RealtimeChannel | null;
  unsubscribeFromChannel: (channel: RealtimeChannel) => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const useRealtimeContext = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtimeContext must be used within RealtimeProvider');
  }
  return context;
};

interface RealtimeProviderProps {
  children: ReactNode;
}

export const RealtimeProvider: React.FC<RealtimeProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(true);
  const [channels, setChannels] = useState<Map<string, RealtimeChannel>>(new Map());

  useEffect(() => {
    if (!user) return;

    // Optional: Set up presence channel to track online users
    const presenceChannel = supabase.channel('online_users', {
      config: { presence: { key: user.id } }
    });

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        // Presence synced
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            user_id: user.id,
            email: user.email,
            role: user.user_metadata?.role || 'brand',
            online_at: new Date().toISOString()
          });
        }
      });

    return () => {
      presenceChannel.unsubscribe();
    };
  }, [user]);

  const subscribeToChannel = (channelName: string, callback: (payload: any) => void): RealtimeChannel | null => {
    if (!user) return null;

    // Check if channel already exists
    if (channels.has(channelName)) {
      return channels.get(channelName)!;
    }

    const channel = supabase.channel(channelName);
    setChannels(prev => new Map(prev).set(channelName, channel));
    
    return channel;
  };

  const unsubscribeFromChannel = (channel: RealtimeChannel) => {
    if (channel) {
      channel.unsubscribe();
      setChannels(prev => {
        const newMap = new Map(prev);
        // Find and remove the channel
        for (const [key, value] of newMap.entries()) {
          if (value === channel) {
            newMap.delete(key);
            break;
          }
        }
        return newMap;
      });
    }
  };

  // Cleanup all channels on unmount
  useEffect(() => {
    return () => {
      channels.forEach(channel => channel.unsubscribe());
    };
  }, []);

  return (
    <RealtimeContext.Provider value={{ isConnected, subscribeToChannel, unsubscribeFromChannel }}>
      {children}
    </RealtimeContext.Provider>
  );
};
