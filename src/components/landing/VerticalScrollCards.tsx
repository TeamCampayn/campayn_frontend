
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Store, MapPin, TrendingUp, DollarSign, Shield, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    title: "AI Matchmaking",
    description: "Our engine analyzes brand goals, audience, and past campaign data to recommend the most relevant creators.",
    icon: Users,
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
    icon: Store,
    gradient: "from-emerald-500 to-cyan-600",
    bgColor: "bg-gradient-to-br from-emerald-50 to-cyan-50",
    visualType: "bharat-split"
  }
];

const AIMatchingVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    {/* Brand bubble */}
    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
        <span className="text-white font-bold text-sm">Brand</span>
      </div>
    </div>
    
    {/* Connection lines */}
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 200">
      <line x1="80" y1="100" x2="180" y2="60" stroke="#3B82F6" strokeWidth="2" className="animate-pulse" />
      <line x1="80" y1="100" x2="180" y2="100" stroke="#3B82F6" strokeWidth="2" className="animate-pulse" />
      <line x1="80" y1="100" x2="180" y2="140" stroke="#3B82F6" strokeWidth="2" className="animate-pulse" />
    </svg>
    
    {/* Creator avatars */}
    <div className="absolute right-4 space-y-4">
      <div className="flex items-center space-x-2 animate-pulse">
        <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-red-400 rounded-full"></div>
        <div className="bg-white rounded-lg px-2 py-1 shadow-md">
          <span className="text-xs font-medium">Beauty | 95% Match</span>
        </div>
      </div>
      <div className="flex items-center space-x-2 animate-pulse">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
        <div className="bg-white rounded-lg px-2 py-1 shadow-md">
          <span className="text-xs font-medium">Tech | 88% Match</span>
        </div>
      </div>
      <div className="flex items-center space-x-2 animate-pulse">
        <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-teal-400 rounded-full"></div>
        <div className="bg-white rounded-lg px-2 py-1 shadow-md">
          <span className="text-xs font-medium">Food | 92% Match</span>
        </div>
      </div>
    </div>
  </div>
);

const LocalReachVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    {/* Storefront */}
    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
      <div className="w-20 h-16 bg-green-600 rounded-lg flex flex-col items-center justify-center shadow-lg">
        <Store className="w-6 h-6 text-white mb-1" />
        <span className="text-white text-xs font-medium">Local Store</span>
      </div>
    </div>
    
    {/* Connection arrows */}
    <div className="absolute left-28 top-1/2 transform -translate-y-1/2">
      <div className="flex space-x-2">
        <div className="w-8 h-0.5 bg-green-600 animate-pulse"></div>
        <div className="w-0 h-0 border-l-4 border-l-green-600 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
      </div>
    </div>
    
    {/* Local creators */}
    <div className="absolute right-4 space-y-3">
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full"></div>
        <div className="bg-white rounded-lg px-2 py-1 shadow-md">
          <span className="text-xs font-medium">Aman – Lucknow</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"></div>
        <div className="bg-white rounded-lg px-2 py-1 shadow-md">
          <span className="text-xs font-medium">Shruti – Bhopal</span>
        </div>
      </div>
      <div className="bg-green-100 rounded-lg px-3 py-1 text-center">
        <span className="text-xs font-medium text-green-800">Hyperlocal Discovery</span>
      </div>
    </div>
  </div>
);

const ROIMixVisual = () => (
  <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
    <div className="flex space-x-4 w-full max-w-xs">
      {/* Micro */}
      <div className="flex-1 text-center">
        <div className="h-16 bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-lg mb-2 relative overflow-hidden">
          <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-orange-600 to-orange-400 animate-pulse"></div>
        </div>
        <span className="text-xs font-medium">Micro</span>
        <div className="text-xs text-gray-600 mt-1">
          <div>CPV: ₹0.12</div>
          <div>Reach: 25K</div>
        </div>
      </div>
      
      {/* Macro */}
      <div className="flex-1 text-center">
        <div className="h-20 bg-gradient-to-t from-red-600 to-red-400 rounded-t-lg mb-2 relative overflow-hidden">
          <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-red-600 to-red-400 animate-pulse"></div>
        </div>
        <span className="text-xs font-medium">Macro</span>
        <div className="text-xs text-gray-600 mt-1">
          <div>CPV: ₹0.25</div>
          <div>Reach: 2.5L</div>
        </div>
      </div>
      
      {/* Mega */}
      <div className="flex-1 text-center">
        <div className="h-24 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg mb-2 relative overflow-hidden">
          <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-purple-600 to-purple-400 animate-pulse"></div>
        </div>
        <span className="text-xs font-medium">Mega</span>
        <div className="text-xs text-gray-600 mt-1">
          <div>CPV: ₹0.45</div>
          <div>Reach: 10L+</div>
        </div>
      </div>
    </div>
    
    <div className="bg-orange-100 rounded-lg px-3 py-1">
      <span className="text-xs font-medium text-orange-800">Optimized ROI Mix</span>
    </div>
  </div>
);

