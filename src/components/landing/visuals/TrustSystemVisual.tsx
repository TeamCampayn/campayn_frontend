
import React from 'react';
import { Users, Shield } from 'lucide-react';

export const TrustSystemVisual = () => (
  <div className="w-full h-full flex items-center justify-center p-6">
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
        {/* Creator Profile */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-800">Arjun Mehta</span>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                Gold
              </div>
            </div>
            <div className="text-xs text-gray-600">Fashion Creator</div>
          </div>
        </div>
        
        {/* Trust Metrics */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Response Rate</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-200 rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full w-full"></div>
              </div>
              <span className="text-xs font-bold text-green-600">98%</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Delivery Rate</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-200 rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full w-full"></div>
              </div>
              <span className="text-xs font-bold text-green-600">100%</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Quality Score</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-200 rounded-full h-1.5">
                <div className="bg-blue-500 h-1.5 rounded-full w-5/6"></div>
              </div>
              <span className="text-xs font-bold text-blue-600">4.8/5</span>
            </div>
          </div>
        </div>
        
        {/* Wallet System */}
        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-800">Wallet Balance</span>
            <Shield className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-lg font-bold text-green-700">₹12,450</div>
          <div className="text-xs text-green-600">Available for withdrawal</div>
        </div>
        
        {/* Tier Progress */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress to Platinum</span>
            <span>850/1000 XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full w-5/6 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
