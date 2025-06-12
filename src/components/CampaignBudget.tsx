
import { useState } from "react";
import { CampaignData } from "../pages/Index";

interface CampaignBudgetProps {
  data: CampaignData;
  updateData: (data: Partial<CampaignData>) => void;
  onNext: () => void;
}

const budgetOptions = [
  { amount: 1000, label: "₹1,000", creators: 25, deliveries: "25 deliveries", features: "Standard category" },
  { amount: 3000, label: "₹3,000", creators: 13, deliveries: "13 deliveries", features: "Mass creator quality" },
  { amount: 6000, label: "₹6,000", creators: 7, deliveries: "7 deliveries", features: "Mega creators" },
  { amount: 10000, label: "₹10,000", creators: 4, deliveries: "4 deliveries", features: "Premium category" },
  { amount: 25000, label: "₹25,000", creators: 2, deliveries: "2 deliveries", features: "Celebrity tier" },
  { amount: 50000, label: "₹50,000", creators: 1, deliveries: "1 delivery", features: "Top influencer" },
];

export const CampaignBudget = ({ data, updateData, onNext }: CampaignBudgetProps) => {
  const [selectedBudget, setSelectedBudget] = useState(data.budget);

  const handleBudgetSelect = (amount: number) => {
    setSelectedBudget(amount);
    updateData({ budget: amount });
  };

  const handleNext = () => {
    if (selectedBudget > 0) {
      onNext();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose campaign budget</h3>
        <p className="text-gray-600">Select your budget to see how many creators you can work with</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {budgetOptions.map((option) => (
          <div
            key={option.amount}
            onClick={() => handleBudgetSelect(option.amount)}
            className={`border-2 rounded-xl p-6 cursor-pointer transition-all hover:shadow-md ${
              selectedBudget === option.amount
                ? "border-purple-600 bg-purple-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-2">{option.label}</div>
              <div className="text-lg font-semibold text-purple-600 mb-2">{option.creators}</div>
              <div className="text-sm text-gray-600 mb-1">{option.deliveries}</div>
              <div className="text-sm text-gray-500">{option.features}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
        <p className="text-amber-800 text-sm">
          💡 <strong>Tip:</strong> Higher budgets unlock premium creators with larger audiences and better engagement rates.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={selectedBudget === 0}
          className={`px-8 py-3 rounded-lg font-medium transition-all ${
            selectedBudget > 0
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
