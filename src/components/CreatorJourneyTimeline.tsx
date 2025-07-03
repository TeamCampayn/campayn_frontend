
"use client";

import { Calendar, Code, FileText, User, Zap, Wallet, Target, Rocket, Shield } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

const creatorTimelineData = [
  {
    id: 1,
    title: "Growth Opportunities",
    date: "Step 1",
    content: "Connect with brands that align with your content and audience, leading to sustainable growth.",
    category: "Growth",
    icon: Rocket,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Secure Payments & Wallet",
    date: "Step 2",
    content: "Get paid securely through our platform with guaranteed payment protection and a built-in wallet system for managing your earnings.",
    category: "Finance",
    icon: Wallet,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 90,
  },
  {
    id: 3,
    title: "Barter Campaign Support",
    date: "Step 3",
    content: "Use your wallet balance for barter campaigns - no need to pay from your pocket. Seamlessly manage all transactions in one place.",
    category: "Campaigns",
    icon: Shield,
    relatedIds: [2, 4],
    status: "in-progress" as const,
    energy: 70,
  },
  {
    id: 4,
    title: "Quick Campaigns",
    date: "Step 4",
    content: "Find and apply to campaigns quickly with our streamlined matching system.",
    category: "Efficiency",
    icon: Zap,
    relatedIds: [3, 5],
    status: "pending" as const,
    energy: 40,
  },
  {
    id: 5,
    title: "Brand Alignment",
    date: "Step 5",
    content: "Work with brands that truly match your content style and audience interests.",
    category: "Matching",
    icon: Target,
    relatedIds: [4],
    status: "pending" as const,
    energy: 20,
  },
];

export const CreatorJourneyTimeline = () => {
  return (
    <div className="relative">
      {/* Section Title */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 text-center">
        <h2 className="text-4xl font-bold text-white mb-2">
          Creator Features & Benefits
        </h2>
        <p className="text-lg text-white/70">
          Discover how our platform empowers your creator journey
        </p>
      </div>
      
      <RadialOrbitalTimeline timelineData={creatorTimelineData} />
    </div>
  );
};

export default CreatorJourneyTimeline;
