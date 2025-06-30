
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Brain, BarChart3, Zap, CreditCard } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    number: 1,
    title: "AI Matchmaking",
    description:
      "Find the perfect creators using intent-based smart suggestions powered by advanced algorithms.",
    icon: Brain,
    gradient: "from-blue-500 to-purple-600",
    bgColor: "bg-gradient-to-br from-blue-50 to-purple-50"
  },
  {
    number: 2,
    title: "Campaign Dashboard",
    description:
      "Launch, track and iterate campaigns from a unified view with real-time performance metrics.",
    icon: BarChart3,
    gradient: "from-green-500 to-teal-600",
    bgColor: "bg-gradient-to-br from-green-50 to-teal-50"
  },
  {
    number: 3,
    title: "Real-Time Insights",
    description:
      "Get live engagement, ROI, and spend metrics on every creator with detailed analytics dashboards.",
    icon: Zap,
    gradient: "from-orange-500 to-red-600",
    bgColor: "bg-gradient-to-br from-orange-50 to-red-50"
  },
  {
    number: 4,
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
    const items = section.querySelectorAll<HTMLDivElement>(".item");
    
    // Set initial state
    items.forEach((item, idx) => {
      if (idx !== 0) {
        gsap.set(item, { yPercent: 100 });
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
      timeline.to(item, { scale: 0.9, borderRadius: "10px" });
      if (items[idx + 1]) {
        timeline.to(
          items[idx + 1],
          { yPercent: 0 },
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
    <section ref={sectionRef} className="scroll-section vertical-section section">
      <div className="wrapper">
        <div className="list" style={{ flexDirection: "column", height: "100%" }}>
          {cards.map(card => {
            const Icon = card.icon;
            return (
              <div key={card.number} className={`item ${card.bgColor}`} style={{ position: "absolute", inset: 0, width: "100vw", height: "100%" }}>
                <div className="item_content" style={{ background: "transparent", color: "#292929", width: "50%", padding: "3rem", display: "flex", flexFlow: "column", justifyContent: "center", alignItems: "flex-start", position: "relative" }}>
                  <h2 className="item_number" style={{ fontSize: "1.5rem", height: "3rem", width: "3rem", borderRadius: "50%", background: "#000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 400, position: "absolute", top: "6rem", left: "3rem", marginBottom: "0.5rem" }}>{card.number}</h2>
                  <h2 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1rem", color: "#1f2937" }}>{card.title}</h2>
                  <p className="item_p" style={{ fontSize: "1.125rem", lineHeight: "1.75", color: "#6b7280" }}>{card.description}</p>
                </div>
                <div className="item_media_container" style={{ width: "50%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem" }}>
                  <div className={`w-48 h-48 rounded-3xl bg-gradient-to-r ${card.gradient} flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300`}>
                    <Icon className="w-24 h-24 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default VerticalScrollCards;
