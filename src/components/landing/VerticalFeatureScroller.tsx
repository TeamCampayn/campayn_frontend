
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Brain, BarChart3, Zap, CreditCard } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const VerticalFeatureScroller = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const cards = [
    {
      icon: Brain,
      title: "AI Matchmaking",
      description: "Find the perfect creators using intent-based smart suggestions.",
      gradient: "from-blue-500 to-purple-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-purple-50"
    },
    {
      icon: BarChart3,
      title: "Campaign Dashboard",
      description: "Launch, track and iterate campaigns from a unified view.",
      gradient: "from-green-500 to-teal-600",
      bgColor: "bg-gradient-to-br from-green-50 to-teal-50"
    },
    {
      icon: Zap,
      title: "Real-Time Insights",
      description: "Get live engagement, ROI, and spend metrics on every creator.",
      gradient: "from-orange-500 to-red-600",
      bgColor: "bg-gradient-to-br from-orange-50 to-red-50"
    },
    {
      icon: CreditCard,
      title: "Automated Payouts",
      description: "Integrated payments, receipts, and performance-based billing.",
      gradient: "from-indigo-500 to-pink-600",
      bgColor: "bg-gradient-to-br from-indigo-50 to-pink-50"
    }
  ];

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const section = sectionRef.current;
    const container = containerRef.current;
    const cardElements = container.querySelectorAll('.feature-card');

    // Set initial positions - all cards start below the viewport
    gsap.set(cardElements, { 
      y: "100vh"
    });

    // Set first card to be in position initially
    gsap.set(cardElements[0], { 
      y: 0
    });

    // Pin the section
    const pinTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => "+=" + (window.innerHeight * (cards.length - 1)),
      pin: container,
      pinSpacing: false,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const totalCards = cards.length;
        
        cardElements.forEach((card, index) => {
          // Calculate which card should be active based on scroll progress
          const cardStart = index / (totalCards - 1);
          const cardEnd = (index + 1) / (totalCards - 1);
          
          if (index === 0) {
            // First card starts visible and gets pushed up
            if (progress <= cardEnd) {
              const pushProgress = progress / cardEnd;
              gsap.set(card, {
                y: -pushProgress * window.innerHeight * 0.3
              });
            } else {
              gsap.set(card, {
                y: -window.innerHeight
              });
            }
          } else if (progress >= cardStart) {
            // Current/next cards slide up from bottom
            const slideProgress = Math.min(1, (progress - cardStart) / (cardEnd - cardStart));
            gsap.set(card, {
              y: (1 - slideProgress) * window.innerHeight * 0.7
            });
          } else {
            // Future cards stay below
            gsap.set(card, {
              y: window.innerHeight
            });
          }
        });
      }
    });

    return () => {
      pinTrigger.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [cards.length]);

  return (
    <section className="py-20 bg-white">
      {/* Section Heading */}
      <div className="max-w-4xl mx-auto px-6 mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Powerful Features
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Everything you need to run successful creator campaigns, all in one platform.
        </p>
      </div>

      {/* Scrolling Cards Section */}
      <section 
        ref={sectionRef}
        className="relative"
        style={{ height: `${100 * cards.length}vh` }}
      >
        <div 
          ref={containerRef}
          className="relative w-full h-screen overflow-hidden"
        >
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className={`feature-card absolute top-0 left-0 w-full h-screen flex items-center justify-center ${card.bgColor}`}
              >
                <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                  {/* Icon and Visual Element */}
                  <div className="flex justify-center lg:justify-end">
                    <div className={`w-32 h-32 rounded-3xl bg-gradient-to-r ${card.gradient} flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300`}>
                      <Icon className="w-16 h-16 text-white" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="text-center lg:text-left">
                    <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                      {card.title}
                    </h3>
                    <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </section>
  );
};
