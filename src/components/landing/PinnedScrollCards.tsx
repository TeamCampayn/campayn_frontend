
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
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: BarChart3,
      title: "Campaign Manager",
      description: "Plan, execute, and track in one unified dashboard.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Zap,
      title: "Insights in Real Time",
      description: "Metrics that help you act, not just observe.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: CreditCard,
      title: "Auto Payments",
      description: "Say goodbye to manual payouts — automate everything.",
      color: "from-orange-500 to-red-500"
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
          
          // Each card slides in from bottom (yPercent: 100 to 0)
          gsap.set(card, {
            yPercent: 100 - (clampedProgress * 100)
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
              className="scroll-card absolute inset-0 w-full h-screen flex items-center justify-center bg-white"
              style={{ zIndex: index + 1 }}
            >
              <div className="max-w-4xl mx-auto px-6 text-center">
                <div className={`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-r ${card.color} flex items-center justify-center mb-8 shadow-2xl`}>
                  <Icon className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                  {card.title}
                </h2>
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
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
