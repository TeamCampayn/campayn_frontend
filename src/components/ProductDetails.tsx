
import { useState } from "react";
import { Package, Link, DollarSign, Tag, Truck, X } from "lucide-react";
import { CampaignData } from "../pages/Index";

interface ProductDetailsProps {
  data: CampaignData;
  updateData: (data: Partial<CampaignData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const productCategories = [
  "Beauty", "Lifestyle", "Finance", "Entertainment", "Parenting", "Health", "Travel", "Food", "Tech"
];

export const ProductDetails = ({ data, updateData, onNext, onPrev }: ProductDetailsProps) => {
  const [productName, setProductName] = useState(data.productName);
  const [productLink, setProductLink] = useState(data.productLink);
  const [productValue, setProductValue] = useState(data.productValue);
  const [productCategory, setProductCategory] = useState(data.productCategory);
  const [shippingRequired, setShippingRequired] = useState(data.shippingRequired);

  const handleInputChange = (field: keyof CampaignData, value: any) => {
    updateData({ [field]: value });
    
    switch (field) {
      case 'productName':
        setProductName(value);
        break;
      case 'productLink':
        setProductLink(value);
        break;
      case 'productValue':
        setProductValue(value);
        break;
      case 'productCategory':
        setProductCategory(value);
        break;
      case 'shippingRequired':
        setShippingRequired(value);
        break;
    }
  };

  const handleNext = () => {
    if (productName && productLink && productValue > 0 && productCategory) {
      onNext();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Product Details</h3>
        <p className="text-gray-600">Tell us about the product you want to promote</p>
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Package className="w-4 h-4 inline mr-2" />
            Product Name *
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => handleInputChange('productName', e.target.value)}
            placeholder="Enter your product name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Link className="w-4 h-4 inline mr-2" />
            Product Link *
          </label>
          <input
            type="url"
            value={productLink}
            onChange={(e) => handleInputChange('productLink', e.target.value)}
            placeholder="https://your-product-link.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 inline mr-2" />
            Product Value (₹) *
          </label>
          <input
            type="number"
            value={productValue || ''}
            onChange={(e) => handleInputChange('productValue', parseInt(e.target.value) || 0)}
            placeholder="Enter product value"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">This is the retail value of your product</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Tag className="w-4 h-4 inline mr-2" />
            Product Category *
          </label>
          <div className="flex flex-wrap gap-2">
            {productCategories.map((category) => (
              <button
                key={category}
                onClick={() => handleInputChange('productCategory', category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  productCategory === category
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t pt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Shipping Details</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              onClick={() => handleInputChange('shippingRequired', true)}
              className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                shippingRequired
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center mb-3">
                <Truck className="w-6 h-6 text-purple-600 mr-3" />
                <h5 className="font-semibold text-gray-900">Shipping Required</h5>
              </div>
              <p className="text-sm text-gray-600">
                You'll send physical products to creators for review and content creation.
              </p>
            </div>

            <div
              onClick={() => handleInputChange('shippingRequired', false)}
              className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                !shippingRequired
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center mb-3">
                <X className="w-6 h-6 text-gray-600 mr-3" />
                <h5 className="font-semibold text-gray-900">No Shipping</h5>
              </div>
              <p className="text-sm text-gray-600">
                Digital product or service that doesn't require physical shipping.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
        <p className="text-green-800 text-sm">
          🛡️ <strong>100% refund policy:</strong> Get a full refund if creators don't deliver or meet quality standards.
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
          disabled={!productName || !productLink || productValue === 0 || !productCategory}
          className={`px-8 py-3 rounded-lg font-medium transition-all ${
            productName && productLink && productValue > 0 && productCategory
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Create Campaign
        </button>
      </div>
    </div>
  );
};
