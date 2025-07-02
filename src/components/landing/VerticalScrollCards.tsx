
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
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: -1,
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

    // Create smoother transitions between cards
    items.forEach((item, idx) => {
      if (idx < items.length - 1) {
        timeline
          .to(item, { 
            scale: 0.95, 
            y: -50,
            duration: 0.5
          })
          .to(items[idx + 1], { 
            y: 0,
            duration: 0.5 
          }, "<0.25");
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      timeline.kill();
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Simple gradient background for smooth performance */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
      
      {/* Fixed Heading */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-4 sm:pb-6 text-center relative z-10">
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
        className="relative w-full h-screen z-10"
      >
        <div className="relative w-full h-screen flex items-center justify-center">
          {featuresData.map((card, index) => {
            return (
              <div 
                key={index} 
                className={`scroll-item absolute w-full flex items-center justify-center px-4 sm:px-6`}
                style={{ 
                  height: '80vh',
                  top: '10vh'
                }}
              >
                <div className={`w-full max-w-7xl mx-auto ${card.bgColor} rounded-2xl sm:rounded-3xl border border-gray-200 shadow-xl h-full overflow-hidden`}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-center p-4 sm:p-6 lg:p-8 h-full">
                    {/* Content - Left side on large screens, bottom on small */}
                    <div className="flex flex-col justify-center text-center lg:text-left order-2 lg:order-1 space-y-3 lg:space-y-4">
                      <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 leading-tight">
                        {card.title}
                      </h3>
                      <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                        {card.description}
                      </p>
                      
                      {/* Bullet Points */}
                      <div className="space-y-2 max-w-2xl">
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
                    <div className="flex justify-center items-center order-1 lg:order-2 h-full">
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-full h-full">
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
