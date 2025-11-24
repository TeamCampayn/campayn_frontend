import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getApiUrl } from '@/lib/api';
import {
  MessageSquare,
  Send,
  ThumbsUp,
  ThumbsDown,
  User,
  Shield,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ConversationMessage {
  id: string;
  sender_type: 'brand' | 'admin';
  sender_id: string;
  message: string;
  message_type: 'message' | 'decision';
  decision_type?: 'approved' | 'rejected' | 'requested_more';
  created_at: string;
}

interface ConversationHistoryProps {
  campaignId: string;
  creatorId: string;
  creatorName: string;
  userType: 'brand' | 'admin';
  currentStatus: 'recommended' | 'approved' | 'rejected' | 'requested_more';
  onStatusUpdate?: () => void;
  initiallyOpen?: boolean;
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  campaignId,
  creatorId,
  creatorName,
  userType,
  currentStatus,
  onStatusUpdate,
  initiallyOpen = false
}) => {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Add polling for real-time updates
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Ref for auto-scrolling to bottom
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  // Track if user is manually scrolling
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  
  // Chat dropdown state
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [lastSeenMessageCount, setLastSeenMessageCount] = useState(messages.length);
  
  const unreadCount = messages.length - lastSeenMessageCount;

  const scrollToBottom = () => {
    if (shouldAutoScroll && !isUserScrolling) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const checkIfUserIsAtBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
      setShouldAutoScroll(isAtBottom);
    }
  };

  const handleScroll = (e: React.UIEvent) => {
    // Prevent the scroll event from bubbling up to parent elements
    e.stopPropagation();
    
    setIsUserScrolling(true);
    checkIfUserIsAtBottom();
    
    // Reset user scrolling flag after a delay
    setTimeout(() => {
      setIsUserScrolling(false);
    }, 1500);
  };

  const fetchConversation = async () => {
    try {
      const url = getApiUrl(`api/campaigns/${campaignId}/creators/${creatorId}/conversation`);
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        const newMessages = data.messages || [];
        // Only update if messages have changed
        if (JSON.stringify(newMessages) !== JSON.stringify(messages)) {
          // Check if there are new messages when chat is closed
          if (!isOpen && newMessages.length > lastSeenMessageCount) {
            setHasUnreadMessages(true);
          }
          
          setMessages(newMessages);
          // Only auto-scroll if user is at bottom or if it's their own message
          if (shouldAutoScroll && isOpen) {
            setTimeout(scrollToBottom, 100);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnreadMessages(false);
      setLastSeenMessageCount(messages.length);
      // Fetch fresh messages when opening
      fetchConversation();
      // Scroll to bottom when opening
      setTimeout(scrollToBottom, 200);
    }
  };

  useEffect(() => {
    fetchConversation();
    // Initialize the last seen count
    setLastSeenMessageCount(messages.length);
    
    // Set up polling for real-time updates
    const interval = setInterval(() => {
      // Only poll if document is visible (tab is active) and user isn't actively scrolling
      if (!document.hidden && !isUserScrolling) {
        fetchConversation();
      }
    }, isOpen ? 3000 : 10000); // Poll more frequently when open, less when closed
    
    setPollingInterval(interval);
    
    // Cleanup on unmount
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [campaignId, creatorId, isOpen]);

  // Initial scroll to bottom when messages first load and chat is open
  useEffect(() => {
    if (messages.length > 0 && !loading && isOpen) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [loading, isOpen]);

  // Cleanup polling interval when component unmounts
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const handleSendMessage = async (actionType: 'message' | 'approved' | 'rejected', event?: React.FormEvent) => {
    // Prevent form submission and page reload
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Only require message text for regular messages, not for approve/reject actions
    if (actionType === 'message' && !newMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      const endpoint = userType === 'admin' 
        ? getApiUrl(`api/campaigns/${campaignId}/creators/${creatorId}/admin-reply`)
        : getApiUrl(`api/campaigns/${campaignId}/creators/${creatorId}/brand-reply`);

      const body = userType === 'admin'
        ? { admin_reply: newMessage.trim() || `Creator ${actionType}`, admin_id: 'admin' }
        : { 
            brand_reply: newMessage.trim() || `Creator ${actionType}`, 
            action_type: actionType === 'message' ? 'continue_chat' : actionType,
            brand_id: 'brand' 
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Message Sent",
          description: actionType === 'message' 
            ? "Message sent successfully" 
            : `Creator ${actionType} successfully`,
        });
        
        setNewMessage('');
        // Always scroll to bottom when user sends a message
        setShouldAutoScroll(true);
        // Immediately refresh conversation to show new message
        await fetchConversation();
        onStatusUpdate?.();
        // Scroll to bottom to show the new message
        setTimeout(scrollToBottom, 200);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to send message",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const canReply = currentStatus === 'requested_more' || 
    (userType === 'admin' && messages.some(m => m.sender_type === 'brand' && m.message_type === 'message'));

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getMessageCountText = () => {
    if (messages.length === 0) return "Start conversation";
    const newCount = messages.length - lastSeenMessageCount;
    if (!isOpen && newCount > 0) {
      return `${messages.length} messages (${newCount} new)`;
    }
    return `${messages.length} message${messages.length === 1 ? '' : 's'}`;
  };

  return (
    <Card className={`transition-all duration-200 ${hasUnreadMessages ? 'ring-2 ring-blue-200' : ''}`}>
      <CardHeader 
        className={`cursor-pointer transition-colors ${
          hasUnreadMessages 
            ? 'hover:bg-blue-50 bg-blue-25' 
            : 'hover:bg-gray-50'
        }`}
        onClick={toggleChat}
      >
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className={`h-5 w-5 transition-colors ${hasUnreadMessages ? 'text-blue-600' : ''}`} />
            <span>Chat with {userType === 'admin' ? 'Brand' : 'Admin'}</span>
            {hasUnreadMessages && (
              <Badge variant="destructive" className="text-xs px-2 py-0 animate-pulse">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-normal">
              {getMessageCountText()}
            </span>
            <span className="text-xs text-gray-400 font-normal hidden sm:inline">
              {isOpen ? 'Click to close' : 'Click to expand'}
            </span>
            {isOpen ? (
              <ChevronUp className="h-4 w-4 transition-transform duration-200" />
            ) : (
              <ChevronDown className="h-4 w-4 transition-transform duration-200" />
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      {isOpen && (
        <CardContent className="space-y-4 animate-in slide-in-from-top-2 duration-200">
        {/* Conversation Messages */}
        <div 
          ref={messagesContainerRef}
          className="space-y-3 max-h-96 overflow-y-auto"
          onScroll={handleScroll}
          onWheel={(e) => {
            // Allow scrolling within this container without affecting parent
            e.stopPropagation();
          }}
        >
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No conversation yet</p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender_type === userType ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender_type === 'admin' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  {message.sender_type === 'admin' ? (
                    <Shield className="h-4 w-4 text-blue-600" />
                  ) : (
                    <User className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <div className={`flex-1 ${
                  message.sender_type === userType ? 'text-right' : 'text-left'
                }`}>
                  <div className={`inline-block max-w-xs md:max-w-sm lg:max-w-md px-3 py-2 rounded-lg ${
                    message.sender_type === userType
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.message}</p>
                    {message.message_type === 'decision' && message.decision_type && (
                      <div className="mt-1">
                        <Badge 
                          variant={message.decision_type === 'approved' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {message.decision_type === 'approved' ? 'Approved' : 'Rejected'}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {formatDate(message.created_at)}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to bottom button */}
        {!shouldAutoScroll && messages.length > 0 && (
          <div className="flex justify-center mt-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                setShouldAutoScroll(true);
                scrollToBottom();
              }}
              className="text-xs"
            >
              <ChevronDown className="h-3 w-3 mr-1" />
              New messages
            </Button>
          </div>
        )}

        {/* Reply Interface */}
        {canReply && (
          <div className="border-t pt-4">
            <form onSubmit={(e) => handleSendMessage('message', e)} className="space-y-3">
              <Textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage('message', e);
                  }
                }}
                className="min-h-[80px]"
                disabled={sending}
              />
              <div className="flex flex-wrap gap-2">
                {userType === 'brand' && currentStatus === 'requested_more' ? (
                  <>
                    <Button
                      type="button"
                      size="sm"
                      onClick={(e) => handleSendMessage('approved', e)}
                      disabled={sending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      {sending ? 'Sending...' : 'Accept Creator'}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={(e) => handleSendMessage('rejected', e)}
                      disabled={sending}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <ThumbsDown className="h-3 w-3 mr-1" />
                      {sending ? 'Sending...' : 'Reject Creator'}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={(e) => handleSendMessage('message', e)}
                      disabled={sending || !newMessage.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      {sending ? 'Sending...' : 'Send Message'}
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    onClick={(e) => handleSendMessage('message', e)}
                    disabled={sending || !newMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-3 w-3 mr-1" />
                    {sending ? 'Sending...' : 'Send Message'}
                  </Button>
                )}
              </div>
            </form>
          </div>
        )}
      </CardContent>
      )}
    </Card>
  );
};

export default ConversationHistory;