const BudgetSliderVisual = () => (
  <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
    {/* Slider */}
    <div className="w-full max-w-xs">
      <div className="flex justify-between text-xs text-gray-600 mb-2">
        <span>₹500</span>
        <span>₹10K</span>
      </div>
      <div className="relative h-2 bg-gray-200 rounded-full">
        <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-indigo-500 to-pink-600 rounded-full animate-pulse"></div>
        <div className="absolute left-1/3 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-full shadow-lg"></div>
      </div>
    </div>
    
    {/* Creator count */}
    <div className="flex space-x-2">
      <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-pink-400 rounded-full animate-pulse"></div>
      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-teal-400 rounded-full animate-pulse"></div>
      <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-dashed border-gray-400"></div>
    </div>
    
    <div className="bg-indigo-100 rounded-lg px-3 py-1">
      <span className="text-xs font-medium text-indigo-800">Campaign size doesn't limit visibility</span>
    </div>
  </div>
);

const TrustSystemVisual = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 max-w-xs">
      {/* Creator profile */}
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full"></div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Priya Sharma</span>
            <div className="bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-medium">Gold</div>
          </div>
          <div className="text-xs text-gray-600">Fashion Creator</div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="space-y-2 mb-3">
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Response Rate:</span>
          <span className="font-medium text-green-600">98%</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">On-time Delivery:</span>
          <span className="font-medium text-green-600">100%</span>
        </div>
      </div>
      
      {/* Wallet */}
      <div className="flex items-center justify-between bg-green-50 rounded-lg p-2">
        <span className="text-xs font-medium text-green-800">₹2,400 Paid</span>
        <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center animate-pulse">
          <div className="w-2 h-1 bg-white rounded-full"></div>
        </div>
      </div>
      
      {/* XP Bar */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>XP Progress</span>
          <span>750/1000</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div className="h-full w-3/4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
);

const BharatSplitVisual = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
      {/* Traditional Agency */}
      <div className="bg-gray-100 rounded-lg p-3 text-center">
        <div className="text-xs font-medium text-gray-800 mb-2">Traditional Agency</div>
        <div className="text-xs text-gray-600 mb-2">₹50K Min</div>
        <div className="space-y-1">
          <div className="w-full h-4 bg-blue-600 rounded text-xs text-white flex items-center justify-center">BigBrand</div>
          <div className="w-full h-4 bg-red-600 rounded text-xs text-white flex items-center justify-center">MegaCorp</div>
        </div>
      </div>
      
      {/* Campayn */}
      <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-lg p-3 text-center border-2 border-emerald-200">
        <div className="text-xs font-medium text-emerald-800 mb-2">Campayn</div>
        <div className="text-xs text-emerald-600 mb-2">₹500 Start</div>
        <div className="space-y-1">
          <div className="w-full h-4 bg-emerald-600 rounded text-xs text-white flex items-center justify-center">रिया बुटीक</div>
          <div className="w-full h-4 bg-cyan-600 rounded text-xs text-white flex items-center justify-center">Amit Café</div>
        </div>
      </div>
    </div>
    
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
      <div className="bg-emerald-100 rounded-lg px-3 py-1">
        <span className="text-xs font-medium text-emerald-800">We built for the rest of India</span>
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
    <div className="bg-gradient-to-br from-gray-50 to-white">
      {/* Fixed Heading */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-4 sm:pb-6 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
          Your Brand Deserves Better Than an Agency. It Deserves Campayn
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
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
                <div className={`w-full max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto ${card.bgColor} rounded-2xl sm:rounded-3xl border border-gray-200 shadow-xl h-full`}>
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12 items-center p-6 sm:p-8 lg:p-12 h-full">
                    {/* Content - Left side (60% on large screens) */}
                    <div className="lg:col-span-3 relative text-center lg:text-left order-2 lg:order-1">
                      <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                        {card.title}
                      </h3>
                      <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                    
                    {/* Visual - Right side (40% on large screens) */}
                    <div className="lg:col-span-2 flex justify-center order-1 lg:order-2 h-full">
                      <div className="w-full h-full max-w-sm relative">
                        {renderVisual(card.visualType)}
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
  );
};

export default VerticalScrollCards;
