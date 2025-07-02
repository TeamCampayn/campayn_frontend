
import React, { useEffect, useRef, useState } from 'react';

interface ROIMixVisualProps {
  isActive?: boolean;
}

export const ROIMixVisual: React.FC<ROIMixVisualProps> = ({ isActive = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animateProgress, setAnimateProgress] = useState(false);

  useEffect(() => {
    if (isActive) {
      setTimeout(() => setAnimateProgress(true), 500);
    } else {
      setAnimateProgress(false);
    }
  }, [isActive]);

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center p-1 overflow-hidden">
      {/* Mobile Layout */}
      <div className="lg:hidden w-full max-w-xs space-y-2 overflow-hidden">
        {/* Creator Mix Strategy Header */}
        <div className="bg-white rounded-lg shadow-lg p-2 border border-gray-200">
          <div className="text-center mb-2">
            <div className="text-xs font-bold text-gray-800 mb-1 truncate">Creator Mix Strategy</div>
            <div className="text-xs text-gray-600 truncate">Optimized ROI</div>
          </div>
          
          {/* Creator Tiers */}
          <div className="space-y-1">
            <div className="flex items-center justify-between p-1.5 bg-green-50 rounded border border-green-200">
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-green-400 to-green-600 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-800 truncate">Micro 50%</span>
              </div>
              <div className="text-xs font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded truncate">₹0.08</div>
            </div>
            
            <div className="flex items-center justify-between p-1.5 bg-orange-50 rounded border border-orange-200">
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-orange-800 truncate">Macro 33%</span>
              </div>
              <div className="text-xs font-bold text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded truncate">₹0.15</div>
            </div>
            
            <div className="flex items-center justify-between p-1.5 bg-red-50 rounded border border-red-200">
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-red-400 to-red-600 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-red-800 truncate">Mega 17%</span>
              </div>
              <div className="text-xs font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded truncate">₹0.35</div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-lg shadow-lg p-2 border border-gray-200">
          <div className="text-center mb-2">
            <div className={`inline-block bg-gradient-to-r from-green-100 to-red-100 px-2 py-1 rounded-full border border-green-200 transition-all duration-500 ${
              animateProgress ? 'animate-bounce' : ''
            }`}>
              <span className="text-xs font-bold text-gray-800 truncate">3x Better ROI 🚀</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-50 rounded-lg p-2 text-center border border-blue-200">
              <div className={`text-sm font-bold text-blue-800 transition-all duration-500 truncate ${
                animateProgress ? 'animate-pulse' : ''
              }`}>
                {animateProgress ? '85%' : '25%'}
              </div>
              <div className="text-xs text-blue-600 truncate">Engagement</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-2 text-center border border-purple-200">
              <div className={`text-sm font-bold text-purple-800 transition-all duration-500 truncate ${
                animateProgress ? 'animate-pulse' : ''
              }`}>
                {animateProgress ? '₹2.5' : '₹5.2'}
              </div>
              <div className="text-xs text-purple-600 truncate">Cost/Click</div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block w-full max-w-xs">
        {/* ROI Optimization Chart */}
        <div className="bg-white rounded-xl shadow-2xl p-4 border-2 border-gray-200 hover:border-orange-300 transition-colors">
          <div className="text-center mb-4">
            <div className="text-sm font-bold text-gray-800 mb-1">Creator Mix Strategy</div>
            <div className="text-xs text-gray-600">Optimized for Maximum ROI</div>
          </div>
          
          {/* Creator Tiers */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-sm animate-pulse"></div>
                <span className="text-xs font-semibold text-green-800">Micro</span>
              </div>
              <div className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">₹0.08/view</div>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full shadow-sm animate-pulse"></div>
                <span className="text-xs font-semibold text-orange-800">Macro</span>
              </div>
              <div className="text-xs font-bold text-orange-700 bg-orange-100 px-2 py-1 rounded-full">₹0.15/view</div>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-red-600 rounded-full shadow-sm animate-pulse"></div>
                <span className="text-xs font-semibold text-red-800">Mega</span>
              </div>
              <div className="text-xs font-bold text-red-700 bg-red-100 px-2 py-1 rounded-full">₹0.35/view</div>
            </div>
          </div>
          
          {/* Animated Portfolio Distribution */}
          <div className="space-y-3">
            <div className="text-xs text-gray-700 text-center font-semibold">Portfolio Distribution</div>
            <div className="flex space-x-1 h-8 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
              <div 
                className={`bg-gradient-to-t from-green-500 to-green-300 rounded-l transition-all duration-1000 flex items-center justify-center text-xs font-bold text-white shadow-inner ${
                  animateProgress ? 'flex-[50]' : 'flex-[0]'
                }`}
              >
                {animateProgress && '50%'}
              </div>
              <div 
                className={`bg-gradient-to-t from-orange-500 to-orange-300 transition-all duration-1000 delay-200 flex items-center justify-center text-xs font-bold text-white shadow-inner ${
                  animateProgress ? 'flex-[33]' : 'flex-[0]'
                }`}
              >
                {animateProgress && '33%'}
              </div>
              <div 
                className={`bg-gradient-to-t from-red-500 to-red-300 rounded-r transition-all duration-1000 delay-400 flex items-center justify-center text-xs font-bold text-white shadow-inner ${
                  animateProgress ? 'flex-[17]' : 'flex-[0]'
                }`}
              >
                {animateProgress && '17%'}
              </div>
            </div>
            
            {/* ROI Impact */}
            <div className="text-center pt-2">
              <div className={`inline-block bg-gradient-to-r from-green-100 to-red-100 px-3 py-1 rounded-full border-2 border-green-200 transition-all duration-500 ${
                animateProgress ? 'animate-bounce' : ''
              }`}>
                <span className="text-xs font-bold text-gray-800">3x Better ROI 🚀</span>
              </div>
            </div>
            
            {/* Performance metrics */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="bg-blue-50 rounded-lg p-2 text-center border border-blue-200">
                <div className={`text-sm font-bold text-blue-800 transition-all duration-500 ${
                  animateProgress ? 'animate-pulse' : ''
                }`}>
                  {animateProgress ? '85%' : '25%'}
                </div>
                <div className="text-xs text-blue-600">Engagement</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-2 text-center border border-purple-200">
                <div className={`text-sm font-bold text-purple-800 transition-all duration-500 ${
                  animateProgress ? 'animate-pulse' : ''
                }`}>
                  {animateProgress ? '₹2.5' : '₹5.2'}
                </div>
                <div className="text-xs text-purple-600">Cost/Click</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
