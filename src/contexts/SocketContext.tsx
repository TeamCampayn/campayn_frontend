import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinRoom: (campaignId: string) => void;
  leaveRoom: () => void;
  sendMessage: (message: string, messageType?: string) => void;
  sendTyping: (isTyping: boolean) => void;
  currentRoom: string | null;
  roomUsers: any[];
  messages: any[];
  typingUsers: any[];
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { user, brand } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [roomUsers, setRoomUsers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<any[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    // Don't reinitialize if socket already exists and is connected
    if (socket && socket.connected) {
      console.log('Socket already connected, skipping reinitialization');
      return;
    }

    // Initialize socket connection
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';
    console.log('Connecting to socket server at:', socketUrl);
    
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: false, // Reuse existing connections when possible
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setIsConnected(true);
      
      // Auto-rejoin room if we were in one before disconnect
      if (currentRoom && user && brand) {
        console.log('Auto-rejoining room:', currentRoom);
        const userType = user.user_metadata?.is_admin ? 'admin' : 'brand';
        const userName = brand.brand_name || user.email || 'Unknown User';
        
        newSocket.emit('join_room', {
          campaignId: currentRoom,
          userId: user.id,
          userType,
          userName
        });
      }

      // Join brand room for payment updates when connected
      if (brand?.id) {
        try {
          newSocket.emit('join_brand_room', brand.id);
        } catch (e) {
          console.warn('Failed to join brand room:', (e as any)?.message);
        }
      }
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
      
      // Don't clear room data on temporary disconnects
      if (reason === 'io server disconnect' || reason === 'io client disconnect') {
        // Clear everything on intentional disconnects
        setCurrentRoom(null);
        setRoomUsers([]);
        setMessages([]);
        setTypingUsers([]);
      } else {
        // Keep room data for automatic reconnections
        console.log('Keeping room data for reconnection');
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    // Room events
    newSocket.on('room_joined', (data) => {
      console.log('Joined room:', data);
      setCurrentRoom(data.campaignId);
      setRoomUsers(data.roomUsers || []);
      setMessages(data.recentMessages || []);
    });

    newSocket.on('user_joined', (data) => {
      console.log('User joined:', data);
      setRoomUsers(prev => {
        const exists = prev.find(user => user.userId === data.userId);
        if (!exists) {
          return [...prev, { userId: data.userId, userType: data.userType, userName: data.userName }];
        }
        return prev;
      });
    });

    newSocket.on('user_left', (data) => {
      console.log('User left:', data);
      setRoomUsers(prev => prev.filter(user => user.userId !== data.userId));
    });

    // Message events
    newSocket.on('new_message', (message) => {
      console.log('New message:', message);
      setMessages(prev => [...prev, message]);
    });

    // Typing events
    newSocket.on('user_typing', (data) => {
      setTypingUsers(prev => {
        if (data.isTyping) {
          const exists = prev.find(user => user.userId === data.userId);
          if (!exists) {
            return [...prev, { userId: data.userId, userName: data.userName, userType: data.userType }];
          }
          return prev;
        } else {
          return prev.filter(user => user.userId !== data.userId);
        }
      });

      // Auto-remove typing indicator after 3 seconds
      if (data.isTyping) {
        setTimeout(() => {
          setTypingUsers(prev => prev.filter(user => user.userId !== data.userId));
        }, 3000);
      }
    });

    // Error handling
    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    setSocket(newSocket);

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('Page hidden - keeping socket connection');
      } else {
        console.log('Page visible - checking socket connection');
        // Only attempt reconnection if socket is disconnected and we still have a user
        if (newSocket && !newSocket.connected && user?.id) {
          console.log('Reconnecting socket...');
          newSocket.connect();
        } else if (newSocket && newSocket.connected) {
          console.log('Socket already connected, no action needed');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      // Only close if this is a completely new user
      if (!user?.id) {
        newSocket.close();
      }
    };
  }, [user?.id]);

  const joinRoom = (campaignId: string) => {
    if (!socket || !user || !brand) {
      console.error('Cannot join room: missing socket, user, or brand', {
        socket: !!socket,
        user: !!user,
        brand: !!brand,
        isConnected
      });
      return;
    }

    const isAdminUser = user.email === 'admin@campayn.local' || 
                       user.user_metadata?.is_admin === true ||
                       user.app_metadata?.is_admin === true;
    
    const userType = isAdminUser ? 'admin' : 'brand';
    const userName = isAdminUser ? 'Campayn Admin' : (brand.brand_name || user.email || 'Unknown User');

    console.log('Joining room:', {
      campaignId,
      userId: user.id,
      userType,
      userName,
      userEmail: user.email,
      isAdmin: isAdminUser,
      socketConnected: socket.connected
    });

    socket.emit('join_room', {
      campaignId,
      userId: user.id,
      userType,
      userName,
      userEmail: user.email,
      isAdmin: isAdminUser
    });
  };

  const leaveRoom = () => {
    if (socket && currentRoom) {
      socket.emit('leave_room', { campaignId: currentRoom });
      setCurrentRoom(null);
      setRoomUsers([]);
      setMessages([]);
      setTypingUsers([]);
    }
  };

  const sendMessage = (message: string, messageType: string = 'text') => {
    if (!socket || !currentRoom || !message.trim() || !user || !brand) {
      console.error('Cannot send message:', {
        socket: !!socket,
        socketConnected: socket?.connected,
        currentRoom,
        message: message.trim(),
        user: !!user,
        brand: !!brand,
        isConnected
      });
      return;
    }

    const isAdminUser = user.email === 'admin@campayn.local' || 
                       user.user_metadata?.is_admin === true ||
                       user.app_metadata?.is_admin === true;
    
    const userType = isAdminUser ? 'admin' : 'brand';
    const userName = isAdminUser ? 'Campayn Admin' : (brand.brand_name || user.email || 'Unknown User');

    console.log('Sending message:', {
      campaignId: currentRoom,
      message: message.trim(),
      messageType,
      userId: user.id,
      userType,
      userName,
      userEmail: user.email,
      isAdmin: isAdminUser,
      socketConnected: socket.connected
    });

    socket.emit('send_message', {
      campaignId: currentRoom,
      message: message.trim(),
      messageType,
      userId: user.id,
      userType,
      userName,
      userEmail: user.email,
      isAdmin: isAdminUser
    });
  };

  const sendTyping = (isTyping: boolean) => {
    if (!socket || !currentRoom) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    socket.emit('typing', {
      campaignId: currentRoom,
      isTyping
    });

    // Auto-stop typing after 2 seconds
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing', {
          campaignId: currentRoom,
          isTyping: false
        });
      }, 2000);
    }
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    joinRoom,
    leaveRoom,
    sendMessage,
    sendTyping,
    currentRoom,
    roomUsers,
    messages,
    typingUsers
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

