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
    <div className="relative">
      {/* Fixed Heading */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-6 sm:pb-8 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-900 bg-clip-text text-transparent mb-6 sm:mb-8 leading-tight tracking-tight">
          Your Brand Deserves Better Than an Agency.{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            It Deserves Campayn
          </span>
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium tracking-wide">
          Everything you need to run successful creator campaigns,{" "}
          <span className="text-blue-700 font-semibold">all in one platform.</span>
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
                  height: '80vh',
                  top: '10vh'
                }}
              >
                <div className={`w-full max-w-7xl mx-auto ${card.bgColor} rounded-2xl sm:rounded-3xl border border-gray-200/60 shadow-2xl shadow-gray-900/10 h-full overflow-hidden backdrop-blur-sm`}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center p-6 sm:p-8 lg:p-12 h-full">
                    {/* Content - Left side on large screens, bottom on small */}
                    <div className="flex flex-col justify-center text-center lg:text-left order-2 lg:order-1 space-y-4 lg:space-y-6 px-2">
                      <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-heading font-bold text-slate-900 leading-tight tracking-tight">
                        {card.title}
                      </h3>
                      <p className="text-base sm:text-lg lg:text-xl text-slate-700 leading-relaxed font-medium tracking-wide max-w-xl">
                        {card.description}
                      </p>
                      
                      {/* Bullet Points */}
                      <div className="space-y-3 lg:space-y-4 max-w-2xl">
                        {card.bulletPoints?.map((point, idx) => (
                          <div key={idx} className="flex items-start space-x-3 sm:space-x-4 text-left group">
                            <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-2.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"></div>
                            <span className="text-sm sm:text-base lg:text-lg text-slate-700 leading-relaxed break-words font-medium tracking-wide group-hover:text-slate-900 transition-colors duration-200">
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
