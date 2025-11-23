import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCampaignForm } from "@/contexts/CampaignFormContext";

const CampaignDetails = () => {
  const { formData, updateFormData } = useCampaignForm();

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4 text-slate-900">Campaign Details</h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="campaignName" className="text-sm font-medium text-slate-700">
            Campaign Name *
          </Label>
          <Input
            id="campaignName"
            value={formData.campaignName}
            onChange={(e) => updateFormData({ campaignName: e.target.value })}
            placeholder="Enter your campaign name"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="campaignDescription" className="text-sm font-medium text-slate-700">
            Campaign Description
          </Label>
          <Textarea
            id="campaignDescription"
            value={formData.campaignDescription}
            onChange={(e) => updateFormData({ campaignDescription: e.target.value })}
            placeholder="Describe your campaign goals and requirements"
            className="mt-1"
            rows={3}
          />
        </div>
        
        <div>
          <Label htmlFor="tagline" className="text-sm font-medium text-slate-700">
            Tagline
          </Label>
          <Input
            id="tagline"
            value={formData.tagline}
            onChange={(e) => updateFormData({ tagline: e.target.value })}
            placeholder="Enter a catchy tagline for your campaign"
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
