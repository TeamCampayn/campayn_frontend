
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Brain, BarChart3, Zap, CreditCard } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    title: "AI Matchmaking",
    description:
      "Find the perfect creators using intent-based smart suggestions powered by advanced algorithms.",
    icon: Brain,
    gradient: "from-blue-500 to-purple-600",
    bgColor: "bg-gradient-to-br from-blue-50 to-purple-50"
  },
  {
    title: "Campaign Dashboard",
    description:
      "Launch, track and iterate campaigns from a unified view with real-time performance metrics.",
    icon: BarChart3,
    gradient: "from-green-500 to-teal-600",
    bgColor: "bg-gradient-to-br from-green-50 to-teal-50"
  },
  {
    title: "Real-Time Insights",
    description:
      "Get live engagement, ROI, and spend metrics on every creator with detailed analytics dashboards.",
    icon: Zap,
    gradient: "from-orange-500 to-red-600",
    bgColor: "bg-gradient-to-br from-orange-50 to-red-50"
  },
  {
    title: "Automated Payouts",
    description:
      "Integrated payments, receipts, and performance-based billing with seamless financial management.",
    icon: CreditCard,
    gradient: "from-indigo-500 to-pink-600",
    bgColor: "bg-gradient-to-br from-indigo-50 to-pink-50"
  },
];

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
            const Icon = card.icon;
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center p-6 sm:p-8 lg:p-12 h-full">
                    {/* Content */}
                    <div className="relative text-center lg:text-left order-2 lg:order-1">
                      <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                        {card.title}
                      </h3>
                      <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                    
                    {/* Icon */}
                    <div className="flex justify-center order-1 lg:order-2">
                      <div className={`w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-2xl sm:rounded-3xl bg-gradient-to-r ${card.gradient} flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300`}>
                        <Icon className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-white" />
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
