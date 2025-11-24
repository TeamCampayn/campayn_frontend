import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRealtimeMessages } from '../hooks/useRealtimeMessages';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Send, MessageCircle, CheckCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { useToast } from '../hooks/use-toast';

interface QuotationChatProps {
  campaignId: string;
  campaignName?: string;
}

const QuotationChat: React.FC<QuotationChatProps> = ({ campaignId, campaignName }) => {
  const { user } = useAuth();
  const { messages, loading, sendMessage: sendRealtimeMessage } = useRealtimeMessages(campaignId);
  const { toast } = useToast();

  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !sending) {
      setSending(true);
      try {
        await sendRealtimeMessage(message.trim());
        setMessage('');
        inputRef.current?.focus();
      } catch (error) {
        console.error('Error sending message:', error);
        toast({
          title: 'Error',
          description: 'Failed to send message. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setSending(false);
      }
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isCurrentUser = (senderId: string) => {
    return user?.id === senderId;
  };

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

  if (loading) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
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
              Campaign Chat
              {campaignName && (
                <span className="text-sm font-normal text-gray-600 ml-2 hidden sm:inline">
                  - {campaignName}
                </span>
              )}
            </CardTitle>
            <div className="flex items-center space-x-2 mt-1">
              <Badge 
                variant="outline" 
                className="text-xs text-green-600 border-green-600"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
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
                      isCurrentUser(msg.sender_id) ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-lg px-4 py-3 shadow-sm border max-w-[85%] sm:max-w-[75%] md:max-w-[65%] min-w-0 overflow-hidden",
                        isCurrentUser(msg.sender_id)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-900 border-gray-200"
                      )}
                    >
                      {!isCurrentUser(msg.sender_id) && (
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge 
                            variant="secondary" 
                            className={cn("text-xs", getUserTypeColor(msg.user_type))}
                          >
                            {msg.user_type === 'admin' || msg.is_admin ? '👨‍💼 Admin' : '🏢 Brand'}
                          </Badge>
                          <span className="text-xs font-medium text-gray-700">
                            {msg.user_email}
                          </span>
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                        {msg.content}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-current border-opacity-10">
                        {isCurrentUser(msg.sender_id) && (
                          <div className="flex items-center text-xs opacity-75">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Sent
                          </div>
                        )}
                        <div 
                          className={cn(
                            "text-xs ml-auto",
                            isCurrentUser(msg.sender_id) ? "text-blue-100 opacity-75" : "text-gray-500"
                          )}
                        >
                          {formatTime(msg.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>
        <div className="flex-shrink-0 border-t bg-gray-50 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={sending}
              className="flex-1"
            />
            <Button type="submit" disabled={!message.trim() || sending}>
              {sending ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            💡 Messages are delivered in real-time via Supabase Realtime
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuotationChat;
