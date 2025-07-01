import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Store, MapPin, TrendingUp, DollarSign, Shield, Users, Brain, Target, Network, Zap } from 'lucide-react';
import { WavyBackground } from '../ui/wavy-background';

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    title: "AI Matchmaking",
    description: "Our engine analyzes brand goals, audience, and past campaign data to recommend the most relevant creators.",
    icon: Brain,
    gradient: "from-blue-500 to-purple-600",
    bgColor: "bg-gradient-to-br from-blue-50 to-purple-50",
    visualType: "ai-matching"
  },
  {
    title: "Empowering Local Reach",
    description: "We connect small and local businesses with creators across Tier 2 & 3 cities for hyperlocal marketing.",
    icon: MapPin,
    gradient: "from-green-500 to-teal-600",
    bgColor: "bg-gradient-to-br from-green-50 to-teal-50",
    visualType: "local-reach"
  },
  {
    title: "Smart Creator Mix for Higher ROI",
    description: "Our creator listings include micro, macro, and mega profiles to optimize for both reach and cost-efficiency.",
    icon: TrendingUp,
    gradient: "from-orange-500 to-red-600",
    bgColor: "bg-gradient-to-br from-orange-50 to-red-50",
    visualType: "roi-mix"
  },
  {
    title: "Campaigns Starting at ₹500",
    description: "Agencies ignore small-ticket campaigns—we empower them. Start your first campaign with as little as ₹500.",
    icon: DollarSign,
    gradient: "from-indigo-500 to-pink-600",
    bgColor: "bg-gradient-to-br from-indigo-50 to-pink-50",
    visualType: "budget-slider"
  },
  {
    title: "Trust-Built Wallet & Tier System",
    description: "Our gamified creator tiers and wallet system bring accountability and transparency to every campaign.",
    icon: Shield,
    gradient: "from-purple-500 to-indigo-600",
    bgColor: "bg-gradient-to-br from-purple-50 to-indigo-50",
    visualType: "trust-system"
  },
  {
    title: "The Platform for India's Next 500M",
    description: "Campayn is built for small businesses, local creators, and India's rising digital economy—not just big D2C brands.",
    icon: Users,
    gradient: "from-emerald-500 to-cyan-600",
    bgColor: "bg-gradient-to-br from-emerald-50 to-cyan-50",
    visualType: "bharat-split"
  }
];

const AIMatchingVisual = () => (
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

const LocalReachVisual = () => (
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

const ROIMixVisual = () => (
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

const BudgetSliderVisual = () => (
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

const TrustSystemVisual = () => (
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

const BharatSplitVisual = () => (
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

const renderVisual = (visualType: string) => {
  switch (visualType) {
    case 'ai-matching':
      return <AIMatchingVisual />;
    case 'local-reach':
      return <LocalReachVisual />;
    case 'roi-mix':
      return <ROIMixVisual />;
    case 'budget-slider':
      return <BudgetSliderVisual />;
    case 'trust-system':
      return <TrustSystemVisual />;
    case 'bharat-split':
      return <BharatSplitVisual />;
    default:
      return null;
  }
};

export const VerticalScrollCards: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    
    const items = section.querySelectorAll<HTMLDivElement>(".scroll-item");
    
    // Clean up any existing ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    // Set initial state - all items except first start below viewport
    items.forEach((item, idx) => {
      if (idx !== 0) {
        gsap.set(item, { y: "100vh" });
      }
    });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        pin: true,
        start: "top top",
        end: `+=${items.length * 100}%`,
        scrub: 1,
        invalidateOnRefresh: true,
      },
      defaults: { ease: "none" },
    });

    items.forEach((item, idx) => {
      // Scale down and move up current item slightly
      timeline.to(item, { scale: 0.95, y: -30 });
      
      // Slide up next item from bottom
      if (items[idx + 1]) {
        timeline.to(
          items[idx + 1],
          { y: 0 },
          "<"
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      timeline.kill();
    };
  }, []);

  return (
    <WavyBackground
      backgroundFill="#0f0f23"
      colors={["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"]}
      waveWidth={50}
      blur={10}
      speed="fast"
      waveOpacity={0.5}
      containerClassName="relative"
    >
      <div className="bg-transparent">
        {/* Fixed Heading */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-4 sm:pb-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Your Brand Deserves Better Than an Agency. It Deserves Campayn
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Everything you need to run successful creator campaigns, all in one platform.
          </p>
        </div>

        {/* Scrollable Cards Section */}
        <section 
          ref={sectionRef} 
          className="relative w-full h-screen"
        >
          <div className="relative w-full h-screen flex items-center justify-center">
            {cards.map((card, index) => {
              return (
                <div 
                  key={index} 
                  className={`scroll-item absolute w-full flex items-center justify-center px-4 sm:px-6`}
                  style={{ 
                    height: '75vh',
                    top: '12.5vh'
                  }}
                >
                  <div className={`w-full max-w-6xl mx-auto ${card.bgColor} rounded-2xl sm:rounded-3xl border border-gray-200 shadow-xl h-full overflow-hidden`}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 xl:gap-8 items-center p-4 sm:p-6 lg:p-8 xl:p-12 h-full">
                      {/* Content - Left side on large screens, full width on small */}
                      <div className="flex flex-col justify-center text-center lg:text-left order-1">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 leading-tight">
                          {card.title}
                        </h3>
                        <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 leading-relaxed">
                          {card.description}
                        </p>
                      </div>
                      
                      {/* Visual - Right side, responsive sizing */}
                      <div className="flex justify-center items-center h-full order-2">
                        <div className="w-full h-full max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg relative">
                          <div className="transform scale-75 sm:scale-90 lg:scale-100 origin-center">
                            {renderVisual(card.visualType)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </WavyBackground>
  );
};

export default VerticalScrollCards;
