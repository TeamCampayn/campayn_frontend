
import React from 'react';

export const BharatSplitVisual = () => (
  <div className="w-full h-full flex items-center justify-center p-6">
    <div className="w-full max-w-sm">
      {/* India's Digital Divide */}
      <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
        <div className="text-center mb-4">
          <div className="text-sm font-bold text-gray-800">India's Creator Economy</div>
        </div>
        
        <div className="space-y-4">
          {/* Traditional Focus */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Traditional Platforms</span>
              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">5% Coverage</span>
            </div>
            <div className="flex space-x-2 mb-2">
              <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs">Mumbai</div>
              <div className="bg-red-600 text-white px-2 py-1 rounded text-xs">Delhi</div>
              <div className="bg-purple-600 text-white px-2 py-1 rounded text-xs">Bangalore</div>
            </div>
            <div className="text-xs text-gray-600">Metro cities only</div>
          </div>
          
          {/* Campayn's Reach */}
          <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-lg p-3 border-2 border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-emerald-800">Campayn</span>
              <span className="text-xs bg-emerald-200 text-emerald-800 px-2 py-1 rounded">95% Coverage</span>
            </div>
            <div className="grid grid-cols-2 gap-1 mb-2">
              <div className="bg-emerald-600 text-white px-2 py-1 rounded text-xs text-center">राज कैफे</div>
              <div className="bg-cyan-600 text-white px-2 py-1 rounded text-xs text-center">प्रिया स्टूडियो</div>
              <div className="bg-teal-600 text-white px-2 py-1 rounded text-xs text-center">Local Salon</div>
              <div className="bg-green-600 text-white px-2 py-1 rounded text-xs text-center">नमस्कार Shop</div>
            </div>
            <div className="text-xs text-emerald-700 font-medium">Bharat's businesses included</div>
          </div>
        </div>
        
        {/* Impact Numbers */}
        <div className="mt-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-3">
          <div className="text-center">
            <div className="text-lg font-bold text-orange-800">500M+</div>
            <div className="text-xs text-orange-700">Underserved creators & businesses</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
