
import React from 'react';

export const BudgetSliderVisual = () => (
  <div className="w-full h-full flex items-center justify-center p-6">
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        {/* Budget Accessibility */}
        <div className="text-center mb-6">
          <div className="text-lg font-bold text-gray-800 mb-2">Campaign Budget</div>
          <div className="text-2xl font-bold text-indigo-600">₹500 - ₹50,000+</div>
        </div>
        
        {/* Comparison */}
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Traditional Agencies</span>
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">₹50K Min</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full w-1/6"></div>
            </div>
            <div className="text-xs text-gray-600 mt-1">Limited Access</div>
          </div>
          
          <div className="bg-indigo-50 rounded-lg p-3 border-2 border-indigo-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-indigo-800">Campayn</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">₹500 Start</span>
            </div>
            <div className="w-full bg-indigo-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full w-full animate-pulse"></div>
            </div>
            <div className="text-xs text-indigo-600 mt-1">Universal Access</div>
          </div>
        </div>
        
        {/* Small businesses served */}
        <div className="mt-4 text-center">
          <div className="flex justify-center space-x-2 mb-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
            <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse"></div>
            <div className="w-6 h-6 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-pulse"></div>
            <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
          </div>
          <div className="text-xs text-gray-600">Small businesses empowered daily</div>
        </div>
      </div>
    </div>
  </div>
);
