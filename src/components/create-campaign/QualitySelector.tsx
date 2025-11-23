
import React, { useState } from "react";
import { Star, DollarSign } from "lucide-react";
import { useCampaignForm } from "@/contexts/CampaignFormContext";

const QualitySelector = () => {
  const { formData, updateFormData } = useCampaignForm();
  const [selectedQuality, setSelectedQuality] = useState(formData.quality || "mass");

  const handleQualityChange = (quality: string) => {
    setSelectedQuality(quality);
    updateFormData({ quality });
  };

  const qualityOptions = [
    {
      id: "ultra-premium",
      title: "Ultra Premium",
      stars: 4,
      description: "High quality, high cost",
      costLevel: 3
    },
    {
      id: "premium", 
      title: "Premium",
      stars: 3,
      description: "Moderate quality & cost",
      costLevel: 2
    },
    {
      id: "mass",
      title: "Mass",
      stars: 2,
      description: "Basic quality, low cost",
      costLevel: 1
    }
  ];

  const renderStars = (count: number) => {
    return Array.from({ length: 4 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < count ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`} 
      />
    ));
  };

  const renderCostIndicator = (level: number) => {
    return Array.from({ length: 3 }, (_, i) => (
      <DollarSign 
        key={i} 
        className={`h-3 w-3 ${i < level ? "text-green-500" : "text-slate-300"}`} 
      />
    ));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4 text-slate-900">Creator Quality</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {qualityOptions.map((option) => (
          <div
            key={option.id}
            onClick={() => handleQualityChange(option.id)}
            className={`
              p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
              hover:shadow-md hover:-translate-y-1
              ${selectedQuality === option.id 
                ? "border-purple-500 bg-purple-50" 
                : "border-slate-200 bg-white hover:border-slate-300"
              }
            `}
          >
            <div className="text-center space-y-3">
              {/* Stars */}
              <div className="flex justify-center space-x-1">
                {renderStars(option.stars)}
              </div>
              
              {/* Title */}
              <h3 className="font-semibold text-slate-900">{option.title}</h3>
              
              {/* Description */}
              <p className="text-sm text-slate-600">{option.description}</p>
              
              {/* Cost Indicator */}
              <div className="flex justify-center space-x-1 pt-2">
                {renderCostIndicator(option.costLevel)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QualitySelector;
