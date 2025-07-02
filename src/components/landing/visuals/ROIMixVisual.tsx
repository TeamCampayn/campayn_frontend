
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
    <div ref={containerRef} className="w-full h-full flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* ROI Optimization Chart */}
        <div className="bg-white rounded-xl shadow-2xl p-6 border-2 border-gray-200 hover:border-orange-300 transition-colors">
          <div className="text-center mb-6">
            <div className="text-lg font-bold text-gray-800 mb-2">Creator Mix Strategy</div>
            <div className="text-sm text-gray-600">Optimized for Maximum ROI</div>
          </div>
          
          {/* Creator Tiers with enhanced design */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-sm animate-pulse"></div>
                <span className="text-sm font-semibold text-green-800">Micro (1K-10K)</span>
              </div>
              <div className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">₹0.08/view</div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full shadow-sm animate-pulse"></div>
                <span className="text-sm font-semibold text-orange-800">Macro (10K-1M)</span>
              </div>
              <div className="text-xs font-bold text-orange-700 bg-orange-100 px-2 py-1 rounded-full">₹0.15/view</div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-red-600 rounded-full shadow-sm animate-pulse"></div>
                <span className="text-sm font-semibold text-red-800">Mega (1M+)</span>
              </div>
              <div className="text-xs font-bold text-red-700 bg-red-100 px-2 py-1 rounded-full">₹0.35/view</div>
            </div>
          </div>
          
          {/* Animated Performance Bars */}
          <div className="space-y-4">
            <div className="text-sm text-gray-700 text-center font-semibold">Optimized Portfolio Distribution</div>
            <div className="flex space-x-2 h-10 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
              <div 
                className={`bg-gradient-to-t from-green-500 to-green-300 rounded-l transition-all duration-1000 flex items-center justify-center text-xs font-bold text-white shadow-inner ${
                  animateProgress ? 'flex-[3]' : 'flex-[0]'
                }`}
              >
                {animateProgress && '50%'}
              </div>
              <div 
                className={`bg-gradient-to-t from-orange-500 to-orange-300 transition-all duration-1000 delay-200 flex items-center justify-center text-xs font-bold text-white shadow-inner ${
                  animateProgress ? 'flex-[2]' : 'flex-[0]'
                }`}
              >
                {animateProgress && '33%'}
              </div>
              <div 
                className={`bg-gradient-to-t from-red-500 to-red-300 rounded-r transition-all duration-1000 delay-400 flex items-center justify-center text-xs font-bold text-white shadow-inner ${
                  animateProgress ? 'flex-[1]' : 'flex-[0]'
                }`}
              >
                {animateProgress && '17%'}
              </div>
            </div>
            
            {/* ROI Impact */}
            <div className="text-center pt-2">
              <div className={`inline-block bg-gradient-to-r from-green-100 to-red-100 px-4 py-2 rounded-full border-2 border-green-200 transition-all duration-500 ${
                animateProgress ? 'animate-bounce' : ''
              }`}>
                <span className="text-sm font-bold text-gray-800">3x Better ROI 🚀</span>
              </div>
            </div>
            
            {/* Performance metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-blue-50 rounded-lg p-2 text-center border border-blue-200">
                <div className={`text-lg font-bold text-blue-800 transition-all duration-500 ${
                  animateProgress ? 'animate-pulse' : ''
                }`}>
                  {animateProgress ? '85%' : '0%'}
                </div>
                <div className="text-xs text-blue-600">Engagement Rate</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-2 text-center border border-purple-200">
                <div className={`text-lg font-bold text-purple-800 transition-all duration-500 ${
                  animateProgress ? 'animate-pulse' : ''
                }`}>
                  {animateProgress ? '₹2.5' : '₹0'}
                </div>
                <div className="text-xs text-purple-600">Cost per Click</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
