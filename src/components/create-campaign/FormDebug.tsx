import React from "react";
import { useCampaignForm } from "@/contexts/CampaignFormContext";

const FormDebug = () => {
  const { formData } = useCampaignForm();

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-xs">
      <h3 className="font-semibold text-yellow-800 mb-2">Form Debug (Remove in production)</h3>
      <div className="space-y-1 text-yellow-700">
        <div>Campaign Name: {formData.campaignName || 'Not set'}</div>
        <div>Budget: ₹{formData.budget.toLocaleString()}</div>
        <div>Category: {formData.category || 'Not set'}</div>
        <div>Quality: {formData.quality || 'Not set'}</div>
        <div>Duration: {formData.duration} days</div>
      </div>
    </div>
  );
};

export default FormDebug;
