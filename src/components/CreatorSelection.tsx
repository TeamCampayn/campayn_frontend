
import { CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CreatorSelectionProps {
  campaignData: any;
  updateCampaignData: (updates: any) => void;
  toggleArrayItem: (array: string[], item: string) => string[];
}

const categoryOptions = [
  { id: 'fashion', name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop' },
  { id: 'lifestyle', name: 'Lifestyle', image: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=200&h=200&fit=crop' },
  { id: 'travel', name: 'Travel', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&h=200&fit=crop' }
];

const qualityTiers = [
  { id: 1, stars: 4, name: 'Content quality: High', description: 'Content quality High', cost: '₹2K', selected: false },
  { id: 2, stars: 3, name: 'Content quality: Medium', description: 'Content quality Medium', cost: '₹1.5K', selected: false },
  { id: 3, stars: 5, name: 'Content quality: Best', description: 'Content quality Best', cost: '₹3K', selected: true }
];

const recentCreators = [
  { name: 'Fatimas.', followers: '4.8M followers', image: 'https://images.unsplash.com/photo-1494790108755-2616b612b829?w=50&h=50&fit=crop&crop=face' },
  { name: '@shantinupur', followers: '2.1M followers', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face' },
  { name: 'dane.artist', followers: '1.5M followers', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&h=50&fit=crop&crop=face' },
  { name: '@thepupil', followers: '923k followers', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face' },
  { name: 'sarikamann', followers: '820k followers', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face' },
  { name: 'rishiaggarwal4', followers: '750k followers', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face' }
];

export const CreatorSelection = ({ campaignData, updateCampaignData, toggleArrayItem }: CreatorSelectionProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">CREATOR DETAILS</h3>
      
      <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CardContent className="p-8">
          <div className="flex items-center space-x-2 mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Select creator category</h2>
          </div>
          
          <p className="text-gray-600 mb-6">
            Choose the type of creator you want to collaborate with. You can get an estimate to modify it when asking creators.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {categoryOptions.map((category) => {
              const isSelected = campaignData.categories.includes(category.id);
              
              return (
                <div
                  key={category.id}
                  onClick={() => updateCampaignData({ 
                    categories: toggleArrayItem(campaignData.categories, category.id) 
                  })}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 ${
                    isSelected ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
                    <div className="p-3 text-white">
                      <h4 className="font-medium">{category.name}</h4>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2">
                    <Button
                      size="sm"
                      variant={isSelected ? "default" : "secondary"}
                      className="text-xs px-2 py-1"
                    >
                      Select
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CardContent className="p-8">
          <div className="flex items-center space-x-2 mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Select creator quality</h2>
          </div>
          
          <p className="text-gray-600 mb-6">
            Select creator quality you prefer. This affects number of creators to hire on hand for your budget.
          </p>

          <div className="flex items-center space-x-2 mb-6">
            <span className="text-blue-600 font-medium">Sample content</span>
            <button className="text-blue-600">▶</button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {qualityTiers.map((tier) => {
              const isSelected = campaignData.quality === tier.id;
              
              return (
                <div
                  key={tier.id}
                  onClick={() => updateCampaignData({ quality: tier.id })}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < tier.stars ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{tier.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{tier.description}</p>
                  <p className="text-sm font-medium text-blue-600">{tier.cost}</p>
                  {tier.selected && (
                    <div className="mt-2">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <h4 className="font-medium text-blue-900 mb-3">Recently selected Micro online creators</h4>
            <div className="grid grid-cols-6 gap-4">
              {recentCreators.map((creator, index) => (
                <div key={index} className="text-center">
                  <img
                    src={creator.image}
                    alt={creator.name}
                    className="w-12 h-12 rounded-full mx-auto mb-2"
                  />
                  <p className="text-xs font-medium text-gray-900">{creator.name}</p>
                  <p className="text-xs text-gray-600">{creator.followers}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
