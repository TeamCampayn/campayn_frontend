
import { useState } from "react";
import { Star, Users } from "lucide-react";
import { CampaignData } from "../pages/Index";

interface CreatorSelectionProps {
  data: CampaignData;
  updateData: (data: Partial<CampaignData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const creatorCategories = [
  {
    id: "fashion",
    title: "Fashion",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050",
    popular: true,
  },
  {
    id: "lifestyle",
    title: "Lifestyle",
    image: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34",
    popular: false,
  },
  {
    id: "travel",
    title: "Travel",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828",
    popular: false,
  },
  {
    id: "fitness",
    title: "Fitness",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    popular: false,
  },
  {
    id: "food",
    title: "Food",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b",
    popular: false,
  },
  {
    id: "tech",
    title: "Tech",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176",
    popular: false,
  },
];

const qualityTiers = [
  {
    id: "standard",
    title: "Standard Quality",
    description: "Good engagement rates",
    stars: 3,
    followers: "10K-50K",
    price: "₹2,000-5,000",
  },
  {
    id: "premium",
    title: "Premium Quality",
    description: "High engagement rates",
    stars: 4,
    followers: "50K-200K", 
    price: "₹5,000-15,000",
  },
  {
    id: "celebrity",
    title: "Celebrity Tier",
    description: "Verified accounts",
    stars: 5,
    followers: "200K+",
    price: "₹15,000+",
  },
];

export const CreatorSelection = ({ data, updateData, onNext, onPrev }: CreatorSelectionProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(data.creatorCategories);
  const [selectedQuality, setSelectedQuality] = useState(data.creatorQuality);

  const handleCategoryToggle = (categoryId: string) => {
    const updated = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(updated);
    updateData({ creatorCategories: updated });
  };

  const handleQualitySelect = (qualityId: string) => {
    setSelectedQuality(qualityId);
    updateData({ creatorQuality: qualityId });
  };

  const handleNext = () => {
    if (selectedCategories.length > 0 && selectedQuality) {
      onNext();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Select creator category</h3>
        <p className="text-gray-600">Choose the type of creators you want to work with for your campaign</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        {creatorCategories.map((category) => {
          const isSelected = selectedCategories.includes(category.id);
          
          return (
            <div
              key={category.id}
              onClick={() => handleCategoryToggle(category.id)}
              className={`relative cursor-pointer transition-all hover:scale-105 ${
                isSelected ? "ring-2 ring-purple-600 ring-offset-2" : ""
              }`}
            >
              <div className="aspect-square rounded-xl overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
                  <div className="p-4 text-white">
                    <h4 className="font-semibold">{category.title}</h4>
                    {category.popular && (
                      <span className="text-xs bg-purple-600 px-2 py-1 rounded-full mt-1 inline-block">
                        Popular
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Select creator quality</h3>
        <p className="text-gray-600">Choose the quality tier that matches your campaign needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {qualityTiers.map((tier) => {
          const isSelected = selectedQuality === tier.id;
          
          return (
            <div
              key={tier.id}
              onClick={() => handleQualitySelect(tier.id)}
              className={`border-2 rounded-xl p-6 cursor-pointer transition-all hover:shadow-md ${
                isSelected
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < tier.stars ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-2">{tier.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{tier.description}</p>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    {tier.followers}
                  </div>
                  <div className="text-sm font-medium text-purple-600">{tier.price}</div>
                </div>
              </div>
            </div>
          );
        })}
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
          disabled={selectedCategories.length === 0 || !selectedQuality}
          className={`px-8 py-3 rounded-lg font-medium transition-all ${
            selectedCategories.length > 0 && selectedQuality
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
