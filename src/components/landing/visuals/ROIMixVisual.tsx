
import React from 'react';

export const ROIMixVisual = () => (
  <div className="w-full h-full flex items-center justify-center p-6">
    <div className="w-full max-w-sm">
      {/* ROI Optimization Chart */}
      <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
        <div className="text-center mb-4">
          <div className="text-sm font-bold text-gray-800">Creator Mix Strategy</div>
        </div>
        
        {/* Creator Tiers */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Micro (1K-10K)</span>
            </div>
            <div className="text-xs text-gray-600">₹0.08/view</div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm font-medium">Macro (10K-1M)</span>
            </div>
            <div className="text-xs text-gray-600">₹0.15/view</div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium">Mega (1M+)</span>
            </div>
            <div className="text-xs text-gray-600">₹0.35/view</div>
          </div>
        </div>
        
        {/* Performance Bars */}
        <div className="mt-4 space-y-2">
          <div className="text-xs text-gray-600 text-center">Optimized Portfolio</div>
          <div className="flex space-x-1 h-8">
            <div className="flex-1 bg-gradient-to-t from-green-500 to-green-300 rounded-l animate-pulse"></div>
            <div className="flex-1 bg-gradient-to-t from-orange-500 to-orange-300 animate-pulse"></div>
            <div className="flex-1 bg-gradient-to-t from-red-500 to-red-300 rounded-r animate-pulse"></div>
          </div>
          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-green-100 to-red-100 px-3 py-1 rounded-full">
              <span className="text-xs font-medium text-gray-800">3x Better ROI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
