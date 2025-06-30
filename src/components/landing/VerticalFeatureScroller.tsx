
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
      description: "Find the perfect creators using intent-based smart suggestions."
    },
    {
      icon: BarChart3,
      title: "Campaign Dashboard",
      description: "Launch, track and iterate campaigns from a unified view."
    },
    {
      icon: Zap,
      title: "Real-Time Insights",
      description: "Get live engagement, ROI, and spend metrics on every creator."
    },
    {
      icon: CreditCard,
      title: "Automated Payouts",
      description: "Integrated payments, receipts, and performance-based billing."
    }
  ];

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const section = sectionRef.current;
    const container = containerRef.current;
    const cardElements = container.querySelectorAll('.feature-card');

    // Set initial positions - all cards start translated down 100%
    gsap.set(cardElements, { 
      yPercent: 100
    });

    // Set first card to be visible initially
    gsap.set(cardElements[0], { 
      yPercent: 0
    });

    // Pin the section
    const pinTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => "+=" + (window.innerHeight * cards.length),
      pin: container,
      pinSpacing: false,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const totalCards = cards.length;
        
        cardElements.forEach((card, index) => {
          // Calculate which card should be active based on scroll progress
          const cardStart = index / totalCards;
          const cardEnd = (index + 1) / totalCards;
          
          if (progress >= cardStart && progress < cardEnd) {
            // Current card - slide in from bottom
            const cardProgress = (progress - cardStart) / (cardEnd - cardStart);
            gsap.set(card, {
              yPercent: 100 - (cardProgress * 100)
            });
          } else if (progress >= cardEnd) {
            // Previous cards - push up and out
            gsap.set(card, {
              yPercent: -100
            });
          } else {
            // Future cards - stay below
            gsap.set(card, {
              yPercent: 100
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
    <section 
      ref={sectionRef}
      className="relative bg-white"
      style={{ height: `${100 * (cards.length + 1)}vh` }}
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
              className="feature-card absolute top-0 left-0 w-full h-screen flex items-center justify-center bg-white"
            >
              <div className="max-w-2xl mx-auto px-6 text-center">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mb-8 shadow-lg">
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  {card.title}
                </h2>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl mx-auto">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
