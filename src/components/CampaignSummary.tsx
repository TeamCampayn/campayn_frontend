
import { CampaignData } from "../pages/Index";
import { Package, Users, Star, DollarSign, Tag } from "lucide-react";

interface CampaignSummaryProps {
  data: CampaignData;
  currentStep: number;
}

export const CampaignSummary = ({ data, currentStep }: CampaignSummaryProps) => {
  const getEstimatedCreators = () => {
    if (data.budget >= 50000) return 1;
    if (data.budget >= 25000) return 2;
    if (data.budget >= 10000) return 4;
    if (data.budget >= 6000) return 7;
    if (data.budget >= 3000) return 13;
    if (data.budget >= 1000) return 25;
    return 0;
  };

  const getQualityLabel = () => {
    switch (data.creatorQuality) {
      case 'standard': return 'Standard Quality';
      case 'premium': return 'Premium Quality';
      case 'celebrity': return 'Celebrity Tier';
      default: return 'Not selected';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Campaign Summary</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <span className="text-gray-600">Budget</span>
          <span className="font-semibold text-gray-900">
            {data.budget > 0 ? `₹${data.budget.toLocaleString()}` : '—'}
          </span>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <span className="text-gray-600">Estimated creators</span>
          <span className="font-semibold text-purple-600">
            {data.budget > 0 ? getEstimatedCreators() : '—'}
          </span>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <span className="text-gray-600">Content types</span>
          <span className="font-semibold text-gray-900">
            {data.contentTypes.length > 0 ? data.contentTypes.length : '—'}
          </span>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <span className="text-gray-600">Creator quality</span>
          <span className="font-semibold text-gray-900">
            {data.creatorQuality ? getQualityLabel() : '—'}
          </span>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <span className="text-gray-600">Categories</span>
          <span className="font-semibold text-gray-900">
            {data.creatorCategories.length > 0 ? data.creatorCategories.length : '—'}
          </span>
        </div>

        {data.productName && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Package className="w-4 h-4 mr-2" />
              Product Details
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium text-gray-900 text-right ml-2">
                  {data.productName}
                </span>
              </div>
              {data.productValue > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Value:</span>
                  <span className="font-medium text-gray-900">₹{data.productValue.toLocaleString()}</span>
                </div>
              )}
              {data.productCategory && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium text-gray-900">{data.productCategory}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {currentStep === 5 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">🎉 Campaign Ready!</h4>
            <p className="text-sm text-green-700">
              Your campaign is configured and ready to connect with creators.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
