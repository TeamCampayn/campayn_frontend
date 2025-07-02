
import React, { useEffect, useRef } from 'react';
import { Store, MapPin, Users, Smartphone } from 'lucide-react';

interface LocalReachVisualProps {
  isActive?: boolean;
}

export const LocalReachVisual: React.FC<LocalReachVisualProps> = ({ isActive = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && containerRef.current) {
      const elements = containerRef.current.querySelectorAll('.animate-on-active');
      elements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('animate-scale-in');
        }, index * 300);
      });
    }
  }, [isActive]);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center p-2">
      {/* Mobile Layout - Enhanced */}
      <div className="lg:hidden w-full max-w-xs space-y-3">
        {/* India Map with Network Effect */}
        <div className="bg-white rounded-lg shadow-lg p-3 border-2 border-green-200">
          <div className="relative w-full h-36 bg-gradient-to-b from-green-100 to-emerald-200 rounded-lg border-2 border-green-300 overflow-hidden">
            <div className="absolute inset-2 bg-gradient-to-br from-green-400 to-emerald-500 opacity-40 rounded-lg" style={{
              clipPath: 'polygon(30% 20%, 70% 15%, 85% 35%, 80% 60%, 70% 85%, 30% 80%, 15% 50%)'
            }}></div>
            
            {/* Cities with connection lines */}
            <div className="absolute top-3 left-4 w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse shadow-lg"></div>
            <div className="absolute top-5 right-4 w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse shadow-lg"></div>
            <div className="absolute bottom-5 left-4 w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse shadow-lg"></div>
            <div className="absolute bottom-3 right-4 w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-pulse shadow-lg"></div>
            
            {/* Central hub */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-green-600 rounded-full animate-ping"></div>
            
            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100">
              <line x1="15" y1="20" x2="50" y2="50" stroke="#22c55e" strokeWidth="1" strokeDasharray="2,1" className="animate-pulse" />
              <line x1="85" y1="25" x2="50" y2="50" stroke="#ec4899" strokeWidth="1" strokeDasharray="2,1" className="animate-pulse" />
              <line x1="15" y1="75" x2="50" y2="50" stroke="#06b6d4" strokeWidth="1" strokeDasharray="2,1" className="animate-pulse" />
              <line x1="85" y1="80" x2="50" y2="50" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="2,1" className="animate-pulse" />
            </svg>
            
            <div className="absolute bottom-1 left-1 right-1 bg-white/90 backdrop-blur-sm rounded p-1.5 text-center border border-green-200">
              <div className="text-xs font-bold text-green-800">155K+ Creators</div>
              <div className="text-xs text-green-600">500+ Cities Connected</div>
            </div>
          </div>
        </div>

        {/* Business & Creators with Connection Flow */}
        <div className="bg-white rounded-lg shadow-lg p-3 border-2 border-gray-200">
          <div className="text-center text-xs font-bold text-gray-700 mb-3">Local Business → AI Match → Creators</div>
          <div className="grid grid-cols-3 gap-2 items-center">
            <div className="text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg mx-auto mb-1 flex items-center justify-center shadow-lg">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div className="text-xs font-bold text-green-800">Local Store</div>
              <div className="text-xs text-gray-500">Needs reach</div>
            </div>
            
            <div className="flex justify-center">
              <div className="flex items-center space-x-1">
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '100ms' }}></div>
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-1">
              <div className="text-center">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mx-auto flex items-center justify-center shadow-md">
                  <Smartphone className="w-4 h-4 text-white" />
                </div>
                <div className="text-xs font-bold text-gray-700">Raj</div>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mx-auto flex items-center justify-center shadow-md">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="text-xs font-bold text-gray-700">Priya</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Redesigned for better clarity */}
      <div className="hidden lg:block w-full max-w-6xl mx-auto h-full">
        <div className="grid grid-cols-3 gap-8 items-center h-full px-8">
          {/* Local Business - Left */}
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white rounded-xl shadow-xl p-6 border-2 border-green-300 text-center">
              <Store className="w-12 h-12 text-green-600 mx-auto mb-3 animate-bounce" />
              <div className="text-lg font-bold text-green-800">Local Business</div>
              <div className="text-sm text-gray-600 mt-2">Fashion Store in Mumbai</div>
              <div className="text-xs text-gray-500 mt-1">Needs local reach</div>
            </div>
            
            {/* Arrow pointing right */}
            <div className="flex items-center">
              <svg className="w-20 h-6" viewBox="0 0 80 24">
                <line x1="8" y1="12" x2="72" y2="12" stroke="#22c55e" strokeWidth="3" strokeDasharray="5,3" className="animate-pulse" />
                <polygon points="68,8 72,12 68,16" fill="#22c55e" />
              </svg>
            </div>
          </div>
          
          {/* India Map - Center */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-64 h-72">
              <div className="w-full h-full bg-gradient-to-b from-green-100 to-emerald-200 rounded-2xl border-4 border-green-300 relative overflow-hidden shadow-2xl">
                {/* Map silhouette */}
                <div className="absolute inset-6 bg-gradient-to-br from-green-400 to-emerald-500 opacity-40 rounded-lg shadow-inner" style={{
                  clipPath: 'polygon(30% 20%, 70% 15%, 85% 35%, 80% 60%, 70% 85%, 30% 80%, 15% 50%)'
                }}></div>
                
                {/* Cities with pulses */}
                <div className="absolute top-12 left-12">
                  <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse shadow-lg"></div>
                  <div className="absolute -top-1 -left-1 w-6 h-6 bg-orange-300 rounded-full animate-ping opacity-30"></div>
                  <div className="absolute top-5 left-0 text-xs font-bold text-orange-800 whitespace-nowrap">Lucknow</div>
                </div>
                
                <div className="absolute top-20 right-16">
                  <div className="w-4 h-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse shadow-lg"></div>
                  <div className="absolute -top-1 -left-1 w-6 h-6 bg-pink-300 rounded-full animate-ping opacity-30"></div>
                  <div className="absolute top-5 right-0 text-xs font-bold text-pink-800 whitespace-nowrap">Bhopal</div>
                </div>
                
                <div className="absolute bottom-20 left-16">
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse shadow-lg"></div>
                  <div className="absolute -top-1 -left-1 w-6 h-6 bg-blue-300 rounded-full animate-ping opacity-30"></div>
                  <div className="absolute bottom-5 left-0 text-xs font-bold text-blue-800 whitespace-nowrap">Nashik</div>
                </div>
                
                <div className="absolute bottom-12 right-12">
                  <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-pulse shadow-lg"></div>
                  <div className="absolute -top-1 -left-1 w-6 h-6 bg-purple-300 rounded-full animate-ping opacity-30"></div>
                  <div className="absolute bottom-5 right-0 text-xs font-bold text-purple-800 whitespace-nowrap">Kochi</div>
                </div>
                
                {/* Central connection hub */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse shadow-lg"></div>
                  <div className="absolute -top-1 -left-1 w-5 h-5 bg-green-300 rounded-full animate-ping opacity-50"></div>
                </div>
                
                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 256 288">
                  <line x1="48" y1="48" x2="128" y2="144" stroke="#f97316" strokeWidth="2" strokeDasharray="4,2" className="animate-pulse" />
                  <line x1="208" y1="80" x2="128" y2="144" stroke="#ec4899" strokeWidth="2" strokeDasharray="4,2" className="animate-pulse" />
                  <line x1="64" y1="208" x2="128" y2="144" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4,2" className="animate-pulse" />
                  <line x1="208" y1="240" x2="128" y2="144" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4,2" className="animate-pulse" />
                </svg>
                
                {/* Stats overlay */}
                <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 border border-green-200">
                  <div className="text-center text-sm font-bold text-green-800">155K+ Creators</div>
                  <div className="text-center text-xs text-green-600">500+ Cities Connected</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Creators - Right */}
          <div className="flex flex-col items-center space-y-4">
            {/* Arrow pointing left */}
            <div className="flex items-center">
              <svg className="w-20 h-6" viewBox="0 0 80 24">
                <line x1="72" y1="12" x2="8" y2="12" stroke="#ec4899" strokeWidth="3" strokeDasharray="5,3" className="animate-pulse" />
                <polygon points="12,8 8,12 12,16" fill="#ec4899" />
              </svg>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-xl p-4 text-center border-2 border-orange-200">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mx-auto mb-2 flex items-center justify-center shadow-lg">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm font-bold text-gray-800">Raj Kumar</div>
                <div className="text-xs text-orange-600">Tech Reviewer • Lucknow</div>
                <div className="text-xs text-gray-500 mt-1">50K followers</div>
              </div>
              
              <div className="bg-white rounded-lg shadow-xl p-4 text-center border-2 border-pink-200">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mx-auto mb-2 flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm font-bold text-gray-800">Priya Nair</div>
                <div className="text-xs text-pink-600">Lifestyle • Kochi</div>
                <div className="text-xs text-gray-500 mt-1">75K followers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
