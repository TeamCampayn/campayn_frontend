
import { Play, FileText, Image, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ContentRequirementsProps {
  campaignData: any;
  updateCampaignData: (updates: any) => void;
  toggleArrayItem: (array: string[], item: string) => string[];
}

const contentTypeOptions = [
  { id: 'reel', name: '30 seconds Reel', duration: 'Add video log', icon: Play },
  { id: 'story', name: 'Video Story', duration: '', icon: Play },
  { id: 'post', name: 'Static Post', duration: '', icon: Image }
];

export const ContentRequirements = ({ campaignData, updateCampaignData, toggleArrayItem }: ContentRequirementsProps) => {
  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
      <CardContent className="p-8">
        <div className="flex items-center space-x-2 mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Choose content requirements per creator</h2>
          <Info className="w-4 h-4 text-gray-400" />
        </div>
        
        <p className="text-gray-600 mb-6">
          Our pricing is dynamic and is always based on the topics selected.
        </p>

        <div className="space-y-4 mb-6">
          {contentTypeOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = campaignData.contentTypes.includes(option.id);
            
            return (
              <div
                key={option.id}
                onClick={() => updateCampaignData({ 
                  contentTypes: toggleArrayItem(campaignData.contentTypes, option.id) 
                })}
                className={`flex items-center space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isSelected ? 'bg-blue-500' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{option.name}</h3>
                  {option.duration && (
                    <p className="text-sm text-gray-500">{option.duration}</p>
                  )}
                </div>
                {option.id === 'reel' && (
                  <Badge className="bg-orange-100 text-orange-800">Hot</Badge>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <span className="text-gray-700">Comments</span>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Pinned comments</span>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
