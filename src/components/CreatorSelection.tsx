
import { Users, Star, TrendingUp, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface CreatorSelectionProps {
  data: any;
  updateData: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const creatorOptions = [
  { 
    id: 'nano', 
    name: 'Nano creators', 
    followers: '1K - 10K followers',
    icon: Users,
    description: 'High engagement, authentic content'
  },
  { 
    id: 'micro', 
    name: 'Micro creators', 
    followers: '10K - 100K followers',
    icon: TrendingUp,
    description: 'Balanced reach and engagement'
  },
  { 
    id: 'macro', 
    name: 'Macro creators', 
    followers: '100K+ followers',
    icon: Star,
    description: 'Maximum reach and visibility'
  }
];

const qualityOptions = [
  { id: 'standard', name: 'Standard Quality', price: 'Budget friendly' },
  { id: 'premium', name: 'Premium Quality', price: 'Higher engagement' },
  { id: 'elite', name: 'Elite Quality', price: 'Top tier creators' }
];

export const CreatorSelection = ({ data, updateData, onNext, onPrev }: CreatorSelectionProps) => {
  const toggleArrayItem = (array: string[] = [], item: string): string[] => {
    const exists = array.includes(item);
    if (exists) {
      return array.filter(i => i !== item);
    } else {
      return [...array, item];
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
      <CardContent className="p-8">
        <div className="flex items-center space-x-2 mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Select creator types</h2>
          <Info className="w-4 h-4 text-gray-400" />
        </div>
        
        <p className="text-gray-600 mb-6">
          Choose the type of creators you want to work with for your campaign.
        </p>

        <div className="space-y-4 mb-8">
          {creatorOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = (data.creatorCategories || []).includes(option.id);
            
            return (
              <div
                key={option.id}
                onClick={() => updateData({ 
                  creatorCategories: toggleArrayItem(data.creatorCategories, option.id) 
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
                  <p className="text-sm text-gray-500">{option.followers}</p>
                  <p className="text-xs text-gray-400">{option.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Creator Quality</h3>
          <div className="grid grid-cols-3 gap-4">
            {qualityOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => updateData({ creatorQuality: option.id })}
                className={`p-4 rounded-lg border-2 cursor-pointer text-center ${
                  data.creatorQuality === option.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h4 className="font-medium text-gray-900">{option.name}</h4>
                <p className="text-sm text-gray-500">{option.price}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={onPrev}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Continue
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
