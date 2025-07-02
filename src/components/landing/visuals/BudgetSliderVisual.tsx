
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
    <div className="w-full h-full flex items-center justify-center p-1 overflow-hidden">
      {/* Mobile Layout */}
      <div className="lg:hidden w-full max-w-xs space-y-2 overflow-hidden">
        {/* Budget Header */}
        <div className="bg-white rounded-lg shadow-lg p-2 border border-gray-200">
          <div className="text-center p-2 bg-gradient-to-r from-indigo-50 to-pink-50 rounded-lg border border-indigo-200">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <DollarSign className="w-3 h-3 text-indigo-600 animate-pulse" />
              <div className="text-xs font-bold text-gray-800 truncate">Campaign Budget</div>
            </div>
            <div className={`text-sm font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent transition-all duration-1000 truncate ${
              animateProgress ? 'animate-pulse' : ''
            }`}>
              ₹500 - ₹50K+
            </div>
          </div>
        </div>

        {/* Comparison */}
        <div className="bg-white rounded-lg shadow-lg p-2 border border-gray-200 space-y-2">
          <div className="bg-red-50 rounded-lg p-2 border border-red-200">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-red-800 truncate">Agencies</span>
              <span className="text-xs bg-red-200 text-red-800 px-1.5 py-0.5 rounded-full font-bold truncate">₹50K Min</span>
            </div>
            <div className="w-full bg-red-200 rounded-full h-2 overflow-hidden">
              <div 
                className={`bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-1000 shadow-inner ${
                  animateProgress ? 'w-1/6' : 'w-0'
                }`}
              ></div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-indigo-50 to-pink-50 rounded-lg p-2 border-2 border-indigo-200 shadow-lg">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-indigo-800 truncate">Campayn</span>
              <span className="text-xs bg-green-200 text-green-800 px-1.5 py-0.5 rounded-full font-bold animate-pulse truncate">₹500 Start</span>
            </div>
            <div className="w-full bg-indigo-200 rounded-full h-2 overflow-hidden">
              <div 
                className={`bg-gradient-to-r from-indigo-500 to-pink-600 h-2 rounded-full transition-all duration-1500 delay-300 shadow-inner ${
                  animateProgress ? 'w-full' : 'w-0'
                }`}
              ></div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-lg p-2 border border-gray-200 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-50 rounded-lg p-2 text-center border border-blue-200">
              <div className={`text-sm font-bold text-blue-800 transition-all duration-500 truncate ${
                animateProgress ? 'animate-bounce' : ''
              }`}>
                {animateProgress ? '2.5K+' : '0'}
              </div>
              <div className="text-xs text-blue-600 truncate">Small Campaigns</div>
            </div>
            <div className="bg-green-50 rounded-lg p-2 text-center border border-green-200">
              <div className={`text-sm font-bold text-green-800 transition-all duration-500 truncate ${
                animateProgress ? 'animate-bounce' : ''
              }`}>
                {animateProgress ? '₹1,250' : '₹0'}
              </div>
              <div className="text-xs text-green-600 truncate">Avg. Size</div>
            </div>
          </div>
          
          <div className="text-center bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-2 border border-yellow-200">
            <div className="text-xs text-gray-800 font-medium">
              <span className={`transition-all duration-500 truncate ${animateProgress ? 'animate-pulse' : ''}`}>
                {animateProgress ? '15K+' : '0'} businesses monthly
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block w-full max-w-xs">
        <div className="bg-white rounded-xl shadow-2xl p-4 border-2 border-gray-200 hover:border-indigo-300 transition-colors">
          {/* Budget Header */}
          <div className="text-center mb-4 p-3 bg-gradient-to-r from-indigo-50 to-pink-50 rounded-lg border border-indigo-200">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <DollarSign className="w-5 h-5 text-indigo-600 animate-pulse" />
              <div className="text-sm font-bold text-gray-800">Campaign Budget</div>
            </div>
            <div className={`text-xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent transition-all duration-1000 ${
              animateProgress ? 'animate-pulse' : ''
            }`}>
              ₹500 - ₹50K+
            </div>
          </div>
          
          {/* Comparison */}
          <div className="space-y-3 mb-4">
            <div className="bg-red-50 rounded-lg p-3 border-2 border-red-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-red-800">Agencies</span>
                <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full font-bold">₹50K Min</span>
              </div>
              <div className="w-full bg-red-200 rounded-full h-3 overflow-hidden mb-2">
                <div 
                  className={`bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-1000 shadow-inner ${
                    animateProgress ? 'w-1/6' : 'w-0'
                  }`}
                ></div>
              </div>
              <div className="flex items-center justify-between text-xs text-red-700">
                <span>Limited</span>
                <span className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>5%</span>
                </span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-indigo-50 to-pink-50 rounded-lg p-3 border-4 border-indigo-200 shadow-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-indigo-800">Campayn</span>
                <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-bold animate-pulse">₹500 Start</span>
              </div>
              <div className="w-full bg-indigo-200 rounded-full h-3 overflow-hidden mb-2">
                <div 
                  className={`bg-gradient-to-r from-indigo-500 to-pink-600 h-3 rounded-full transition-all duration-1500 delay-300 shadow-inner ${
                    animateProgress ? 'w-full' : 'w-0'
                  }`}
                ></div>
              </div>
              <div className="flex items-center justify-between text-xs text-indigo-700">
                <span className="flex items-center space-x-1">
                  <Zap className="w-3 h-3" />
                  <span>Universal</span>
                </span>
                <span className="flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>95%</span>
                </span>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-blue-50 rounded-lg p-2 text-center border border-blue-200">
              <div className={`text-sm font-bold text-blue-800 transition-all duration-500 ${
                animateProgress ? 'animate-bounce' : ''
              }`}>
                {animateProgress ? '2.5K+' : '0'}
              </div>
              <div className="text-xs text-blue-600">Small Campaigns</div>
            </div>
            <div className="bg-green-50 rounded-lg p-2 text-center border border-green-200">
              <div className={`text-sm font-bold text-green-800 transition-all duration-500 ${
                animateProgress ? 'animate-bounce' : ''
              }`}>
                {animateProgress ? '₹1,250' : '₹0'}
              </div>
              <div className="text-xs text-green-600">Avg. Size</div>
            </div>
          </div>
          
          {/* Small businesses served */}
          <div className="text-center bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-2 border border-yellow-200">
            <div className="flex justify-center space-x-1 mb-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i}
                  className={`w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-300 ${
                    animateProgress ? 'animate-pulse' : 'opacity-50'
                  }`}
                  style={{ animationDelay: `${i * 200}ms` }}
                ></div>
              ))}
            </div>
            <div className="text-xs text-gray-600 font-medium">
              <span className={`transition-all duration-500 ${animateProgress ? 'animate-pulse' : ''}`}>
                {animateProgress ? '15K+' : '0'} businesses monthly
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
