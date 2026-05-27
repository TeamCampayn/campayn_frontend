
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InviteModalProps {
  creator: any;
  isOpen: boolean;
  onClose: () => void;
}

const InviteModal = ({ creator, isOpen, onClose }: InviteModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const [inviting, setInviting] = useState(false);
  const [invited, setInvited] = useState(false);

  // Mock brandId for now - in production this would come from auth context
  const brandId = "68c9f0e2-2e5a-4b9a-8f8e-8a8e8a8e8a8e"; 

  useEffect(() => {
    if (isOpen) {
      fetchBrandCampaigns();
      setInvited(false);
    }
  }, [isOpen]);

  const fetchBrandCampaigns = async () => {
    setLoading(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://campayn-backend.onrender.com';
      const res = await fetch(`${backendUrl}/api/campaigns?brand_id=${brandId}`);
      const result = await res.json();
      if (result.success) {
        // Only show active/planning campaigns
        setCampaigns(result.campaigns.filter((c: any) => c.status !== 'completed'));
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!selectedCampaign) {
      toast({
        title: "Selection Required",
        description: "Please select a campaign to invite the creator.",
        variant: "destructive"
      });
      return;
    }

    setInviting(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://campayn-backend.onrender.com';
      const res = await fetch(`${backendUrl}/api/campaigns/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: selectedCampaign,
          creatorId: creator.id,
          brandId: brandId
        })
      });

      const result = await res.json();

      if (result.success) {
        setInvited(true);
        toast({
          title: "Invitation Sent!",
          description: `You have successfully invited ${creator.name} to your campaign.`,
        });
        setTimeout(() => onClose(), 2000);
      } else {
        toast({
          title: "Invitation Failed",
          description: result.error || "Could not send invitation.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setInviting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0f0f0f] border-white/10 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
            Invite <span className="text-campayn-primary">{creator?.name}</span>
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Invite this creator to one of your active campaigns. They will be notified on their dashboard.
          </DialogDescription>
        </DialogHeader>

        {invited ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="text-emerald-500" size={32} />
            </div>
            <div>
              <h4 className="text-xl font-bold">Invitation Sent</h4>
              <p className="text-slate-400 text-sm">Waiting for creator to accept.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500">Select Campaign</label>
              {loading ? (
                <div className="h-12 bg-white/5 rounded-xl animate-pulse flex items-center justify-center">
                  <Loader2 className="animate-spin text-slate-700" size={20} />
                </div>
              ) : campaigns.length > 0 ? (
                <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:ring-campayn-primary/20">
                    <SelectValue placeholder="Choose an active campaign" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                    {campaigns.map((c) => (
                      <SelectItem key={c.id} value={c.id} className="focus:bg-white/5 focus:text-white">
                        {c.campaign_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-center gap-3">
                  <AlertCircle className="text-amber-500" size={20} />
                  <p className="text-xs text-amber-500/80 font-medium">No active campaigns found. Please create a campaign first.</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
              <img 
                src={creator?.profilePictureUrl} 
                alt={creator?.name} 
                className="w-12 h-12 rounded-xl object-cover border border-white/10"
              />
              <div>
                <p className="font-bold text-sm">{creator?.name}</p>
                <p className="text-xs text-slate-500">@{creator?.igHandle}</p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl">
            Cancel
          </Button>
          {!invited && (
            <Button 
              onClick={handleInvite} 
              disabled={inviting || !selectedCampaign}
              className="bg-campayn-primary hover:bg-campayn-primary/90 text-white rounded-xl px-8 font-bold"
            >
              {inviting ? <Loader2 className="animate-spin mr-2" size={18} /> : <Send className="mr-2" size={18} />}
              Send Invitation
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
