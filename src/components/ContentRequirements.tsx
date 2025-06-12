
import { useState } from "react";
import { Play, Image, FileText } from "lucide-react";
import { CampaignData } from "../pages/Index";

interface ContentRequirementsProps {
  data: CampaignData;
  updateData: (data: Partial<CampaignData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const contentOptions = [
  {
    id: "video-story",
    title: "Video Story",
    icon: Play,
    description: "30 second reel",
    duration: "30s",
    popular: true,
  },
  {
    id: "static-post",
    title: "Static Post",
    icon: Image,
    description: "Single image post",
    duration: "1 post",
    popular: false,
  },
  {
    id: "carousel",
    title: "Carousel",
    icon: FileText,
    description: "Multiple images",
    duration: "3-5 images",
    popular: false,
  },
];

export const ContentRequirements = ({ data, updateData, onNext, onPrev }: ContentRequirementsProps) => {
  const [selectedContent, setSelectedContent] = useState<string[]>(data.contentTypes);

  const handleContentToggle = (contentId: string) => {
    const updated = selectedContent.includes(contentId)
      ? selectedContent.filter(id => id !== contentId)
      : [...selectedContent, contentId];
    
    setSelectedContent(updated);
    updateData({ contentTypes: updated });
  };

  const handleNext = () => {
    if (selectedContent.length > 0) {
      onNext();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose content requirements per creator</h3>
        <p className="text-gray-600">Select the type of content you want creators to produce for your campaign</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {contentOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedContent.includes(option.id);
          
          return (
            <div
              key={option.id}
              onClick={() => handleContentToggle(option.id)}
              className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all hover:shadow-md ${
                isSelected
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {option.popular && (
                <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                  Popular
                </div>
              )}
              
              <div className="text-center">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center ${
                  isSelected ? "bg-purple-600" : "bg-gray-100"
                }`}>
                  <Icon className={`w-6 h-6 ${isSelected ? "text-white" : "text-gray-600"}`} />
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-1">{option.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {option.duration}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <p className="text-blue-800 text-sm">
          ℹ️ You can select multiple content types. Creators will need to deliver all selected formats.
        </p>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        
        <button
          onClick={handleNext}
          disabled={selectedContent.length === 0}
          className={`px-8 py-3 rounded-lg font-medium transition-all ${
            selectedContent.length > 0
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};
