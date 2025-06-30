
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Brain, BarChart3, Zap, CreditCard } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const PinnedScrollCards = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const cards = [
    {
      icon: Brain,
      title: "AI Matchmaking",
      description: "Smart recommendations tailored to your brand DNA.",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconColor: "from-blue-500 to-blue-600"
    },
    {
      icon: BarChart3,
      title: "Campaign Manager",
      description: "Plan, execute, and track in one unified dashboard.",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      iconColor: "from-purple-500 to-purple-600"
    },
    {
      icon: Zap,
      title: "Insights in Real Time",
      description: "Metrics that help you act, not just observe.",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      iconColor: "from-green-500 to-green-600"
    },
    {
      icon: CreditCard,
      title: "Auto Payments",
      description: "Say goodbye to manual payouts — automate everything.",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      iconColor: "from-orange-500 to-orange-600"
    }
  ];

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const section = sectionRef.current;
    const container = containerRef.current;
    const cardElements = container.querySelectorAll('.scroll-card');

    // Set initial positions - all cards start translated down 100%
    gsap.set(cardElements, { 
      yPercent: 100,
      zIndex: (index) => index + 1
    });

    // Pin the section
    const pinTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => "+=" + (window.innerHeight * cards.length),
      pin: container,
      pinSpacing: false,
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const totalCards = cards.length;
        
        cardElements.forEach((card, index) => {
          const cardProgress = (progress * totalCards) - index;
          const clampedProgress = Math.max(0, Math.min(1, cardProgress));
          
          // Current card slides in from bottom
          const currentY = 100 - (clampedProgress * 100);
          
          // Previous cards get pushed up slightly
          const pushProgress = Math.max(0, cardProgress - 1);
          const pushAmount = pushProgress * 20; // Push previous cards up by 20%
          
          gsap.set(card, {
            yPercent: currentY - pushAmount
          });
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
      className="relative bg-gradient-to-br from-gray-50 to-white"
      style={{ height: `${100 * (cards.length + 1)}vh` }}
    >
      <div 
        ref={containerRef}
        className="relative w-full h-screen overflow-hidden"
      >
        {/* Section Heading */}
        <div className="absolute top-20 left-0 right-0 z-50 text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to run successful creator campaigns
          </p>
        </div>

        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="scroll-card absolute inset-0 w-full h-screen flex items-center justify-center"
              style={{ zIndex: index + 1 }}
            >
              <div className={`max-w-md mx-auto p-8 rounded-2xl shadow-lg border-2 ${card.bgColor} ${card.borderColor} backdrop-blur-sm`}>
                <div className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-r ${card.iconColor} flex items-center justify-center mb-6 shadow-md`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center">
                  {card.title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed text-center">
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
