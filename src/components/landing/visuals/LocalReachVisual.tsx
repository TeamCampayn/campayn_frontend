
import React from 'react';
import { Store } from 'lucide-react';

export const LocalReachVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center p-6">
    {/* India Map Outline */}
    <div className="relative">
      <div className="w-48 h-56 bg-gradient-to-b from-green-100 to-green-200 rounded-lg border-2 border-green-300 relative overflow-hidden">
        {/* Map silhouette */}
        <div className="absolute inset-4 bg-green-300 opacity-30" style={{
          clipPath: 'polygon(30% 20%, 70% 15%, 85% 35%, 80% 60%, 70% 85%, 30% 80%, 15% 50%)'
        }}></div>
        
        {/* Tier 2/3 Cities */}
        <div className="absolute top-8 left-8">
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
          <div className="text-xs font-medium text-green-800 mt-1">Lucknow</div>
        </div>
        
        <div className="absolute top-16 right-12">
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
          <div className="text-xs font-medium text-green-800 mt-1">Bhopal</div>
        </div>
        
        <div className="absolute bottom-16 left-12">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="text-xs font-medium text-green-800 mt-1">Nashik</div>
        </div>
        
        <div className="absolute bottom-8 right-8">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
          <div className="text-xs font-medium text-green-800 mt-1">Kochi</div>
        </div>
        
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full">
          <line x1="32" y1="40" x2="160" y2="80" stroke="#10b981" strokeWidth="1" strokeDasharray="2,2" className="animate-pulse" />
          <line x1="48" y1="180" x2="160" y2="140" stroke="#10b981" strokeWidth="1" strokeDasharray="2,2" className="animate-pulse" />
        </svg>
      </div>
      
      {/* Local Business */}
      <div className="absolute -left-6 top-1/2 transform -translate-y-1/2">
        <div className="bg-white rounded-lg shadow-lg p-2 border-2 border-green-300">
          <Store className="w-6 h-6 text-green-600 mx-auto mb-1" />
          <div className="text-xs font-medium text-center">Local Store</div>
        </div>
      </div>
      
      {/* Creator Profiles */}
      <div className="absolute -right-6 top-1/4">
        <div className="bg-white rounded-lg shadow-md p-2 text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full mx-auto mb-1"></div>
          <div className="text-xs font-medium">Raj</div>
        </div>
      </div>
      
      <div className="absolute -right-6 bottom-1/4">
        <div className="bg-white rounded-lg shadow-md p-2 text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mx-auto mb-1"></div>
          <div className="text-xs font-medium">Priya</div>
        </div>
      </div>
    </div>
  </div>
);
