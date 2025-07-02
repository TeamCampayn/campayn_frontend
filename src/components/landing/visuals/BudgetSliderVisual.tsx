
import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, Users, Zap } from 'lucide-react';

interface BudgetSliderVisualProps {
  isActive?: boolean;
}

export const BudgetSliderVisual: React.FC<BudgetSliderVisualProps> = ({ isActive = false }) => {
  const [animateProgress, setAnimateProgress] = useState(false);

  useEffect(() => {
    if (isActive) {
      setTimeout(() => setAnimateProgress(true), 400);
    } else {
      setAnimateProgress(false);
    }
  }, [isActive]);

  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl shadow-2xl p-6 border-2 border-gray-200 hover:border-indigo-300 transition-colors">
          {/* Enhanced Budget Header */}
          <div className="text-center mb-6 p-4 bg-gradient-to-r from-indigo-50 to-pink-50 rounded-lg border border-indigo-200">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <DollarSign className="w-6 h-6 text-indigo-600 animate-pulse" />
              <div className="text-lg font-bold text-gray-800">Campaign Budget</div>
            </div>
            <div className={`text-3xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent transition-all duration-1000 ${
              animateProgress ? 'animate-pulse' : ''
            }`}>
              ₹500 - ₹50,000+
            </div>
          </div>
          
          {/* Enhanced Comparison */}
          <div className="space-y-4 mb-6">
            <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-red-800">Traditional Agencies</span>
                <span className="text-xs bg-red-200 text-red-800 px-3 py-1 rounded-full font-bold">₹50K Min</span>
              </div>
              <div className="w-full bg-red-200 rounded-full h-4 overflow-hidden mb-2">
                <div 
                  className={`bg-gradient-to-r from-red-500 to-red-600 h-4 rounded-full transition-all duration-1000 shadow-inner ${
                    animateProgress ? 'w-1/6' : 'w-0'
                  }`}
                ></div>
              </div>
              <div className="flex items-center justify-between text-xs text-red-700">
                <span>Limited Access</span>
                <span className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>Only 5% businesses</span>
                </span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-indigo-50 to-pink-50 rounded-lg p-4 border-4 border-indigo-200 shadow-lg">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-indigo-800">Campayn Platform</span>
                <span className="text-xs bg-green-200 text-green-800 px-3 py-1 rounded-full font-bold animate-pulse">₹500 Start</span>
              </div>
              <div className="w-full bg-indigo-200 rounded-full h-4 overflow-hidden mb-2">
                <div 
                  className={`bg-gradient-to-r from-indigo-500 to-pink-600 h-4 rounded-full transition-all duration-1500 delay-300 shadow-inner ${
                    animateProgress ? 'w-full' : 'w-0'
                  }`}
                ></div>
              </div>
              <div className="flex items-center justify-between text-xs text-indigo-700">
                <span className="flex items-center space-x-1">
                  <Zap className="w-3 h-3" />
                  <span>Universal Access</span>
                </span>
                <span className="flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>95% businesses</span>
                </span>
              </div>
            </div>
          </div>
          
          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
              <div className={`text-xl font-bold text-blue-800 transition-all duration-500 ${
                animateProgress ? 'animate-bounce' : ''
              }`}>
                {animateProgress ? '2.5K+' : '0'}
              </div>
              <div className="text-xs text-blue-600">Small Campaigns/Month</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
              <div className={`text-xl font-bold text-green-800 transition-all duration-500 ${
                animateProgress ? 'animate-bounce' : ''
              }`}>
                {animateProgress ? '₹1,250' : '₹0'}
              </div>
              <div className="text-xs text-green-600">Avg. Campaign Size</div>
            </div>
          </div>
          
          {/* Small businesses served */}
          <div className="text-center bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3 border border-yellow-200">
            <div className="flex justify-center space-x-2 mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i}
                  className={`w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-300 ${
                    animateProgress ? 'animate-pulse' : 'opacity-50'
                  }`}
                  style={{ animationDelay: `${i * 200}ms` }}
                ></div>
              ))}
            </div>
            <div className="text-xs text-gray-600 font-medium">
              <span className={`transition-all duration-500 ${animateProgress ? 'animate-pulse' : ''}`}>
                {animateProgress ? '15,000+' : '0'} small businesses empowered monthly
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
