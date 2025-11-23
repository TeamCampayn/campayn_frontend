
import React, { useState } from "react";
import { useCampaignForm } from "@/contexts/CampaignFormContext";

const budgetOptions = [
  5000, 10000, 25000, 50000, 100000, 500000
];

const BudgetSelector = () => {
  const { formData, updateFormData } = useCampaignForm();
  
  // Find the current budget index from form data
  const currentBudgetIdx = budgetOptions.findIndex(option => option === formData.budget);
  const [budgetIdx, setBudgetIdx] = useState(currentBudgetIdx >= 0 ? currentBudgetIdx : 2);
  
  const budgetValue = budgetOptions[budgetIdx];
  const maxBudget = Math.floor(budgetValue * 1.4); // 40% increase for flexibility

  const handleBudgetChange = (newIdx: number) => {
    setBudgetIdx(newIdx);
    updateFormData({ budget: budgetOptions[newIdx] });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4 text-slate-900">Campaign Budget</h2>
      
      {/* Slider Container */}
      <div className="relative mb-4">
        <div className="flex items-center gap-4">
          <input 
            type="range"
            min={0}
            max={budgetOptions.length - 1}
            step={1}
            value={budgetIdx}
            onChange={e => handleBudgetChange(Number(e.target.value))}
            className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #7C3AED 0%, #7C3AED ${(budgetIdx / (budgetOptions.length - 1)) * 100}%, #e2e8f0 ${(budgetIdx / (budgetOptions.length - 1)) * 100}%, #e2e8f0 100%)`
            }}
          />
          
          {/* Live Value Tooltip */}
          <div className="ml-4 px-3 py-1 bg-[#7C3AED] text-white rounded-lg text-sm font-medium shadow-md">
            ₹{budgetValue.toLocaleString()}
          </div>
        </div>
        
        {/* Slider Labels */}
        <div className="flex justify-between mt-2 text-xs text-slate-500">
          {budgetOptions.map((amount, i) => (
            <span key={i} className={`${i === budgetIdx ? "text-[#7C3AED] font-medium" : ""}`}>
              ₹{amount >= 100000 ? `${amount/100000}L` : `${amount/1000}K`}
            </span>
          ))}
        </div>
      </div>

      {/* Info Callout */}
      <div className="mb-4 p-4 rounded-xl bg-yellow-50 border border-yellow-200">
        <p className="text-yellow-800 text-sm font-medium">
          My budget is slightly flexible: this will increase your maximum to{' '}
          <span className="font-semibold">₹{maxBudget.toLocaleString()}</span> and get you more creators.
        </p>
      </div>
      
      {/* Helper Note */}
      <div className="text-xs text-slate-500 bg-slate-50 rounded-lg px-4 py-3">
        Campayn is a free platform—you only pay creators. Budget selection determines available packages.
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #7C3AED;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(124, 58, 237, 0.4);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #7C3AED;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(124, 58, 237, 0.4);
        }
      `}</style>
    </div>
  );
};

export default BudgetSelector;
