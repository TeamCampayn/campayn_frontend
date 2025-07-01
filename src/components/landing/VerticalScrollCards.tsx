
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { featuresData } from './data/featuresData';
import {
  AIMatchingVisual,
  LocalReachVisual,
  ROIMixVisual,
  BudgetSliderVisual,
  TrustSystemVisual,
  BharatSplitVisual
} from './visuals';
import { Component as EtheralShadow } from '../ui/etheral-shadow';

gsap.registerPlugin(ScrollTrigger);

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
    <div className="relative">
      {/* Fixed Heading */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-4 sm:pb-6 text-center bg-gradient-to-br from-gray-50 to-white relative z-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
          Your Brand Deserves Better Than an Agency. It Deserves Campayn
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Everything you need to run successful creator campaigns, all in one platform.
        </p>
      </div>

      {/* Scrollable Cards Section with Background */}
      <section 
        ref={sectionRef} 
        className="relative w-full h-screen overflow-hidden"
      >
        {/* Ethereal Shadow Background */}
        <EtheralShadow
          color="rgba(30, 30, 50, 0.8)"
          animation={{ scale: 80, speed: 60 }}
          noise={{ opacity: 0.4, scale: 1.5 }}
          sizing="fill"
          className="absolute inset-0 z-0"
        />
        
        <div className="relative w-full h-screen flex items-center justify-center z-10">
          {featuresData.map((card, index) => {
            return (
              <div 
                key={index} 
                className={`scroll-item absolute w-full flex items-center justify-center px-4 sm:px-6`}
                style={{ 
                  height: '75vh',
                  top: '12.5vh'
                }}
              >
                <div className={`w-full max-w-6xl mx-auto ${card.bgColor} rounded-2xl sm:rounded-3xl border border-gray-200/20 shadow-2xl h-full overflow-hidden backdrop-blur-sm bg-opacity-95`}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 xl:gap-8 items-center p-4 sm:p-6 lg:p-8 xl:p-12 h-full">
                    {/* Content - Left side on large screens, full width on small */}
                    <div className="flex flex-col justify-center text-center lg:text-left order-1">
                      <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 leading-tight">
                        {card.title}
                      </h3>
                      <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-700 leading-relaxed">
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
  );
};

export default VerticalScrollCards;
