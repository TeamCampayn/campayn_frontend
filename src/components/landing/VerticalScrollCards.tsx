
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

gsap.registerPlugin(ScrollTrigger);

const renderVisual = (visualType: string, isActive: boolean) => {
  const props = { isActive };
  switch (visualType) {
    case 'ai-matching':
      return <AIMatchingVisual {...props} />;
    case 'local-reach':
      return <LocalReachVisual {...props} />;
    case 'roi-mix':
      return <ROIMixVisual {...props} />;
    case 'budget-slider':
      return <BudgetSliderVisual {...props} />;
    case 'trust-system':
      return <TrustSystemVisual {...props} />;
    case 'bharat-split':
      return <BharatSplitVisual {...props} />;
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
        onUpdate: (self) => {
          // Calculate which card is currently active
          const progress = self.progress;
          const activeIndex = Math.min(Math.floor(progress * items.length), items.length - 1);
          
          // Add active class to current card
          items.forEach((item, idx) => {
            if (idx === activeIndex) {
              item.classList.add('active');
            } else {
              item.classList.remove('active');
            }
          });
        }
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
                <div className={`w-full max-w-6xl mx-auto ${card.bgColor} rounded-2xl sm:rounded-3xl border border-gray-200 shadow-xl h-full overflow-hidden`}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 xl:gap-8 items-center p-4 sm:p-6 lg:p-8 xl:p-12 h-full">
                    {/* Content - Left side on large screens, full width on small */}
                    <div className="flex flex-col justify-center text-center lg:text-left order-2 lg:order-1">
                      <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 leading-tight">
                        {card.title}
                      </h3>
                      <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 leading-relaxed mb-4 lg:mb-6">
                        {card.description}
                      </p>
                      
                      {/* Bullet Points */}
                      <div className="space-y-2 sm:space-y-3">
                        {card.bulletPoints?.map((point, idx) => (
                          <div key={idx} className="flex items-start space-x-2 sm:space-x-3 text-left">
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-xs sm:text-sm lg:text-base text-gray-700 leading-relaxed">
                              {point}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Visual - Above content on mobile, right side on desktop */}
                    <div className="flex justify-center items-center h-full order-1 lg:order-2">
                      <div className="w-full h-full max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg relative">
                        <div className="transform scale-75 sm:scale-90 lg:scale-100 origin-center">
                          {renderVisual(card.visualType, false)}
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
