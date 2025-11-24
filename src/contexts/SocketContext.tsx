import React, { createContext, useContext } from 'react';

interface SocketContextType {
  socket: null;
  isConnected: false;
  joinRoom: (campaignId: string) => void;
  leaveRoom: () => void;
  sendMessage: (message: string, messageType?: string) => void;
  sendTyping: (isTyping: boolean) => void;
  currentRoom: null;
  roomUsers: [];
  messages: [];
  typingUsers: [];
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const stubValue: SocketContextType = {
  socket: null,
  isConnected: false,
  joinRoom: () => {},
  leaveRoom: () => {},
  sendMessage: () => {},
  sendTyping: () => {},
  currentRoom: null,
  roomUsers: [],
  messages: [],
  typingUsers: []
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    return stubValue;
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  return (
    <SocketContext.Provider value={stubValue}>
      {children}
    </SocketContext.Provider>
  );
};
