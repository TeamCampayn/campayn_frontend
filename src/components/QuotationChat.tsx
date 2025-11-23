import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Send, Users, MessageCircle, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

interface QuotationChatProps {
  campaignId: string;
  campaignName?: string;
}

const QuotationChat: React.FC<QuotationChatProps> = ({ campaignId, campaignName }) => {
  const { user, brand } = useAuth();
  const { 
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
  } = useSocket();

  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Join room when component mounts
  useEffect(() => {
    if (campaignId && isConnected && socket) {
      console.log('Joining room for campaign:', campaignId);
      joinRoom(campaignId);
    }

    return () => {
      if (campaignId) {
        console.log('Leaving room for campaign:', campaignId);
        leaveRoom();
      }
    };
  }, [campaignId, isConnected, socket]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle typing
  const handleTyping = (value: string) => {
    setMessage(value);
    
    if (value.length > 0 && !isTyping) {
      setIsTyping(true);
      sendTyping(true);
    } else if (value.length === 0 && isTyping) {
      setIsTyping(false);
      sendTyping(false);
    }
  };

  // Send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
      setIsTyping(false);
      sendTyping(false);
    }
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Check if message is from current user
  const isCurrentUser = (userId: string) => {
    return user?.id === userId;
  };

  // Get message sender label
  const getMessageSender = (msg: any) => {
    if (isCurrentUser(msg.userId)) {
      return 'You';
    }
    
    if (msg.userType === 'admin' || msg.isAdmin || msg.userEmail === 'admin@campayn.local') {
      return 'Campayn Admin';
    }
    
    return msg.userName || 'Brand';
  };

  // Get current user type
  const getCurrentUserType = () => {
    return user?.email === 'admin@campayn.local' || 
           user?.user_metadata?.is_admin || 
           user?.app_metadata?.is_admin ? 'admin' : 'brand';
  };

  // Get user type color
  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'brand':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isConnected) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to chat server...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-[700px] max-h-[80vh] flex flex-col overflow-hidden">
      <CardHeader className="flex-shrink-0 pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg truncate">
              Quotation Chat
              {campaignName && (
                <span className="text-sm font-normal text-gray-600 ml-2 hidden sm:inline">
                  - {campaignName}
                </span>
              )}
            </CardTitle>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                {roomUsers.length} user{roomUsers.length !== 1 ? 's' : ''}
              </Badge>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs",
                  isConnected ? "text-green-600 border-green-600" : "text-red-600 border-red-600"
                )}
              >
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-4 sm:px-6">
            <div className="space-y-3 py-4 min-h-full flex flex-col">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8 flex-1 flex flex-col justify-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex w-full mb-3",
                      isCurrentUser(msg.userId) ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-lg px-4 py-3 shadow-sm border max-w-[85%] sm:max-w-[75%] md:max-w-[65%] min-w-0 overflow-hidden",
                        isCurrentUser(msg.userId)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-900 border-gray-200"
                      )}
                    >
                      {/* Message Header - Only show for other users */}
                      {!isCurrentUser(msg.userId) && (
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge 
                            variant="secondary" 
                            className={cn("text-xs", getUserTypeColor(msg.userType))}
                          >
                            {msg.userType === 'admin' || msg.isAdmin ? '👨‍💼 Admin' : '🏢 Brand'}
                          </Badge>
                          <span className="text-xs font-medium text-gray-700 truncate">
                            {getMessageSender(msg)}
                          </span>
                        </div>
                      )}
                      
                      {/* Message Content */}
                      <div className="break-words overflow-wrap-anywhere">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words hyphens-auto">
                          {msg.message}
                        </p>
                      </div>
                      
                      {/* Message Footer */}
                      <div className="flex items-center justify-between mt-2">
                        {isCurrentUser(msg.userId) && (
                          <span className="text-xs text-blue-100 opacity-75">
                            You
                          </span>
                        )}
                        <span className={cn(
                          "text-xs ml-auto",
                          isCurrentUser(msg.userId) ? "text-blue-100 opacity-75" : "text-gray-500"
                        )}>
                          <Clock className="h-3 w-3 inline mr-1" />
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}

            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-600">
                      {typingUsers.map(u => u.userName).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                    </span>
                  </div>
                </div>
              </div>
            )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Message Input */}
        <div className="flex-shrink-0 border-t p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              ref={inputRef}
              value={message}
              onChange={(e) => handleTyping(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={!isConnected}
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={!message.trim() || !isConnected}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuotationChat;

