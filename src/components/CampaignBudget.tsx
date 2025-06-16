
import { useState } from "react";
import { Info, DollarSign, TrendingUp } from 'lucide-react';
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
    <Card className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
      <CardContent className="p-10">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Choose campaign budget</h2>
            <p className="text-gray-600">Set your investment for maximum impact</p>
          </div>
        </div>
        
        <div className="mb-10">
          <div className="mb-6">
            <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              ₹{data.budget?.toLocaleString() || '0'}
            </div>
            <div className="flex space-x-6 text-sm">
              {budgetMarks.map((mark) => (
                <span key={mark} className="text-gray-500 font-medium">
                  ₹{mark >= 1000000 ? '10L+' : mark >= 100000 ? `${mark/100000}L` : `${mark/1000}K`}
                </span>
              ))}
            </div>
          </div>
          
          <Slider
            value={[data.budget || 5000]}
            onValueChange={(value) => updateData({ budget: value[0] })}
            max={1000000}
            min={5000}
            step={5000}
            className="w-full mb-8"
          />
          
          <div className="flex items-center space-x-4 bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200">
            <Checkbox
              checked={data.flexibleBudget || false}
              onCheckedChange={(checked) => updateData({ flexibleBudget: checked as boolean })}
              className="border-amber-300"
            />
            <Label className="text-gray-700 font-medium cursor-pointer">
              My budget is slightly flexible (this will allow you to get more creators in your campaign)
            </Label>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm">
              <p className="text-blue-900 font-semibold mb-2">
                💡 Pro Tip: Higher budgets attract premium creators
              </p>
              <p className="text-blue-700">
                Campaign available for purchase with flexible payment options.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onNext}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            Continue →
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
