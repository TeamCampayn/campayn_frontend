
import React from 'react';
import { Brain } from 'lucide-react';

export const AIMatchingVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center p-6">
    <div className="relative w-full max-w-sm">
      {/* Central AI Brain */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <Brain className="w-8 h-8 text-white" />
        </div>
      </div>
      
      {/* Orbiting Elements */}
      <div className="relative w-48 h-48 mx-auto">
        {/* Brand Requirements */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
          <div className="bg-blue-100 px-3 py-1 rounded-full text-xs font-medium text-blue-800">
            Fashion Brand
          </div>
        </div>
        
        {/* Creator Matches */}
        <div className="absolute top-4 right-0 transform translate-x-2">
          <div className="bg-green-100 px-2 py-1 rounded-lg text-xs text-green-800 font-medium">
            98% Match
          </div>
        </div>
        
        <div className="absolute bottom-4 right-2">
          <div className="bg-yellow-100 px-2 py-1 rounded-lg text-xs text-yellow-800 font-medium">
            92% Match
          </div>
        </div>
        
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
          <div className="bg-purple-100 px-2 py-1 rounded-lg text-xs text-purple-800 font-medium">
            Target Audience
          </div>
        </div>
        
        <div className="absolute top-4 left-0 transform -translate-x-2">
          <div className="bg-orange-100 px-2 py-1 rounded-lg text-xs text-orange-800 font-medium">
            Campaign Data
          </div>
        </div>
        
        {/* Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full animate-pulse" viewBox="0 0 192 192">
          <circle cx="96" cy="96" r="80" fill="none" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4,4" />
          <line x1="96" y1="16" x2="96" y2="64" stroke="#3b82f6" strokeWidth="2" opacity="0.6" />
          <line x1="176" y1="48" x2="128" y2="76" stroke="#10b981" strokeWidth="2" opacity="0.6" />
          <line x1="176" y1="144" x2="128" y2="116" stroke="#f59e0b" strokeWidth="2" opacity="0.6" />
          <line x1="96" y1="176" x2="96" y2="128" stroke="#8b5cf6" strokeWidth="2" opacity="0.6" />
          <line x1="16" y1="48" x2="64" y2="76" stroke="#f97316" strokeWidth="2" opacity="0.6" />
        </svg>
      </div>
    </div>
  </div>
);
