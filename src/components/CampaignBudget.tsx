
import { useState } from "react";
import { Info } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface CampaignBudgetProps {
  data: any;
  updateData: (data: any) => void;
  onNext: () => void;
}

export const CampaignBudget = ({ data, updateData, onNext }: CampaignBudgetProps) => {
  const budgetMarks = [5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000];

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
      <CardContent className="p-8">
        <div className="flex items-center space-x-2 mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Choose campaign budget</h2>
          <Info className="w-4 h-4 text-gray-400" />
        </div>
        
        <div className="mb-8">
          <div className="mb-4">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              ₹{data.budget?.toLocaleString() || '0'}
            </div>
            <div className="flex space-x-4 text-sm">
              {budgetMarks.map((mark) => (
                <span key={mark} className="text-gray-500">₹{mark >= 1000000 ? '10L+' : mark >= 100000 ? `${mark/100000}L` : `${mark/1000}K`}</span>
              ))}
            </div>
          </div>
          
          <Slider
            value={[data.budget || 5000]}
            onValueChange={(value) => updateData({ budget: value[0] })}
            max={1000000}
            min={5000}
            step={5000}
            className="w-full mb-6"
          />
          
          <div className="flex items-center space-x-3 bg-yellow-50 p-4 rounded-lg">
            <Checkbox
              checked={data.flexibleBudget || false}
              onCheckedChange={(checked) => updateData({ flexibleBudget: checked as boolean })}
            />
            <Label className="text-sm text-gray-700">
              My budget is slightly flexible (this will allow you to get more creators in your campaign)
            </Label>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <p className="text-yellow-800 font-medium">
                We'll find partners around your price. Choose a higher price will help you get better creators
              </p>
              <p className="text-yellow-700 mt-1">
                Campaign available for purchase.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
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
